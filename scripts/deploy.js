const { 
    lotto,
    lottoNFT,
    BigNumber,
    generateLottoNumbers
} = require("../test/settings.js");
// The deployment script
const main = async () => {
    // Getting the first signer as the deployer
    const [deployer] = await ethers.getSigners();
    // Saving the info to be logged in the table (deployer address)
    var deployerLog = { Label: "Deploying Address", Info: deployer.address };
    // Saving the info to be logged in the table (deployer address)
    var deployerBalanceLog = { 
        Label: "Deployer ETH Balance", 
        Info: (await deployer.getBalance()).toString() 
    };

    let mock_erc20Contract;
    // Creating the instance and contract info for the lottery contract
    let lotteryInstance, lotteryContract;
    // Creating the instance and contract info for the lottery NFT contract
    let lotteryNftInstance, lotteryNftContract;
    // Creating the instance and contract info for the cosmic token contract
    let cosmicInstance;
    // Creating the instance and contract info for the timer contract
    let timerInstance, timerContract;
    // Creating the instance and contract info for the mock rand gen
    let randGenInstance, randGenContract;
    // Creating the instance and contract of all the contracts needed to mock
    // the ChainLink contract ecosystem. 
    let linkInstance;
    let mock_vrfCoordInstance, mock_vrfCoordContract;

    // Getting the lottery code (abi, bytecode, name)
    lotteryContract = await ethers.getContractFactory("Lottery");
    // Getting the lotteryNFT code (abi, bytecode, name)
    lotteryNftContract = await ethers.getContractFactory("LotteryNFT");
    // Getting the lotteryNFT code (abi, bytecode, name)
    mock_erc20Contract = await ethers.getContractFactory("Mock_erc20");
    // Getting the timer code (abi, bytecode, name)
    timerContract = await ethers.getContractFactory("Timer");
    // Getting the ChainLink contracts code (abi, bytecode, name)
    randGenContract = await ethers.getContractFactory("RandomNumberGenerator");
    mock_vrfCoordContract = await ethers.getContractFactory("Mock_VRFCoordinator");

    // Deploys the contracts
    timerInstance = await timerContract.deploy();
    cosmicInstance = await mock_erc20Contract.deploy(
        lotto.buy.cosmic,
    );
    linkInstance = await mock_erc20Contract.deploy(
        lotto.buy.cosmic,
    );
    mock_vrfCoordInstance = await mock_vrfCoordContract.deploy(
        linkInstance.address,
        lotto.chainLink.keyHash,
        lotto.chainLink.fee
    );
    lotteryInstance = await lotteryContract.deploy(
        cosmicInstance.address,
        timerInstance.address,
        lotto.setup.sizeOfLottery,
        lotto.setup.maxValidRange,
        lotto.setup.bucket.one,
        lotto.setup.bucket.two,
        lotto.setup.bucketDiscount.one,
        lotto.setup.bucketDiscount.two,
        lotto.setup.bucketDiscount.three
    );
    randGenInstance = await randGenContract.deploy(
        mock_vrfCoordInstance.address,
        linkInstance.address,
        lotteryInstance.address,
        lotto.chainLink.keyHash,
        lotto.chainLink.fee
    );
    lotteryNftInstance = await lotteryNftContract.deploy(
        lottoNFT.newLottoNft.uri,
        lotteryInstance.address,
        timerInstance.address
    );

    // Final set up of contracts
    await lotteryInstance.init(
        lotteryNftInstance.address,
        randGenInstance.address
    );
    // Making sure the lottery has some cosmic
    await cosmicInstance.mint(
        lotteryInstance.address,
        lotto.newLotto.prize
    );
    // Sending link to lottery
    await linkInstance.transfer(
        randGenInstance.address,
        lotto.buy.cosmic
    );
    // Saving the info to be logged in the table (deployer address)
    var cosmicLog = { Label: "Deployed Mock Cosmic Token Address", Info: cosmicInstance.address };
    var lotteryLog = { Label: "Deployed Lottery Address", Info: lotteryInstance.address };
    var lotteryNftLog = { Label: "Deployed Lottery NFT Address", Info: lotteryNftInstance.address };

    console.table([
        deployerLog, 
        deployerBalanceLog, 
        cosmicLog, 
        lotteryLog,
        lotteryNftLog
    ]);
}
// Runs the deployment script, catching any errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
  });