import {
  Button,
  Divider,
  HStack,
  Icon,
  Link,
  Stack,
  Text,
  chakra,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "components/FormInput";
import PasswordField from "components/PasswordField";
import {
  loginFailedDescription,
  loginSuccessDescription,
} from "constants/messages/auth.messages";
import { ILoginSchema, LoginSchema } from "constants/validation/auth";
import { useStores } from "hooks/useStores";
import routes from "routes";
import { SubmitButton } from "../../authenticatePage.styles";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { AuthenticateParams, ELoginSocial } from "enums/auth";
const LoginForm = () => {
  // @ts-ignore
  const method = useForm<ILoginSchema>({
    resolver: yupResolver(LoginSchema),
  });

  const { authStore, cookiesStore } = useStores();
  const { isLoading, getSSOError, setSSOError } = authStore;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [timeResendActivation, setTimeResendActivation] = React.useState(0);
  const toast = useToast();
  const router = useRouter();

  const {
    handleSubmit,
    formState: { isSubmitting },
    getValues,
  } = method;

  useEffect(() => {
    if (authStore.user && authStore.user.id) {
      if (authStore.user.role === "user") {
        router.push(routes.user.home.value);
      } else {
        router.push(routes.admin.manageAccounts.value);
      }
    }
  }, [authStore.user]);

  async function onSubmit(data: ILoginSchema): Promise<void> {
    try {
      const { email, password } = data;
      await authStore.login({ email, password });
      toast({
        status: "success",
        description: loginSuccessDescription,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error?.message === "AccountPendingActivation") {
          onOpen();
        } else {
          toast({
            status: "error",
            description: loginFailedDescription,
          });
        }
      }
    }
  }

  const onResendActivation = async () => {
    if (timeResendActivation === 0) {
      const email = getValues()?.email;
      await authStore?.resendActivationEmail(email);
      toast({
        status: "success",
        description:
          "Verification email sent successfully. Please check your email.",
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

  const redirectToSSO = async (type: ELoginSocial) => {
    const url = `${process.env.API_URL}/auth/login/${type}`;
    let timer: NodeJS.Timeout;

    const w = 500;
    const h = 600;
    const left = screen.width / 2 - w / 2;
    const top = screen.height / 2 - h / 2;
    const newWindow = window.open(
      url,
      "_blank",
      `width=${w},height=${h},top=${top},left=${left}`
    );
    if (newWindow) {
      timer = setInterval(() => {
        const errorSSO = getSSOError();
        if (errorSSO) {
          setSSOError("");
          clearInterval(timer);
        } else {
          const aToken = cookiesStore.getItem(AuthenticateParams.ACCESS_TOKEN);

          if (aToken) {
            authStore.fetchCurrentUser();
            clearInterval(timer);
          }
        }
      }, 500);
    }
  };

  return (
    <FormProvider {...method}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="4">
          <FormInput
            name="email"
            label="Email address"
            placeholder="Your email"
            type="email"
          />
          <PasswordField
            name="password"
            label="Password"
            placeholder="Your password"
          />
          <HStack>
            <Text width="full" align="right" fontSize="sm">
              <Link
                href={`${routes.auth.forgotPassword.value}`}
                color="blue.600"
              >
                Forgot Password?
              </Link>
            </Text>
          </HStack>
          <SubmitButton type="submit" isLoading={isSubmitting || isLoading}>
            Log in
          </SubmitButton>
          <HStack>
            <Divider />
            <Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
              or continue with
            </Text>
            <Divider />
          </HStack>
          <HStack spacing={2}>
            <Button
              flex="1"
              leftIcon={<Icon as={FaGoogle} />}
              colorScheme="red"
              variant="solid"
              onClick={() => redirectToSSO(ELoginSocial.GOOGLE)}
            >
              Google
            </Button>
            <Button
              flex="1"
              leftIcon={<Icon as={FaFacebook} />}
              colorScheme="facebook"
              variant="solid"
              onClick={() => redirectToSSO(ELoginSocial.FACEBOOK)}
            >
              Facebook
            </Button>
          </HStack>
          <Text width="full" align="center" textAlign="center" fontSize="sm">
            Not a member?{" "}
            <Link href={`${routes.auth.register.value}`} color="black.600">
              <chakra.span color="blue.500">Sign up now</chakra.span>
            </Link>
          </Text>
        </Stack>
      </form>

      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pending Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Your account is pending activation. Please check your email to
              activate your account.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onResendActivation}>
              Resend Activation{" "}
              {timeResendActivation > 0 && `(${timeResendActivation})`}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FormProvider>
  );
};

export default observer(LoginForm);
