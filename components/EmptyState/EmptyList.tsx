import { VStack, Text, Button, Image } from "@chakra-ui/react";
import React from "react";

interface Props {
  _button?: {
    text: string;
    onClick: () => void;
  };
  title?: string;
  description?: string;
}

const EmptyList = (props: Props) => {
  const { _button, title, description } = props;
  return (
    <VStack
      borderRadius={10}
      p={5}
      borderColor={"gray.300"}
      alignItems={"center"}
      justifyContent={"center"}
      w={"full"}
      gap={3}
    >
      <Image
        src={"/assets/EmptyState.png"}
        w={300}
        h={300}
        objectFit={"contain"}
      />

      <Text
        fontSize={"xl"}
        fontWeight={"bold"}
        textAlign={"center"}
        color={"gray.500"}
      >
        {title ?? "No data found"}
      </Text>

      <Text
        fontSize={"md"}
        fontWeight={"normal"}
        textAlign={"center"}
        color={"gray.500"}
      >
        {description ?? "Try again later"}
      </Text>

      {_button && (
        <Button variant={"primary"} onClick={_button.onClick}>
          {_button?.text}
        </Button>
      )}
    </VStack>
  );
};

export default EmptyList;
