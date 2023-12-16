import { HStack, Link, LinkProps, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import Icon from "components/Icon";
import SvgIcon from "components/SvgIcon";
import { gray500 } from "theme/colors.theme";

export interface INavLinkProps extends LinkProps {
  isActive?: boolean;
  label: string;
  icon: string;
  href?: string;
  onClick?: () => void;
  isExpanded?: boolean;
}

const NavLink = (props: INavLinkProps) => {
  const { icon, isActive, label, href, onClick, isExpanded = true } = props;
  const isSVGIcon = icon?.endsWith(".svg");

  return (
    <Link
      className={undefined}
      display="block"
      onClick={onClick}
      paddingY={3}
      pl={4}
      href={href}
      borderRadius="lg"
      fontWeight={600}
      fontSize="sm"
      lineHeight="1.5rem"
      as={href ? NextLink : undefined}
      aria-current={isActive ? "page" : undefined}
      color="white"
      _hover={{
        textDecoration: "none",
        bg: "gray.200",
      }}
      _activeLink={{
        bg: "gray.200",
        color: "gray.900",
      }}
    >
      <HStack spacing={3} minW={isExpanded ? "240px" : undefined}>
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
    </Link>
  );
};

export default NavLink;
