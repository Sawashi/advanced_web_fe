import {
  Avatar,
  Button,
  Center,
  HStack,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import SvgIcon from "components/SvgIcon";
import { IClass } from "interfaces/classes";
import { useRouter } from "next/router";
import React from "react";
import routes from "routes";
import { checkValidArray, getValidArray } from "utils/common";

export type ClassesListProps = {
  classes: IClass[];
  isLoading?: boolean;
};

export interface IClassCardProps {
  item: IClass;
}

const ClassCard = ({ item }: IClassCardProps) => {
  const router = useRouter();
  return (
    <VStack
      key={`${item?.id}`}
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
      onClick={() => {
        router.push(routes.classes.details.value(item?.id ?? ""));
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

      {/* Footer */}
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

const ClassesList = ({ classes, isLoading = false }: ClassesListProps) => {
  const renderClassItem = (item: IClass, index: number) => (
    <ClassCard item={item} />
  );

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
      {isLoading ? (
        <Center mt={20} w={"full"}>
          <Spinner boxSize={30} />
        </Center>
      ) : (
        <>
          {checkValidArray(classes) ? (
            getValidArray(classes)?.map(renderClassItem)
          ) : (
            <VStack>
              <SvgIcon iconName={"ic-empty.svg"} size={100} fill="gray.300" />
              <Text fontSize={25} fontWeight={600} textAlign={"center"}>
                No class found
              </Text>
            </VStack>
          )}
        </>
      )}
    </HStack>
  );
};

export default ClassesList;
