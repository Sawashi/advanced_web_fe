import { Box, HStack, Image } from "@chakra-ui/react";
import { observer } from "mobx-react";
import React from "react";

const UserHeader = () => {
  return (
    <HStack
      w={"100%"}
      h={62}
      alignItems={"center"}
      borderBottomColor={"gray.700"}
      px={'medium'}
    >
      <Image
        src="/assets/icons/logo.svg"
        alt="logo"
        objectFit={"contain"}
        w={10}
      />
    </HStack>
  );
};

export default observer(UserHeader);
