// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

interface IOracle {
    function getCurrentPrice() external view returns (uint256);

    function getUsdPrice() external view returns (uint256);
}
