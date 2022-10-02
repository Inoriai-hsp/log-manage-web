import request from '@/utils/request'

export function listPage(params) {
    return request({
        url: '/block-manager/user/listPage',
        method: 'get',
        params: params
    })
}

export function saveOrUpdate(data) {
    return request({
        url: '/block-manager/user/saveOrUpdate',
        method: 'post',
        data: data
    })
}

export function delUser(id) {
    return request({
        url: '/block-manager/user/delUser',
        method: 'get',
        params: {userId: id}
    })
}