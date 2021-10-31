import { ethers } from "hardhat";

const predictTheFutureAttackAddress =
  "0x77550F9c8ae6b6CeF2c2F88d1eaFC49299bbBEcd";

async function main() {
  const ContractFactory = await ethers.getContractFactory(
    "PredictTheFutureAttacker"
  );
  const contract = await ContractFactory.attach(predictTheFutureAttackAddress);

  const tx = await contract.perhapsGuess();
  const receipt = await tx.wait();
  console.log(receipt);
  console.log("Done!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
