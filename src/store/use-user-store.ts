import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiLogin, apiQueryUserInfo } from '@/api/user'
import { LOGIN_ROUTE_PATH } from '@/router/routes'

export interface UserInfo {
  name: string
  token: string
  roles: string[]
  codes: string[]
}

export interface UserLoginPayload {
  username: string
  password: string
  [x: string]: any
}

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const loading = ref(false)

  const user = ref<UserInfo>({
    name: '',
    roles: [],
    codes: [],
    token: localStorage.getItem('token') ?? '',
  })

  async function fetchUpdateUserInfo() {
    try {
      const { data } = await apiQueryUserInfo()
      user.value = {
        ...user.value,
        ...data,
      }
      return user.value
    }
    catch (error) {
      console.error(error)
      logout()
      return user.value
    }
  }

  async function login(payload: UserLoginPayload) {
    try {
      loading.value = true
      const res = await apiLogin(payload)
      const token = user.value.token = res.data.token
      localStorage.setItem('token', token)
      return fetchUpdateUserInfo()
    }
    finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = {
      name: '',
      token: '',
      roles: [],
      codes: [],
    }
    localStorage.removeItem('token')
    router.push(LOGIN_ROUTE_PATH)
  }

  return {
    login,
    logout,
    fetchUpdateUserInfo,
    loginLoading: loading,
    user: computed(() => user.value),
  }
})
