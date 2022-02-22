// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Commander.sol";
import "./IMinter.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT WHICH USES HARDCODED VALUES FOR CLARITY.
 * PLEASE DO NOT USE THIS CODE IN PRODUCTION.
 */

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

contract CommanderMinter is VRFConsumerBase, AccessControl, IMinter {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    bytes32 internal keyHash;
    uint256 internal fee;

    mapping(bytes32 => address) internal request;

    Commander public commander;

    constructor(
        address vrf,
        address link,
        bytes32 _keyHash,
        uint256 _fee,
        Commander _commander
    )
        VRFConsumerBase(
            vrf, // VRF Coordinator
            link // LINK Token
        )
    {
        keyHash = _keyHash;
        fee = _fee;
        commander = _commander;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function setVRF(bytes32 _keyHash, uint256 _fee)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        keyHash = _keyHash;
        fee = _fee;
    }

    /**
     * Requests randomness
     */
    function mint(address to, uint256) public override onlyRole(MINTER_ROLE) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        bytes32 requestId = requestRandomness(keyHash, fee);
        request[requestId] = to;
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        address to = request[requestId];
        commander.safeMint(to, randomness);
    }

    // function withdrawLink() external {} - Implement a withdraw function to avoid locking your LINK in the contract
}
