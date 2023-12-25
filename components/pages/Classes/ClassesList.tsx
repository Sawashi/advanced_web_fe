import {
  Avatar,
  Button,
  Flex,
  HStack,
  Spinner,
  Center,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useClipboard,
  useDisclosure,
  useToast,
  Box,
} from "@chakra-ui/react";
import { createClassToken } from "API/post/post.classes.manage-class";
import SvgIcon from "components/SvgIcon";
import { IClass } from "interfaces/classes";
import { useRouter } from "next/router";
import React from "react";
import { checkValidArray, getValidArray } from "utils/common";
import clipboardCopy from "clipboard-copy";
import routes from "routes";

export type ClassesListProps = {
  classes: IClass[];
  typeOfClass: string;
  isLoading?: boolean;
};
export type tokenProps = {
  token: string;
};

export interface IClassCardProps {
  item: IClass;
  typeOfClass: string;
}

const ClassCard = ({ item, typeOfClass }: IClassCardProps) => {
  const router = useRouter();
  const toast = useToast();

  const createJoinLink = async (classId: string, roleToJoin: string) => {
    try {
      const modifiedClassId: string = classId.substring(1, classId.length - 1);
      console.log(modifiedClassId, roleToJoin);
      const data = await createClassToken(modifiedClassId, roleToJoin, "1d");
      const tokenCreated = JSON.stringify(data.data);
      const parsedToken: tokenProps = JSON.parse(tokenCreated);
      console.log(parsedToken?.token);

      if (parsedToken?.token) {
        clipboardCopy(
          window.location.origin +
            routes.user.join_class_via_token.value(
              parsedToken.token,
              modifiedClassId
            )
        );
        toast({
          status: "success",
          description: "Successfully copied to clipboard",
        });
      } else {
        toast({
          status: "error",
          description: "Something went wrong",
        });
      }
    } catch (error) {
      console.error("Error creating join link:", error);
      toast({
        status: "error",
        description: "Error creating join link",
      });
    }
  };
  const {
    isOpen: isOpenCreateLink,
    onClose: onCloseCreateLink,
    onOpen: onOpenCreateLink,
  } = useDisclosure();
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
        onClick={() => {
          router.push(routes.classes.details.value(item?.id ?? ""));
        }}
      >
        <HStack w={"full"} justifyContent={"space-between"} zIndex={10}>
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
        </HStack>
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
      <HStack w="100%" h={"40px"} justifyContent="flex-start">
        <Box>
          <Menu>
            <MenuButton aria-label="Options">
              <Button
                as={"div"}
                variant={"ghost"}
                borderRadius={"full"}
                _hover={{
                  bgColor: "gray.200",
                }}
              >
                <SvgIcon iconName={"ic-threedot-horizontal.svg"} size={20} />
              </Button>
            </MenuButton>
            <MenuList bgColor={"white.100"}>
              {typeOfClass === "Teaching" || typeOfClass === "Owned" ? (
                <>
                  <MenuItem onClick={() => onOpenCreateLink()}>
                    Create link
                  </MenuItem>
                  <MenuItem>Invite</MenuItem>
                  <MenuItem>
                    <Text color={"tomato"}>Delete</Text>
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem>Properties</MenuItem>
                  <MenuItem>
                    <Text color={"tomato"}>Leave</Text>
                  </MenuItem>
                </>
              )}
            </MenuList>
          </Menu>
        </Box>
      </HStack>

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
      <Modal isOpen={isOpenCreateLink} onClose={onCloseCreateLink}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create link for joining class</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" gap={2}>
              <Button
                colorScheme="teal"
                variant="solid"
                onClick={() =>
                  createJoinLink(JSON.stringify(item?.id), "teacher")
                }
              >
                Create link to join as teacher
              </Button>
              <Button
                colorScheme="teal"
                variant="solid"
                onClick={() =>
                  createJoinLink(JSON.stringify(item?.id), "student")
                }
              >
                Create link to join as student
              </Button>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCloseCreateLink}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

const ClassesList = ({
  classes,
  isLoading = false,
  typeOfClass,
}: ClassesListProps) => {
  const renderClassItem = (item: IClass, index: number) => (
    <ClassCard item={item} typeOfClass={typeOfClass} />
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
