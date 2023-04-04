
export default {
/**
 * 字符串是否为空
 *
 * @param content
 * @returns {boolean}
 */
  isEmpty (content) {
    return this.isNull(content)
  },
  /**
   * 对象是否为空
   *
   * @param object
   * @returns {boolean}
   */
  isNull (object) {
    try {
      if (typeof object === 'undefined') {
        return true
      }
      if (typeof object === 'string') {
        if (object === '' || object.length === 0) {
          return true
        }
      }
      if (typeof object === 'object') {
        if (object === null) {
          return true
        } else if (object instanceof Array) {
          for (let item of object) {
            if (Object.keys(item).length === 0) {
              return true
            }
          }
        } else {
          return Object.keys(object).length === 0
        }
      }
    } catch (e) {

    }
    return false
  }
}
