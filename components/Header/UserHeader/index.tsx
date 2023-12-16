import { Box, HStack, Image } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React from "react";

const UserHeader = () => {
  const router = useRouter();

  const onClickLogo = () => {
    router.push("/");
  };

  return (
    <HStack
      w={"100%"}
      h={62}
      alignItems={"center"}
      p={5}
      borderBottomWidth={1}
      borderBottomColor={"gray.300"}
    >
      <Image
        src="/assets/icons/logo.svg"
        alt="logo"
        objectFit={"contain"}
        w={10}
        onClick={onClickLogo}
        _hover={{ cursor: "pointer" }}
      />
      <HStack></HStack>
    </HStack>
  );
};

export default observer(UserHeader);
