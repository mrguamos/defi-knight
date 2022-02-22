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
import "./IOracle.sol";
import "./Morale.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

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
    IOracle private oracle;
    uint256 private constant MINT_FEE = 70;
    uint256 private constant STABLE_FEE = 30;
    uint256 private constant GUILD_FEE = 10;
    uint256 private constant MORALE_FEE = 5;
    uint256 private constant ADD_MEMBER_FEE = 1;

    IERC20 private stableCoin;
    uint256 private presaleFee;
    Morale private morale;
    bool isPaused;

    struct Enemy {
        uint16 combatPower;
        uint256 rewards;
    }

    mapping(uint8 => Enemy) enemies;

    function initialize(
        DefiKnight _defiKnight,
        Commander _commander,
        Knight _knight,
        Guild _guild,
        IMinter _knightMinter,
        IMinter _commanderMinter,
        IOracle _oracle,
        IERC20 _stableCoin,
        Morale _morale
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
        oracle = _oracle;
        stableCoin = _stableCoin;
        morale = _morale;
        isPaused = true;
    }

    function mintKnight() external onlyNonContract {
        require(!isPaused, "Minting disabled");
        uint256 mintFee = getMintFee();
        require(mintFee > 0);
        require(
            defiKnight.balanceOf(msg.sender) >= mintFee,
            "Not Enough Balance"
        );
        require(
            stableCoin.balanceOf(msg.sender) >= STABLE_FEE,
            "Not Enough Balance"
        );
        defiKnight.transferFrom(msg.sender, address(this), mintFee);
        stableCoin.transferFrom(msg.sender, address(this), mintFee);
        counter.increment();
        knightMinter.mint(msg.sender, counter.current());
    }

    function mintKnightPresale() external payable onlyNonContract {
        require(knight.isPresale());
        require(presaleFee != 0, "Presale Fee Not Set");
        require(msg.value >= presaleFee, "Not Enough Balance");
        counter.increment();
        knightMinter.mint(msg.sender, counter.current());
    }

    function mintCommander() external onlyNonContract {
        require(!isPaused, "Minting disabled");
        uint256 mintFee = getMintFee();
        require(mintFee > 0);
        require(
            defiKnight.balanceOf(msg.sender) >= mintFee,
            "Not Enough Balance"
        );
        require(
            stableCoin.balanceOf(msg.sender) >= STABLE_FEE,
            "Not Enough Balance"
        );
        defiKnight.transferFrom(msg.sender, address(this), mintFee);
        stableCoin.transferFrom(msg.sender, address(this), mintFee);
        counter.increment();
        commanderMinter.mint(msg.sender, counter.current());
    }

    function mintCommanderPresale() external payable onlyNonContract {
        require(commander.isPresale());
        require(presaleFee != 0, "Presale Fee Not Set");
        require(msg.value >= presaleFee, "Not Enough Balance");
        counter.increment();
        commanderMinter.mint(msg.sender, counter.current());
    }

    function mintGuild(bytes32 name) external onlyNonContract {
        require(!isPaused, "Minting disabled");
        uint256 guildFee = getGuildFee();
        require(
            defiKnight.balanceOf(msg.sender) >= guildFee,
            "Not Enough Balance"
        );

        defiKnight.transferFrom(msg.sender, address(this), guildFee);
        guild.safeMint(msg.sender, name);
    }

    function buyMorale(uint256 guildId) external payable onlyNonContract {
        require(guild.ownerOf(guildId) == msg.sender);
        uint256 moraleFee = getMoraleFee();
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

        uint256 moraleFee = getMoraleFee();
        require(moraleFee > 0);
        uint16 totalMorale = morale.guildMorale(guildId);
        uint256 totalMoraleFee = moraleFee * (knights.length * totalMorale);

        uint256 addMemberFee = getAddMemberFee();
        require(addMemberFee > 0);
        uint256 totalAddMemberFee = addMemberFee *
            (commanders.length + knights.length);

        require(
            defiKnight.balanceOf(msg.sender) >=
                totalMoraleFee + totalAddMemberFee,
            "Not Enough Balance"
        );

        defiKnight.transferFrom(msg.sender, address(this), totalMoraleFee);
        guild.addMembers(msg.sender, guildId, commanders, knights);
    }

    function disbandGuild(uint256 guildId) external payable onlyNonContract {
        require(guild.ownerOf(guildId) == msg.sender);
        guild.disband(guildId);
    }

    function getMintFee() public view returns (uint256) {
        return oracle.getUsdPrice() * MINT_FEE;
    }

    function getGuildFee() public view returns (uint256) {
        return oracle.getUsdPrice() * GUILD_FEE;
    }

    function getMoraleFee() public view returns (uint256) {
        return oracle.getUsdPrice() * MORALE_FEE;
    }

    function getAddMemberFee() public view returns (uint256) {
        return oracle.getUsdPrice() * ADD_MEMBER_FEE;
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

    function setPresaleFee(uint256 _presaleFee)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        presaleFee = _presaleFee;
    }
}
