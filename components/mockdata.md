// // SPDX-License-Identifier: SEE LICENSE IN LICENSE
// pragma solidity ^0.8.28;

// import {
//     VRFConsumerBaseV2Plus
// } from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
// import {
//     VRFV2PlusClient
// } from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
// import {
//     AutomationCompatibleInterface
// } from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

// // Custom errors (saves gas vs strings)
// error LotteryNotOpen();
// error NotEnoughETH();
// error UpkeepNotNeeded();
// error TransferFailed();

// contract Lottery is VRFConsumerBaseV2Plus, AutomationCompatibleInterface {
//     // Types
//     enum LotteryState {
//         OPEN,
//         CALCULATING,
//         INACTIVE
//     }

//     // Immutable variables (cheaper than storage)
//     uint256 private immutable i_lotteryEntryFee;
//     uint256 private immutable i_subscriptionId;
//     bytes32 private immutable i_keyHash;
//     uint32 private immutable i_callbackGasLimit;
//     uint256 private immutable i_interval;

//     // Constants
//     uint16 private constant REQUEST_CONFIRMATIONS = 3;
//     uint32 private constant NUM_WORDS = 1;

//     // State variables (optimized layout)
//     LotteryState private s_lotteryState;
//     address private s_recentWinner;
//     uint256 private s_lastTimeStamp;
//     address payable[] private s_players;

//     // Events
//     event LotteryEnter(address indexed player);
//     event RequestedLotteryWinner(uint256 indexed requestId);
//     event WinnerPicked(address indexed winner);

//     constructor(
//         address _vrfCoordinator,
//         uint256 _lotteryEntryFee,
//         uint256 _subscriptionId,
//         bytes32 _keyHash,
//         uint32 _callbackGasLimit,
//         uint256 _interval
//     ) VRFConsumerBaseV2Plus(_vrfCoordinator) {
//         i_lotteryEntryFee = _lotteryEntryFee;
//         i_subscriptionId = _subscriptionId;
//         i_keyHash = _keyHash;
//         i_callbackGasLimit = _callbackGasLimit;
//         i_interval = _interval;
//         s_lotteryState = LotteryState.OPEN;
//         s_lastTimeStamp = block.timestamp; // ✅ Initialize timestamp in constructor
//     }

//     function enterLottery() external payable {
//         if (s_lotteryState != LotteryState.OPEN) revert LotteryNotOpen();
//         if (msg.value < i_lotteryEntryFee) revert NotEnoughETH();

//         s_players.push(payable(msg.sender));
//         emit LotteryEnter(msg.sender);
//     }

//     /**
//      * @dev Chainlink Automation calls this to check if upkeep is needed
//      */
//     function checkUpkeep(
//         bytes memory /* checkData */
//     )
//         public
//         view
//         override
//         returns (bool upkeepNeeded, bytes memory /* performData */)
//     {
//         bool isOpen = (s_lotteryState == LotteryState.OPEN);
//         bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
//         bool hasPlayers = (s_players.length > 0);
//         bool hasBalance = (address(this).balance > 0);

//         upkeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);
//         return (upkeepNeeded, "");
//     }

//     function performUpkeep(bytes calldata /* performData */) external override {
//         (bool upkeepNeeded, ) = checkUpkeep("");
//         if (!upkeepNeeded) revert UpkeepNotNeeded();

//         s_lotteryState = LotteryState.CALCULATING;

//         // Request random words from Chainlink VRF
//         uint256 requestId = s_vrfCoordinator.requestRandomWords(
//             VRFV2PlusClient.RandomWordsRequest({
//                 keyHash: i_keyHash,
//                 subId: i_subscriptionId,
//                 requestConfirmations: REQUEST_CONFIRMATIONS,
//                 callbackGasLimit: i_callbackGasLimit,
//                 numWords: NUM_WORDS,
//                 extraArgs: VRFV2PlusClient._argsToBytes(
//                     VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
//                 )
//             })
//         );
//         emit RequestedLotteryWinner(requestId);
//     }

