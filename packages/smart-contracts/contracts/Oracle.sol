// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IOracle.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

interface IUniswapV2Pair {
    function getReserves()
        external
        view
        returns (
            uint112 reserve0,
            uint112 reserve1,
            uint32 blockTimestampLast
        );

    function token0() external view returns (address);

    function token1() external view returns (address);
}

contract Oracle is IOracle, AccessControl {
    AggregatorV3Interface internal priceFeed;
    address private pairAddress;
    IUniswapV2Pair private uniswapV2Pair;

    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    //token per USD
    function getUsdPrice() public view override returns (uint256) {
        require(pairAddress != address(0), "Pair address not set.");
        uint256 ethUsd = getEthUsdPrice();
        uint256 usdEth = 1 / ethUsd;
        uint256 pairValueReserves = getCurrentPrice();
        uint256 usdToken = pairValueReserves * usdEth;
        return usdToken;
    }

    function getEthUsdPrice() public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price / 10**8);
    }

    function getCurrentPrice() public view override returns (uint256) {
        (uint112 reserve0, uint112 reserve1, ) = uniswapV2Pair.getReserves();
        uint256 pairValueReserves = reserve1 / reserve0;
        return pairValueReserves;
    }

    function setPairAddress(address _pairAddress)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        pairAddress = _pairAddress;
        uniswapV2Pair = IUniswapV2Pair(pairAddress);
    }
}
