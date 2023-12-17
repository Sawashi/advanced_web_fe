import { Avatar, HStack, Text, VStack } from "@chakra-ui/react";
import { IClass } from "interfaces/classes";
import React from "react";
import { getValidArray } from "utils/common";

export type ClassesListProps = {
  classes: IClass[];
};

const ClassesList = ({ classes }: ClassesListProps) => {
  const renderClassItem = (item: IClass, index: number) => {
    return (
      <VStack
        key={`${item?.id}-${index}`}
        w="300px"
        h={"200px"}
        borderRadius={10}
        borderWidth={1}
        borderColor={"gray.300"}
        overflowX={"hidden"}
        _hover={{
          cursor: "pointer",
          boxShadow: "md",
          borderColor: "green.500",
        }}
        position={"relative"}
      >
        <VStack
          w={"full"}
          flex={1}
          bgSize={"cover"}
          bgPosition="center"
          bgRepeat={"no-repeat"}
          backgroundImage={
            "https://www.gstatic.com/classroom/themes/img_bookclub.jpg"
          }
          alignItems={"start"}
          p={5}
          flexShrink={1}
        >
          <Text
            color="white"
            fontWeight={"600"}
            fontSize={"20px"}
            flexWrap={"wrap"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
            whiteSpace={"nowrap"}
            w={"full"}
          >
            {item?.name}
          </Text>
          <Text
            color="white"
            fontSize={"medium"}
            flexWrap={"wrap"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
            whiteSpace={"nowrap"}
            w={"full"}
          >
            {item?.description}
          </Text>

          <Text
            color="white"
            fontSize={"small"}
            flexWrap={"wrap"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
            whiteSpace={"nowrap"}
            w={"full"}
          >
            {item?.owner?.firstName + " " + item?.owner?.lastName}
          </Text>
        </VStack>

        <HStack h={"40px"}></HStack>

        <Avatar
          position={"absolute"}
          rounded={"full"}
          bottom={"20px"}
          size={"lg"}
          right={"20px"}
          bgColor={"primary.300"}
          src={item?.owner?.avatar}
          name={item?.owner?.firstName + " " + item?.owner?.lastName}
        />
      </VStack>
    );
  };

  return (
    <HStack
      alignItems={"start"}
      w={"full"}
      p={5}
      overflowX={"hidden"}
      overflowY={"auto"}
      spacing={5}
      columnGap={5}
      flexWrap={"wrap"}
      justifyContent={"start"}
    >
      {getValidArray([...classes])?.map(renderClassItem)}
    </HStack>
  );
};

export default ClassesList;
