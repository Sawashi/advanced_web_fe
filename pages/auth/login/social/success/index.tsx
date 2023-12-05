import { Stack, Image, Text } from "@chakra-ui/react";
import { AuthenticateParams } from "enums/auth";
import { useStores } from "hooks/useStores";
import { ILoginDataRes } from "interfaces/authentication";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useEffect } from "react";

const SocialLoginSuccess = () => {
  const searchParams = useSearchParams();
  const { cookiesStore } = useStores();

  useEffect(() => {
    if (searchParams.get("result")) {
      let result = JSON.parse(
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
  }, [searchParams]);

  return (
    <Stack
      w="100%"
      h="100vh"
      alignItems="center"
      justifyContent="center"
      spacing="4"
      px="4"
    >
      <Image src="/assets/icons/logo.svg" alt="logo" width="100px" />
      <Text fontSize="2xl" fontWeight="bold" textAlign="center">
        Login successfully!
      </Text>
      <Text fontSize="md" textAlign="center">
        Please wait a moment...
      </Text>
    </Stack>
  );
};

export default SocialLoginSuccess;
