import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "ethers";

/**
 * Hardhat Ignition Deployment Module for Lottery Contract
 *
 * This module deploys the Lottery contract with all required Chainlink VRF 2.5
 * and Automation configuration parameters.
 */

const LotteryModule = buildModule("LotteryModule", (m) => {
  // ========================================
  // CONFIGURATION PARAMETERS
  // ========================================

  /**
   * VRF Coordinator Address
   * This is the address of the Chainlink VRF Coordinator contract on your network
   *
   * Sepolia Testnet: 0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B
   * Ethereum Mainnet: 0xD7f86b4b8Cae7D942340FF628F82735b7a20893a
   *
   * Get addresses for other networks from: https://docs.chain.link/vrf/v2-5/supported-networks
   */
  const vrfCoordinator = m.getParameter(
    "vrfCoordinator",
    "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B" // Sepolia testnet default
  );

  /**
   * Lottery Entry Fee
   * The minimum amount of ETH required to enter the lottery
   *
   * Example: 0.01 ETH = parseEther("0.01")
   */
  const lotteryEntryFee = m.getParameter(
    "lotteryEntryFee",
    parseEther("0.01") // 0.01 ETH
  );

  /**
   * Subscription ID
   * Your Chainlink VRF subscription ID
   *
   * Create a subscription at: https://vrf.chain.link/
   * Fund it with LINK tokens for your network
   *
   * Note: After deployment, you need to add the deployed contract address
   * as a consumer to this subscription
   */
  const subscriptionId = m.getParameter(
    "subscriptionId",
    "65782800199786290964488167298791493541762207264327220923854487195089363576761"
  );

  /**
   * Key Hash (Gas Lane)
   * Determines the maximum gas price you're willing to pay for a request
   *
   * Sepolia Testnet options:
   * - 500 gwei: 0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae
   * - 150 gwei: 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c
   *
   * Higher gas lanes cost more but are fulfilled faster
   * Get key hashes for other networks from: https://docs.chain.link/vrf/v2-5/supported-networks
   */
  const keyHash = m.getParameter(
    "keyHash",
    "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c" // Sepolia 150 gwei
  );

  /**
   * Callback Gas Limit
   * Maximum gas allowed for the fulfillRandomWords callback function
   *
   * Your callback does:
   * - Calculate winner index
   * - Update state variables
   * - Reset players array
   * - Transfer ETH to winner
   *
   * 100,000 gas is typically sufficient for basic operations
   * Increase if you add more complex logic
   */
  const callbackGasLimit = m.getParameter(
    "callbackGasLimit",
    500000 // 100k gas
  );

  /**
   * Interval (in seconds)
   * Time that must pass between lottery draws
   *
   * Examples:
   * - 30 seconds: 30
   * - 5 minutes: 300
   * - 1 hour: 3600
   * - 1 day: 86400
   * - 1 week: 604800
   */
  const interval = m.getParameter(
    "interval",
    120 // 120 seconds
  );

  // ========================================
  // CONTRACT DEPLOYMENT
  // ========================================

  /**
   * Deploy the Lottery contract with all configuration parameters
   *
   * Constructor parameters in order:
   * 1. vrfCoordinator - Address of VRF Coordinator contract
   * 2. lotteryEntryFee - Minimum ETH to enter lottery
   * 3. subscriptionId - Your VRF subscription ID
   * 4. keyHash - Gas lane configuration
   * 5. callbackGasLimit - Max gas for callback
   * 6. interval - Time between lottery draws
   */
  const lottery = m.contract("Lottery", [
    vrfCoordinator,
    lotteryEntryFee,
    subscriptionId,
    keyHash,
    callbackGasLimit,
    interval,
  ]);

  // ========================================
  // RETURN DEPLOYED CONTRACT
  // ========================================

  /**
   * Return the deployed contract instance
   * This allows you to access the contract address and interact with it
   * after deployment
   */
  return { lottery };
});

export default LotteryModule;
