import { post, get } from '@/api/httpService'

 export function login (data) {
  return post('/api/1/mobile/login', data)
}
 export function getProcess () {
  return get('/api/1/mobile/getProcess')
}
 export function getLines ({factoryID}) {
  return get(`/api/1/mobile/getLines/${factoryID}`)
}
 export function workProgressCommit (data) {
  return post(`/api/1/mobile/workProgressCommit`, data)
}
 export function getVer () {
  return get(`/api/1/mobile/getVer`)
}