import { AuthenticateParams } from "enums/auth";
import { useStores } from "hooks/useStores";
import { ILoginDataRes } from "interfaces/authentication";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const SocialLoginSuccess = () => {
  const searchParams = useSearchParams();
  const { cookiesStore } = useStores();

  console.log(searchParams.get("result"));

  useEffect(() => {
    if (searchParams.get("result")) {
      const result = JSON.parse(
        searchParams.get("result") as string
      ) as ILoginDataRes;
      const {
        accessToken,
        accessTokenExpiresIn,
        refreshToken,
        refreshTokenExpiresIn,
      } = result;
      cookiesStore.setItem(AuthenticateParams.ACCESS_TOKEN, accessToken, {
        expiresIn: accessTokenExpiresIn,
      });
      cookiesStore.setItem(AuthenticateParams.REFRESH_TOKEN, refreshToken, {
        expiresIn: refreshTokenExpiresIn,
      });
      setTimeout(() => {
        window.close();
      }, 500);
    }
  });

  return <div>Success</div>;
};

export default SocialLoginSuccess;
