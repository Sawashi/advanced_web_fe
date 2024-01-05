import React, { useState } from "react";
import AuthenticationLayout from "components/Layout/AuthenticationLayout";
import AuthenticatePage from "components/pages/AuthenticatePage";
import {
  EAuthenticatePageName,
  EAuthenticatePageType,
} from "components/pages/AuthenticatePage/constant";

const OwnerLogin = () => {
  const [namePage, setNamePage] = useState(EAuthenticatePageName.LOGIN);
  return (
    <AuthenticationLayout title={`${namePage}`}>
      <AuthenticatePage
        type={EAuthenticatePageType.LOGIN}
        setNamePage={setNamePage}
      />
    </AuthenticationLayout>
  );
};

export default OwnerLogin;
