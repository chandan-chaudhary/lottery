// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.28;

import {
    VRFConsumerBaseV2Plus
} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {
    VRFV2PlusClient
} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {
    AutomationCompatibleInterface
} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

// Custom errors (saves gas vs strings)
error LotteryNotOpen();
error NotEnoughETH();
error UpkeepNotNeeded();
error TransferFailed();
error NotOwner();
error InvalidOwnerAddress();
error InvalidInterval();
error InvalidEntryFee();

contract Lottery is VRFConsumerBaseV2Plus, AutomationCompatibleInterface {
    // Types
    enum LotteryState {
        OPEN,
        CALCULATING,
        INACTIVE
    }
    // State variables (entry fee and interval are updatable)
    uint256 private immutable i_subscriptionId;
    bytes32 private immutable i_keyHash;
    uint32 private immutable i_callbackGasLimit;

    // Constants
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    // State variables (optimized layout)
    uint256 private s_lotteryEntryFee;
    uint256 private s_interval;

    LotteryState private s_lotteryState;
    address private s_recentWinner;
    uint256 private s_lastTimeStamp;
    address payable[] private s_players;
    address[] private s_allRecentWinners;

    // Events
    event LotteryEnter(address indexed player);
    event RequestedLotteryWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    constructor(
        address _vrfCoordinator,
        uint256 _lotteryEntryFee,
        uint256 _subscriptionId,
        bytes32 _keyHash,
        uint32 _callbackGasLimit,
        uint256 _interval
    ) VRFConsumerBaseV2Plus(_vrfCoordinator) {
        s_lotteryEntryFee = _lotteryEntryFee;
        i_subscriptionId = _subscriptionId;
        i_keyHash = _keyHash;
        i_callbackGasLimit = _callbackGasLimit;
        s_interval = _interval;
        s_lotteryState = LotteryState.OPEN;
        s_lastTimeStamp = block.timestamp; // ✅ Initialize timestamp in constructor
    }

    /**
     * @dev Allows the current owner to change ownership to a new owner
     */
    function changeOwner(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidOwnerAddress();
        transferOwnership(newOwner);
    }

    /**
     * @dev Allows the owner to withdraw all funds from the contract in case of emergency
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 contractBalance = address(this).balance;
        (bool success, ) = owner().call{value: contractBalance}("");
        if (!success) revert TransferFailed();
    }

    /**
     * @notice Updates the interval between lottery draws.
     * @dev Only callable by the owner.
     * @param newInterval The new interval in seconds.
     */
    function setInterval(uint256 newInterval) external onlyOwner {
        if (newInterval == 0) revert InvalidInterval();
        s_interval = newInterval;
    }

    /**
     * @notice Updates the lottery entry fee.
     * @dev Only callable by the owner.
     * @param newEntryFee The new entry fee in wei.
     */
    function setLotteryEntryFee(uint256 newEntryFee) external onlyOwner {
        if (newEntryFee == 0) revert InvalidEntryFee();
        s_lotteryEntryFee = newEntryFee;
    }

    /**
     * @dev Allows a user to enter the lottery by paying the entry fee
     */
    function enterLottery() external payable {
        if (s_lotteryState != LotteryState.OPEN) revert LotteryNotOpen();
        if (msg.value < s_lotteryEntryFee) revert NotEnoughETH();

        s_players.push(payable(msg.sender));
        emit LotteryEnter(msg.sender);
    }

    /**
     * @dev Chainlink Automation calls this to check if upkeep is needed
     */
    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        bool isOpen = (s_lotteryState == LotteryState.OPEN);
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > s_interval);
        bool hasPlayers = (s_players.length > 0);
        bool hasBalance = (address(this).balance > 0);

        upkeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);
        return (upkeepNeeded, "");
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) revert UpkeepNotNeeded();

        s_lotteryState = LotteryState.CALCULATING;

        // Request random words from Chainlink VRF
        uint256 requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: i_keyHash,
                subId: i_subscriptionId,
                requestConfirmations: REQUEST_CONFIRMATIONS,
                callbackGasLimit: i_callbackGasLimit,
                numWords: NUM_WORDS,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );
        emit RequestedLotteryWinner(requestId);
    }

    /**
     * @dev ✅ OPTIMIZED: Reduced gas usage in callback
     */
    function fulfillRandomWords(
        uint256 /* requestId */,
        uint256[] calldata randomWords
    ) internal override {
        // Calculate winner
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable winner = s_players[indexOfWinner];

        // Update state before external call (CEI pattern)
        s_recentWinner = winner;
        s_allRecentWinners.push(winner);
        s_lotteryState = LotteryState.OPEN;
        s_lastTimeStamp = block.timestamp;

        // Cache balance to avoid multiple SLOAD operations
        uint256 prize = address(this).balance;

        // Delete array (cheaper than creating new one)
        delete s_players;

        // Transfer prize (external call last)
        (bool success, ) = winner.call{value: prize}("");
        if (!success) revert TransferFailed();

        emit WinnerPicked(winner);
    }

    // ========================================
    // View Functions (Optimized)
    // ========================================

    function getPlayers() external view returns (address payable[] memory) {
        return s_players;
    }

    function getLotteryEntryFee() external view returns (uint256) {
        return s_lotteryEntryFee;
    }

    function getRecentWinner() external view returns (address) {
        return s_recentWinner;
    }
    function getAllRecentWinners() external view returns (address[] memory) {
        return s_allRecentWinners;
    }

    function getLotteryState() external view returns (LotteryState) {
        return s_lotteryState;
    }

    function getNumWords() external pure returns (uint256) {
        return NUM_WORDS;
    }

    function getNumberOfPlayers() external view returns (uint256) {
        return s_players.length;
    }

    function getLastTimeStamp() external view returns (uint256) {
        return s_lastTimeStamp;
    }

    function getRequestConfirmations() external pure returns (uint256) {
        return REQUEST_CONFIRMATIONS;
    }

    function getInterval() external view returns (uint256) {
        return s_interval;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
