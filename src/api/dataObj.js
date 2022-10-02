import request from '@/utils/request'

// export function fetchList(params) {
//     return request({
//       url: '/admin/list',
//       method: 'get',
//       params: params
//     })
//   }

export function getObjList(name) {
    return request({
        url: '/block-manager/dataObj/list',
        method: 'get',
        params: {name: name}
    })
}

export function getObjPageList(params) {
    return request({
        url: '/block-manager/dataObj/getPageList',
        method: 'get',
        params: params
    })
}

export function updateObj(data) {
    return request({
        url: '/block-manager/dataObj/saveOrUpdate',
        method: 'post',
        data: data
    })
}

export function deleteObj(id) {
    return request({
        url: '/block-manager/dataObj/del',
        method: 'get',
        params: {id: id}
    })
}