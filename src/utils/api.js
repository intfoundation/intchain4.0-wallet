import { Message } from 'element-ui'
import moment from 'moment'
import BigNumber from 'bignumber.js'
let strTrim = str => str.replace(/(^\s*)|(\s*$)/g, "")

let checkParams = (flag, msg) => {
    if (flag) {
        Message({
            type: 'info',
            message: msg
        });
    }
    return flag;
}

let info = (type, msg) => {
    Message({
        type,
        message: msg
    });
}

let isPhone = tel => /^1(3|4|5|6|7|8|9)\d{9}$/.test(tel)


let isEmail = email => /^[_a-z0-9-\.]+@([-a-z0-9]+\.)+[a-z]{2,}$/i.test(email)

let numFormat = (s, n) => {
    s = new BigNumber(s).dividedBy(Math.pow(10, 18)).toString()
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    let t = "";
    for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
}


let bn = {}
bn.add = function() {
    let res = new BigNumber(0)
    for (let a of arguments) {
        res = res.plus(a)
    }
    return res.toString()
}

bn.minus = (a, b) => {
    return new BigNumber(a).minus(b).toString()
}

bn.multiply = function() {
    let res = new BigNumber(1)
    for (let a of arguments) {
        res = res.multipliedBy(a)
    }
    return res.toString()
}

bn.div = (a, b) => {
    return new BigNumber(a).dividedBy(b).toString()
}


let api = {
    install: function(Vue) {
        Vue.prototype.strTrim = strTrim;
        Vue.prototype.checkParams = checkParams;
        Vue.prototype.info = info;
        Vue.prototype.isPhone = isPhone;
        Vue.prototype.isEmail = isEmail;
        Vue.prototype.moment = moment;
        Vue.prototype.numFormat = numFormat;
        Vue.prototype.bn = bn;
    }
}

export default api