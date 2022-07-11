// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Commander.sol";
import "./Knight.sol";

contract Guild is
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

    uint8 private constant TYPE_COMMANDER = 0;
    uint8 private constant TYPE_KNIGHT = 1;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant GAME_ADMIN_ROLE = keccak256("GAME_ADMIN_ROLE");

    mapping(address => bool) _isBlacklisted;
    //guild => commanders
    mapping(uint256 => uint256[]) public guildCommander;
    //guild => knights
    mapping(uint256 => uint256[]) public guildKnight;

    struct GuildState {
        uint256 id;
        uint8 emblem;
        uint8 morale;
        uint16 combatPower;
        uint8 winRate;
        bytes32 name;
        uint8 maxKnight;
        uint256 lastFight;
    }

    mapping(uint256 => GuildState) public guilds;

    event NewGuild(uint256 indexed guild, address indexed minter);

    Commander private commander;
    Knight private knight;

    uint8 public constant EMBLEM_BONUS = 5;
    uint8 public constant POTION_WR_BONUS = 5;
    uint8 public constant POTION_CP_BONUS = 100;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(Commander _commander, Knight _knight)
        public
        initializer
    {
        __ERC721_init("DefiKnightGuild", "DKG");
        __ERC721Enumerable_init();
        __Pausable_init();
        __AccessControl_init();
        __ERC721Burnable_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
        _grantRole(GAME_ADMIN_ROLE, msg.sender);
        commander = _commander;
        knight = _knight;
    }

    function getAllCommanders(uint256 tokenId)
        public
        view
        returns (uint256[] memory)
    {
        return guildCommander[tokenId];
    }

    function getAllKnights(uint256 tokenId)
        public
        view
        returns (uint256[] memory)
    {
        return guildKnight[tokenId];
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

    function safeMint(address to, bytes32 name)
        public
        onlyRole(MINTER_ROLE)
        whenNotPaused
    {
        counter.increment();
        uint256 tokenId = counter.current();
        guilds[tokenId] = (GuildState(tokenId, 0, 0, 0, 0, name, 0, 0));
        emit NewGuild(tokenId, to);
        _safeMint(to, tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    )
        internal
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        whenNotPaused
    {
        require(
            !_isBlacklisted[to] && !_isBlacklisted[from],
            "Blacklisted address"
        );

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

    function getGuild(uint256 tokenId) public view returns (GuildState memory) {
        return guilds[tokenId];
    }

    function setLastFight(uint256 tokenId) public onlyRole(GAME_ADMIN_ROLE) {
        guilds[tokenId].lastFight = block.timestamp;
    }

    function updateCombatPower(uint256 guildId, uint16 combatPower)
        public
        onlyRole(GAME_ADMIN_ROLE)
        whenNotPaused
    {
        guilds[guildId].combatPower = combatPower;
    }

    function updateWinRate(uint256 guildId, uint8 winRate)
        public
        onlyRole(GAME_ADMIN_ROLE)
        whenNotPaused
    {
        guilds[guildId].winRate = winRate;
    }

    function updateMaxKnight(uint256 guildId, uint8 maxKnight)
        public
        onlyRole(GAME_ADMIN_ROLE)
        whenNotPaused
    {
        guilds[guildId].maxKnight = maxKnight;
    }

    function addMember(
        uint256 guildId,
        uint256 tokenId,
        uint8 nftType
    ) public onlyRole(GAME_ADMIN_ROLE) whenNotPaused {
        if (nftType == TYPE_COMMANDER) {
            guildCommander[guildId].push(tokenId);
        } else if (nftType == TYPE_KNIGHT) {
            guildKnight[guildId].push(tokenId);
        }
    }

    function deleteCommanderMapping(uint256 guildId)
        public
        onlyRole(GAME_ADMIN_ROLE)
        whenNotPaused
    {
        delete guildCommander[guildId];
    }

    function deleteKnightMapping(uint256 guildId)
        public
        onlyRole(GAME_ADMIN_ROLE)
        whenNotPaused
    {
        delete guildKnight[guildId];
    }

    function addMorale(uint256 guildId, uint8 amount)
        public
        onlyRole(GAME_ADMIN_ROLE)
        whenNotPaused
    {
        guilds[guildId].morale = amount;
    }

    function updateEmblem(uint256 guildId, uint8 emblem)
        public
        onlyRole(GAME_ADMIN_ROLE)
        whenNotPaused
    {
        guilds[guildId].emblem = emblem;
        updateWinRate(guildId, guilds[guildId].winRate + EMBLEM_BONUS);
    }

    function updateLastFight(uint256 guildId)
        public
        onlyRole(GAME_ADMIN_ROLE)
        whenNotPaused
    {
        guilds[guildId].lastFight = block.timestamp;
    }

    function updateMorale(uint256 guildId, uint8 morale)
        public
        onlyRole(GAME_ADMIN_ROLE)
        whenNotPaused
    {
        guilds[guildId].morale = morale;
    }
}
