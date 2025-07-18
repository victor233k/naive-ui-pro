import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { apiLogin, apiQueryUserInfo } from '@/api/user'

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
  const user = ref<UserInfo>({
    name: '',
    roles: [],
    codes: [],
    token: localStorage.getItem('token') ?? '',
  })

  const loading = ref(false)

  async function fetchUpdateUserInfo() {
    try {
      const { data } = await apiQueryUserInfo()
      user.value = {
        ...user.value,
        ...data,
      }
      return user.value
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (_) {
      $reset()
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

  function $reset() {
    user.value = {
      name: '',
      token: '',
      roles: [],
      codes: [],
    }
    localStorage.removeItem('token')
  }

  return {
    login,
    $reset,
    fetchUpdateUserInfo,
    loginLoading: loading,
    user: computed(() => user.value),
  }
})
