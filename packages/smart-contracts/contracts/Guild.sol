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
import "./GuildHelper.sol";

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

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant GAME_ADMIN_ROLE = keccak256("GAME_ADMIN_ROLE");

    mapping(address => bool) _isBlacklisted;
    //guild => commanders
    mapping(uint256 => uint256[]) private guildCommander;
    //guild => knights
    mapping(uint256 => uint256[]) private guildKnight;

    mapping(uint256 => uint256) public lastFight;

    struct GuildState {
        bytes32 emblem;
        uint8 morale;
        uint16 combatPower;
        uint8 winRate;
        bytes32 name;
    }

    mapping(uint256 => GuildState) public guilds;

    event NewGuild(uint256 indexed guild, address indexed minter);

    Commander private commander;
    Knight private knight;
    GuildHelper private guildHelper;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(
        Commander _commander,
        Knight _knight,
        GuildHelper _guildHelper
    ) public initializer {
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
        guildHelper = _guildHelper;
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
        guilds[tokenId] = (GuildState("", 0, 0, 0, name));
        emit NewGuild(tokenId, to);
        _safeMint(to, tokenId);
    }

    function addMembers(
        address caller,
        uint256 tokenId,
        uint256[] calldata commanders,
        uint256[] calldata knights
    ) public onlyRole(GAME_ADMIN_ROLE) whenNotPaused {
        for (uint8 i = 0; i < commanders.length; i++) {
            require(commander.ownerOf(commanders[i]) == caller);
            require(commander.commanderGuild(commanders[i]) == 0);
            guildCommander[tokenId].push(commanders[i]);
            commander.setMapping(commanders[i], tokenId);
            if (commander.getCommander(commanders[i]).isGenesis) {
                guilds[tokenId].winRate += 1;
            }
        }
        for (uint16 i = 0; i < knights.length; i++) {
            require(knight.ownerOf(knights[i]) == caller);
            require(knight.knightGuild(knights[i]) == 0);
            guildKnight[tokenId].push(knights[i]);
            knight.setMapping(knights[i], tokenId);
            Knight.KnightState memory kk = knight.getKnight(knights[i]);
            // guilds[tokenId].combatPower += kk.combatPower + kk.bonusPower;
        }
    }

    function disband(uint256 tokenId)
        public
        onlyRole(GAME_ADMIN_ROLE)
        whenNotPaused
    {
        guilds[tokenId].combatPower = 0;
        guilds[tokenId].winRate = 0;
        guilds[tokenId].morale = 0;

        for (uint8 i = 0; i < guildCommander[tokenId].length; i++) {
            commander.deleteMapping(guildCommander[tokenId][i]);
        }

        for (uint16 i = 0; i < guildKnight[tokenId].length; i++) {
            knight.deleteMapping(guildKnight[tokenId][i]);
        }

        delete guildCommander[tokenId];
        delete guildKnight[tokenId];
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

        uint256[] memory commanders = guildCommander[tokenId];
        uint256[] memory knights = guildKnight[tokenId];

        for (uint8 i = 0; i < commanders.length; i++) {
            guildHelper.transferCommander(from, to, commanders[i]);
        }

        for (uint8 i = 0; i < knights.length; i++) {
            guildHelper.transferKnight(from, to, knights[i]);
        }

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

    function setLastFight(uint256 tokenId, uint256 timestamp)
        public
        onlyRole(GAME_ADMIN_ROLE)
    {
        lastFight[tokenId] = timestamp;
    }
}