//     /**
//      * @dev ✅ OPTIMIZED: Reduced gas usage in callback
//      */
//     function fulfillRandomWords(
//         uint256 /* requestId */,
//         uint256[] calldata randomWords
//     ) internal override {
//         // Calculate winner
//         uint256 indexOfWinner = randomWords[0] % s_players.length;
//         address payable winner = s_players[indexOfWinner];

//         // Update state before external call (CEI pattern)
//         s_recentWinner = winner;
//         s_lotteryState = LotteryState.OPEN;
//         s_lastTimeStamp = block.timestamp;

//         // Cache balance to avoid multiple SLOAD operations
//         uint256 prize = address(this).balance;

//         // Delete array (cheaper than creating new one)
//         delete s_players;

//         // Transfer prize (external call last)
//         (bool success, ) = winner.call{value: prize}("");
//         if (!success) revert TransferFailed();

//         emit WinnerPicked(winner);
//     }

//     // ========================================
//     // View Functions (Optimized)
//     // ========================================

//     function getPlayers() external view returns (address payable[] memory) {
//         return s_players;
//     }

//     function getLotteryEntryFee() external view returns (uint256) {
//         return i_lotteryEntryFee;
//     }

//     function getRecentWinner() external view returns (address) {
//         return s_recentWinner;
//     }

//     function getLotteryState() external view returns (LotteryState) {
//         return s_lotteryState;
//     }

//     function getNumWords() external pure returns (uint256) {
//         return NUM_WORDS;
//     }

//     function getNumberOfPlayers() external view returns (uint256) {
//         return s_players.length;
//     }

//     function getLastTimeStamp() external view returns (uint256) {
//         return s_lastTimeStamp;
//     }

//     function getRequestConfirmations() external pure returns (uint256) {
//         return REQUEST_CONFIRMATIONS;
//     }

//     function getInterval() external view returns (uint256) {
//         return i_interval;
//     }
// }

// // // SPDX-License-Identifier: SEE LICENSE IN LICENSE
// // pragma solidity ^0.8.28;

// // //create a lottery contract
// // // users can enter the lottery by paying a fee
// // // winner get announced in interval of times
// // // winner get all lottery fees

// // import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
// // import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
// // import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

// // error LotteryNotOpen();
// // error NotEnoughETH();
// // error UpkeepNotNeeded();
// // error TransferFailed();

// // contract Lottery is VRFConsumerBaseV2Plus, AutomationCompatibleInterface {
// //     // Custom errors

// //     //types
// //     enum LotteryState {
// //         OPEN,
// //         CALCULATING,
// //         INACTIVE
// //     }
// //     uint256 private immutable i_lotteryEntryFee;
// //     address payable[] private s_players;
// //     address private s_recentWinner;

// //     LotteryState private s_lotteryState;

// //     // VRF Configuration
// //     uint256 private immutable i_subscriptionId;
// //     bytes32 private immutable i_keyHash;
// //     uint32 private immutable i_callbackGasLimit;
// //     uint16 private constant REQUEST_CONFIRMATIONS = 3;
// //     uint32 private constant NUM_WORDS = 1;

// //     uint256 private s_lasttimeStamp;
// //     uint256 private immutable i_interval; // 200 seconds

// //     //EVENTS
// //     event LotteryEnter(address indexed player);
// //     event RequestedLotteryWinner(uint256 indexed requestId);
// //     event WinnerPicked(address indexed winner);

// //     constructor(
// //         address _vrfCoordinator, //address contract of vrf coordinator
// //         uint256 _lotteryEntryFee,
// //         uint256 _subscriptionId,
// //         bytes32 _keyHash,
// //         uint32 _callbackGasLimit,
// //         uint256 _interval
// //     ) VRFConsumerBaseV2Plus(_vrfCoordinator) {
// //         i_lotteryEntryFee = _lotteryEntryFee;
// //         i_subscriptionId = _subscriptionId;
// //         i_keyHash = _keyHash;
// //         i_callbackGasLimit = _callbackGasLimit;
// //         i_interval = _interval;
// //         s_lotteryState = LotteryState.OPEN;
// //         if (s_lotteryState != LotteryState.OPEN) {
// //             revert LotteryNotOpen();
// //         }
// //     }

