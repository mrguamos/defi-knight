// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

interface IMinter {
    function mint(address to, uint256 counter) external;
}
