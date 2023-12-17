import { Flex, Stack, VStack, Divider } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { forwardRef, useImperativeHandle } from "react";
import { EZIndexLayer } from "enums/theme";
import { useStores } from "hooks/useStores";
import routes from "routes";
import NavLink, { INavLinkProps } from "../NavLink";
import { EUserPageName } from "constants/pages/common";
import { observer } from "mobx-react";

export interface ISidebarRefProps {
  onExpand: () => void;
}

interface ISidebarProps {}
const SideBar = forwardRef<ISidebarRefProps, ISidebarProps>((_, ref) => {
  const router = useRouter();
  const { authStore, settingStore } = useStores();
  const { isSideBarExpanded, setSideBarExpanded } = settingStore;
  const { user } = authStore;

  function getLinkProps(
    href: string,
    iconName: string
  ): Omit<INavLinkProps, "label"> {
    const isActive = router.asPath.includes(href);
    return {
      isActive,
      href,
      icon: `${iconName}.svg`,
      isExpanded: isSideBarExpanded,
    };
  }

  useImperativeHandle(ref, () => ({
    onExpand: () => {
      const isSideBarExpanded = Boolean(settingStore.isSideBarExpanded);
      setSideBarExpanded(!isSideBarExpanded);
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
      px={5}
    >
      <VStack
        display="flex"
        flex={1}
        width="full"
        h={"full"}
        overflowX="hidden"
        overflowY="auto"
        justifyContent={"space-between"}
        divider={<Divider h={0.5} bgColor={"gray.400"} />}
        py={3}
      >
        <Stack
          width="full"
          flex={1}
          divider={<Divider h={"1px"} bgColor={"gray.400"} />}
        >
          <NavLink
            label={EUserPageName.HOME}
            {...getLinkProps(routes.user.home.value, "ic-home")}
          />

          <NavLink
            label={EUserPageName.ENROLLED}
            {...getLinkProps(routes.user.enrolled_classes.value, "ic-enrolled")}
          />

          <NavLink
            label={EUserPageName.TEACHING}
            {...getLinkProps(routes.user.owned_classes.value, "ic-teacher")}
          />

          <NavLink
            label={EUserPageName.OWNED}
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
            isExpanded={isSideBarExpanded}
          />
        </Stack>
      </VStack>
    </Flex>
  );
});

export default observer(SideBar);
