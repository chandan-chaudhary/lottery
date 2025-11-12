// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IVRFConsumer {
    function rawFulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) external;
}
/**
 * Mock VRF Coordinator for Local Testing
 * This contract simulates Chainlink VRF functionality for testing purposes
 * DO NOT USE IN PRODUCTION!
 */
contract MockVRFCoordinator {
    uint256 private requestCounter;

    event RandomWordsRequested(
        bytes32 indexed keyHash,
        uint256 requestId,
        uint256 indexed subId,
        uint16 requestConfirmations,
        uint32 callbackGasLimit,
        uint32 numWords,
        address indexed sender
    );

    /**
     * Mock implementation of requestRandomWords
     * Returns a mock request ID
     */
    function requestRandomWords(
        bytes32 keyHash,
        uint256 subId,
        uint16 requestConfirmations,
        uint32 callbackGasLimit,
        uint32 numWords,
        bytes memory /* extraArgs */
    ) external returns (uint256) {
        requestCounter++;

        emit RandomWordsRequested(
            keyHash,
            requestCounter,
            subId,
            requestConfirmations,
            callbackGasLimit,
            numWords,
            msg.sender
        );

        return requestCounter;
    }

    /**
     * Helper function to manually fulfill random words (for testing)
     * In production, Chainlink VRF would call this
     */
    // function fulfillRandomWords(
    //     uint256 requestId,
    //     address consumer,
    //     uint256[] memory randomWords
    // ) external {
    //     // Call the consumer's fulfillRandomWords function
    //     (bool success, ) = consumer.call(
    //         abi.encodeWithSignature(
    //             "rawFulfillRandomWords(uint256,uint256[])",
    //             requestId,
    //             randomWords
    //         )
    //     );
    //     require(success, "Fulfillment failed");
    // }
    function fulfillRandomWords(
        uint256 requestId,
        address consumer,
        uint256[] memory randomWords
    ) external {
        IVRFConsumer(consumer).rawFulfillRandomWords(requestId, randomWords);
    }
}
