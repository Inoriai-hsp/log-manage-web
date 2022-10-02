import request from '@/utils/request'

export function createTask(data) {
    return request({
        url: '/block-manager/chain/createMatchContent',
        method: 'post',
        data: data
    })
}

export function getTaskList(params) {
    return request({
        url: '/block-manager/chain/taskList',
        method: 'get',
        params: params
    })
}

export function getTaskById(id) {
    return request({
        url: '/block-manager/chain/getTaskById',
        method: 'get',
        params: {taskId: id}
    })
}

export function intoChain(data) {
    return request({
        url: '/block-manager/chain/intoChain',
        method: 'post',
        data: data
    })
}