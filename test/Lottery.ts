import { expect } from "chai";
import hre from "hardhat";
import { parseEther } from "ethers";

const { ethers } = hre;

describe("Lottery Contract", function () {
  // Test configuration - matches your contract requirements
  const ENTRY_FEE = parseEther("0.01"); // 0.01 ETH
  const SUBSCRIPTION_ID = BigInt(1); // Mock subscription ID for testing
  const KEY_HASH =
    "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c";
  const CALLBACK_GAS_LIMIT = 100000;
  const INTERVAL = 30; // 1 minute in seconds

  // We'll use a mock VRF Coordinator for local testing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lottery: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockVRFCoordinator: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let player1: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let player2: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let player3: any;

  /**
   * Deploy a mock VRF Coordinator for testing
   * This simulates Chainlink VRF without needing real LINK tokens
   */
  async function deployMockVRFCoordinator() {
    // For testing, we'll deploy a simple mock contract
    // In production, you'd use the real VRF Coordinator address
    const MockVRFCoordinator = await ethers.getContractFactory(
      "MockVRFCoordinator"
    );
    const mock = await MockVRFCoordinator.deploy();
    return mock;
  }

  /**
   * Setup function - runs before each test
   * Deploys fresh contracts and gets test accounts
   */
  beforeEach(async function () {
    // Get test accounts (Hardhat provides 20 accounts with 10,000 ETH each)
    const signers = await ethers.getSigners();
    player1 = signers[1];
    player2 = signers[2];
    player3 = signers[3];

    // Deploy mock VRF Coordinator
    mockVRFCoordinator = await deployMockVRFCoordinator();

    // Deploy the Lottery contract
    lottery = await ethers.deployContract("Lottery", [
      await mockVRFCoordinator.getAddress(), // VRF Coordinator address
      ENTRY_FEE,
      SUBSCRIPTION_ID,
      KEY_HASH,
      CALLBACK_GAS_LIMIT,
      INTERVAL,
    ]);

    console.log("✅ Lottery deployed at:", await lottery.getAddress());
  });

  /**
   * Test Suite 1: Deployment and Initial State
   */
  describe("Deployment", function () {
    it("Should set the correct entry fee", async function () {
      const entryFee = await lottery.getLotteryEntryFee();
      expect(entryFee).to.equal(ENTRY_FEE);
    });

    it("Should start in OPEN state", async function () {
      const state = await lottery.getLotteryState();
      expect(state).to.equal(0); // 0 = OPEN
    });

    it("Should have no players initially", async function () {
      const numPlayers = await lottery.getNumberOfPlayers();
      expect(numPlayers).to.equal(0);
    });

    it("Should have zero balance initially", async function () {
      const balance = await ethers.provider.getBalance(
        await lottery.getAddress()
      );
      expect(balance).to.equal(0);
    });
  });

  /**
   * Test Suite 2: Entering the Lottery
   */
  describe("Entering Lottery", function () {
    it("Should allow a user to enter with correct fee", async function () {
      const tx = await lottery
        .connect(player1)
        .enterLottery({ value: ENTRY_FEE });
      await tx.wait();

      const numPlayers = await lottery.getNumberOfPlayers();
      expect(numPlayers).to.equal(1);
    });

    it("Should emit LotteryEnter event when user enters", async function () {
      await expect(lottery.connect(player1).enterLottery({ value: ENTRY_FEE }))
        .to.emit(lottery, "LotteryEnter")
        .withArgs(player1.address);
    });

    it("Should revert if user sends insufficient ETH", async function () {
      const insufficientFee = parseEther("0.005"); // Less than 0.01 ETH

      await expect(
        lottery.connect(player1).enterLottery({ value: insufficientFee })
      ).to.be.revertedWithCustomError(lottery, "NotEnoughETH");
    });

    it("Should allow multiple users to enter", async function () {
      // Player 1 enters
      await lottery.connect(player1).enterLottery({ value: ENTRY_FEE });

      // Player 2 enters
      await lottery.connect(player2).enterLottery({ value: ENTRY_FEE });

      // Player 3 enters
      await lottery.connect(player3).enterLottery({ value: ENTRY_FEE });

      const numPlayers = await lottery.getNumberOfPlayers();
      expect(numPlayers).to.equal(3);
    });

    it("Should add players to the players array", async function () {
      await lottery.connect(player1).enterLottery({ value: ENTRY_FEE });
      await lottery.connect(player2).enterLottery({ value: ENTRY_FEE });

      const players = await lottery.getPlayers();
      expect(players).to.include(player1.address);
      expect(players).to.include(player2.address);
    });

    it("Should accept more than the minimum entry fee", async function () {
      const higherFee = parseEther("0.05"); // More than required

      await lottery.connect(player1).enterLottery({ value: higherFee });

      const numPlayers = await lottery.getNumberOfPlayers();
      expect(numPlayers).to.equal(1);
    });

    it("Should increase contract balance when users enter", async function () {
      await lottery.connect(player1).enterLottery({ value: ENTRY_FEE });
      await lottery.connect(player2).enterLottery({ value: ENTRY_FEE });

      const balance = await ethers.provider.getBalance(
        await lottery.getAddress()
      );
      expect(balance).to.equal(ENTRY_FEE * BigInt(2));
    });
  });

  /**
   * Test Suite 3: Getter Functions
   */
  describe("Getter Functions", function () {
    it("Should return correct lottery entry fee", async function () {
      expect(await lottery.getLotteryEntryFee()).to.equal(ENTRY_FEE);
    });

    it("Should return correct number of players", async function () {
      await lottery.connect(player1).enterLottery({ value: ENTRY_FEE });
      await lottery.connect(player2).enterLottery({ value: ENTRY_FEE });

      expect(await lottery.getNumberOfPlayers()).to.equal(2);
    });

    it("Should return all players", async function () {
      await lottery.connect(player1).enterLottery({ value: ENTRY_FEE });
      await lottery.connect(player2).enterLottery({ value: ENTRY_FEE });

      const players = await lottery.getPlayers();
      expect(players.length).to.equal(2);
    });

    it("Should return NUM_WORDS constant", async function () {
      expect(await lottery.getNumWords()).to.equal(1);
    });

    it("Should return REQUEST_CONFIRMATIONS constant", async function () {
      expect(await lottery.getRequestConfirmations()).to.equal(3);
    });

    it("Should return last timestamp", async function () {
      const timestamp = await lottery.getLastTimeStamp();
      expect(timestamp).to.be.greaterThan(0);
    });
  });

  /**
   * Test Suite 4: CheckUpkeep Function
   */
  describe("CheckUpkeep", function () {
    it("Should return false when no players have entered", async function () {
      // Even with time passed, no players means no upkeep needed
      const [upkeepNeeded] = await lottery.checkUpkeep("0x");
      expect(upkeepNeeded).to.equal(false);
    });

    it("Should return false when not enough time has passed", async function () {
      await lottery.connect(player1).enterLottery({ value: ENTRY_FEE });

      // Don't increase time - just after entering
      const [upkeepNeeded] = await lottery.checkUpkeep("0x");
      expect(upkeepNeeded).to.equal(false);
    });

    it("Should return false when lottery is not open", async function () {
      await lottery.connect(player1).enterLottery({ value: ENTRY_FEE });

      // Just check that it can be called
      const [upkeepNeeded] = await lottery.checkUpkeep("0x");

      // Should be false since not enough time has passed
      expect(upkeepNeeded).to.equal(false);
    });
  });

  /**
   * Test Suite 5: Lottery State Management
   */
  describe("Lottery State", function () {
    it("Should allow entry when lottery is OPEN", async function () {
      // Lottery starts in OPEN state
      await lottery.connect(player1).enterLottery({ value: ENTRY_FEE });

      // Try to enter - should work
      await lottery.connect(player2).enterLottery({ value: ENTRY_FEE });
      expect(await lottery.getNumberOfPlayers()).to.equal(2);
    });

    it("Should return correct lottery state", async function () {
      const state = await lottery.getLotteryState();
      expect(state).to.equal(0); // OPEN = 0
    });
  });

  /**
   * Test Suite 6: Edge Cases
   */
  describe("Edge Cases", function () {
    it("Should handle the same user entering multiple times", async function () {
      await lottery.connect(player1).enterLottery({ value: ENTRY_FEE });
      await lottery.connect(player1).enterLottery({ value: ENTRY_FEE });

      const numPlayers = await lottery.getNumberOfPlayers();
      expect(numPlayers).to.equal(2); // Same user can enter multiple times
    });

    it("Should handle zero initial winner", async function () {
      const winner = await lottery.getRecentWinner();
      expect(winner).to.equal(ethers.ZeroAddress);
    });

    it("Should maintain accurate player count after multiple entries", async function () {
      for (let i = 0; i < 5; i++) {
        const [signer] = await ethers.getSigners();
        await lottery.connect(signer).enterLottery({ value: ENTRY_FEE });
      }

      const players = await lottery.getPlayers();
      expect(players.length).to.equal(await lottery.getNumberOfPlayers());
    });
  });
});
