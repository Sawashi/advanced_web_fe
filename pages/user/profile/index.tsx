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
  VStack,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import withAuth from "HOCs/withAuth";
import FormInput from "components/FormInput";
import UserLayout from "components/Layout/UserLayout";
import {
  EditProfileSchema,
  IEditProfileSchema,
} from "constants/validation/auth";
import { useStores } from "hooks/useStores";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";

function UserProfileEdit() {
  const { authStore } = useStores();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const methods = useForm({
    defaultValues: {
      firstName: authStore.user?.firstName,
      lastName: authStore.user?.lastName,
      dob: authStore.user?.dob,
    },
    resolver: yupResolver(EditProfileSchema),
    reValidateMode: "onChange",
    mode: "all",
  });
  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  useEffect(() => {
    if (authStore.user) {
      methods.reset({
        firstName: authStore.user?.firstName,
        lastName: authStore.user?.lastName,
        dob: authStore.user?.dob,
      });
    }
  }, [authStore.user]);

  const onSubmit = async (data: IEditProfileSchema) => {
    try {
      await authStore.editProfile(data);
      toast({
        status: "success",
        description: "Edit profile successfully",
      });
    } catch (error) {
      toast({
        status: "error",
        description: "Edit profile failed",
      });
    }
  };

  return (
    <UserLayout title="Profile">
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
          <FormProvider {...methods}>
            <Center>
              <Avatar
                size="2xl"
                name={`${authStore.user?.firstName} ${authStore.user?.lastName}`}
              />
            </Center>
            <Center>
              <Text fontSize="2xl">{`${authStore.user?.firstName} ${authStore.user?.lastName}`}</Text>
            </Center>
            <VStack spacing={8} w="100%">
              <FormInput
                name="firstName"
                label="First Name"
                isRequired={false}
              />
              <FormInput name="lastName" label="Last Name" isRequired={false} />
              <FormInput
                name="dob"
                label="Date of birth"
                isRequired={false}
                maxLength={10}
              />

              <Button
                bg={"blue.500"}
                color={"white"}
                w="full"
                isDisabled={!isValid}
                onClick={handleSubmit(onSubmit)}
                _hover={{
                  bg: "blue.600",
                }}
              >
                Submit
              </Button>
              <Button
                sx={{ width: "100%", margin: "2% 0" }}
                onClick={onOpen}
                variant={"link"}
              >
                Change password
              </Button>
            </VStack>
          </FormProvider>
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
    </UserLayout>
  );
}
export default withAuth(observer(UserProfileEdit));
