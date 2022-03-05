// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./IOracle.sol";

contract PriceManager is
    Initializable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    uint256 public constant MINT_FEE = 70;
    uint256 public constant STABLE_FEE = 30;
    uint256 public constant GUILD_FEE = 10;
    uint256 public constant MORALE_FEE = 5;
    uint256 public constant ADD_MEMBER_FEE = 1;
    uint256 public presaleFee;
    IOracle private oracle;
    bool public isPresale;

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    function initialize(IOracle _oracle, uint256 _presaleFee)
        public
        initializer
    {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
        oracle = _oracle;
        isPresale = true;
        presaleFee = _presaleFee;
    }

    function setPresaleFee(uint256 _presaleFee)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        presaleFee = _presaleFee;
    }

    function setPresale(bool _isPresale) external onlyRole(DEFAULT_ADMIN_ROLE) {
        isPresale = _isPresale;
    }

    function getMintFee() public view returns (uint256) {
        return oracle.getUsdPrice() * MINT_FEE;
    }

    function getGuildFee() public view returns (uint256) {
        return oracle.getUsdPrice() * GUILD_FEE;
    }

    function getMoraleFee() public view returns (uint256) {
        return oracle.getUsdPrice() * MORALE_FEE;
    }

    function getAddMemberFee() public view returns (uint256) {
        return oracle.getUsdPrice() * ADD_MEMBER_FEE;
    }
}
