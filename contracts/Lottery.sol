// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.28;

//create a lottery contract
// users can enter the lottery by paying a fee
// winner get announced in interval of times
// winner get all lottery fees

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract Lottery is VRFConsumerBaseV2Plus, AutomationCompatibleInterface {
    //types
    enum LotteryState {
        OPEN,
        CALCULATING,
        INACTIVE
    }
    uint256 private immutable i_lotteryEntryFee;
    address payable[] private s_players;
    address private s_recentWinner;

    LotteryState private s_lotteryState;

    // VRF Configuration
    uint256 private immutable i_subscriptionId;
    bytes32 private immutable i_keyHash;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    uint256 private s_lasttimeStamp;
    uint256 private immutable i_interval; // 200 seconds

    //EVENTS
    event LotteryEnter(address indexed player);
    event RequestedLotteryWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    constructor(
        address _vrfCoordinator, //address contract of vrf coordinator
        uint256 _lotteryEntryFee,
        uint256 _subscriptionId,
        bytes32 _keyHash,
        uint32 _callbackGasLimit,
        uint256 _interval
    ) VRFConsumerBaseV2Plus(_vrfCoordinator) {
        i_lotteryEntryFee = _lotteryEntryFee;
        i_subscriptionId = _subscriptionId;
        i_keyHash = _keyHash;
        i_callbackGasLimit = _callbackGasLimit;
        s_lotteryState = LotteryState.OPEN;
        s_lasttimeStamp = block.timestamp;
        i_interval = _interval;
    }

    function enterLottery() public payable {
        if (s_lotteryState != LotteryState.OPEN) {
            revert(
                "Lottery is not open, please participate in other lotteries available"
            );
        }
        if (msg.value < i_lotteryEntryFee)
            revert("Not enough ETH to enter lottery");

        // add user to lottery array
        s_players.push(payable(msg.sender));
        // emit event
        emit LotteryEnter(msg.sender);
    }

    /**
     *
     *@dev This is the function that the Chainlink Automation nodes call
     * they look for the `upkeepNeeded` to return true. The following should be true
     * 1. The time interval should have passed between lottery runs
     * 2. The lottery should have at least 1 player, and have some ETH
     * 3. Our subscription is funded with LINK
     * 4. The lottery should be in an "open" state.
     */

    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        // Check if lottery is open
        bool isOpen = (s_lotteryState == LotteryState.OPEN);
        // Check if the time interval has passed
        bool timePassed = ((block.timestamp - s_lasttimeStamp) > i_interval);
        // Check if there are players
        bool hasPlayers = (s_players.length > 0);
        // Check if the contract has balance
        bool hasBalance = address(this).balance > 0;
        // Determine if upkeep is needed
        upkeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);
        return (upkeepNeeded, "");
    }

    //REQUEST RANDOM WINNER
    function performUpkeep(bytes calldata /* performData */) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert("Upkeep not needed");
        }

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

    function fulfillRandomWords(
        uint256 /*requestId */,
        uint256[] calldata randomWords
    ) internal override {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        // select the recent winner
        s_recentWinner = recentWinner;
        // change the lottery state to open
        s_lotteryState = LotteryState.OPEN;
        // reset the players array
        s_players = new address payable[](0);

        //reset timestamp
        s_lasttimeStamp = block.timestamp;

        // transfer the money to the winner
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert("Transfer failed");
        }

        emit WinnerPicked(s_recentWinner);
    }

    // get all players
    function getPlayers() public view returns (address payable[] memory) {
        return s_players;
    }

    function getLotteryEntryFee() public view returns (uint256) {
        return i_lotteryEntryFee;
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function lotteryState() public view returns (LotteryState) {
        return s_lotteryState;
    }

    // Get num words as pure because its constant
    function getNumWords() public pure returns (uint256) {
        return NUM_WORDS;
    }

    function getNoOfPlayer() public view returns (uint256) {
        return s_players.length;
    }

    function getLastTimeStamp() public view returns (uint256) {
        return s_lasttimeStamp;
    }

    function getRequestConfirmations() public pure returns (uint256) {
        return REQUEST_CONFIRMATIONS;
    }
}
