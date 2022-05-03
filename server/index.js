const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const {keccak_256} = require('@noble/hashes/sha3');
const { bytesToHex } = require('@noble/hashes/utils');
const secp = require('@noble/secp256k1')

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

const privKeyArr = [];

// create private key
const createPvt = () => {
  let privateKey = secp.utils.randomPrivateKey();
  privateKey = Buffer.from(privateKey).toString('hex');
  return privateKey;
}

// get public key
const createPub = (privKey) => {
  let publicKey = secp.getPublicKey(privKey);
  publicKey = Buffer.from(publicKey).toString('hex');
  publicKey = "0x" + publicKey.slice(publicKey.length - 40);
  return publicKey;
}

// assign random balance
const genBalance = () => {
  let balance = Math.floor(Math.random() * 9999 + 1)
  return balance;
}

const balances = {}

// create n number of accounts
const createAccounts = (num) => {
  for (let i = 0; i < num; i++) {
    let accountNumber = i;
    console.log(`Account Number: ${accountNumber}`);
    let privKey = createPvt();
    console.log(`Private Key: ${privKey}`);
    let pubKey = createPub(privKey);
    console.log(`Public Key: ${pubKey}`);
    let accBalance = genBalance();
    console.log(`Balance: ${accBalance}`);
    balances[pubKey] = accBalance;
  }
};

// one for everyone in the class
createAccounts(51);

console.log(Object.entries(balances));

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount} = req.body;
  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({ balance: balances[sender] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
