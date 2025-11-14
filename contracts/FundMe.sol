// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import {
    AggregatorV3Interface
} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract FundMe {
    mapping(address => uint256) public fundersToAmount;
    uint256 public priceFeed;
    uint constant MINIMUM_VALUE = 100 * 10 ** 18;
    uint constant TARGET_VALUE = 1000 * 10 ** 18;
    address owner;
    uint public feedUsd;

    uint256 deploymentTimestamp;
    uint256 lockTime;

    address erc20Addr;

    bool public isGetFundSuccess;

    AggregatorV3Interface internal dataFeed;
    constructor(uint256 _lockTime) {
        dataFeed = AggregatorV3Interface(
            // sepolia testnet
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        owner = msg.sender;
        deploymentTimestamp = block.timestamp;
        lockTime = _lockTime;
    }

    function fund() external payable {
        require(
            block.timestamp < deploymentTimestamp + lockTime,
            "window is closed"
        );
        require(convertEthToUsd(msg.value) >= MINIMUM_VALUE, "Send more ETH");
        fundersToAmount[msg.sender] += msg.value;
    }

    function getChainlinkDataFeedLatestAnswer() public view returns (int256) {
        // prettier-ignore
        (
        /* uint80 roundId */,
        int256 answer,
        /*uint256 startedAt*/,
        /*uint256 updatedAt*/,
        /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();

        return answer;
    }

    function convertEthToUsd(uint256 ethAmount) internal returns (uint256) {
        int256 answer = getChainlinkDataFeedLatestAnswer();
        priceFeed = uint256(answer);
        feedUsd = (ethAmount * priceFeed) / (10 ** 8);
        // 10 ** 8 is the decimals of the price feed
        return (ethAmount * priceFeed) / (10 ** 8);
    }

    function transferOwnership(address _owner) external onlyOwner {
        owner = _owner;
    }

    function getFund() external windowClosed onlyOwner {
        require(
            convertEthToUsd(address(this).balance) >= TARGET_VALUE,
            "Target is not reached"
        );
        bool success;
        (success, ) = payable(msg.sender).call{value: address(this).balance}(
            ""
        );
        require(success, "GetFund is faild");
        fundersToAmount[msg.sender] = 0;
        isGetFundSuccess = true;
    }

    function refund() external windowClosed {
        require(
            convertEthToUsd(address(this).balance) < TARGET_VALUE,
            "Target is reached"
        );
        require(fundersToAmount[msg.sender] > 0, "You have not funded");
        bool success;
        (success, ) = payable(msg.sender).call{
            value: fundersToAmount[msg.sender]
        }("");
        require(success, "refund is failed");
        fundersToAmount[msg.sender] = 0;
    }

    function setFunderToAmount(
        address funder,
        uint256 amountToUpdate
    ) external {
        require(
            msg.sender == erc20Addr,
            "You do not have permission to call this function"
        );
        fundersToAmount[funder] = amountToUpdate;
    }

    function setErc20Addr(address _erc20Addr) public onlyOwner {
        erc20Addr = _erc20Addr;
    }

    modifier windowClosed() {
        require(
            block.timestamp >= deploymentTimestamp + lockTime,
            "Funding is in process"
        );
        _;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "this function is only be called by owner"
        );
        _;
    }
}
