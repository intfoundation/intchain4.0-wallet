let BigNumber = require('bignumber.js')
let Nat = require("int4.js").nat
let Abi = require("int4.js").abi
let Transaction = require("int4.js").transaction
let axios = require("axios")

let run = (body, exchange = false)=> {
    return new Promise((resolve, reject) => {
        axios
            .post("/api/wallet/transfer", { body, url: "", isEth: true, exchange: exchange }).then(res => {
                resolve(res.data)
            }).catch(err => reject(err))
    })
}

let getBlock = number => {
    number = number ? '0x' + number.toString(16) : "latest";
    let body = `{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["${number}", true],"id":1}`
    return run(body)
}

let getTransactionByHash = hash => {
    let body = `{"jsonrpc":"2.0","method":"eth_getTransactionByHash","params":["${hash}"],"id":1}`
    return run(body)
}

let getTransactionReceipt = hash => {
    let body = `{"jsonrpc":"2.0","method":"eth_getTransactionReceipt","params":["${hash}"],"id":1}`
    return run(body)
}

let getBalance = async address => {
    let body = `{"jsonrpc":"2.0","method":"eth_getBalance","params":["${address}", "latest"],"id":1}`
    return await run(body)

}

let getTokenBalance = async params => {
  let data = Abi.encodeParams(["address"], [params.address]);
  let functionSig = Abi.methodID("balanceOf", ["address"]).substr(2, 8);
  let tx = {
    from: params.address,
    to: params.contractAddress,
    data: "0x" + functionSig + data.substring(2)
  }

  let body = `{"jsonrpc":"2.0","method":"eth_call","params":[` + JSON.stringify(tx) + `,"latest"],"id":1}`
  try{
    return await run(body);
  }catch (e) {
    console.log("getTokenBalance error", e);
    return "0x0";
  }
}

let getTokenDecimals = async contractAddress => {
  let functionSig = Abi.methodID("decimals", []).substr(2, 8);
  let tx = {
    to: contractAddress,
    data: "0x" + functionSig
  }
  let body = `{"jsonrpc":"2.0","method":"eth_call","params":[` + JSON.stringify(tx) + `,"latest"],"id":1}`

  try{
    return await run(body)
  }catch (e) {
    console.log("getTokenDecimals error", e);
    return "0x0";
  }

}

//curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getTransactionCount","params":["INT3E9Li2B9gqCeQaC5nDWGhM9AZv3TJ", "latest"],"id":1}' -H 'content-type: application/json;' http://127.0.0.1:7000/intchain
let getNonce = async address => {
    let body = `{"jsonrpc":"2.0","method":"eth_getTransactionCount","params":["${address}", "latest"],"id":1}`
    let result = await run(body)
    return parseInt(result, 16)
}
//curl -X POST --data '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1}' -H 'content-type: application/json;' http://127.0.0.1:7000/intchain
let getGasPrice = async () => {
    let body = `{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1}`
    let result = await run(body)
    return parseInt(result, 16)
}

let stringToHex = (str) => {
    var val = "0x";
    for (var i = 0; i < str.length; i++) {
        if (val == "") { val = str.charCodeAt(i).toString(16); } else { val += str.charCodeAt(i).toString(16); }
    }
    return val;
}

let hexToString = (str) => {
    let s = str.indexOf("0x") == 0 ? str.slice(2) : str;
    let val = '';
    for (let i = 0; i < s.length; i += 2) {
        val += String.fromCharCode(+parseInt(s.slice(i, 2), 16).toString(10))
    }
    return val;
}

let sendSignTx = async params => {
    let nonce = await getNonce(params.account.address);
    let tx = {
        chainId: "0x1",
        nonce: Nat.fromString('' + nonce),
        gasPrice: Nat.fromString('0x' + new BigNumber(params.gasPrice).multipliedBy(Math.pow(10, 18)).toString(16)),
        gas: Nat.fromString(params.gas),
        to: params.to,
        value: params.value === 0 ? "0x0" : Nat.fromString('0x' + new BigNumber(params.value).multipliedBy(Math.pow(10, 18)).toString(16)),
        data: params.data || '0x'
    }
    let signTx = await Transaction.sign(tx, params.account)
    let body = `{"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["${signTx}"],"id":1}`
    return await run(body, params.exchange)
}


module.exports = {
    run,
    getBlock,
    getTransactionByHash,
    getTransactionReceipt,
    getBalance,
    getTokenBalance,
    getTokenDecimals,
    getNonce,
    sendSignTx,
    getGasPrice,
    stringToHex
}
