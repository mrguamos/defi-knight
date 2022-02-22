// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IUniswapV2Factory {
    function createPair(address tokenA, address tokenB)
        external
        returns (address pair);
}

contract DefiKnight is ERC20, Ownable {
    address public pairAddress;
    address public taxRecipientAddress;
    uint256 public TAX_FEE = 5;
    bool public takeFee;
    mapping(address => bool) public excludedAddressFromFee;

    constructor(address uniswapFactoryAddress, address eth)
        ERC20("DefiKnight", "DK")
    {
        _mint(msg.sender, 5000000 * 10**decimals());
        takeFee = true;
        if (uniswapFactoryAddress != address(0)) {
            pairAddress = IUniswapV2Factory(uniswapFactoryAddress).createPair(
                address(this),
                eth
            );
        }
    }

    function excludeAddressFromFee(address _excludedAddress, bool isExcluded)
        public
        onlyOwner
    {
        excludedAddressFromFee[_excludedAddress] = isExcluded;
    }

    function setTaxRecipientAddress(address _taxRecipientAddress)
        public
        onlyOwner
    {
        taxRecipientAddress = _taxRecipientAddress;
    }

    function setTakeFee(bool _takeFee) public onlyOwner {
        takeFee = _takeFee;
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual override {
        if (
            recipient == pairAddress &&
            takeFee &&
            !excludedAddressFromFee[sender]
        ) {
            uint256 fee = (amount * TAX_FEE) / 100;
            super._transfer(sender, taxRecipientAddress, fee);
            amount = amount - fee;
        }
        super._transfer(sender, recipient, amount);
    }
}
