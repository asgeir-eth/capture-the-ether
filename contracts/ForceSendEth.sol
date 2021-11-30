pragma solidity ^0.8.0;

contract ForceSendEth {
    constructor(address to) payable {
        selfdestruct(payable(to));
    }
}