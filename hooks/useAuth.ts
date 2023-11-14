import { useEffect } from 'react'
import { ILoginDataReq } from 'interfaces/authentication'
import { CommonError } from 'types'
import { useStores } from './useStores'

export function useAuth(): {
  loginHandler: () => void
} {
  const { authStore } = useStores()

  async function loginHandler(): Promise<void> {
    try {
      const mockUserName: ILoginDataReq = {
        email: 'admin@admin.com',
        password: '123456789'
      }
      await authStore.login(mockUserName)
    } catch (error) {
      console.error('useAuth.ts', (<CommonError>error)?.message)
    }
  }

  useEffect(() => {
    if (authStore.accessToken) {
      authStore.fetchCurrentUser()
    }
  }, [authStore.accessToken])

  return { loginHandler }
}
