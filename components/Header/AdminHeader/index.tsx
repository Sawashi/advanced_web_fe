import {
  Avatar,
  Button,
  HStack,
  Image,
  Progress,
  Tooltip,
  VStack,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import SvgIcon from "components/SvgIcon";
import { useStores } from "hooks/useStores";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React from "react";
import routes from "routes";
import { gray500 } from "theme/colors.theme";

export interface IAdminHeaderProps {
  onExpand?: () => void;
}

const AdminHeader = ({ onExpand }: IAdminHeaderProps) => {
  const router = useRouter();
  const { settingStore: spinnerStore, authStore } = useStores();
  const { isHeaderLoading } = spinnerStore;
  const name =
    (authStore.user?.firstName ?? "") + " " + (authStore.user?.lastName ?? "");

  const onClickLogo = () => {
    router.push(routes.user.home.value);
  };

  const onExpandSidebar = () => {
    onExpand?.();
  };

  return (
    <VStack w={"100%"} spacing={0} position={"relative"}>
      <HStack
        w={"100%"}
        alignItems={"center"}
        p={5}
        borderBottomWidth={1}
        borderBottomColor={"gray.300"}
      >
        <HStack w={"full"} alignItems={"center"} gap={5} flex={1}>
          <SvgIcon
            iconName={"ic-menu.svg"}
            size={30}
            onClick={onExpandSidebar}
            color={gray500}
          />
          <Image
            src="/assets/icons/logo.svg"
            alt="logo"
            objectFit={"contain"}
            w={10}
            onClick={onClickLogo}
            _hover={{ cursor: "pointer" }}
          />
        </HStack>
        <HStack alignItems={"center"} gap={3}>
          <Tooltip
            label={
              <VStack
                gap={0.5}
                alignItems={"flex-start"}
                justifyContent={"center"}
                w={"full"}
                borderRadius={5}
              >
                <Text fontWeight={"bold"}>{name}</Text>
                <Text>{authStore?.user?.email}</Text>
              </VStack>
            }
            aria-label="A tooltip"
            hasArrow
          >
            <Avatar
              _hover={{
                cursor: "pointer",
              }}
              size={"md"}
              src={authStore.user?.avatar}
              name={name}
              onClick={() => {
                router.push(routes.user.profile.value);
              }}
            />
          </Tooltip>
        </HStack>
      </HStack>
      {isHeaderLoading ? (
        <Progress
          size="xs"
          isIndeterminate={true}
          colorScheme="primary"
          w={"full"}
          position={"absolute"}
          border={0}
        />
      ) : null}
    </VStack>
  );
};

export default observer(AdminHeader);
