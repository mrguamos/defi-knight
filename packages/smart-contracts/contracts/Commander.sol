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

contract Commander is
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    PausableUpgradeable,
    AccessControlUpgradeable,
    ERC721BurnableUpgradeable,
    UUPSUpgradeable
{
    uint8 public constant BONUS_MAX_WR = 1;

    using Counters for Counters.Counter;

    Counters.Counter public counter;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    mapping(address => bool) _isBlacklisted;

    struct CommanderState {
        uint256 id;
        uint8 rarity;
        uint8 class;
        bool isGenesis;
        uint8 gender;
    }
    mapping(uint256 => CommanderState) public commanders;

    event NewCommander(uint256 indexed commander, address indexed minter);

    //commander => guild
    mapping(uint256 => uint256) public commanderGuild;

    PriceManager priceManager;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(PriceManager _priceManager) public initializer {
        __ERC721_init("DefiKnightCommander", "DKC");
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

        // • One-star, 44% chance
        // • Two-star, 35% chance
        // • Three-star, 15% chance
        // • Four-star, 5% chance
        // • Five-star, 1% chance

        uint8 rarity;
        if (rollRarity >= 56) rarity = 0;
        else if (rollRarity < 56 && rollRarity >= 21) rarity = 1;
        else if (rollRarity < 21 && rollRarity >= 6) rarity = 2;
        else if (rollRarity < 6 && rollRarity >= 1) rarity = 3;
        else rarity = 4;
        commanders[tokenId] = CommanderState(
            tokenId,
            rarity,
            uint8(rollClass),
            tokenId <= 1000,
            uint8(rollGender)
        );
        emit NewCommander(tokenId, to);
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
        require(commanderGuild[tokenId] == 0);
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

    function getCommander(uint256 tokenId)
        public
        view
        returns (CommanderState memory)
    {
        return commanders[tokenId];
    }

    function setMapping(uint256 tokenId, uint256 guildId)
        public
        onlyRole(MINTER_ROLE)
    {
        commanderGuild[tokenId] = guildId;
    }

    function deleteMapping(uint256 tokenId) public onlyRole(MINTER_ROLE) {
        delete commanderGuild[tokenId];
    }

    function getCommandersByIds(uint256[] calldata tokenIds)
        external
        view
        returns (CommanderState[] memory)
    {
        CommanderState[] memory cc = new CommanderState[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            cc[i] = (commanders[tokenIds[i]]);
        }
        return cc;
    }
}
