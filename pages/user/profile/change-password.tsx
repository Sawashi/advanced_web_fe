import { VStack, useToast, Heading, Button } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import withAuth from "HOCs/withAuth";
import UserLayout from "components/Layout/UserLayout";
import {
  ChangePasswordSchema,
  IChangePasswordSchema,
} from "constants/validation/auth";
import { useStores } from "hooks/useStores";
import { observer } from "mobx-react";
import { useForm, FormProvider } from "react-hook-form";
import { changePassword, getCurrentUser } from "API/authenticate";
import FormInput from "components/FormInput";

function ChangePassword() {
  const { authStore } = useStores();
  const toast = useToast();
  const methods = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
    resolver: yupResolver(ChangePasswordSchema),
    reValidateMode: "onChange",
    mode: "all",
  });
  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const handleSubmitModal = async (data: IChangePasswordSchema) => {
    await getCurrentUser();
    try {
      const res = await changePassword(data?.oldPassword, data?.newPassword);
      if (res) {
        toast({
          status: "success",
          description: "Changed password",
        });
        return;
      }
      toast({
        status: "error",
        description: "Change password failed",
      });
    } catch (error) {
      toast({
        status: "error",
        description: "Something went wrong",
      });
    }
  };

  return (
    <UserLayout title="Change Password">
      <FormProvider {...methods}>
        <VStack
          w="full"
          h="full"
          alignItems="flex-start"
          justifyContent="flex-start"
          spacing="4"
          p={5}
          gap={5}
        >
          <Heading>Change Password</Heading>
          <FormInput
            name="oldPassword"
            label="Old Password"
            type="password"
            placeholder="Old Password"
          />

          <FormInput
            name="newPassword"
            label="New Password"
            type="password"
            placeholder="New Password"
          />

          <Button
            variant="primary"
            onClick={handleSubmit(handleSubmitModal)}
            disabled={!isValid}
          >
            Submit
          </Button>
        </VStack>
      </FormProvider>
    </UserLayout>
  );
}
export default withAuth(observer(ChangePassword));
