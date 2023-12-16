import {
  Flex,
  Stack,
  VStack,
  Image,
  Text,
  StackDivider,
  Divider,
} from "@chakra-ui/react";
import get from "lodash/get";
import { useRouter } from "next/router";
import React, { RefObject, useMemo } from "react";
import { EZIndexLayer } from "enums/theme";
import { useStores } from "hooks/useStores";
import routes from "routes";
import NavLink, { INavLinkProps } from "../NavLink";
import { EUserPageName } from "constants/pages/common";

interface ISidebarProps {
  sideBarRef?: RefObject<HTMLDivElement>;
}
const SideBar = (props: ISidebarProps) => {
  const { sideBarRef } = props;
  const router = useRouter();
  const { authStore } = useStores();
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
    };
  }

  return (
    <Flex
      minWidth="240px"
      width={"fit-content"}
      display="flex"
      justifyContent="space-between"
      flexDirection="column"
      ref={sideBarRef}
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
      >
        <Stack spacing={2} marginX={3} width="full" flex={1} py={3}>
          <NavLink
            label={EUserPageName.ENROLLED}
            {...getLinkProps(routes.user.classes.value, "ic-enrolled")}
          />
          {/*<NavLink
            label={FleetManagerPageName.CASES}
            {...getLinkProps(
              routes.fleetManager.cases.value(fleetId),
              "ic-cases"
            )}
          />
          <NavLink
            label={FleetManagerPageName.VEHICLES}
            {...getLinkProps(
              routes.fleetManager.vehicles.value(fleetId),
              "ic-vehicles"
            )}
          />
          <NavLink
            label={FleetManagerPageName.DRIVERS}
            {...getLinkProps(
              routes.fleetManager.drivers.value(fleetId),
              "ic-drivers"
            )}
          />
          <NavLink
            label={FleetManagerPageName.ACTIVITY}
            {...getLinkProps(
              routes.fleetManager.activity.value(fleetId),
              "ic-activity"
            )}
          />
          <NavLink
            label={FleetManagerPageName.REPORTS}
            {...getLinkProps(
              routes.fleetManager.reports.value(fleetId),
              "ic-reports"
            )}
          /> */}
        </Stack>
        <Stack w="full" alignSelf={"end"}>
          <NavLink
            label={EUserPageName.LOGOUT}
            onClick={() => {
              authStore.logout();
            }}
            icon={"ic-logout.svg"}
          />
        </Stack>
      </VStack>
    </Flex>
  );
};

export default SideBar;
