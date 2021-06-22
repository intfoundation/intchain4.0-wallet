let BigNumber = require('bignumber.js')
let Nat = require("int4.js").nat
let Transaction = require("int4.js").transaction
let axios = require("axios")

let run = body => {
    return new Promise((resolve, reject) => {
        axios
            .post("/api/wallet/transfer", { body }).then(res => {
                resolve(res.data)
            }).catch(err => reject(err))
    })
}

let getBlock = number => {
    number = number ? '0x' + number.toString(16) : "latest";
    let body = `{"jsonrpc":"2.0","method":"int_getBlockByNumber","params":["${number}", true],"id":1}`
    return run(body)
}

let getTransactionByHash = hash => {
    let body = `{"jsonrpc":"2.0","method":"int_getTransactionByHash","params":["${hash}"],"id":1}`
    return run(body)
}

let getTransactionReceipt = hash => {
    let body = `{"jsonrpc":"2.0","method":"int_getTransactionReceipt","params":["${hash}"],"id":1}`
    return run(body)
}

let getBalance = async address => {
    let body = `{"jsonrpc":"2.0","method":"int_getBalance","params":["${address}", "latest"],"id":1}`
    let result = await run(body)
    return parseInt(result, 16)
}

let getFullBalance = async address => {
    let body = `{"jsonrpc":"2.0","method":"int_getBalanceDetail","params":["${address}", "latest", true],"id":1}`
    return run(body)
}

let getEpoch = async number => {
    if (!number) {
        let body = '{"jsonrpc":"2.0","method":"int_getCurrentEpochNumber","params":[],"id":1}'
        number = await run(body)
    } else {
        number = '0x' + number.toString(16)
    }
    let body = `{"jsonrpc":"2.0","method":"int_getEpoch","params":["${number}"],"id":1}`
    return run(body)
}
//curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getTransactionCount","params":["INT3E9Li2B9gqCeQaC5nDWGhM9AZv3TJ", "latest"],"id":1}' -H 'content-type: application/json;' http://127.0.0.1:7000/intchain
let getNonce = async address => {
    let body = `{"jsonrpc":"2.0","method":"int_getTransactionCount","params":["${address}", "latest"],"id":1}`
    let result = await run(body)
    return parseInt(result, 16)
}
//curl -X POST --data '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1}' -H 'content-type: application/json;' http://127.0.0.1:7000/intchain
let getGasPrice = async () => {
    let body = `{"jsonrpc":"2.0","method":"int_gasPrice","params":[],"id":1}`
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
        chainId: '0x800',
        nonce: Nat.fromString('' + nonce),
        gasPrice: Nat.fromString('0x' + new BigNumber(params.gasPrice).multipliedBy(Math.pow(10, 18)).toString(16)),
        gas: Nat.fromString(params.gas),
        to: params.to,
        value: params.value === 0 ? "0x0" : Nat.fromString('0x' + new BigNumber(params.value).multipliedBy(Math.pow(10, 18)).toString(16)),
        data: params.data || '0x'
    }
    let signTx = await Transaction.sign(tx, params.account)
    let body = `{"jsonrpc":"2.0","method":"int_sendRawTransaction","params":["${signTx}"],"id":1}`
    return await run(body)
}


module.exports = {
    run,
    getBlock,
    getTransactionByHash,
    getTransactionReceipt,
    getBalance,
    getFullBalance,
    getEpoch,
    getNonce,
    sendSignTx,
    getGasPrice,
    stringToHex
}
