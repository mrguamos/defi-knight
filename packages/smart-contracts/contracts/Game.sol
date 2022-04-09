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
        uint256 moraleFee = priceManager.getMoraleFee();
        require(moraleFee > 0);

        uint256[] memory knights = guild.getAllKnights(guildId);
        uint256 totalMoraleFee = moraleFee * (14 * knights.length);

        require(
            defiKnight.balanceOf(msg.sender) >= totalMoraleFee,
            "Not Enough Balance"
        );

        defiKnight.transferFrom(msg.sender, address(this), totalMoraleFee);
        morale.addMorale(guildId, 14);
    }

    function conquer(uint256 guildId, uint256 enemy) external onlyNonContract {
        uint256 lastFight = guild.lastFight(guildId);
        require(lastFight >= lastFight + 1 days);
        counter.increment();
    }

    //guild => commanders
    mapping(uint256 => uint256[]) private guildCommander;
    //guild => knights
    mapping(uint256 => uint256[]) private guildKnight;

    // function disband(uint256 guildtoken) {
    //     address owner = guild.ownerOf(guildToken);

    //     guildCommander[guildToken].length
    //     loop
    //         transfer commanderToken(holder contract) to owner
    // }

    //mapping guild/commander and guild/knight for validation on assignment
    mapping(uint256 => uint256) private commanderGuild;
    mapping(uint256 => uint256) private knightGuild;

    //commander not related to knights, commander for knight slots only
    function addGuildMembers(
        uint256 guildId,
        uint256[] calldata newCommanderTokens, //calldata used for array or struct parameters, and external
        uint256[] calldata newKnightTokens
    ) external {
        //validate if member is already assigned to a guild
        validateGuildAssignment(newCommanderTokens, newKnightTokens);

        // build commander
        //require(commander.ownerOf(commanderToken) == msg.sender);
        require(
            (guildCommander[guildId].length + newCommanderTokens.length) <= 5,
            "Invalid number of assigned commanders."
        ); //validate commander, guild limit 5

        //get knight slot cap + wr
        uint16 guildKnightCap = 0;
        uint8 guildWinRate = 0;
        Commander.CommanderState memory cs;
        if (guildCommander[guildId].length != 0) {
            //get knight slot + wr current assigned commanders
            for (uint16 f = 0; f < guildCommander[guildId].length; f++) {
                cs = commander.getCommander(guildCommander[guildId][f]);
                guildKnightCap += cs.rarity + 1;
                if (cs.isGenesis) {
                    guildWinRate += 1;
                }
            }
        }

        if (newCommanderTokens.length != 0) {
            //get knight slot + wr  "for assignment" commanders
            for (uint16 f = 0; f < newCommanderTokens.length; f++) {
                cs = commander.getCommander(newCommanderTokens[f]);
                guildKnightCap += cs.rarity + 1;
                if (cs.isGenesis) {
                    guildWinRate += 1;
                }
                guildCommander[guildId].push(newCommanderTokens[f]);
                commanderGuild[newCommanderTokens[f]] = guildId;
                commander.safeTransferFrom(
                    msg.sender,
                    address(guildMember),
                    newCommanderTokens[f]
                );
            }
        }

        //build knights
        require(
            (guildKnight[guildId].length + newKnightTokens.length) <=
                guildKnightCap
        ); //validate knights, knight limit <=25

        //get total combatpower
        uint16 combatPower;

        Knight.KnightState memory ks;
        if (guildKnight[guildId].length != 0) {
            //get knight slot + wr current assigned commanders
            for (uint16 f = 0; f < guildKnight[guildId].length; f++) {
                ks = knight.getKnight(guildKnight[guildId][f]);
                combatPower += ks.combatPower + ks.bonusPower;
            }
        }

        if (newKnightTokens.length != 0) {
            //get knight slot + wr  "for assignment" commanders
            for (uint16 f = 0; f < newKnightTokens.length; f++) {
                ks = knight.getKnight(newKnightTokens[f]);
                combatPower += ks.combatPower + ks.bonusPower;
                knightGuild[newKnightTokens[f]] = guildId; // mapping for validation
                knight.safeTransferFrom(
                    msg.sender,
                    address(guildMember),
                    newKnightTokens[f]
                );
            }
        }

        guild.updateCombatPower(guildId, combatPower);
        guild.updateWinRate(guildId, guildWinRate);
    }

    function validateGuildAssignment(
        uint256[] calldata commanderTokens,
        uint256[] calldata knightTokens
    ) private view {
        //validate if member is already assigned to a guild
        for (uint16 c = 0; c < commanderTokens.length; c++) {
            require(
                commanderGuild[commanderTokens[c]] == 0,
                string(
                    abi.encodePacked(
                        "Commander already assigned to a guild: ",
                        commanderGuild[commanderTokens[c]]
                    )
                )
            );
        }

        for (uint16 c = 0; c < knightTokens.length; c++) {
            require(
                knightGuild[knightTokens[c]] == 0,
                string(
                    abi.encodePacked(
                        "Knight already assigned to a guild: ",
                        knightGuild[knightTokens[c]]
                    )
                )
            );
        }
    }

    function getMyGuildCommanders(uint256 guildId)
        public
        view
        returns (uint256[] memory)
    {
        return guildCommander[guildId];
    }

    function getMyGuildKnights(uint256 guildId)
        public
        view
        returns (uint256[] memory)
    {
        return guildKnight[guildId];
    }

    function getCommanderValidation(uint256 commanderToken)
        public
        view
        returns (uint256)
    {
        return commanderGuild[commanderToken];
    }

    function getKnightValidation(uint256 knightToken)
        public
        view
        returns (uint256)
    {
        return knightGuild[knightToken];
    }

    function getMyGuildStats(uint256 guildId)
        public
        view
        returns (Guild.GuildState memory)
    {
        return guild.getGuild(guildId);
    }

    function disbandGuild(uint256 guildId) external payable onlyNonContract {
        require(guild.ownerOf(guildId) == msg.sender);
        guild.disband(guildId);
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
}
