import { Stack, Text, Image } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import routes from "routes";

const UserPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace(routes.home.value);
  }, []);

  return (
    <Stack
      w="100%"
      h="100vh"
      alignItems="center"
      justifyContent="center"
      spacing="4"
    >
      <Image src="/assets/icons/logo.svg" alt="logo" width="200px" />
    </Stack>
  );
};

export default UserPage;
