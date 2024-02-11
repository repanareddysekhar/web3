import "dotenv/config"
import { Keypair } from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const keyPair = Keypair.generate();

console.log("Public key is: ", keyPair.publicKey.toBase58());
console.log("Private key is: ", keyPair.secretKey)


const keyPairFromEnv = getKeypairFromEnvironment("SECRET_KEY");
console.log("key pair from env, ", keyPairFromEnv);