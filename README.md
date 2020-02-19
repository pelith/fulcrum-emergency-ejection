# Fulcrum Emergency Ejection

How it works.

Fulcrum Emergency Ejection is a smart contract that automatically calculates the maximal claimable amount in Fulcorm iETH pool. It helps you to withdraw stucked fund as much as possible.

While withdrawing from Fulcrum, two requirements must be fulfilled: you have that much deposit and there's enough liquidity in iToken's contract.
Since many people are trying to extract ETH, even it seems to be possible for you to withdraw, someone may always run before your transaction and lead to yours fail.

Fulcrum Emergency Ejection contract first checks how much ETH are there in the pool, if none, quit, if some, withdraw the exact number then. More gas efficient. Txs are not likely to revert. No more suffer from gas estimation and competition.

~35,000 gas for a tx not extracting any ETH
~500,000 gas for successful withdrawals

## Install

### Requirements

- node.js 10.16.0 (Recommended)
- npm 6.9.0

### Steps

```
npm install
npm run start
```

If there is an error about `./build/Release/scrypt` not found, please enter the following command to fix:

```
cp node_modules/scrypt/build/Release/scrypt.node node_modules/scrypt/build/Release/scrypt
```

Once the dev server launched correctly, please navigate to [here](http://localhost:3000?data=ewogICJ1dWlkIjogIjEyMzQiLAogICJjcnlwdG9jdXJyZW5jeSI6IHsKICAgICJuYW1lIjogIkVSQzc3NyIsCiAgICAidG9rZW4iOiAiMHhhRkY0NDgxRDEwMjcwRjUwZjIwM0UwNzYzZTI1OTc3NzYwNjhDQmM1IiwKICAgICJyZWN2IjogIjB4NTM1OUU3NTQ0ZDQ4ZGI3ODE3MkYxMEZmQTMyMmExZDFiMjVFOTI1OSIsCiAgICAiZGVjaW1hbCI6ICIxOCIsCiAgICAiYW1vdW50IjogIjEwMDAwMDAwMDAwMDAwMDAwMDAiLAogICAgImFwaSI6ICJodHRwOi8vZXhhbXBsZS5jb20iCiAgfSwKICAiY3JlZGl0Y2FyZCI6IHsKICAgICJrZXkiOiAicGtfdGVzdF9YMkNLSXdaaENFeDk5dVk4Vmc4d2d0RlQiLAogICAgImFtb3VudCI6ICIxIiwKICAgICJjdXJyZW5jeSI6ICJOVEQiLAogICAgImFwaSI6ICJodHRwOi8vbG9jYWxob3N0IgogIH0KfQ==) and you should see 3 button (Cryptocurrency Pay, Credit Card pay, and Mobile Brower) on the interface.

### Build

`npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
