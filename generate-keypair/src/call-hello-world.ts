import {
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    Keypair,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction, TransactionInstruction
} from "@solana/web3.js";
import * as borsh from 'borsh';
import {airdrop} from "./airdrop-util";

const CONTRACT_PROGRAM_ID = "JB579z8BVDzw6JZNDTHMrrb7drFu1zN98eWMHWuJNbxv";

class GreetingAccount {
    counter = 0;
    constructor(fields: {counter: number} | undefined = undefined) {
        if (fields) {
            this.counter = fields.counter;
        }
    }
}

const GreetingSchema = new Map([
    [GreetingAccount, {kind: 'struct', fields: [['counter', 'u32']]}],
]);

const createDataAccount = async (connection, parentAccount): Promise<Keypair> => {
    const dataAccount = Keypair.generate();
    const createAccountInstruction = await SystemProgram.createAccount({
        fromPubkey: parentAccount.publicKey,
        newAccountPubkey: dataAccount.publicKey,
        lamports: 1000000000,
        space: 4,
        programId: new PublicKey(CONTRACT_PROGRAM_ID)
    });
    const transaction = new Transaction();
    transaction.add(createAccountInstruction);
    await sendAndConfirmTransaction(connection, transaction, [parentAccount, dataAccount]);
    return dataAccount;
}

export const callCounter = async(parentAccount: Keypair) => {
    const connection = new Connection("http://127.0.0.1:8899", "confirmed");

    await airdrop(parentAccount.publicKey, 2);
    // const dataAccount = createDataAccount(connection, parentAccount);
    const dataAccount = new PublicKey("Bcmj9BR9xKGXDbRPtWVLwE58ge2EvUKt6tBguaGeMUjP");


    const instruction = new TransactionInstruction({
        keys: [{pubkey: (await dataAccount), isSigner: false, isWritable: true}],
        programId: new PublicKey(CONTRACT_PROGRAM_ID),
        data: Buffer.alloc(1),
    });

    await sendAndConfirmTransaction(
        connection,
        new Transaction().add(instruction),
        [parentAccount],
    );


    // Read data
    const accountInfo = await connection.getAccountInfo((await dataAccount));

    const greeting = borsh.deserialize(
        GreetingSchema,
        GreetingAccount,
        accountInfo.data,
    );

    console.log(
        (await dataAccount).toBase58(),
        'has been greeted',
        greeting.counter,
        'time(s)',
    );

}

callCounter(Keypair.generate());