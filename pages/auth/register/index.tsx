import React, { useState } from 'react'
import AuthenticationLayout from 'components/Layout/AuthenticationLayout'
import AuthenticatePage from 'components/pages/AuthenticatePage'
import { EAuthenticatePageName, EAuthenticatePageType } from 'components/pages/AuthenticatePage/constant'

const RegisterPage = () => {
  const [namePage, setNamePage] = useState(EAuthenticatePageName.REGISTER)
  return (
    <AuthenticationLayout title={`${namePage}`}>
      <AuthenticatePage type={EAuthenticatePageType.REGISTER} setNamePage={setNamePage} />
    </AuthenticationLayout>
  )
}

export default RegisterPage
