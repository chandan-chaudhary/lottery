import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import dotenv from "dotenv";
import "@typechain/hardhat";

dotenv.config();

const config: HardhatUserConfig = {
  // plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // hardhatMainnet: {
    //   // type: "edr-simulated",
    //   chainType: "l1",
    // },
    // hardhatOp: {
    //   type: "edr-simulated",
    //   chainType: "op",
    // },
    sepolia: {
      // type: "http",
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      chainId: 11155111,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  // verify: {
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
  // },
};

export default config;

// import type { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";
// import "@nomicfoundation/hardhat-verify";
// import dotenv from "dotenv";
// import "@typechain/hardhat";

// dotenv.config();

// const config: HardhatUserConfig = {
//   // plugins: [hardhatToolboxMochaEthersPlugin],
//   solidity: {
//     profiles: {
//       default: {
//         version: "0.8.28",
//       },
//       production: {
//         version: "0.8.28",
//         settings: {
//           optimizer: {
//             enabled: true,
//             runs: 200,
//           },
//         },
//       },
//     },
//   },
//   networks: {
//     hardhatMainnet: {
//       type: "edr-simulated",
//       chainType: "l1",
//     },
//     hardhatOp: {
//       type: "edr-simulated",
//       chainType: "op",
//     },
//     sepolia: {
//       type: "http",
//       url: "https://ethereum-sepolia-rpc.publicnode.com",
//       chainId: 11155111,
//       accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
//     },
//   },
//   verify: {
//     etherscan: {
//       apiKey: process.env.ETHERSCAN_API_KEY || "",
//     },
//   },
// };

// export default config;
