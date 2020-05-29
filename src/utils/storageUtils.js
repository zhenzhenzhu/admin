
/**
 * 进行local数据存储管理的工具模块
 */
import store from 'store'
const USER_KEY = 'user_key'
export default {
  /**
   * 保存数据
   */
    saveUser(user) {
        // 两个值都是字符串 1.key 2.value
        // localStorage.setItem(USER_KEY,JSON.stringify(user))
        store.set(USER_KEY,user)
    },
  /**
   * 获取数据
   */
    getUser() { //如果存在，返回的是一个对象，不存在返回 {}
    //    return JSON.parse( localStorage.getItem(USER_KEY) || {})
      return store.get(USER_KEY) || {}
    },
  /**
   * 删除数据
   */
    removeUser() {
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}