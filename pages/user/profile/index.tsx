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
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { PASSWORD_PATTERN } from "constants/common";
import { changePassword, getCurrentUser, refreshToken } from "API/authenticate";

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

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isOldPasswordValid, setIsOldPasswordValid] = useState(true);
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(true);

  const handleOldPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputOldPassword = event.target.value;
    setOldPassword(inputOldPassword);
    const isOldPasswordValid = PASSWORD_PATTERN.test(inputOldPassword);
    setIsOldPasswordValid(isOldPasswordValid);
  };

  const handleNewPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputNewPassword = event.target.value;
    setNewPassword(inputNewPassword);
    const isNewPasswordValid = PASSWORD_PATTERN.test(inputNewPassword);
    setIsNewPasswordValid(isNewPasswordValid);
  };

  const handleSubmitModal = async () => {
    await getCurrentUser();
    try {
      await changePassword(oldPassword, newPassword, authStore.accessToken);
      toast({
        status: "success",
        description: "Changed password",
      });
    } catch (error) {
      toast({
        status: "error",
        description: "Change password failed",
      });
    }
  };

  return (
    <UserLayout title="Profile">
      <Flex align={"center"} justify={"center"}>
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
                name={`${authStore.user?.firstName ?? ""} ${
                  authStore.user?.lastName ?? ""
                }`}
                src={authStore.user?.avatar}
              />
            </Center>
            <Center>
              <Text fontSize="2xl">{`${authStore.user?.firstName ?? ""} ${
                authStore.user?.lastName ?? ""
              }`}</Text>
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
            <Box
              maxW="md"
              mx="auto"
              mt={8}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
            >
              <FormControl isInvalid={!isOldPasswordValid}>
                <FormLabel>Old Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter your old password"
                  value={oldPassword}
                  onChange={handleOldPasswordChange}
                />
              </FormControl>

              <FormControl mt={4} isInvalid={!isNewPasswordValid}>
                <FormLabel>New Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                />
                {!isNewPasswordValid && (
                  <Text color="red.500" fontSize="sm" mt={2}>
                    Password must have at least one lowercase letter, one
                    uppercase letter, one digit, and one special character.
                    Minimum length is 8 characters.
                  </Text>
                )}
              </FormControl>

              <Button
                colorScheme="teal"
                mt={4}
                onClick={handleSubmitModal}
                isDisabled={!isNewPasswordValid || !isOldPasswordValid}
              >
                Change Password
              </Button>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Got it!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </UserLayout>
  );
}
export default withAuth(observer(UserProfileEdit));
