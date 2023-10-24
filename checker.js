import { Provider, Network } from "aptos";
import fs from 'fs'


const parseFile = fileName => fs.readFileSync(fileName, "utf8").split('\n').map(str => str.trim()).filter(str => str.length > 10);

const provider = new Provider(Network.MAINNET)
const collection_name = "Aptos ONE Mainnet Anniversary 2023"


const searchNft = async (client, accountAddress) => {
    let tokens = await client.getOwnedTokens(accountAddress);

    if (tokens.length === 0) {
        console.log(`\n${accountAddress} has no tokens.\n`);
        return;
    }

    for (let index = 0; index < tokens.current_token_ownerships_v2.length; index++) {
        const token = tokens.current_token_ownerships_v2[index];
        if (token.current_token_data.current_collection.collection_name === collection_name) {
            console.log(`\n[${accountAddress}] NFT Confirmed`);
            return true;
        }
    }

    console.log(`\n[${accountAddress}] No NFT`);
    return false;
};


(async () => {
    let wallets = parseFile('wallets.txt')
    let results = []
    let nftFound = 0

    for (let wallet of wallets) {
        let nftIsset = await searchNft(provider, wallet)
        results.push([wallet, nftIsset])
        if (nftIsset) nftFound++
    }

    fs.writeFile('results.txt', results.join('\n'), function(err) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`[Wallets Count] ${wallets.length}`);
        console.log(`[NFT Found] ${nftFound}`);
        console.log('[Results Saved] File: results.txt');
    });
})()