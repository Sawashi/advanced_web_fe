import {
  Button,
  Collapse,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import SvgIcon from "components/SvgIcon";
import { IReview } from "interfaces/classes";
import React from "react";
import { useState } from "react";
import { primary500 } from "theme/colors.theme";

type Props = {
  review: IReview;
};

const Comments = (review: Props) => {
  const [isShowComments, setIsShowComments] = useState(false);
  const commentInputRef = React.useRef<HTMLInputElement>(null);

  const handleShowComments = (value: string) => {
    console.log(value);
    commentInputRef.current!.value = "";
  };

  return (
    <VStack w={"full"} alignItems={"start"} gap={5}>
      <VStack w={"full"} alignItems={"start"}>
        <HStack w={"full"} justifyContent={"space-between"}>
          <Text fontSize={"md"} fontWeight={"bold"}>
            Comments
          </Text>

          <HStack
            alignItems={"center"}
            gap={3}
            onClick={() => {
              setIsShowComments(!isShowComments);
            }}
            _hover={{
              cursor: "pointer",
            }}
          >
            <SvgIcon iconName="ic-chat.svg" size={20} color={primary500} />
            <Text fontSize={"sm"} fontWeight={"bold"}>
              0
            </Text>
          </HStack>
        </HStack>
        <Collapse in={isShowComments}></Collapse>
      </VStack>
      <HStack w={"full"}>
        <Input
          ref={commentInputRef}
          placeholder="Add a comment"
          h={50}
          outline={"none"}
          flex={1}
          w={"full"}
          borderRadius={12}
          borderWidth={1}
          borderColor={"gray.300"}
          _focus={{
            borderColor: "gray.500",
          }}
          _hover={{
            borderColor: "gray.500",
          }}
          fontSize={"sm"}
          enterKeyHint={"send"}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (commentInputRef.current?.value) {
                handleShowComments(commentInputRef.current?.value);
              }
            }
          }}
        />
        <Button
          rounded={"ghost"}
          borderWidth={0}
          borderRadius={12}
          colorScheme={"primary"}
          p={0}
          onClick={() => {
            if (commentInputRef.current?.value) {
              handleShowComments(commentInputRef.current?.value);
            }
          }}
        >
          <SvgIcon iconName="ic-send.svg" size={20} color={primary500} />
        </Button>
      </HStack>
    </VStack>
  );
};

export default Comments;
