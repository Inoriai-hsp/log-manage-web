import request from '@/utils/request'

export function listOpLog(params) {
    return request({
        url: '/block-manager/opLog/logs',
        method: 'get',
        params: params
    })
}

export function getChainDataPage(params) {
    return request({
        url: '/block-manager/chain/getChainDataPage',
        method: 'get',
        params: params
    })
}

export function getDetailByTask(params) {
    return request({
        url: '/block-manager/chain/getDetailByTask',
        method: 'get',
        params: params
    })
}