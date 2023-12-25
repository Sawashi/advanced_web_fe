import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  ModalFooter,
  useToast,
} from "@chakra-ui/react";
import { createClassToken } from "API/post/post.classes.manage-class";
import clipboardCopy from "clipboard-copy";
import SvgIcon from "components/SvgIcon";
import { useRouter } from "next/router";
import routes from "routes";
export type tokenProps = {
  token: string;
};
export type MenuClassProps = {
  typeOfClass: string;
  classId: string;
};
const MenuClass = ({ typeOfClass, classId }: MenuClassProps) => {
  const toast = useToast();
  const createJoinLink = async (classId: string, roleToJoin: string) => {
    try {
      const modifiedClassId: string = classId.substring(1, classId.length - 1);
      const data = await createClassToken(modifiedClassId, roleToJoin, "1d");
      const tokenCreated = JSON.stringify(data.data);
      const parsedToken: tokenProps = JSON.parse(tokenCreated);
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
    <>
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
                onClick={() => createJoinLink(classId, "teacher")}
              >
                Create link to join as teacher
              </Button>
              <Button
                colorScheme="teal"
                variant="solid"
                onClick={() => createJoinLink(classId, "student")}
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
    </>
  );
};
export default MenuClass;
