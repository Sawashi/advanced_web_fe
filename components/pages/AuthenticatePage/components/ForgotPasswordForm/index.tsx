import {
  HStack,
  Stack,
  useToast,
  Text,
  Link,
  chakra,
  AlertIcon,
  Alert,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import PasswordField from "components/PasswordField";
import { SubmitButton } from "../../authenticatePage.styles";
import {
  IForgotPasswordSchema,
  IRegisterSchema,
  RegisterSchema,
  ForgotPasswordSchema,
} from "constants/validation/auth";
import { forgotPassword } from "API/authenticate";
import routes from "routes";
import FormInput from "components/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { set } from "lodash";

const ForgotPasswordForm = () => {
  const [showMessage, setShowMessage] = React.useState(false);
  const method = useForm<IForgotPasswordSchema>({
    mode: "all",
    reValidateMode: "onChange",
    resolver: yupResolver(ForgotPasswordSchema),
  });
  const toast = useToast();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = method;
  const router = useRouter();
  const showError = (error?: string): void => {
    toast({
      status: "error",
      description: error || "Something went wrong",
    });
    setShowMessage(false);
  };

  const showSuccess = (message?: string): void => {
    toast({
      status: "success",
      description: message || "Successfully",
    });
    setShowMessage(true);
  };

  async function onSubmit(data: IForgotPasswordSchema): Promise<void> {
    try {
      const res = await forgotPassword(data);
      if (res) {
        showSuccess("Successfully");
      }
    } catch (error) {
      showError("Failed to send mail for retrieve password");
    }
  }

  return (
    <FormProvider {...method}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="6">
          <FormInput
            name="email"
            label="Email address"
            placeholder="Your email"
            type="email"
            isRequired={true}
          />
          {showMessage ? (
            <>
              <Alert status="success">
                <AlertIcon />
                Request completed, check your email!
              </Alert>
            </>
          ) : (
            <></>
          )}
          <SubmitButton type="submit" isLoading={isSubmitting}>
            Submit
          </SubmitButton>
          <Button
            variant="solid"
            onClick={() => {
              router.push(routes.auth.login.value);
            }}
          >
            Back to login
          </Button>
        </Stack>
      </form>
    </FormProvider>
  );
};

export default ForgotPasswordForm;
