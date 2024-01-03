import {
  Avatar,
  Button,
  HStack,
  Image,
  Progress,
  Tooltip,
  VStack,
  Text,
} from "@chakra-ui/react";
import SvgIcon from "components/SvgIcon";
import { useStores } from "hooks/useStores";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import routes from "routes";
import { gray500 } from "theme/colors.theme";

export interface IHeaderProps {}

const Header = (props: IHeaderProps) => {
  const router = useRouter();
  const { authStore } = useStores();
  const { user } = authStore;

  const name =
    (authStore.user?.firstName ?? "") + " " + (authStore.user?.lastName ?? "");

  const onClickLogo = () => {
    router.push(routes.user.home.value);
  };

  const ButtonsActions = useCallback(() => {
    if (!user?.id) {
      return (
        <>
          <Button
            variant={"primary"}
            _hover={{
              bgColor: "gray.200",
            }}
            onClick={() => {
              router.push(routes.auth.login.value);
            }}
          >
            <Text>Log in</Text>
          </Button>

          <Button
            variant={"outline"}
            _hover={{
              bgColor: "gray.200",
            }}
            onClick={() => {
              router.push(routes.auth.register.value);
            }}
          >
            <Text>Sign up</Text>
          </Button>
        </>
      );
    }

    return (
      <Button
        variant={"primary"}
        _hover={{
          bgColor: "gray.200",
        }}
        onClick={() => {
          router.push(routes.user.home.value);
        }}
      >
        <Text>Go to my classes</Text>
      </Button>
    );
  }, [user]);

  useEffect(() => {
    try {
      authStore.fetchCurrentUser();
    } catch (error) {}
  }, []);

  return (
    <VStack w={"100%"} spacing={0} position={"relative"}>
      <HStack
        w={"100%"}
        h={62}
        alignItems={"center"}
        p={5}
        borderBottomWidth={1}
        borderBottomColor={"gray.300"}
      >
        <HStack w={"full"} alignItems={"center"} gap={5} flex={1}>
          <Image
            src="/assets/icons/logo.svg"
            alt="logo"
            objectFit={"contain"}
            w={10}
            onClick={onClickLogo}
            _hover={{
              cursor: "pointer",
            }}
          />
        </HStack>
        <HStack alignItems={"center"} gap={3}>
          <ButtonsActions />
        </HStack>
      </HStack>
    </VStack>
  );
};

export default observer(Header);
