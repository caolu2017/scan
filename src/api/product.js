import { post, get } from '@/api/httpService'

/**
 * 产品专栏列表查询
 * GET
 * @param
 */
export function getProductList (params) {
  return post('/product/getProductList', params)
}

/**
 * 产品类别查询
 * GET
 * @param
 */
export function getProductType (params) {
  return get('/product/getProductType', params)
}

/**
 * 产品专栏信息详情
 * GET
 * @param
 */
export function getProductInfoById (params) {
  return get('/product/getProductInfoById', params)
}

/**
 * 产品专栏信息详情
 * GET
 * @param
 */
export function getYinPianByType (params) {
  return post('/product/getYinPianByType', params)
}

/**
 * 查询员工信息
 * GET
 * @param
 */
export function checkUser (params) {
  return get('/ganbu/checkUser', params)
}
