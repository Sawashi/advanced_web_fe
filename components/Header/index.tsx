import { useMemo } from "react";
import { observer } from "mobx-react";
import { useStores } from "hooks/useStores";
import {
  Box,
  Flex,
  IconButton,
  Button,
  Stack,
  Popover,
  PopoverTrigger,
  useColorModeValue,
  useDisclosure,
  Avatar,
  Portal,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  Link,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import IconComponent from "components/Icon";
import routes from "routes";
import { useRouter } from "next/router";

const Header = () => {
  const { authStore } = useStores();
  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();

  const onLogout = (e: any) => {
    e.preventDefault();
    authStore.logout();
    router.replace(routes.auth.login.value);
  };

  const Content = useMemo(() => {
    if (!authStore.user?.id) {
      return (
        <>
          <Button
            as={"a"}
            fontSize={"sm"}
            fontWeight={400}
            variant={"link"}
            href={routes.auth.login.value}
          >
            Sign In
          </Button>
          <Button
            as={"a"}
            display={{ base: "none", md: "inline-flex" }}
            fontSize={"sm"}
            fontWeight={600}
            color={"white"}
            bg={"red.400"}
            href={routes.auth.register.value}
            _hover={{
              bg: "red.500",
            }}
          >
            Sign Up
          </Button>
        </>
      );
    }
    return (
      <Popover>
        <PopoverTrigger>
          <Avatar
            size={"md"}
            name={`${authStore.user?.firstName} ${authStore.user?.lastName}`}
            _hover={{
              cursor: "pointer",
            }}
            src={authStore.user?.avatar}
          />
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <PopoverHeader
              fontSize={"lg"}
              textAlign={"center"}
              fontWeight={600}
            >{`${authStore.user?.firstName} ${authStore.user?.lastName}`}</PopoverHeader>
            <PopoverBody>
              <Link href={routes.user.profile.value}>
                <a>Profile</a>
              </Link>
            </PopoverBody>
            <PopoverFooter>
              <Button
                variant={"link"}
                display={{ base: "none", md: "inline-flex" }}
                fontSize={"md"}
                fontWeight={600}
                onClick={onLogout}
                leftIcon={<IconComponent iconName="ic-logout.svg" size={20} />}
              >
                Log out
              </Button>
            </PopoverFooter>
          </PopoverContent>
        </Portal>
      </Popover>
    );
  }, [authStore.user]);

  return (
    <Box w={"100%"}>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex
          flex={{ base: 1 }}
          justify={{ base: "center", md: "start" }}
          alignItems={{ base: "center", md: "center" }}
        >
          <IconComponent
            iconName="logo.svg"
            size={50}
            onClick={() => {
              router.push(routes.user.dashboard.value);
            }}
          />
          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          alignItems={"center"}
          direction={"row"}
          spacing={6}
        >
          {Content}
        </Stack>
      </Flex>
    </Box>
  );
};

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Box
                as="a"
                p={2}
                href={navItem.href ?? "#"}
                fontSize={"sm"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Box>
            </PopoverTrigger>
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Latest",
    children: [
      {
        label: "Explore Design Work",
        subLabel: "Trending Design to inspire you",
        href: "#",
      },
      {
        label: "New & Noteworthy",
        subLabel: "Up-and-coming Designers",
        href: "#",
      },
    ],
  },
  {
    label: "Category",
    children: [
      {
        label: "Job Board",
        subLabel: "Find your dream design job",
        href: "#",
      },
      {
        label: "Freelance Projects",
        subLabel: "An exclusive list for contract work",
        href: "#",
      },
    ],
  },
  {
    label: "About",
    href: "#",
  },
];
export default observer(Header);
