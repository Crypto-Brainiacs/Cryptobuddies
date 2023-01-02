import type { SafeEventEmitterProvider } from "@web3auth/base";
import Web3 from "web3";

import { APP_CONSTANTS } from "./constants";

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

export default class EthereumRpc {
  private provider: SafeEventEmitterProvider;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }
  async getAccounts(): Promise<string[]> {
    try {
      const web3 = new Web3(this.provider as any);
      const accounts = await web3.eth.getAccounts();
      return accounts;
    } catch (error: unknown) {
      return error as string[];
    }
  }

  async sendlikeTransaction(postIndex: any): Promise<string> {
    try {
      const alchemyKey = APP_CONSTANTS.ALCHEMY_KEY;
      const web3 = createAlchemyWeb3(alchemyKey, {
        writeProvider: this.provider,
      });

      const contractABI = require("./contract-abi.json");
      const contractAddress = APP_CONSTANTS.CONTRACT_ADDRESS;

      const helloWorldContract = new web3.eth.Contract(
        contractABI,
        contractAddress
      );

      let accounts = await this.getAccounts();

      await helloWorldContract.methods
        .like(postIndex)
        .send({ from: accounts[0] });

      return "success";
    } catch (error) {
      return error as string;
    }
  }

  async sendAddCommentTransaction(
    postIndex: any,
    comment: any
  ): Promise<string> {
    try {
      const alchemyKey = APP_CONSTANTS.ALCHEMY_KEY;
      const web3 = createAlchemyWeb3(alchemyKey, {
        writeProvider: this.provider,
      });

      const contractABI = require("./contract-abi.json");
      const contractAddress = APP_CONSTANTS.CONTRACT_ADDRESS;

      const helloWorldContract = new web3.eth.Contract(
        contractABI,
        contractAddress
      );

      let accounts = await this.getAccounts();

      await helloWorldContract.methods
        .addComment(postIndex, comment)
        .send({ from: accounts[0] });

      return "success";
    } catch (error) {
      return error as string;
    }
  }

  async sendWritepostTransaction(
    postName: any,
    postDescription: any
  ): Promise<string> {
    try {
      const alchemyKey = APP_CONSTANTS.ALCHEMY_KEY;
      const web3 = createAlchemyWeb3(alchemyKey, {
        writeProvider: this.provider,
      });

      const contractABI = require("./contract-abi.json");
      const contractAddress = APP_CONSTANTS.CONTRACT_ADDRESS;

      const helloWorldContract = new web3.eth.Contract(
        contractABI,
        contractAddress
      );

      let accounts = await this.getAccounts();

      await helloWorldContract.methods
        .writepost(postName, postDescription)
        .send({ from: accounts[0] });

      return "success";
    } catch (error) {
      return error as string;
    }
  }

  async getAllposts(): Promise<any[]> {
    try {
      const alchemyKey = APP_CONSTANTS.ALCHEMY_KEY;
      const web3 = createAlchemyWeb3(alchemyKey, {
        writeProvider: this.provider,
      });

      const contractABI = require("./contract-abi.json");
      const contractAddress = APP_CONSTANTS.CONTRACT_ADDRESS;

      const helloWorldContract = new web3.eth.Contract(
        contractABI,
        contractAddress
      );

      return await helloWorldContract.methods.getAllposts().call();
    } catch (error) {
      return [];
    }
  }
}
