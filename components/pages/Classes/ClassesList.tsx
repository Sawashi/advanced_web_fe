import {
  Avatar,
  Button,
  HStack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import SvgIcon from "components/SvgIcon";
import { IClass } from "interfaces/classes";
import React from "react";
import { checkValidArray, getValidArray } from "utils/common";
import CreateClassModal from "./CreateClassModal";

export type ClassesListProps = {
  classes: IClass[];
};

const ClassesList = ({ classes }: ClassesListProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
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
      alignItems={checkValidArray(classes) ? "start" : "center"}
      w={"full"}
      p={5}
      overflowX={"hidden"}
      overflowY={"auto"}
      spacing={5}
      columnGap={5}
      flexWrap={"wrap"}
      justifyContent={checkValidArray(classes) ? "start" : "center"}
    >
      {checkValidArray(classes) ? (
        getValidArray(classes)?.map(renderClassItem)
      ) : (
        <VStack>
          <SvgIcon iconName={"ic-empty.svg"} size={100} />
          <Text fontSize={25} fontWeight={600} textAlign={"center"}>
            No class found
          </Text>
          <Button onClick={onOpen}>Create a class</Button>
        </VStack>
      )}
      <CreateClassModal isVisible={isOpen} onClose={onClose} />
    </HStack>
  );
};

export default ClassesList;
