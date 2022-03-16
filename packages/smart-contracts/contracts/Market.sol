// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "./DefiKnight.sol";
import "./Commander.sol";
import "./Knight.sol";
import "./Guild.sol";

contract Market is
    Initializable,
    AccessControlUpgradeable,
    UUPSUpgradeable,
    ERC721Holder
{
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    DefiKnight private defiKnight;
    Commander private commander;
    Knight private knight;
    Guild private guild;

    uint8 private constant TYPE_COMMANDER = 0;
    uint8 private constant TYPE_KNIGHT = 1;
    uint8 private constant TYPE_GUILD = 2;
    uint8 private constant TAX = 10;

    event ListingEvent(uint8 indexed nftType, uint256 indexed tokenId);

    struct Listing {
        address owner;
        uint256 amount;
    }
    mapping(uint8 => mapping(uint256 => Listing)) list;

    function initialize(
        DefiKnight _defiKnight,
        Commander _commander,
        Knight _knight,
        Guild _guild
    ) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
        defiKnight = _defiKnight;
        commander = _commander;
        knight = _knight;
        guild = _guild;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    modifier onlyNonContract() {
        _onlyNonContract();
        _;
    }

    function _onlyNonContract() internal view {
        require(tx.origin == msg.sender, "Wallet Only");
    }

    function sell(
        uint8 nftType,
        uint256 tokenId,
        uint256 amount
    ) external {
        if (nftType == TYPE_COMMANDER) {
            require(commander.ownerOf(tokenId) == msg.sender);
            commander.safeTransferFrom(msg.sender, address(this), tokenId);
        } else if (nftType == TYPE_KNIGHT) {
            require(knight.ownerOf(tokenId) == msg.sender);
            knight.safeTransferFrom(msg.sender, address(this), tokenId);
        } else if (nftType == TYPE_GUILD) {
            require(guild.ownerOf(tokenId) == msg.sender);
            guild.safeTransferFrom(msg.sender, address(this), tokenId);
        }
        list[nftType][tokenId] = Listing(msg.sender, amount);
        emit ListingEvent(nftType, tokenId);
    }

    function cancel(uint8 nftType, uint256 tokenId) external {
        Listing memory listing = list[nftType][tokenId];
        if (nftType == TYPE_COMMANDER) {
            require(listing.owner == msg.sender);
            commander.safeTransferFrom(address(this), msg.sender, tokenId);
        } else if (nftType == TYPE_KNIGHT) {
            require(listing.owner == msg.sender);
            knight.safeTransferFrom(address(this), msg.sender, tokenId);
        } else if (nftType == TYPE_GUILD) {
            require(listing.owner == msg.sender);
            guild.safeTransferFrom(address(this), msg.sender, tokenId);
        }
        delete list[nftType][tokenId];
        emit ListingEvent(nftType, tokenId);
    }

    function buy(
        uint8 nftType,
        uint256 tokenId,
        uint256 amount
    ) external {
        Listing memory listing = list[nftType][tokenId];
        if (nftType == TYPE_COMMANDER) {
            require(listing.amount == amount);
            defiKnight.transferFrom(msg.sender, listing.owner, amount);
            commander.safeTransferFrom(address(this), msg.sender, tokenId);
        } else if (nftType == TYPE_KNIGHT) {
            require(listing.amount == amount);
            defiKnight.transferFrom(msg.sender, listing.owner, amount);
            knight.safeTransferFrom(address(this), msg.sender, tokenId);
        } else if (nftType == TYPE_GUILD) {
            require(listing.amount == amount);
            defiKnight.transferFrom(msg.sender, listing.owner, amount);
            guild.safeTransferFrom(address(this), msg.sender, tokenId);
        }
        delete list[nftType][tokenId];
        emit ListingEvent(nftType, tokenId);
    }

    function getListing(uint8 nftType, uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return list[nftType][tokenId];
    }
}
