// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./PriceManager.sol";

contract Knight is
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    PausableUpgradeable,
    AccessControlUpgradeable,
    ERC721BurnableUpgradeable,
    UUPSUpgradeable
{
    using Counters for Counters.Counter;

    Counters.Counter public counter;
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    mapping(address => bool) _isBlacklisted;

    struct KnightState {
        uint8 rarity;
        uint8 class;
        uint8 gender;
        uint16 combatPower;
        uint16 bonusPower;
    }

    mapping(uint256 => KnightState) knights;

    event NewKnight(uint256 indexed knight, address indexed minter);

    // //knight => guild
    mapping(uint256 => uint256) public knightGuild;

    address public guildAddress;

    PriceManager priceManager;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(PriceManager _priceManager) public initializer {
        __ERC721_init("DefiKnightKnight", "DKK");
        __ERC721Enumerable_init();
        __Pausable_init();
        __AccessControl_init();
        __ERC721Burnable_init();
        __UUPSUpgradeable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
        priceManager = _priceManager;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function safeMint(address to, uint256 seed)
        public
        onlyRole(MINTER_ROLE)
        whenNotPaused
    {
        counter.increment();
        uint256 tokenId = counter.current();

        uint256 rollClass = (seed % 3);

        uint256 rollGender = (tokenId % 2);

        uint256 random = uint256(keccak256(abi.encodePacked(seed, gasleft())));

        uint256 rollRarity = (random % 100);

        uint8 rarity;
        uint16 combatPower;
        uint8 bonusPower = 0;

        // • One-star, 44% chance
        // • Two-star, 35% chance
        // • Three-star, 15% chance
        // • Four-star, 5% chance
        // • Five-star, 1% chance

        if (rollRarity >= 56) {
            rarity = 0;
            combatPower = uint16(random % 26) + 25;
        } else if (rollRarity < 56 && rollRarity >= 21) {
            rarity = 1;
            combatPower = uint16(random % 26) + 75;
        } else if (rollRarity < 21 && rollRarity >= 6) {
            rarity = 2;
            combatPower = uint16(random % 26) + 125;
        } else if (rollRarity < 6 && rollRarity >= 1) {
            rarity = 3;
            combatPower = uint16(random % 26) + 175;
        } else {
            combatPower = uint16(random % 26) + 225;
            rarity = 4;
        }

        if (tokenId <= 1000) {
            bonusPower = 20;
        }

        knights[tokenId] = (
            KnightState(
                rarity,
                uint8(rollClass),
                uint8(rollGender),
                combatPower,
                bonusPower
            )
        );
        emit NewKnight(tokenId, to);
        _safeMint(to, tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        require(
            !_isBlacklisted[to] && !_isBlacklisted[from],
            "Blacklisted address"
        );
        require(knightGuild[tokenId] == 0);
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721Upgradeable) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(
            ERC721Upgradeable,
            ERC721EnumerableUpgradeable,
            AccessControlUpgradeable
        )
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function blacklistAddress(address account, bool value)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _isBlacklisted[account] = value;
    }

    function getKnight(uint256 tokenId)
        public
        view
        returns (KnightState memory)
    {
        return knights[tokenId];
    }

    function setMapping(uint256 tokenId, uint256 guildId) public {
        require(msg.sender == guildAddress);
        knightGuild[tokenId] = guildId;
    }

    function deleteMapping(uint256 tokenId) public {
        require(msg.sender == guildAddress);
        delete knightGuild[tokenId];
    }

    function setGuildAddress(address _guildAddress)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        guildAddress = _guildAddress;
    }
}
