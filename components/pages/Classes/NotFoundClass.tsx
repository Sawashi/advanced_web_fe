import { Heading, VStack, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import routes from "routes";

const NotFoundClass = () => {
  const router = useRouter();
  return (
    <VStack
      borderRadius={10}
      borderWidth={1}
      p={5}
      borderColor={"gray.300"}
      alignItems={"start"}
      gap={10}
    >
      <VStack w={"full"} alignItems={"start"} gap={2}>
        <Heading size={"md"}>Class not found</Heading>
        <Text>Look for it on Classes, or double-check your link.</Text>
      </VStack>

      <Button
        variant={"primary"}
        alignSelf={"end"}
        onClick={() => {
          router.push(routes.user.home.value);
        }}
      >
        Go to Classes
      </Button>
    </VStack>
  );
};

export default NotFoundClass;
