// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./IOracle.sol";
import "./DefiKnight.sol";

contract PriceManager is
    Initializable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    uint256 private mintFee;
    uint256 private stableFee;
    uint256 private guildFee;
    uint256 private moraleFee;
    uint256 private emblemFee;
    uint256 private potionCPFee;
    uint256 private potionWRFee;
    IOracle private oracle;
    DefiKnight private defiKnight;

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    function initialize(IOracle _oracle, DefiKnight _defiKnight)
        public
        initializer
    {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
        oracle = _oracle;
        defiKnight = _defiKnight;
        mintFee = 50;
        stableFee = 100000000000000000;
        guildFee = 50;
        moraleFee = 1;
        emblemFee = 50;
        potionCPFee = 50;
        potionWRFee = 50;
    }

    function getMintFee() public view returns (uint256) {
        return (oracle.getUsdPrice() * mintFee) * 10**defiKnight.decimals();
    }

    function getStableFee() public view returns (uint256) {
        return stableFee;
    }

    function getGuildFee() public view returns (uint256) {
        return (oracle.getUsdPrice() * guildFee) * 10**defiKnight.decimals();
    }

    function getEmblemFee() public view returns (uint256) {
        return (oracle.getUsdPrice() * emblemFee) * 10**defiKnight.decimals();
    }

    function getMoraleFee() public view returns (uint256) {
        return (oracle.getUsdPrice() * moraleFee) * 10**defiKnight.decimals();
    }

    function setMintFee(uint256 _mintFee)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        mintFee = _mintFee;
    }

    function setGuildFee(uint256 _guildFee)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        guildFee = _guildFee;
    }

    function setMoraleFee(uint256 _moraleFee)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        moraleFee = _moraleFee;
    }

    function setEmblemFee(uint256 _emblemFee)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        emblemFee = _emblemFee;
    }

    //in wei
    function setStableFee(uint256 _stableFee)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        stableFee = _stableFee;
    }

    function setPotionCPFee(uint256 _potionCPFee)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        potionCPFee = _potionCPFee;
    }

    function setPotionWRFee(uint256 _potionWRFee)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        potionWRFee = _potionWRFee;
    }

    function getPotionCPFee() public view returns (uint256) {
        return (oracle.getUsdPrice() * potionCPFee) * 10**defiKnight.decimals();
    }

    function getPotionWRFee() public view returns (uint256) {
        return (oracle.getUsdPrice() * potionWRFee) * 10**defiKnight.decimals();
    }
}
