import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import {
    Connection,
    Keypair,
    SystemProgram,
    LAMPORTS_PER_SOL,
    Transaction,
    sendAndConfirmTransaction,
    PublicKey,
    clusterApiUrl,
} from "@solana/web3.js";

import "dotenv/config"

(async () => {
    const fromKeypair = getKeypairFromEnvironment("SECRET_KEY");
    const toKeypair = new PublicKey("Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod");

    const connection = new Connection("http://127.0.0.1:8899", "confirmed");
    const airdropSignature = await connection.requestAirdrop(
        fromKeypair.publicKey,
        2 * LAMPORTS_PER_SOL
    );

    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: airdropSignature,
    });

    const lamportsToSend = 1_000_000;

    const transferTransaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: fromKeypair.publicKey,
            toPubkey: toKeypair,
            lamports: lamportsToSend,
        })
    );

    await sendAndConfirmTransaction(connection, transferTransaction, [
        fromKeypair,
    ]);
})();
