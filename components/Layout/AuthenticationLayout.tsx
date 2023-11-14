import { chakra } from '@chakra-ui/react'
import Head from 'next/head'
import React, { ReactNode, useEffect } from 'react'
import { useStores } from 'hooks/useStores'

interface IAuthenticationLayoutProps {
  title?: string
  children?: ReactNode
}

const AuthenticationLayout = (props: IAuthenticationLayoutProps) => {
  const { title, children } = props
  const { authStore } = useStores()
  useEffect(() => {
    if (authStore.getLocalStorageAccessToken()) {
      authStore.fetchCurrentUser()
    }
  }, [])
  return (
    <>
      <Head>
        <title>{title || 'Ono'}</title>
        <link rel="icon" href="/assets/icons/logo.svg" />
      </Head>
      <chakra.main>{children}</chakra.main>
    </>
  )
}

export default AuthenticationLayout
