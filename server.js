const express = require('express'); //Line 1
const app = express(); //Line 2
const port = process.env.PORT || 5000; //Line 3
const NodeCache = require( "node-cache" );
const walletCoreLib = require('haven-wallet-core');
const claimAmount = 10 * 1000000000000;
const claimCurrency = "XHV";
let wallet;
const addressCache = new NodeCache({ stdTTL: 7200, checkperiod: 120 });

const walletConfig = {
  path:"stage_miner",
  password:"test",
  networkType:2,
  serverUri:"localhost:37750",
  serverUsername:"",
  serverPassword:"",
  proxyToWorker:false
}

async function run() {





}

async function init() {

  console.log("open wallet ... ");
  wallet = await walletCoreLib.openWalletWasm(walletConfig);
  console.log("start syncing ... ");
  await wallet.startSyncing();
  console.log("wallet synced ");
  app.use(express.json());
  app.listen(port, () => console.log(`Listening on port ${port}`));

 // claim funds
 app.post('/claim', async (req, res) => { 

  const address = req.body.address;

  console.log(address);

  try {
    walletCoreLib.MoneroUtils.validateAddress(address);
    console.log("address is valid");
  }
  catch(e){
    res.status(400).send({ message:"Address is not valid" });
    return;
  }

  if (addressCache.has(address)) {

    res.status(400).send({message:"Please wait till you can claim again, only allowed every 2 hours" });
    return;
  }

  const destinations = [new walletCoreLib.MoneroDestination(address, claimAmount)];

  const txConfig = {
    canSplit: true,
    accountIndex: 0,
    relay: true,
    priority:1,
    sourceCurrency: claimCurrency,
    destinationCurrency: claimCurrency,
    destinations
  };

  try{
    await wallet.createTxs(txConfig);
    addressCache.set(address, address);
    res.send({ status: 'ok' });
  }
  catch(e) 
  {
    res.status(400).send({ message:e.message });
  }
});
}

init();



