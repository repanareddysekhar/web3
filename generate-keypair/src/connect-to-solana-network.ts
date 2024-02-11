import {clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import { constants } from "mocha/lib/utils";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import "dotenv/config";

const connection = new Connection(clusterApiUrl("devnet"));
console.log(`✅ Connected!`);

const address = getKeypairFromEnvironment("SECRET_KEY").publicKey;
const balance = await connection.getBalance(address);
const balanceInSol = balance / LAMPORTS_PER_SOL;

console.log(`The balance in account: ${address} is ${balanceInSol}`);