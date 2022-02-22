// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./Commander.sol";
import "./Knight.sol";

contract GuildHelper is
    Initializable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    Commander private commander;
    Knight private knight;

    address public guildAddress;

    function initialize(Commander _commander, Knight _knight)
        public
        initializer
    {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
        commander = _commander;
        knight = _knight;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    function transferCommander(
        address from,
        address to,
        uint256 tokenId
    ) public {
        require(msg.sender == guildAddress);
        commander.safeTransferFrom(from, to, tokenId);
    }

    function transferKnight(
        address from,
        address to,
        uint256 tokenId
    ) public {
        require(msg.sender == guildAddress);
        knight.safeTransferFrom(from, to, tokenId);
    }

    function setGuildAddress(address _guildAddress)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        guildAddress = _guildAddress;
    }
}
