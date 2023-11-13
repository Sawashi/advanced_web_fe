import { useEffect } from 'react'
import { observer } from 'mobx-react'
import { useAuth } from 'hooks/useAuth'
import { useStores } from 'hooks/useStores'
const Header = () => {
  const { testStore, authStore } = useStores()
  const { loginHandler } = useAuth()

  useEffect(() => {
    loginHandler()
  }, [])

  console.log('testStore?.status', testStore?.status)
  console.log('authStore?.user', authStore?.user)
  return <div>This is header</div>
}

export default observer(Header)
