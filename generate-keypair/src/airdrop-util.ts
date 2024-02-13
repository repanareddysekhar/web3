import {PublicKey, Connection, LAMPORTS_PER_SOL} from "@solana/web3.js";

export const airdrop = async (address: PublicKey, amount: number) => {
    const publicKey = new PublicKey(address);

    const connection = new Connection("http://127.0.0.1:8899", "confirmed");
    const airdropSignature = await connection.requestAirdrop(
        publicKey,
        2 * LAMPORTS_PER_SOL
    );

    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: airdropSignature,
    });
}