// deploys the attacker contract

import { ethers } from "hardhat";

async function main() {
  const ContractFactory = await ethers.getContractFactory(
    "PredictTheFutureAttacker"
  );
  const contract = await ContractFactory.deploy({
    value: ethers.utils.parseEther("1"),
  });
  await contract.deployed();

  console.log("PredictTheFutureAttacker deployed to:", contract.address);
  console.log("Done!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
