1. Run `npm install`
2. Run `npm run dev`.
3. Service get currency in USD: GET localhost:3000/api/currencyToUsd
4. Service post by currency and amount get quantity in other currencies:
   POST localhost:3000/api/currencyConvert
   body example:
   {
   "currency":"EUR",
   "amount":"1"
   }
