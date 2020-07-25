const express = require("express");
const router = express.Router();
const axios = require("axios");

var btcPrice = "";
var ethPrice = "";
var dashPrice = "";
var eurPrice = "";
var bsPrice = "";
var ptrPrice = "";

loadPrices();

async function loadPrices() {
  btcPrice = await getBtcPrice();
  ethPrice = await getEthPrice();
  dashPrice = await getDashPrice();
  eurPrice = await getEurPrice();
  bsPrice = await getBsPrice();
  ptrPrice = await getPtrPrice();
}

router.get("/currencyToUsd", async (req, res) => {
  const data = {
    BTC: btcPrice,
    ETH: ethPrice,
    DASH: dashPrice,
    EUR: eurPrice,
    BS: bsPrice,
    PTR: ptrPrice,
  };
  res.json(data);
});

router.post("/currencyConvert", async (req, res) => {
  let currency = req.body.currency;
  let amount = parseInt(req.body.amount);
  let usd;

  if (isNaN(amount))
    res.json("That amount is not valid, please enter another.");

  switch (currency) {
    case "BTC":
      usd = btcPrice.price * amount;
      break;
    case "ETH":
      usd = ethPrice.price * amount;
      break;
    case "DASH":
      usd = dashPrice.price * amount;
      break;
    case "PTR":
      usd = ptrPrice.price * amount;
      break;
    case "BS":
      usd = bsPrice.price * amount;
      break;
    case "EUR":
      usd = eurPrice.price * amount;
      break;
    default:
      res.json(
        "That currency does not exist, please try: BTC,ETH,DASH,PTR,BS,EUR."
      );
  }

  let data = {
    BTC: {
      BTCUSD: btcPrice.price,
      QuantityBTC: usd / btcPrice.price,
      USDAmount: usd,
    },
    ETH: {
      ETHUSD: ethPrice.price,
      QuantityETH: usd / ethPrice.price,
      USDAmount: usd,
    },
    DASH: {
      DASHUSD: dashPrice.price,
      QuantityDASH: usd / dashPrice.price,
      USDAmount: usd,
    },
    PTR: {
      PTRUSD: ptrPrice,
      QuantityPTR: usd / ptrPrice,
      USDAmount: usd,
    },
    BS: {
      BSUSD: bsPrice,
      QuantityPTR: usd / bsPrice,
      USDAmount: usd,
    },
    EUR: {
      EURUSD: eurPrice.price,
      QuantityPTR: usd / eurPrice.price,
      USDAmount: usd,
    },
  };
  res.json(data);
});

async function getBtcPrice() {
  let btc = await axios
    .get("https://api.binance.com/api/v1/ticker/price?symbol=BTCUSDT")
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
  return btc;
}

async function getEthPrice() {
  let eth = await axios
    .get("https://api.binance.com/api/v1/ticker/price?symbol=ETHUSDT")
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
  return eth;
}

async function getDashPrice() {
  let dash = await axios
    .get("https://api.binance.com/api/v1/ticker/price?symbol=DASHUSDT")
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
  return dash;
}

async function getEurPrice() {
  let eur = await axios
    .get("https://api.binance.com/api/v1/ticker/price?symbol=EURUSDT")
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
  return eur;
}

async function getBsPrice() {
  let bs = await axios
    .get("https://s3.amazonaws.com/dolartoday/data.json")
    .then(function (response) {
      let bsToUsd = 1 / response.data.USD.transferencia;
      return bsToUsd;
    })
    .catch(function (error) {
      console.log(error);
      let bsToUsd = 1 / 100000;
      return bsToUsd;
    });
  return bs;
}

async function getPtrPrice() {
  let ptr = await axios
    .get("https://petroapp-price.petro.gob.ve/price/")
    .then(function (response) {
      let bsToUsd = 1 / response.data.USD.transferencia;
      return bsToUsd;
    })
    .catch(function (error) {
      let ptrToUsd = 60;
      return ptrToUsd;
    });
  return ptr;
}

module.exports = router;
