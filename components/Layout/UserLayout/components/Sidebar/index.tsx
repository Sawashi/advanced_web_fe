import { Flex, Stack, VStack, Divider } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { forwardRef, useImperativeHandle } from "react";
import { EZIndexLayer } from "enums/theme";
import { useStores } from "hooks/useStores";
import routes from "routes";
import NavLink, { INavLinkProps } from "../NavLink";
import { EUserPageName } from "constants/pages/common";

export interface ISidebarRefProps {
  onExpand: () => void;
}

interface ISidebarProps {}
const SideBar = forwardRef<ISidebarRefProps, ISidebarProps>((_, ref) => {
  const router = useRouter();
  const { authStore } = useStores();
  const { user } = authStore;
  const [isExpanded, setIsExpanded] = React.useState(true);

  function getLinkProps(
    href: string,
    iconName: string
  ): Omit<INavLinkProps, "label"> {
    const isActive = router.asPath.includes(href);
    return {
      isActive,
      href,
      icon: `${iconName}.svg`,
      isExpanded,
    };
  }

  useImperativeHandle(ref, () => ({
    onExpand: () => {
      setIsExpanded(!isExpanded);
    },
  }));

  return (
    <Flex
      minWidth="24px"
      width={"fit-content"}
      display="flex"
      justifyContent="space-between"
      flexDirection="column"
      color="white"
      zIndex={EZIndexLayer.NAV}
      borderRightWidth={1}
      borderRightColor={"gray.300"}
    >
      <VStack
        display="flex"
        height="full"
        overflowX="hidden"
        overflowY="auto"
        paddingX={2}
        justifyContent={"space-between"}
        divider={<Divider h={0.5} bgColor={"gray.400"} />}
        py={3}
      >
        <Stack
          spacing={2}
          marginX={3}
          width="full"
          flex={1}
          divider={<Divider h={0.4} bgColor={"gray.400"} />}
        >
          <NavLink
            label={EUserPageName.ENROLLED}
            {...getLinkProps(routes.user.enrolled_classes.value, "ic-enrolled")}
          />

          <NavLink
            label={EUserPageName.YOUR_CLASSES}
            {...getLinkProps(routes.user.owned_classes.value, "ic-rocket")}
          />
        </Stack>
        <Stack w="full" alignSelf={"end"}>
          <NavLink
            label={EUserPageName.SETTINGS}
            {...getLinkProps(routes.user.profile.value, "ic-settings")}
          />
          <NavLink
            label={EUserPageName.LOGOUT}
            onClick={() => {
              authStore.logout();
            }}
            icon={"ic-logout.svg"}
            isExpanded={isExpanded}
          />
        </Stack>
      </VStack>
    </Flex>
  );
});

export default SideBar;
