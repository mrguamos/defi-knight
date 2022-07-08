// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract RewardsManager is
    Initializable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant GAME_ADMIN_ROLE = keccak256("GAME_ADMIN_ROLE");

    uint8 public constant REWARDS_DURATION = 14;
    uint256 public constant REWARDS_DURATION_DAYS = 14 days;
    uint8 public constant REWARDS_FEE = 70;
    uint8 public constant REWARDS_FEE_PER_DAY = 5;

    //   maxLevel: 25,
    //   maxSubLevel: 9,
    //   minCP: 50,
    //   maxCP: 6250,
    //   cpIncrement: 25,
    //   levelIncrement: 250,
    //   wrIncrement: 5,
    //   minWR: 30,
    //   maxWR: 70,
    //   minAmount: 10,
    //   amountIncrement: 4,

    struct AccountRewards {
        address account;
        uint256 amount;
        uint256 lastClaim;
    }

    struct Rewards {
        uint8 maxLevel;
        uint8 maxSubLevel;
        uint8 minCP;
        uint16 maxCP;
        uint8 cpIncrement;
        uint8 levelIncrement;
        uint8 wrIncrement;
        uint8 minWR;
        uint8 maxWR;
        uint8 minAmount;
        uint8 amountIncrement;
    }

    Rewards public rewards;
    mapping(address => AccountRewards) public accountRewards;

    function initialize() public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
        rewards = Rewards(25, 9, 50, 6250, 25, 250, 5, 30, 70, 10, 4);
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

    function updateReward(Rewards calldata _rewards)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        rewards = _rewards;
    }

    function updateAccountRewards(address account, uint256 amount)
        public
        onlyRole(GAME_ADMIN_ROLE)
    {
        AccountRewards storage _accountRewards = accountRewards[account];
        _accountRewards.amount += amount;
        _accountRewards.account = account;
        if (_accountRewards.lastClaim == 0) {
            _accountRewards.lastClaim = block.timestamp;
        }
    }

    function getAccountRewards(address account)
        external
        view
        returns (AccountRewards memory)
    {
        return accountRewards[account];
    }

    function getRewards() external view returns (Rewards memory) {
        return rewards;
    }

    function claim(address account)
        external
        onlyRole(GAME_ADMIN_ROLE)
        returns (uint256 amount)
    {
        AccountRewards storage ar = accountRewards[account];
        require(ar.amount > 0, "Nothing to claim");
        uint256 countdown = ar.lastClaim + REWARDS_DURATION_DAYS;
        uint256 diff = (countdown + 1 days) - block.timestamp;
        uint256 daysDiff = diff / 1 days;
        uint256 tax = daysDiff * REWARDS_FEE_PER_DAY;
        uint256 fee = (ar.amount * tax) / 100;
        amount = ar.amount - fee;
        ar.amount = 0;
        ar.lastClaim = block.timestamp;
    }
}
