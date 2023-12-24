import {
  HStack,
  Stack,
  useToast,
  Text,
  Link,
  chakra,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import PasswordField from "components/PasswordField";
import { SubmitButton } from "../../authenticatePage.styles";
import { IRegisterSchema, RegisterSchema } from "constants/validation/auth";
import { signUp } from "API/post/post.auth.sign-up";
import routes from "routes";
import FormInput from "components/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useStores } from "hooks/useStores";
import { set } from "lodash";

const RegisterForm = () => {
  const [timeResendActivation, setTimeResendActivation] = React.useState(0);
  const { authStore, cookiesStore } = useStores();
  const [resendMail, setResendMail] = React.useState("");
  const [showResendActivation, setShowResendActivation] = useState(false);
  const method = useForm<IRegisterSchema>({
    mode: "all",
    reValidateMode: "onChange",
    resolver: yupResolver(RegisterSchema),
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
  };

  const showSuccess = (message?: string): void => {
    toast({
      status: "success",
      description: message || "Successfully",
    });
  };

  async function onSubmit(data: IRegisterSchema): Promise<void> {
    try {
      const res = await signUp(data);
      setResendMail(data.email);
      setShowResendActivation(true);
      if (res) {
        showSuccess("Successfully. Please check your email.");
      }
    } catch (error) {
      showError("Register failed, try again");
    }
  }

  const onResendActivation = async () => {
    if (timeResendActivation === 0) {
      const email = resendMail;
      await authStore?.resendActivationEmail(email);
      toast({
        status: "success",
        description: "Verification email sent successfully, check your email.",
      });
      setTimeResendActivation(60);
      const interval = setInterval(() => {
        setTimeResendActivation((prev) => prev - 1);
      }, 1000);
      setTimeout(() => {
        clearInterval(interval);
      }, 60000);
    }
  };

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
          <PasswordField
            name="password"
            label="Your Password"
            placeholder="Your Password"
          />
          <FormInput
            name="dob"
            label="Date of birth"
            placeholder="YYYY-MM-DD"
            isRequired={false}
            maxLength={10}
          />
          <FormInput
            name="firstName"
            label="First name"
            placeholder="Your first name"
          />
          <FormInput
            name="lastName"
            label="Last name"
            placeholder="Your last name"
          />

          <HStack>
            <Text width="full" align="center" fontSize="sm">
              Already a member?{" "}
              <Link href={`${routes.auth.login.value}`} color="black.600">
                <chakra.span color="blue.500">Sign in now</chakra.span>
              </Link>
            </Text>
          </HStack>
          <SubmitButton type="submit" isLoading={isSubmitting}>
            Submit
          </SubmitButton>
          {showResendActivation ? (
            <>
              <Button colorScheme="blue" onClick={onResendActivation}>
                Resend Activation{" "}
                {timeResendActivation > 0 && `(${timeResendActivation})`}
              </Button>
            </>
          ) : (
            <></>
          )}
        </Stack>
      </form>
    </FormProvider>
  );
};

export default RegisterForm;
