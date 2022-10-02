import Cookies from 'js-cookie'

const TokenKey = 'loginToken'
const RoleKey = 'role'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getRole() {
  return Cookies.get(RoleKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setRole(role) {
  return Cookies.set(RoleKey, role)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeRole() {
  return Cookies.remove(RoleKey)
}
