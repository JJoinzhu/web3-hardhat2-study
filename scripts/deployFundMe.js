const { ethers } = require("hardhat");
require("@nomicfoundation/hardhat-verify");

async function main() {
    const apiKey = process.env.SEPOLIA_API_KEY;

    // create factory
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    console.log("Deploying FundMe contract...");
    // deploy contract from factory
    const fundMe = await fundMeFactory.deploy(10);
    await fundMe.waitForDeployment();
    console.log(`Successfully, FundMe deployed to: ${fundMe.target}`);

    // Get chainId from provider (correct way)
    const network = await ethers.provider.getNetwork();
    const chainId = Number(network.chainId);
    console.log(`Network: ${hre.network.name}, ChainId: ${chainId}, API Key: ${apiKey ? 'Set' : 'Not set'}`);

    // Sepolia chainId is 11155111
    if (chainId === 11155111 && apiKey) {
        console.log("Waiting for 5 blocks to pass...");
        await fundMe.deploymentTransaction()?.wait(5);
        await verifyFundMe(fundMe.target, [10]);
    } else {
        console.log("Skipping verification (not Sepolia network or API key not set)");
    }

}

async function verifyFundMe(address, args) {
    await hre.run("verify:verify", {
        address,
        constructorArguments: args,
    });
}

main().then().catch((error) => {
    console.error(error);
    process.exit(1);
});