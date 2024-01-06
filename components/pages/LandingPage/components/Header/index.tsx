import {
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  Image,
  Link,
  Text,
  VStack,
  chakra,
  useDisclosure,
} from "@chakra-ui/react";
import SvgIcon from "components/SvgIcon";
import { useStores } from "hooks/useStores";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Link as ScrollLink } from "react-scroll";
import routes from "routes";
import { maxMobileWidth } from "theme/globalStyles";
import NextLink from "next/link";

type Props = {
  sections: {
    id: string;
    label: string;
  }[];
};

const Header: React.FC<Props> = ({ sections }) => {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const { authStore } = useStores();
  const isMobile: boolean = useMediaQuery({ maxWidth: maxMobileWidth });
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    authStore.fetchCurrentUser();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleOnLogoClick() {
    router.reload();
  }

  return (
    mounted && (
      <chakra.header
        zIndex={1000}
        position="sticky"
        top={0}
        bg="#fafafa"
        w="full"
        h={"80px"}
        boxShadow={
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"
        }
        py={4}
      >
        <Container width="100%" maxW="container.2xl">
          <HStack w="full" justifyContent="space-between">
            <HStack gap={5}>
              <Box>
                <Image
                  src="/assets/icons/logo.svg"
                  alt="logo"
                  objectFit="contain"
                  w={10}
                  onClick={handleOnLogoClick}
                  _hover={{
                    cursor: "pointer",
                  }}
                />
              </Box>

              <HStack
                gap={5}
                display={{
                  base: "none",
                  md: "flex",
                }}
              >
                {sections.map((section) => {
                  return (
                    <Link
                      key={section.id}
                      as={ScrollLink}
                      to={section.id}
                      spy={true}
                      activeStyle={{
                        fontWeight: "600",
                      }}
                      offset={-80}
                      _hover={{
                        textDecoration: "none",
                      }}
                    >
                      {section.label}
                    </Link>
                  );
                })}
              </HStack>
            </HStack>

            {isMobile && (
              <>
                <IconButton
                  aria-label="Menu"
                  border={0}
                  icon={<SvgIcon iconName="ic-menu.svg" />}
                  onClick={onOpen}
                />

                <Drawer isOpen={isOpen} onClose={onClose}>
                  <DrawerOverlay />

                  <DrawerContent>
                    <DrawerCloseButton size="lg" top={5} right={5} />

                    <DrawerBody mt={20}>
                      <VStack w="full" spacing={2}>
                        {sections.map((section) => {
                          return (
                            <Link
                              key={section.id}
                              as={ScrollLink}
                              to={section.id}
                              spy={true}
                              activeStyle={{
                                fontWeight: "600",
                              }}
                              offset={-80}
                              _hover={{
                                textDecoration: "none",
                              }}
                              width="full"
                              py={2}
                            >
                              {section.label}
                            </Link>
                          );
                        })}
                      </VStack>

                      <Divider width="full" my={5} />

                      <VStack>
                        {!authStore?.isLoading &&
                          (authStore.isAuthenticated ? (
                            <>
                              <Link
                                as={NextLink}
                                _hover={{
                                  textDecoration: "none",
                                }}
                                width="full"
                                py={2}
                                href={
                                  authStore.user?.role === "user"
                                    ? routes.user.home.value
                                    : routes.admin.manageAccount.value
                                }
                              >
                                Dashboard
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link
                                as={NextLink}
                                _hover={{
                                  textDecoration: "none",
                                }}
                                width="full"
                                py={2}
                                href={routes.auth.login.value}
                              >
                                Login
                              </Link>

                              <Link
                                as={NextLink}
                                _hover={{
                                  textDecoration: "none",
                                }}
                                width="full"
                                py={2}
                                href={routes.auth.register.value}
                              >
                                Sign up
                              </Link>
                            </>
                          ))}
                      </VStack>
                    </DrawerBody>
                  </DrawerContent>
                </Drawer>
              </>
            )}

            {!isMobile &&
              !authStore?.isLoading &&
              (authStore.isAuthenticated ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (authStore.user?.role === "user") {
                      router.push(routes.user.home.value);
                    } else {
                      router.push(routes.admin.manageAccount.value);
                    }
                  }}
                >
                  <Text>Dashboard</Text>
                </Button>
              ) : (
                <HStack>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      router.push(routes.auth.login.value);
                    }}
                  >
                    <Text>Log in</Text>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      router.push(routes.auth.register.value);
                    }}
                  >
                    <Text>Sign up</Text>
                  </Button>
                </HStack>
              ))}
          </HStack>
        </Container>
      </chakra.header>
    )
  );
};

export default observer(Header);
