import { HStack, Stack, useToast, Text, Link } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import PasswordField from "components/PasswordField";
import { SubmitButton } from "../../authenticatePage.styles";
import { IRegisterSchema, RegisterSchema } from "constants/validation/auth";
import { signUp } from "API/authenticate";
import routes from "routes";
import FormInput from "components/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";

const RegisterForm = () => {
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
      if (res) {
        showSuccess("Successfully");
        router.push(routes.auth.login.value);
      }
    } catch (error) {
      showError("Register failed");
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
              <Link href={`${routes.auth.login.value}`} color="black.600">
                Already a member? Sign in now
              </Link>
            </Text>
          </HStack>

          <SubmitButton type="submit" isLoading={isSubmitting}>
            Submit
          </SubmitButton>
        </Stack>
      </form>
    </FormProvider>
  );
};

export default RegisterForm;
