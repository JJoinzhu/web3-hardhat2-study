const { ethers } = require("hardhat");
require("@nomicfoundation/hardhat-verify");

async function main() {
    // create factory
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    console.log("Deploying FundMe contract...");
    // deploy contract from factory
    const fundMe = await fundMeFactory.deploy(10);
    await fundMe.waitForDeployment();
    console.log(`Successfully, FundMe deployed to: ${fundMe.target}`);

    await hre.run("verify:verify", {
        address: fundMe.target,
        constructorArguments: [
            10,
        ],
    });
}

main().then().catch((error) => {
    console.error(error);
    process.exit(1);
});