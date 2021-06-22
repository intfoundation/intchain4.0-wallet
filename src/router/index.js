import Vue from 'vue'
import Router from 'vue-router'
const Layout = resolve => require(['@/components/layouts/Layout'], resolve);
//新钱包
const newWallet = resolve => require(['@/components/pages/newWallet'], resolve)

//钱包信息
const walletInfo = resolve => require(['@/components/pages/walletInfo'], resolve)
//转账
const transfer = resolve => require(['@/components/pages/transfer'], resolve)

//合约
const contract = resolve => require(['@/components/pages/contract'], resolve)

//注册
const register = resolve => require(['@/components/pages/register'], resolve)

//解禁
// const unForbidden = resolve => require(['@/components/pages/unForbidden'], resolve)

//水龙头
const faucet = resolve => require(['@/components/pages/waterTap'], resolve)

//投票
const stake = resolve => require(['@/components/pages/stake'], resolve)

// 领取奖励
const mineReward = resolve => require(['@/components/pages/mineReward'], resolve)

Vue.use(Router)
const router = new Router({
    routes: [{
        path: '/',
        // name: 'Layout',
        component: Layout,
        children: [{
            path: '',
            name: 'newWallet',
            component: newWallet,
            meta: []
        },
        {
            path: '/walletInfo',
            name: 'walletInfo',
            component: walletInfo,
        },
        {
            path: '/transfer',
            name: 'transfer',
            component: transfer
        },
        {
            path: '/contract',
            name: 'contract',
            component: contract
        },
        {
            path: '/register',
            name: 'register',
            component: register
        },
        {
            path: '/faucet',
            name: 'faucet',
            component: faucet
        },
        {
            path: '/stake',
            name: 'stake',
            component: stake
        },
        {
            path: '/mineReward',
            name: 'mineReward',
            component: mineReward
        }
        ]
    }]
})

export default router
