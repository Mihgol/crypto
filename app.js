const app = Vue.createApp({
  data() {
    return {
      VAULT: [],
      turnover: { 
        ofAccount: {credits: 0, debits: 0, total: 0, creditCount: 0, debitCount: 0, count: 0, average: 0},
        ofInternal: {credits: 0, debits: 0, total: 0, creditCount: 0, debitCount: 0, count: 0, average: 0},
        ofCrypto: {credits: 0, debits: 0, total: 0, creditCount: 0, debitCount: 0, count: 0, average: 0}
      },
      init: true,
      crypto: { 
        rowsWithCrypto: [], 
        includedKeywords: [],
        excludedKeywords: [], 
        rowsWithoutCrypto: [] 
      },
      internal: { uniqueAccounts: [], internalTransactions: [] },
      KEYWORDS: [
        "binance",
        "binance.com",
        "BNB",
        "kraken",
        "kraken.com",
        "coinbase",
        "coinbase.com",
        "bitstamp",
        "bitstamp.net",
        "bitfinex",
        "bitfinex.com",
        "bittrex",
        "bittrex.com",
        "gate.io",
        "gateio.com",
        "bybit",
        "bybit.com",
        "crypto.com",
        "crypto.com",
        "gemini",
        "gemini.com",
        "okx",
        "okx.com",
        "bitpanda",
        "bitpanda.com",
        "bitget",
        "bitget.com",
        "mexc",
        "mexc.com",
        "uniswap",
        "uniswap.org",
        "pancakeswap",
        "pancakeswap.finance",
        "sushiswap",
        "sushiswap.org",
        "1inch",
        "1inch.io",
        "debank",
        "debank.com",
        "aave",
        "aave.com",
        "compound",
        "compound.finance",
        "makerdao",
        "makerdao.com",
        "yearn",
        "yearn.finance",
        "curve",
        "curve.fi",
        "balancer",
        "balancer.fi",
        "safemoon",
        "safemoon.net",
        "shiba inu",
        "shibatoken.com",
        "dogecoin",
        "dogecoin.com",
        "litecoin",
        "litecoin.org",
        "solana",
        "solana.com",
        "polygon",
        "polygon.technology",
        "avalanche",
        "ava labs",
        "fantom",
        "fantom.foundation",
        "terra",
        "terra.money",
        "cosmos",
        "cosmos.network",
        "polkadot",
        "polkadot.network",
        "kusama",
        "kusama.network",
        "near",
        "near.org",
        "arbitrum",
        "arbitrum.org",
        "optimism",
        "optimism.io",
        "zkSync",
        "zksync.io",
        "immutable x",
        "immutable.com",
        "opensea",
        "opensea.io",
        "rarible",
        "rarible.com",
        "foundation",
        "foundation.app",
        "superrare",
        "superrare.com",
        "knownorigin",
        "knownorigin.io",
        "makersplace",
        "makersplace.com",
        "async art",
        "async.art",
        "nifty gateway",
        "niftygateway.com",
        "zora",
        "zora.co",
        "mintable",
        "mintable.app",
        "looksrare",
        "looksrare.org",
        "x2y2",
        "x2y2.io",
        "seaport",
        "seaport.xyz",
        "blur",
        "blur.io",
        "sudomint",
        "sudomint.xyz",
        "manifold",
        "manifold.xyz",
        "mintgate",
        "mintgate.xyz",
        "mintbase",
        "mintbase.io",
        "niftykit",
        "niftykit.com",
        "mintplex",
        "mintplex.xyz",
        "Bitcoin",
        "BTC",
        "XBT",
        "₿",
        "Ethereum",
        "ETH",
        "Tether",
        "USDT",
        "XRP",
        "XRP",
        "BNB",
        "BNB",
        "Solana",
        "SOL",
        "Polygon",
        "MATIC",
        "Avalanche",
        "AVAX",
        "Fantom",
        "FTM",
        "Terra",
        "LUNA",
        "Cosmos",
        "ATOM",
        "Polkadot",
        "DOT",
        "Kusama",
        "KSM",
        "NEAR Protocol",
        "NEAR",
        "Arbitrum",
        "ARB",
        "Optimism",
        "OP",
        "zkSync",
        "ZKS",
        "Immutable X",
        "IMX",
        "Dogecoin",
        "DOGE",
        "Litecoin",
        "LTC",
        "Shiba Inu",
        "SHIB",
        "Chainlink",
        "LINK",
        "Cardano",
        "ADA",
        "Bitcoin Cash",
        "BCH",
        "EOS",
        "EOS",
        "DASH",
        "DASH",
        "Ethereum Classic",
        "ETC",
        "Gridcoin",
        "GRC",
        "Nano",
        "NANO",
        "NEO",
        "NEO",
        "Namecoin",
        "NMC",
        "NXT",
        "NXT",
        "PotCoin",
        "POT",
        "Peercoin",
        "PPC",
        "Titcoin",
        "TIT",
        "USD Coin",
        "USDC",
        "Revolut",
        "Paypal",
      ],
      DESC_COL: 26,
      AMOUNT_COL: 21,
      ACCOUNT_COL: 0,
      ORIGIN_COL: 19,
      TITLE_OF_FIRST_CELL: "account",
    };
  },
  methods: {
    mainLoop() {

      if(this.init) {
        this.crypto = this.findCrypto(this.getVaultData(), this.crypto.includedKeywords, this.crypto.excludedKeywords);
        this.internal = this.findInternalTransactions(this.getVaultData());
        this.init = false;
      }

      this.crypto = this.findCrypto(
        [...this.crypto.rowsWithCrypto, ...this.crypto.rowsWithoutCrypto],
        this.crypto.includedKeywords,
        this.crypto.excludedKeywords
      );

      this.turnover = {
        ofAccount: this.calculateTurnover(this.getVaultData()),
        ofInternal: this.calculateTurnover(this.internal.internalTransactions),
        ofCrypto: this.calculateTurnover(this.crypto.rowsWithCrypto)
      }
    },
    findInternalTransactions(table) {
      const output = { uniqueAccounts: [], internalTransactions: [] };

      output.uniqueAccounts = Array.from(new Set(table.map(row => row[this.ACCOUNT_COL])));

      for (const row of table) {
        const originAccountNumber = row[this.ORIGIN_COL]
        if (output.uniqueAccounts.includes(originAccountNumber)) {
          output.internalTransactions.push(row);
        }
      }
      return output;
    },
    formatPound(value){
      const absoluteValue = Math.abs(value)
      const formatter = Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
      });

      return formatter.format(absoluteValue);
    },
    calculateTurnover(table) {
      const output = {credits: 0, debits: 0, total: 0, creditCount: 0, debitCount: 0, count: 0, average: 0};
      
      for(const index in table) {
        const row = table[index];
        const transactionValue = row[this.AMOUNT_COL];
        output.count += 1;

        if(transactionValue > 0) {
          output.creditCount += 1;
          output.credits = this.sumUpMoneyArray([output.credits, transactionValue]);
        } 

        if(transactionValue < 0){
          output.debitCount += 1;
          output.debits = this.sumUpMoneyArray([output.debits, transactionValue]);
        }
      }

    output.total = this.sumUpMoneyArray([output.credits, Math.abs(output.debits)]);
    let average = this.sumUpMoneyArray([output.credits, Math.abs(output.debits)]) / output.count;
    output.average = Math.round(average * 100) / 100;
    return output; 
    },
    findCrypto(
      table, 
      includedKeywords, 
      excludedKeywords
    ) {
      // [[a, b], [a, b]]; []; []
      const KEYWORDS = this.KEYWORDS;
      const output = {
        rowsWithCrypto: [],
        rowsWithoutCrypto: [],
        includedKeywords,
        excludedKeywords 
      };
      
      for (const index in table) {
        let row = table[index];
        let transactionDescription = row[this.DESC_COL] || "";
        let matched = false;

        for (const keyword of KEYWORDS) {
          if (
            transactionDescription.toLowerCase().includes(keyword.toLowerCase())
            && !output.excludedKeywords.includes(keyword)
          ) {
            if (!output.includedKeywords.includes(keyword)) {
              output.includedKeywords.push(keyword);
            }
            matched = true;
          }
        }
        if (matched) {
          output.rowsWithCrypto.push(row)
        } else {
          output.rowsWithoutCrypto.push(row);
        };
      }

      output.includedKeywords = output.includedKeywords.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

      output.excludedKeywords = output.excludedKeywords.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

      output.rowsWithCrypto = output.rowsWithCrypto.sort((a, b) => a[this.DESC_COL].localeCompare(b[this.DESC_COL]));

      output.rowsWithoutCrypto = output.rowsWithoutCrypto.sort((a, b) => a[this.DESC_COL].localeCompare(b[this.DESC_COL]));
      
      return output;
    },
    handlePaste(event) {
      const clipboard = event.clipboardData || window.clipboardData;
      const html = clipboard.getData("text/html");
      const text = clipboard.getData("text/plain");
      this.VAULT = this.parseClipboard(html, text);
      this.mainLoop([]);
    },
    parseClipboard(html, text) {
      let rows = [];
      if (html) {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const table = doc.querySelector("table");

        if (table) {

          for (const tr of table.rows) {  
            rows.push([...tr.cells].map((td) => td.innerText.trim()));
          }
          rows.shift();
          return rows;
        }
      }

      if (text) {
        rows = text.split(/\r?\n/).map((line) => line.split("\t"));
      }
      rows.shift();
      return rows;
    },
    getVaultData() {
      return JSON.parse(JSON.stringify(this.VAULT));
    },
    sumUpMoneyArray(moneyArray) {
       const totalPennies = moneyArray.reduce((sum, amt) => sum + Math.round(amt * 100), 0);
       return totalPennies / 100;
    },
    calculatePercentage(part, total) {
        const partPennies = Math.round(part * 100);
        const totalPennies = Math.round(total * 100);

        if (totalPennies === 0) {
          return 0;
        }

        const percent = (partPennies / totalPennies) * 100;
        return percent.toFixed(2);
    },
    keywordSwitch(source, destination, index){
      destination.push(...source.splice(index, 1));
      this.mainLoop();
    },
    excludeRow(index) {
      const [row] = this.crypto.rowsWithCrypto.splice(index, 1);
      if (row) {
          this.crypto.rowsWithoutCrypto.push(row);
      }
      this.turnover = {
        ofAccount: this.calculateTurnover(this.getVaultData()),
        ofInternal: this.calculateTurnover(this.internal.internalTransactions),
        ofCrypto: this.calculateTurnover(this.crypto.rowsWithCrypto)
      }
    },
    includeRow(index) {
      const [row] = this.crypto.rowsWithoutCrypto.splice(index, 1);
      if (row) {
          this.crypto.rowsWithCrypto.push(row);
      }
      this.turnover = {
        ofAccount: this.calculateTurnover(this.getVaultData()),
        ofInternal: this.calculateTurnover(this.internal.internalTransactions),
        ofCrypto: this.calculateTurnover(this.crypto.rowsWithCrypto)
      }
    }
  },
});
app.mount("#app");
