import {
  Button,
  Collapse,
  HStack,
  Link,
  LinkProps,
  Text,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Icon from "components/Icon";
import SvgIcon from "components/SvgIcon";
import { gray500 } from "theme/colors.theme";
import { checkValidArray } from "utils/common";
import React from "react";
import { observer } from "mobx-react";
import { useStores } from "hooks/useStores";

export interface INavLinkProps extends LinkProps {
  isActive?: boolean;
  label: string;
  icon: string;
  href?: string;
  onClick?: () => void;
  isExpanded?: boolean;
  children?: React.ReactNode[];
}

const NavLink = (props: INavLinkProps) => {
  const {
    icon,
    isActive,
    label,
    href,
    onClick,
    isExpanded = true,
    children,
  } = props;
  const isSVGIcon = icon?.endsWith(".svg");
  const isHavingChildren = checkValidArray(children);
  const { settingStore } = useStores();
  const { settingSidebar, setSettingSidebar } = settingStore;
  const isDropdownOpen = settingSidebar?.dropDownName === href;

  const setOpenChildren = () => {
    if (isDropdownOpen) {
      setSettingSidebar({
        dropDownName: "",
      });
      return;
    }
    setSettingSidebar({
      dropDownName: href,
    });
  };

  return (
    <VStack w={"100%"} spacing={0} alignItems="flex-start">
      <Link
        className={undefined}
        display="flex"
        onClick={onClick}
        paddingY={3}
        px={1}
        href={href}
        borderRadius="lg"
        fontWeight={600}
        fontSize="sm"
        lineHeight="1.5rem"
        as={href ? NextLink : undefined}
        aria-current={isActive ? "page" : undefined}
        flexDirection={isExpanded ? "row" : "column"}
        color="white"
        _hover={{
          textDecoration: "none",
          bg: "gray.200",
        }}
        _activeLink={{
          bg: "gray.200",
          color: "gray.900",
        }}
        minW={isExpanded ? "250px" : undefined}
      >
        <HStack spacing={3} px={3} flex={1}>
          {isSVGIcon ? (
            <SvgIcon
              iconName={icon}
              size={30}
              color={isActive ? gray500 : "#767676"}
            />
          ) : (
            <Icon iconName={icon} size={30} alt="" />
          )}
          {isExpanded ? (
            <Text as="span" flexGrow={1} color="gray.500">
              {label}
            </Text>
          ) : null}
        </HStack>
        {isHavingChildren && isExpanded ? (
          <Button
            variant="ghost"
            size="sm"
            color="gray.500"
            onClick={setOpenChildren}
          >
            <SvgIcon
              iconName={isDropdownOpen ? "ic-up.svg" : "ic-down.svg"}
              size={20}
            />
          </Button>
        ) : null}
      </Link>
      <Collapse in={isDropdownOpen} animateOpacity>
        <VStack spacing={0} alignItems="flex-start" gap={2} mt={2} flex={1}>
          {children}
        </VStack>
      </Collapse>
    </VStack>
  );
};

export default observer(NavLink);
