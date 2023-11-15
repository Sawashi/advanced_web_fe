import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  Center,
  Box,
  Grid,
  GridItem,
  Text,
  AbsoluteCenter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import withAuth from "HOCs/withAuth";
import { useStores } from "hooks/useStores";
import { observer } from "mobx-react";

function UserProfileEdit() {
  const { authStore } = useStores();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <Flex minH={"100vh"} align={"center"} justify={"center"}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"60%"}
          bg={useColorModeValue("white", "gray.700")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile
          </Heading>
          <Grid templateColumns="repeat(4, 1fr)" gap={2}>
            <GridItem w="100%" colSpan={3}>
              <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                <GridItem w="100%">
                  <Box>
                    <FormControl id="firstName">
                      <FormLabel>First Name</FormLabel>
                      <Input type="text" />
                    </FormControl>
                  </Box>
                </GridItem>
                <GridItem w="100%">
                  <Box>
                    <FormControl id="lastName">
                      <FormLabel>Last Name</FormLabel>
                      <Input type="text" />
                    </FormControl>
                  </Box>
                </GridItem>
              </Grid>
              <HStack></HStack>
              <Box>
                <FormControl id="dob">
                  <FormLabel>Date of birth</FormLabel>
                  <Input type="date" />
                </FormControl>
              </Box>
              <Button sx={{ width: "100%", margin: "2% 0" }} onClick={onOpen}>
                Change password
              </Button>
              <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                <GridItem w="100%">
                  <Button
                    bg={"red.400"}
                    color={"white"}
                    w="full"
                    _hover={{
                      bg: "red.500",
                    }}
                  >
                    Cancel
                  </Button>
                </GridItem>
                <GridItem w="100%">
                  <Button
                    bg={"blue.400"}
                    color={"white"}
                    w="full"
                    _hover={{
                      bg: "blue.500",
                    }}
                  >
                    Submit
                  </Button>
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem w="100%" position={"relative"}>
              <AbsoluteCenter>
                <Center>
                  <Avatar
                    size="xl"
                    name={`${authStore.user?.firstName} ${authStore.user?.lastName}`}
                  />
                </Center>
                <Center sx={{ padding: "2%" }}>
                  <Text fontSize="2xl">{authStore.user?.firstName}</Text>
                </Center>
              </AbsoluteCenter>
            </GridItem>
          </Grid>
        </Stack>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Old password</FormLabel>
              <Input placeholder="Enter old password" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>New password</FormLabel>
              <Input placeholder="Enter new password" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Re-enter new password</FormLabel>
              <Input placeholder="Re-enter new password" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue">Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
export default withAuth(observer(UserProfileEdit));
