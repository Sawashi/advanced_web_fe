import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import Icon from "components/Icon";
import LoginForm from "./components/LoginForm";
import ResetPasswordForm from "./components/ResetPasswordForm";
import SetPasswordForm from "./components/SetPasswordForm";
import {
  EAuthenticatePageGuide,
  EAuthenticatePageName,
  EAuthenticatePageTitle,
  EAuthenticatePageType,
} from "./constant";

export interface ILoginProps {
  type?: EAuthenticatePageType;
  setNamePage?: (name: EAuthenticatePageName) => void;
}

const AuthenticatePage = (props: ILoginProps) => {
  const { type, setNamePage } = props;
  const [pageType] = useState<EAuthenticatePageType | undefined>(type);
  const isOverflow: boolean = useMediaQuery({ maxHeight: 810 });

  function getTitle(): string {
    switch (pageType) {
      case EAuthenticatePageType.SET_PASSWORD:
        setNamePage?.(EAuthenticatePageName.SET_PASSWORD);
        return EAuthenticatePageTitle.SET_PASSWORD;
      case EAuthenticatePageType.RESET_PASSWORD:
        setNamePage?.(EAuthenticatePageName.RESET_PASSWORD);
        return EAuthenticatePageTitle.RESET_PASSWORD;
      case EAuthenticatePageType.LOGIN:
        setNamePage?.(EAuthenticatePageName.LOGIN);
        return EAuthenticatePageTitle.LOGIN;
      default:
        setNamePage?.(EAuthenticatePageName.LOGIN);
        return EAuthenticatePageTitle.LOGIN;
    }
  }

  function getDescription(): string {
    switch (pageType) {
      case EAuthenticatePageType.SET_PASSWORD:
        return EAuthenticatePageGuide.SET_PASSWORD;
      case EAuthenticatePageType.RESET_PASSWORD:
        return EAuthenticatePageGuide.RESET_PASSWORD;
      case EAuthenticatePageType.LOGIN:
        return EAuthenticatePageGuide.LOGIN;
      default:
        return EAuthenticatePageGuide.LOGIN;
    }
  }

  return (
    <Box minHeight={isOverflow ? "810px" : "100vh"}>
      <Box width="full" maxWidth="xl" marginX="auto" paddingY="188px">
        <Box maxWidth="416px" marginX={{ base: 8, md: "auto" }}>
          <Icon
            iconName="logo.svg"
            width={140}
            height={55}
            
          />
          <VStack marginBottom={12} width="full" alignItems="flex-start">
            <Heading
              fontSize="24px"
              marginBottom={2}
              marginTop={14}
              fontWeight="bold"
              color="gray.900"
              lineHeight="26px"
            >
              {getTitle()}
            </Heading>
            <Text fontSize="md" color="gray.700">
              {getDescription()}
            </Text>
          </VStack>
          {pageType === EAuthenticatePageType.SET_PASSWORD && (
            <SetPasswordForm />
          )}
          {pageType === EAuthenticatePageType.RESET_PASSWORD && (
            <ResetPasswordForm />
          )}
          {pageType === EAuthenticatePageType.LOGIN && <LoginForm />}
        </Box>
      </Box>
    </Box>
  );
};

export default AuthenticatePage;