// //     function enterLottery() public payable {
// //         if (s_lotteryState != LotteryState.OPEN) {
// //             revert LotteryNotOpen();
// //         }
// //         if (msg.value < i_lotteryEntryFee) revert NotEnoughETH();

// //         // add user to lottery array
// //         s_players.push(payable(msg.sender));
// //         // emit event
// //         emit LotteryEnter(msg.sender);
// //     }

// //     /**
// //      *
// //      *@dev This is the function that the Chainlink Automation nodes call
// //      * they look for the `upkeepNeeded` to return true. The following should be true
// //      * 1. The time interval should have passed between lottery runs
// //      * 2. The lottery should have at least 1 player, and have some ETH
// //      * 3. Our subscription is funded with LINK
// //      * 4. The lottery should be in an "open" state.
// //      */

// //     function checkUpkeep(
// //         bytes memory /* checkData */
// //     )
// //         public
// //         view
// //         override
// //         returns (bool upkeepNeeded, bytes memory /* performData */)
// //     {
// //         // Check if lottery is open
// //         bool isOpen = (s_lotteryState == LotteryState.OPEN);
// //         // Check if the time interval has passed
// //         bool timePassed = ((block.timestamp - s_lasttimeStamp) > i_interval);
// //         // Check if there are players
// //         bool hasPlayers = (s_players.length > 0);
// //         // Check if the contract has balance
// //         bool hasBalance = address(this).balance > 0;
// //         // Determine if upkeep is needed
// //         upkeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);
// //         return (upkeepNeeded, "");
// //     }

// //     function performUpkeep(bytes calldata /* performData */) external override {
// //         (bool upkeepNeeded, ) = checkUpkeep("");
// //         if (!upkeepNeeded) {
// //             revert UpkeepNotNeeded();
// //         }

// //         s_lotteryState = LotteryState.CALCULATING;

// //         // Request random words from Chainlink VRF
// //         uint256 requestId = s_vrfCoordinator.requestRandomWords(
// //             VRFV2PlusClient.RandomWordsRequest({
// //                 keyHash: i_keyHash,
// //                 subId: i_subscriptionId,
// //                 requestConfirmations: REQUEST_CONFIRMATIONS,
// //                 callbackGasLimit: i_callbackGasLimit,
// //                 numWords: NUM_WORDS,
// //                 extraArgs: VRFV2PlusClient._argsToBytes(
// //                     VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
// //                 )
// //             })
// //         );
// //         emit RequestedLotteryWinner(requestId);
// //     }

// //     function fulfillRandomWords(
// //         uint256 /*requestId */,
// //         uint256[] calldata randomWords
// //     ) internal override {
// //         uint256 indexOfWinner = randomWords[0] % s_players.length;
// //         address payable recentWinner = s_players[indexOfWinner];
// //         // select the recent winner
// //         s_recentWinner = recentWinner;
// //         // change the lottery state to open
// //         s_lotteryState = LotteryState.OPEN;
// //         // reset the players array
// //         s_players = new address payable[](0);

// //         //reset timestamp
// //         s_lasttimeStamp = block.timestamp;

// //         (bool success, ) = recentWinner.call{value: address(this).balance}("");
// //         if (!success) {
// //             revert TransferFailed();
// //         }

// //         emit WinnerPicked(s_recentWinner);
// //     }

// //     /**
// //      * @notice Returns the list of players currently entered into the lottery.
// //      * @dev Public view function that returns a copy of the internal s_players array.
// //      * @return players An array of payable addresses representing current entrants.
// //      */
// //     function getPlayers() public view returns (address payable[] memory) {
// //         return s_players;
// //     }

// //     /**
// //      * @notice Returns the configured entry fee for the lottery.
// //      * @dev Public view accessor for the immutable i_lotteryEntryFee.
// //      * @return fee The entry fee in wei required to join the lottery.
// //      */
// //     function getLotteryEntryFee() public view returns (uint256) {
// //         return i_lotteryEntryFee;
// //     }

