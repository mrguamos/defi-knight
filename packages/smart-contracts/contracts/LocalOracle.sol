// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IOracle.sol";

contract LocalOracle is IOracle, AccessControl {
    uint256 price;
    uint256 usdPrice;

    constructor(uint256 _price) {
        price = _price;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    //token per USD
    function getUsdPrice() public view override returns (uint256) {
        return usdPrice;
    }

    function getCurrentPrice() public view override returns (uint256) {
        return price;
    }

    function setCurrentPrice(uint256 _price)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        price = _price;
    }
}
