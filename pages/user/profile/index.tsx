import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  Box,
  Text,
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
import { changePassword, getCurrentUser } from "API/authenticate";
import { useRouter } from "next/router";
import routes from "routes";

function UserProfileEdit() {
  const { authStore } = useStores();
  const router = useRouter();
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
      await changePassword(oldPassword, newPassword);
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
          p={6}
          my={12}
        >
          <FormProvider {...methods}>
            <Avatar
              size="2xl"
              name={`${authStore.user?.firstName ?? ""} ${
                authStore.user?.lastName ?? ""
              }`}
              src={authStore.user?.avatar}
            />

            <Text
              fontSize="2xl"
              fontWeight="bold"
              color={useColorModeValue("gray.800", "white")}
            >{`${authStore.user?.firstName ?? ""} ${
              authStore.user?.lastName ?? ""
            }`}</Text>

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
                bg={"primary.500"}
                color={"white"}
                w="full"
                py={3}
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
                onClick={() => {
                  router.push(routes.user.profile.change_password.value);
                }}
                variant={"link"}
              >
                Change password?
              </Button>
            </VStack>
          </FormProvider>
        </Stack>
      </Flex>
    </UserLayout>
  );
}
export default withAuth(observer(UserProfileEdit));
