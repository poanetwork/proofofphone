![Proof of Phone logo](https://raw.githubusercontent.com/blocknotary/proofofphone/master/logo_proof_of_phone.png)

Proof of phone is a smart oracle developed for the Oracles Network to serve as a simple form of KYC (Know-Your-Customer).

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/hyperium/hyper/master/LICENSE)

## Installation

1. Download zip archive
2. Unpack it
3. Go to the /web folder in terminal and install the dependencies `npm install`
4. Set **environment** `dev` or `live` in configs: `./web/config.json`, `./scripts/config.json`, `./web/public/javascripts/config.json` (see config.json with placeholders below)
5. Launch any Ethereum RPC client. For example, [testrpc](https://github.com/ethereumjs/testrpc)
6. Set smart contract key points in `./web/config.json` and `./scripts/config.json` (see config.json with placeholders below):
    * `account`
    * `rpc`
7. Go to `/scripts` folder.
8. Run `npm install`
9. Run `node deployContract.js` to deploy your smart contract into Ethereum.
8. After creation you will get the message in terminal like this:
    *Contract mined! address:* **0xb713e9195f44a10383015f38774f31869053750c** *transactionHash: 0x85e85f78a4e1b40f26e491eb88b9a231b31085db11799734edc54d0285edc190*
9. Copy created smart contract address from this message and paste it to the client config.json (`./web/public/javascripts/config.json`) and scripts config (`./scripts/config.json`) to `contractAddress` property depending on your environment.
10. Set `twilio` params for sending SMS in server config.
11. Go to `/web` folder in terminal and start proofofphone web application `node app.js`

### Server config.json (`./web/config.json`) with placeholders
```
{
    "environment": "live/dev",
    "sendSMS": {
        "twilio": {
            "dev": {
               "phoneNumber": "+12345678900",
               "accountSID": "twilio_account_SID_dev",
               "authToken": "twilio_auth_token_dev"
            },
            "live": {
               "phoneNumber": "+12345678900",
               "accountSID": "twilio_account_SID_live",
               "authToken": "twilio_auth_token_live"
            }
        }
    },
    "Ethereum": {
      "dev": {
        "rpc": "http://host:port"
      },
      "live": {
        "rpc": "http://host:port"
      }
    }
}
```

### Client config.json (`./web/public/javascripts/config.json`) with placeholders
```
{
  "environment": "live/dev",
  "Ethereum": {
    "live": {
      "contractAddress": "0x0000000000000000000000000000000000000000"
    },
    "dev": {
      "contractAddress": "0x0000000000000000000000000000000000000000"
    },
    "contracts": {
      "ProofOfPhone": {
        "bin": "0x6060604052341561000c57fe5b5b6106438061001c6000396000f30060606040523615610081576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806303679666146100835780633404fe32146100e357806371d01c73146101105780639fbebee51461015a578063b958a5e11461017e578063ceaecc84146101c8578063fe97ee8814610228575bfe5b341561008b57fe5b6100a16004808035906020019091905050610276565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156100eb57fe5b61010e6004808035906020019091908035600019169060200190919050506102b4565b005b341561011857fe5b610144600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610354565b6040518082815260200191505060405180910390f35b341561016257fe5b61017c60048080356000191690602001909190505061036c565b005b341561018657fe5b6101b2600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610537565b6040518082815260200191505060405180910390f35b34156101d057fe5b6101e66004808035906020019091905050610581565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561023057fe5b61025c600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506105b4565b604051808215151515815260200191505060405180910390f35b60006001600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b919050565b6040604051908101604052808381526020013373ffffffffffffffffffffffffffffffffffffffff168152506002600083600019166000191681526020019081526020016000206000820151816000015560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055509050505b5050565b60006020528060005260406000206000915090505481565b3373ffffffffffffffffffffffffffffffffffffffff1660026000836000191660001916815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156103e55760006000fd5b60026000826000191660001916815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166001600060026000856000191660001916815260200190815260200160002060000154815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600260008260001916600019168152602001908152602001600020600001546000600060026000856000191660001916815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b50565b6000600060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490505b919050565b60016020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006000600060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541415156106085760019050610612565b60009050610612565b5b9190505600a165627a7a7230582007f136df6454b733e1e101a03dccfd4fd2ad950dcba0025499b3f7a16c993ca50029",
        "abi": [{"constant":true,"inputs":[{"name":"phone","type":"uint256"}],"name":"getAddressByPhone","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"phone","type":"uint256"},{"name":"codeToken","type":"bytes32"}],"name":"newToken","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"addressPhonePair","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"codeToken","type":"bytes32"}],"name":"activatePair","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"getPhoneByAddress","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"phoneAddressPair","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"hasPhone","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"}]
      }
    }
  }
}
```

### Scripts config.json (`./scripts/config.json`) with placeholders
```
{
  "environment": "live/dev",
  "Ethereum": {
    "live": {
      "rpc": "http://host:port",
      "account": "0x0000000000000000000000000000000000000000",
      "contractAddress": "0x0000000000000000000000000000000000000000"
    },
    "contracts": {
      "ProofOfPhone": {
        "bin": "0x6060604052341561000c57fe5b5b6106438061001c6000396000f30060606040523615610081576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806303679666146100835780633404fe32146100e357806371d01c73146101105780639fbebee51461015a578063b958a5e11461017e578063ceaecc84146101c8578063fe97ee8814610228575bfe5b341561008b57fe5b6100a16004808035906020019091905050610276565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156100eb57fe5b61010e6004808035906020019091908035600019169060200190919050506102b4565b005b341561011857fe5b610144600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610354565b6040518082815260200191505060405180910390f35b341561016257fe5b61017c60048080356000191690602001909190505061036c565b005b341561018657fe5b6101b2600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610537565b6040518082815260200191505060405180910390f35b34156101d057fe5b6101e66004808035906020019091905050610581565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561023057fe5b61025c600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506105b4565b604051808215151515815260200191505060405180910390f35b60006001600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b919050565b6040604051908101604052808381526020013373ffffffffffffffffffffffffffffffffffffffff168152506002600083600019166000191681526020019081526020016000206000820151816000015560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055509050505b5050565b60006020528060005260406000206000915090505481565b3373ffffffffffffffffffffffffffffffffffffffff1660026000836000191660001916815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156103e55760006000fd5b60026000826000191660001916815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166001600060026000856000191660001916815260200190815260200160002060000154815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600260008260001916600019168152602001908152602001600020600001546000600060026000856000191660001916815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b50565b6000600060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490505b919050565b60016020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006000600060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541415156106085760019050610612565b60009050610612565b5b9190505600a165627a7a7230582007f136df6454b733e1e101a03dccfd4fd2ad950dcba0025499b3f7a16c993ca50029",
        "abi": [{"constant":true,"inputs":[{"name":"phone","type":"uint256"}],"name":"getAddressByPhone","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"phone","type":"uint256"},{"name":"codeToken","type":"bytes32"}],"name":"newToken","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"addressPhonePair","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"codeToken","type":"bytes32"}],"name":"activatePair","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"getPhoneByAddress","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"phoneAddressPair","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"hasPhone","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"}]
      }
    }
  }
}
```

## Contributors

Viktor Baranov

Pasha Goncharenko

Igor Barinov

Anton Grin


## License

MIT

## Support

Supported by [Wanxiang Blockchain Labs](http://www.blockchainlabs.org/blockgrant-x-en/)
