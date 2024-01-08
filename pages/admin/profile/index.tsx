import {
  Button,
  Flex,
  Stack,
  Text,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUpdateAvatar } from "API/post/post.user.avatar";
import withAuth from "HOCs/withAuth";
import AvatarUpload from "components/AvatarUpload";
import FormInput from "components/FormInput";
import AdminLayout from "components/Layout/AdminLayout";
import {
  EditProfileSchema,
  IEditProfileSchema,
} from "constants/validation/auth";
import { useStores } from "hooks/useStores";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import routes from "routes";

function UserProfileEdit() {
  const { authStore } = useStores();
  const {
    mutateAsync: updateAvatar,
    isSuccess: isUpdatedAvatar,
    isError,
  } = useUpdateAvatar();
  const router = useRouter();
  const toast = useToast();
  const methods = useForm({
    defaultValues: {
      firstName: authStore.user?.firstName,
      lastName: authStore.user?.lastName,
      dob: authStore.user?.dob,
      avatar: authStore.user?.avatar,
    },
    resolver: yupResolver(EditProfileSchema),
    reValidateMode: "onChange",
    mode: "all",
  });
  const {
    handleSubmit,
    setError,
    formState: { isValid },
  } = methods;

  const onSubmit = async (data: IEditProfileSchema) => {
    try {
      await authStore.editProfile(data);
      toast({
        status: "success",
        description: "Edit profile successfully",
      });
      await authStore.fetchCurrentUser();
    } catch (error) {
      toast({
        status: "error",
        description: "Edit profile failed",
      });
    }
  };

  const handleUploadFile = async (file: File) => {
    if (file) {
      if (
        file.size > 5 * 1024 * 1024 ||
        !["image/png", "image/jpg", "image/jpeg"].includes(file.type)
      ) {
        setError("avatar", {
          type: "manual",
          message: "File size must be less than 5MB and file type is image",
        });
      } else {
        setError("avatar", { type: "", message: "" });
        await updateAvatar({
          avatar: file,
        });
        await authStore?.fetchCurrentUser();
      }
    }
  };

  useEffect(() => {
    if (authStore.user) {
      methods.reset({
        firstName: authStore.user?.firstName,
        lastName: authStore.user?.lastName,
        dob: authStore.user?.dob,
      });
    }
  }, [authStore.user]);

  useEffect(() => {
    if (isUpdatedAvatar) {
      toast({
        status: "success",
        description: "Update avatar successfully",
      });
    }
    if (isError) {
      toast({
        status: "error",
        description: "Update avatar failed",
      });
    }
  }, [isUpdatedAvatar, isError]);

  return (
    <AdminLayout title="Profile">
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
            <AvatarUpload
              src={authStore.user?.avatar ?? ""}
              handleUploadFile={handleUploadFile}
              error={methods?.formState?.errors?.avatar?.message}
            />

            <Text
              fontSize="2xl"
              fontWeight="bold"
              color={useColorModeValue("gray.800", "white")}
            >{`${authStore.user?.firstName ?? ""} ${
              authStore.user?.lastName ?? ""
            }`}</Text>

            <Text
              mt={-4}
              fontSize="md"
              color={useColorModeValue("gray.800", "gray.200")}
            >
              {authStore.user?.email ?? ""}
            </Text>

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
    </AdminLayout>
  );
}
export default withAuth(observer(UserProfileEdit));