// //     /**
// //      * @notice Returns the most recent winner of the lottery.
// //      * @dev Public view accessor for s_recentWinner which is set when a winner is selected.
// //      * @return winner The address of the most recent lottery winner.
// //      */
// //     function getRecentWinner() public view returns (address) {
// //         return s_recentWinner;
// //     }

// //     /**
// //      * @notice Returns the current state of the lottery.
// //      * @dev Public view accessor for the s_lotteryState enum (e.g., OPEN, CLOSED, CALCULATING).
// //      * @return state The current LotteryState.
// //      */
// //     function lotteryState() public view returns (LotteryState) {
// //         return s_lotteryState;
// //     }

// //     /**
// //      * @notice Returns the number of random words requested from the VRF coordinator.
// //      * @dev Pure function returning the constant NUM_WORDS.
// //      * @return numWords The constant number of VRF words requested.
// //      */
// //     function getNumWords() public pure returns (uint256) {
// //         return NUM_WORDS;
// //     }

// //     /**
// //      * @notice Returns the number of players currently entered in the lottery.
// //      * @dev Public view helper that returns the length of the s_players array.
// //      * @return count The number of players.
// //      */
// //     function getNoOfPlayer() public view returns (uint256) {
// //         return s_players.length;
// //     }

// //     // /**
// //     //  * @notice Returns the list of players currently entered into the lottery (alias).
// //     //  * @dev Public view function, duplicate accessor of s_players for compatibility or clarity.
// //     //  * @return players An array of payable addresses representing current entrants.
// //     //  */
// //     // function getAllPlayers() public view returns (address payable[] memory) {
// //     //     return s_players;
// //     // }

// //     /**
// //      * @notice Returns the last recorded timestamp used for upkeep/interval checks.
// //      * @dev Public view accessor for s_lasttimeStamp used to determine when to perform upkeep.
// //      * @return timestamp The last recorded block timestamp used by the contract.
// //      */
// //     function getLastTimeStamp() public view returns (uint256) {
// //         return s_lasttimeStamp;
// //     }

// //     /**
// //      * @notice Returns the number of confirmations required for a VRF request.
// //      * @dev Pure function returning the constant REQUEST_CONFIRMATIONS used in VRF requests.
// //      * @return confirmations The constant number of confirmations required.
// //      */
// //     function getRequestConfirmations() public pure returns (uint256) {
// //         return REQUEST_CONFIRMATIONS;
// //     }
// // }


// {
//   "vrfCoordinator": "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
//   "lotteryEntryFee": "10000000000000000",
//   "subscriptionId": "65782800199786290964488167298791493541762207264327220923854487195089363576761",
//   "keyHash": "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
//   "callbackGasLimit": 300000,
//   "interval": 300,

//     "vrfCoordinator": "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
//   "lotteryEntryFee": "10000000000000000",
//   "subscriptionId": "65782800199786290964488167298791493541762207264327220923854487195089363576761",
//   "keyHash": "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
//   "callbackGasLimit": 500000,
//   "interval": 120
  
//   "_comments": {
//     "vrfCoordinator": "Sepolia VRF Coordinator v2.5",
//     "lotteryEntryFee": "0.01 ETH entry fee",
//     "subscriptionId": "Your VRF subscription ID",
//     "keyHash": "150 gwei gas lane (OPTIMIZED - was 500 gwei)",
//     "callbackGasLimit": "300k gas (OPTIMIZED - was 500k)",
//     "interval": "5 minutes between draws (OPTIMIZED - was 2 min)"
//   },
  
//   "_costEstimates": {
//     "vrf_cost_per_request": "~5-10 LINK",
//     "automation_cost_per_month": "~1-2 LINK",
//     "total_monthly_cost": "Depends on lottery frequency",
//     "previous_cost": "82 LINK per request (TOO HIGH)",
//     "savings": "~90% reduction"
//   }
// }