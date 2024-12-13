import store from '@/store'

/**
 * 检查当前用户是否拥有指定的权限
 * @param {Array} value 需要的角色列表
 * @returns {Boolean} 是否拥有权限
 * @example v-permission="['admin','editor']"
 */
export function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })
    return hasPermission
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}

/**
 * 检查当前用户是否拥有指定的所有权限
 * @param {Array} roles 需要的角色列表
 * @returns {boolean} 是否拥有所有权限
 */
export function checkAllPermissions(roles) {
  if (roles && roles instanceof Array && roles.length > 0) {
    const userRoles = store.getters && store.getters.roles
    return roles.every(role => userRoles.includes(role))
  }
  return false
}

/**
 * 检查当前用户是否为管理员
 * @returns {boolean} 是否为管理员
 */
export function isAdmin() {
  const roles = store.getters && store.getters.roles
  return roles.includes('admin')
}