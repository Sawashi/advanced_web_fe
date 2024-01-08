import { Button, Heading, VStack, useToast } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { changePassword } from "API/post/post.auth.change-password";
import withAuth from "HOCs/withAuth";
import FormInput from "components/FormInput";
import AdminLayout from "components/Layout/AdminLayout";
import {
  ChangePasswordSchema,
  IChangePasswordSchema,
} from "constants/validation/auth";
import { observer } from "mobx-react";
import { FormProvider, useForm } from "react-hook-form";

function ChangePassword() {
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
    <AdminLayout title="Change Password">
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
    </AdminLayout>
  );
}
export default withAuth(observer(ChangePassword));
