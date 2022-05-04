# Greg's ECDSA-Exchange
Week 1 Project for ChainShot's Ethereum BootCamp
Updates to Original (ChainShot/ECDSA-Exchange):
1. Added function to create n number of accounts on the server
2. Each created account is given a generated private key, and public key address (0x+...)
3. Each created account is assigned a random balance between 1 and 10,000
4. Added functionality to client which verifies that the user has the private key of the sender's address through digital signatures // for exercise purposes only
5. Added functionality that verifies that the sender's account balance has the required funds for the transaction
6. If private key is wrong or account balance is too low, the transaction does not work and an alert is triggered
7. If private key is verified and the account balance has enough funds, the transaction will work and the submit button will change to green for 3.5s
8. Made changes to the html and css just for fun

Running the Exchange:
1. Clone repository and install dependecies
2. Inside the server folder, run 'nodemon index'
3. Inside the client folder, run 'npx parcel index.html'
4. Open a browser and navigate to localhost:1234

Using the Exchange:
1. Copy/paste a public key address into the address field up top
2. Enter amount to send, recipients public key address, and the corresponding private key of the first public key (the one you're sending from)
3. Click Transfer Amount!

![projectss](https://user-images.githubusercontent.com/99760083/166803252-2ce6590d-36cf-4ee4-a06b-64978b1ec148.PNG)
![projectserverss](https://user-images.githubusercontent.com/99760083/166803294-083d6f0c-7238-411f-88dd-3baec4579628.PNG)
