// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "./Commander.sol";
import "./Knight.sol";

contract GuildMember is
    Initializable,
    AccessControlUpgradeable,
    UUPSUpgradeable,
    ERC721Holder
{
    uint8 private constant TYPE_COMMANDER = 0;
    uint8 private constant TYPE_KNIGHT = 1;

    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant GAME_ADMIN_ROLE = keccak256("GAME_ADMIN_ROLE");

    Commander private commander;
    Knight private knight;

    function initialize() public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
        _grantRole(GAME_ADMIN_ROLE, msg.sender);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    function transferToOwner(uint8 nftType, uint256 tokenId) external {
        if (nftType == TYPE_COMMANDER) {
            commander.safeTransferFrom(address(this), msg.sender, tokenId);
        } else {
            knight.safeTransferFrom(address(this), msg.sender, tokenId);
        }
    }

    function approveGameContract(address gameAddress)
        external
        onlyRole(GAME_ADMIN_ROLE)
    {
        commander.setApprovalForAll(gameAddress, true);
        knight.setApprovalForAll(gameAddress, true);
    }
}
