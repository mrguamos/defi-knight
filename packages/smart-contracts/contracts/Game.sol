// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./Commander.sol";
import "./Knight.sol";
import "./Guild.sol";
import "./GuildMember.sol";
import "./DefiKnight.sol";
import "./IMinter.sol";
import "./Morale.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./PriceManager.sol";

contract Game is Initializable, AccessControlUpgradeable, UUPSUpgradeable {
    using Counters for Counters.Counter;

    Counters.Counter private counter;

    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    DefiKnight private defiKnight;
    Commander private commander;
    Knight private knight;
    Guild private guild;
    GuildMember private guildMember;
    IMinter private knightMinter;
    IMinter private commanderMinter;
    Morale private morale;
    bool isPaused;

    uint8 private constant TYPE_COMMANDER = 0;
    uint8 private constant TYPE_KNIGHT = 1;

    struct Enemy {
        uint16 combatPower;
        uint256 rewards;
    }

    mapping(uint8 => Enemy) enemies;

    PriceManager priceManager;

    function initialize(
        DefiKnight _defiKnight,
        Commander _commander,
        Knight _knight,
        Guild _guild,
        GuildMember _guildMember,
        IMinter _knightMinter,
        IMinter _commanderMinter,
        Morale _morale,
        PriceManager _priceManager
    ) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
        defiKnight = _defiKnight;
        commander = _commander;
        knight = _knight;
        guild = _guild;
        guildMember = _guildMember;
        knightMinter = _knightMinter;
        commanderMinter = _commanderMinter;
        morale = _morale;
        isPaused = false;
        priceManager = _priceManager;
    }

    function mintKnight() external payable onlyNonContract {
        require(!isPaused, "Minting disabled");
        uint256 mintFee = priceManager.getMintFee();
        uint256 stableFee = priceManager.getStableFee();
        require(mintFee > 0);
        require(
            defiKnight.balanceOf(msg.sender) >= mintFee,
            "Not Enough Balance"
        );
        require(msg.value >= stableFee, "Not Enough Balance");
        defiKnight.transferFrom(msg.sender, address(this), mintFee);
        counter.increment();
        knightMinter.mint(msg.sender, counter.current());
    }

    function mintCommander() external payable onlyNonContract {
        require(!isPaused, "Minting disabled");
        uint256 mintFee = priceManager.getMintFee();
        uint256 stableFee = priceManager.getStableFee();
        require(mintFee > 0);
        require(
            defiKnight.balanceOf(msg.sender) >= mintFee,
            "Not Enough Balance"
        );
        require(msg.value >= stableFee, "Not Enough Balance");
        defiKnight.transferFrom(msg.sender, address(this), mintFee);
        counter.increment();
        commanderMinter.mint(msg.sender, counter.current());
    }

    function mintGuild(bytes32 name) external onlyNonContract {
        require(!isPaused, "Minting disabled");
        uint256 guildFee = priceManager.getGuildFee();
        require(
            defiKnight.balanceOf(msg.sender) >= guildFee,
            "Not Enough Balance"
        );

        defiKnight.transferFrom(msg.sender, address(this), guildFee);
        guild.safeMint(msg.sender, name);
    }

    function buyMorale(uint256 guildId) external payable onlyNonContract {
        require(guild.ownerOf(guildId) == msg.sender);
        Guild.GuildState memory g = guild.getGuild(guildId);
        require(g.morale <= 0, "Guild has morale");
        uint256 moraleFee = priceManager.getMoraleFee();
        require(moraleFee > 0);

        uint256[] memory knights = guild.getAllKnights(guildId);
        uint256 totalMoraleFee = moraleFee * (14 * knights.length);

        require(
            defiKnight.balanceOf(msg.sender) >= totalMoraleFee,
            "Not Enough Balance"
        );

        defiKnight.transferFrom(msg.sender, address(this), totalMoraleFee);
        guild.addMorale(guildId, 14);
    }

    function conquer(uint256 guildId, uint8 enemy) external onlyNonContract {
        require(guild.ownerOf(guildId) == msg.sender);
        Guild.GuildState memory g = guild.getGuild(guildId);
        require(g.morale > 0, "Out of morale");
        uint256 lastFight = g.lastFight;
        require(lastFight >= lastFight + 1 days);
        counter.increment();
    }

    function setPaused(bool _isPaused) public onlyRole(DEFAULT_ADMIN_ROLE) {
        isPaused = _isPaused;
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

    function withdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        payable(msg.sender).transfer(address(this).balance);
    }

    function emergencyWithdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        defiKnight.transfer(msg.sender, address(this).balance);
    }

    fallback() external payable {}

    receive() external payable {}

    function addCommander(
        uint256 guildId,
        Guild.GuildState memory g,
        uint256[] calldata newCommanderTokens
    ) private returns (uint8 maxKnight) {
        uint8 guildWinRate = g.winRate;
        if (newCommanderTokens.length != 0) {
            for (uint8 f = 0; f < newCommanderTokens.length; f++) {
                require(commander.ownerOf(newCommanderTokens[f]) == msg.sender);
                uint256 cg = commander.commanderGuild(newCommanderTokens[f]);
                require(
                    cg == 0,
                    string(
                        abi.encodePacked(
                            "Commander already assigned to a guild: ",
                            cg
                        )
                    )
                );
                Commander.CommanderState memory cs = commander.getCommander(
                    newCommanderTokens[f]
                );

                if (cs.isGenesis) {
                    guildWinRate += commander.BONUS_MAX_WR();
                }
                guild.addMember(guildId, newCommanderTokens[f], TYPE_COMMANDER);
                commander.setMapping(newCommanderTokens[f], guildId);
                commander.safeTransferFrom(
                    msg.sender,
                    address(guildMember),
                    newCommanderTokens[f]
                );
                maxKnight += cs.rarity + 1;
            }
            guild.updateWinRate(guildId, guildWinRate);
            guild.updateMaxKnight(guildId, maxKnight);
        }
    }

    function addKnight(
        uint256 guildId,
        Guild.GuildState memory g,
        uint256[] calldata newKnightTokens
    ) private {
        uint16 combatPower = g.combatPower;

        if (newKnightTokens.length != 0) {
            for (uint16 f = 0; f < newKnightTokens.length; f++) {
                uint256 newKnightToken = newKnightTokens[f];
                require(knight.ownerOf(newKnightToken) == msg.sender);
                uint256 kg = knight.knightGuild(newKnightToken);
                require(
                    kg == 0,
                    string(
                        abi.encodePacked(
                            "Knight already assigned to a guild: ",
                            kg
                        )
                    )
                );
                Knight.KnightState memory ks = knight.getKnight(newKnightToken);
                combatPower += ks.combatPower;
                if (ks.isGenesis) {
                    combatPower += knight.BONUS_POWER();
                }
                guild.addMember(guildId, newKnightToken, TYPE_KNIGHT);
                knight.setMapping(newKnightToken, guildId);
                knight.safeTransferFrom(
                    msg.sender,
                    address(guildMember),
                    newKnightToken
                );
            }
            guild.updateCombatPower(guildId, combatPower);
        }
    }

    function addGuildMembers(
        uint256 guildId,
        uint256[] calldata newCommanderTokens,
        uint256[] calldata newKnightTokens
    ) external onlyNonContract {
        require(guild.ownerOf(guildId) == msg.sender);
        uint256[] memory commandersId = guild.getAllCommanders(guildId);
        require(
            (commandersId.length + newCommanderTokens.length) <= 5,
            "Invalid number of assigned commanders."
        );
        Guild.GuildState memory g = guild.getGuild(guildId);

        uint8 maxKnight = addCommander(guildId, g, newCommanderTokens);

        uint256[] memory knightsId = guild.getAllKnights(guildId);
        require(
            (knightsId.length + newKnightTokens.length) <= maxKnight,
            "Invalid number of knights"
        );
        addKnight(guildId, g, newKnightTokens);

        if (g.morale > 0) {
            uint256 moraleFee = priceManager.getMoraleFee();
            uint256 totalMoraleFee = moraleFee *
                (g.morale * newKnightTokens.length);

            require(
                defiKnight.balanceOf(msg.sender) >= totalMoraleFee,
                "Not Enough Balance"
            );

            defiKnight.transferFrom(msg.sender, address(this), totalMoraleFee);
        }
    }

    function disbandGuild(uint256 guildId) external onlyNonContract {
        require(guild.ownerOf(guildId) == msg.sender, "NOT OWNER");
        Guild.GuildState memory g = guild.getGuild(guildId);
        require(g.morale <= 0, "Guild has morale");
        uint256[] memory commandersId = guild.getAllCommanders(guildId);
        if (commandersId.length != 0) {
            for (uint16 f = 0; f < commandersId.length; f++) {
                guildMember.transferToOwner(
                    TYPE_COMMANDER,
                    commandersId[f],
                    msg.sender
                );
                commander.deleteMapping(commandersId[f]);
            }
            guild.deleteCommanderMapping(guildId);
        }

        uint256[] memory knightsId = guild.getAllKnights(guildId);
        if (knightsId.length != 0) {
            for (uint16 f = 0; f < knightsId.length; f++) {
                guildMember.transferToOwner(
                    TYPE_KNIGHT,
                    knightsId[f],
                    msg.sender
                );
                knight.deleteMapping(knightsId[f]);
            }
            guild.deleteKnightMapping(guildId);
        }
    }
}
