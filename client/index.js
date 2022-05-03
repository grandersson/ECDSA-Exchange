import "./index.scss";

const {keccak_256} = require('@noble/hashes/sha3');
const { bytesToHex } = require('@noble/hashes/utils');
const secp = require('@noble/secp256k1');

const server = "http://localhost:3042";

document.getElementById("exchange-address").addEventListener('input', ({ target: {value} }) => {
  if(value === "") {
    document.getElementById("balance").innerHTML = 0;
    return;
  }

  fetch(`${server}/balance/${value}`).then((response) => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });
});

document.getElementById("transfer-amount").addEventListener('click', async () => {
  const sender = document.getElementById("exchange-address").value;
  const amount = document.getElementById("send-amount").value;
  const recipient = document.getElementById("recipient").value;
  const keySubmit = document.querySelector("#private-key").value;
  const accountBalance = document.querySelector("#balance").textContent;
  const sendBtn = document.querySelector("#transfer-amount");

  const myMessageHash = bytesToHex((keccak_256(JSON.stringify({ sender, amount, recipient }))));
  console.log(myMessageHash);
  const signature = await secp.sign(myMessageHash, keySubmit, {recovered: true});
  console.log(signature);
  console.log(signature[0]);
  console.log(signature[1]);

  const signedSignature = signature[0];
  const recoveryKey = signature[1];

  const recoverPub = secp.recoverPublicKey(myMessageHash, signedSignature, recoveryKey);
  console.log(recoverPub);
  const recoveredKeyHex = Buffer.from(recoverPub).toString('hex');
  console.log(recoveredKeyHex);
  const keyMatch = "0x" + recoveredKeyHex.slice(recoveredKeyHex.length - 40);
  console.log(keyMatch);

  // check if public key matches address key
  const isValid = (key1, key2) => {
    if (key1 == key2) {
      return true;
    } else return false;
  }

  // verify that account has enough funds for transaction
  const hasBalance = (sendAmt, funds) => {
    sendAmt = Number.parseInt(sendAmt, 10);
    funds = Number.parseInt(funds, 10);
    if (sendAmt <= funds) {
      return true;
    } else { return false };
  }

  console.log(hasBalance(amount, accountBalance));

  console.log(isValid(sender, keyMatch));

  if ((isValid(sender,keyMatch)) && (hasBalance(amount, accountBalance))) {

  const body = JSON.stringify({
    sender, amount, recipient
  });

  const request = new Request(`${server}/send`, { method: 'POST', body });

  fetch(request, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });
  sendBtn.classList.add("success");
  setTimeout(() => {
    sendBtn.classList.remove("success");
  }, 3500);
} else {
    alert('Wrong Key or Insufficient Funds!');
  };
});
