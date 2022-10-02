import request from '@/utils/request'

// export function login(username, password) {
//   return request({
//     url: '/block-manager/auth/login',
//     method: 'post',
//     data: {
//       username,
//       password
//     }
//   })
// }

// export function fetchList(params) {
//     return request({
//       url: '/admin/list',
//       method: 'get',
//       params: params
//     })
//   }

export function getFileList(params) {
    return request({
        url: '/block-manager/logFile/pageList',
        method: 'get',
        params: params
    })
}

export function uploadFile(formData) {
    return request({
        url: '/block-manager/logFile/uploadFile',
        method: 'post',
        headers: {
            "Content-Type": "multipart/form-data"
        },
        data: formData
    })
}

export function getFileInfo(id) {
    return request({
        url: '/block-manager/logFile/getFileInfo',
        method: 'get',
        params: {fileId: id}
    })
}

export function customize(data) {
    return request({
        url: '/block-manager/log/customize',
        method: 'post',
        data: data
    })
}

export function findLogByStatus(params) {
    return request({
        url: '/block-manager/log/findLogByStatus',
        method: 'get',
        params: params
    })
}

export function getLogInfo(params) {
    return request({
        url: '/block-manager/log/getLogInfo',
        method: 'get',
        params: params
    })
}

export function getFileContentShard(params) {
    return request({
        url: '/block-manager/log/getFileContentShard',
        method: 'get',
        params: params
    })
}