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

//注销
const unRegister = resolve => require(['@/components/pages/unRegister'], resolve)

//编辑节点信息
const editValidator = resolve => require(['@/components/pages/editValidator'], resolve)

//解禁
// const unForbidden = resolve => require(['@/components/pages/unForbidden'], resolve)

//水龙头
const faucet = resolve => require(['@/components/pages/waterTap'], resolve)

//投票
const stake = resolve => require(['@/components/pages/stake'], resolve)

// 领取奖励
const mineReward = resolve => require(['@/components/pages/mineReward'], resolve)

// 跨链资产兑换
const bridge = resolve => require(['@/components/pages/bridge'], resolve)

Vue.use(Router)
const router = new Router({
    routes: [{
        path: '/',
        // name: 'Layout',
        component: Layout,
        children: [{
            path: '',
            name: 'walletInfo',
            component: walletInfo,
            meta: []
        },
        {
            path: '/newWallet',
            name: 'newWallet',
            component: newWallet,
        },
        {
            path: '/transfer',
            name: 'transfer',
            component: transfer
        },
        // {
        //     path: '/contract',
        //     name: 'contract',
        //     component: contract
        // },
        {
            path: '/register',
            name: 'register',
            component: register
        },
        {
            path: '/unRegister',
            name: 'unRegister',
            component: unRegister
        },
        {
            path: '/editValidator',
            name: 'editValidator',
            component: editValidator
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
        },
        {
            path: '/bridge',
            name: 'bridge',
            component: bridge
        }
        ]
    }]
})

export default router
