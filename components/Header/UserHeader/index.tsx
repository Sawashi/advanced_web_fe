import { Box, HStack, Image } from "@chakra-ui/react";
import SvgIcon from "components/SvgIcon";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React from "react";
import routes from "routes";
import { gray500 } from "theme/colors.theme";

export interface IUserHeaderProps {
  onExpand?: () => void;
}

const UserHeader = ({ onExpand }: IUserHeaderProps) => {
  const router = useRouter();

  const onClickLogo = () => {
    router.push(routes.user.home.value);
  };

  const onExpandSidebar = () => {
    onExpand?.();
  };

  return (
    <HStack
      w={"100%"}
      h={62}
      alignItems={"center"}
      p={5}
      borderBottomWidth={1}
      borderBottomColor={"gray.300"}
      spacing={5}
    >
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
      <HStack></HStack>
    </HStack>
  );
};

export default observer(UserHeader);
