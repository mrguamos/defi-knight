// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./Commander.sol";
import "./Knight.sol";
import "./Guild.sol";
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

    function addGuildMembers(
        uint256 guildId,
        uint256[] calldata commanders,
        uint256[] calldata knights
    ) external payable onlyNonContract {
        require(guild.ownerOf(guildId) == msg.sender);

        uint256 moraleFee = priceManager.getMoraleFee();
        require(moraleFee > 0);
        uint16 totalMorale = morale.guildMorale(guildId);
        uint256 totalMoraleFee = moraleFee * (knights.length * totalMorale);

        require(
            defiKnight.balanceOf(msg.sender) >= totalMoraleFee,
            "Not Enough Balance"
        );

        defiKnight.transferFrom(msg.sender, address(this), totalMoraleFee);
        guild.addMembers(msg.sender, guildId, commanders, knights);
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

    function withdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        payable(msg.sender).transfer(address(this).balance);
    }

    function emergencyWithdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        defiKnight.transfer(msg.sender, address(this).balance);
    }

    fallback() external payable {}

    receive() external payable {}
}
