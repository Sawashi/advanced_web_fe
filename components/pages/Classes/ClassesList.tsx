import {
  Avatar,
  Button,
  Flex,
  HStack,
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
} from "@chakra-ui/react";
import { createClassToken } from "API/post/post.classes.manage-class";
import SvgIcon from "components/SvgIcon";
import { IClass } from "interfaces/classes";
import React from "react";
import { checkValidArray, getValidArray } from "utils/common";
import clipboardCopy from "clipboard-copy";
import routes from "routes";

export type ClassesListProps = {
  classes: IClass[];
  typeOfClass: string;
};
export type tokenProps = {
  token: string;
};

const ClassesList = ({ classes, typeOfClass }: ClassesListProps) => {
  const toast = useToast();

  const createJoinLink = async (classId: string, roleToJoin: string) => {
    try {
      const data = await createClassToken(classId, roleToJoin, "1d");
      const tokenCreated = JSON.stringify(data.data);
      const parsedToken: tokenProps = JSON.parse(tokenCreated);
      console.log(parsedToken?.token);

      if (parsedToken?.token) {
        clipboardCopy(
          window.location.origin +
            routes.user.join_class_via_token.value(parsedToken.token, classId)
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
  const renderClassItem = (item: IClass, index: number) => {
    return (
      <VStack
        key={`${item?.id}-${index}`}
        w="300px"
        h={"250px"}
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
          <HStack w={"full"} justifyContent={"space-between"}>
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
                  <SvgIcon iconName={"ic-threedot-vertical.svg"} size={20} />
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
                  onClick={() => createJoinLink(item?.id, "teacher")}
                >
                  Create link to join as teacher
                </Button>
                <Button
                  colorScheme="teal"
                  variant="solid"
                  onClick={() => createJoinLink(item?.id, "student")}
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
        </VStack>
      )}
    </HStack>
  );
};

export default ClassesList;
