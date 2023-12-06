import { Stack, Image, Text } from "@chakra-ui/react";
import { useStores } from "hooks/useStores";
import { ILoginSSOErrorRes } from "interfaces/authentication";
import { observer } from "mobx-react";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useEffect } from "react";

const SocialLoginError = () => {
  const searchParams = useSearchParams();
  const { authStore } = useStores();
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchParams.get("error")) {
      try {
        let res = JSON.parse(
          searchParams.get("error") as string
        ) as ILoginSSOErrorRes;

        if (res?.message) {
          authStore.setSSOError(res.message);
          setError(res.message);
        }
      } catch (e) {
        console.error(e);
      }
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
        Login failed!
      </Text>
      <Text fontSize="lg" fontWeight="normal" textAlign="center">
        {error}
      </Text>
    </Stack>
  );
};

export default observer(SocialLoginError);
