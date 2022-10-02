import request from '@/utils/request'

export function getFileInfo() {
  return request({
    url: '/block-manager/logFile/getFileInfo?fileId=71338365258043392',
    method: 'get'
  })
}
