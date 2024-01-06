import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  VStack,
  chakra,
  useToken,
} from "@chakra-ui/react";
import SvgIcon from "components/SvgIcon";
import NextLink from "next/link";
import React from "react";
import { useMediaQuery } from "react-responsive";
import { maxMobileWidth, maxTabletWidth } from "theme/globalStyles";

type Props = {};

const Footer: React.FC<Props> = (props) => {
  const [gray200] = useToken("colors", ["gray.200"]);

  const data = [
    {
      title: "Info",
      links: [
        {
          label: "Formats",
          href: "#",
        },
        {
          label: "Compression",
          href: "#",
        },
        {
          label: "Pricing",
          href: "#",
        },
        {
          label: "FAQ",
          href: "#",
        },
        {
          label: "Status",
          href: "#",
        },
      ],
    },
    {
      title: "Resources",
      links: [
        {
          label: "Developer API",
          href: "#",
        },
        {
          label: "Tools",
          href: "#",
        },
        {
          label: "Blog",
          href: "#",
        },
        {
          label: "Support",
          href: "#",
        },
      ],
    },
    {
      title: "Company",
      links: [
        {
          label: "About Us",
          href: "#",
        },
        {
          label: "Sustainability",
          href: "#",
        },
        {
          label: "Terms of Service",
          href: "#",
        },
        {
          label: "Privacy Policy",
          href: "#",
        },
      ],
    },
  ];

  return (
    <Container
      as="footer"
      width="100%"
      maxW="container.2xl"
      py={{
        base: 10,
        lg: 20,
      }}
      mt={10}
      bg="primary.500"
      color="gray.300"
    >
      <Stack
        justifyContent="space-around"
        alignItems={{
          base: "flex-start",
          md: "center",
          lg: "flex-start",
        }}
        direction={{
          base: "column",
          lg: "row",
        }}
        spacing={{
          base: 10,
          lg: 20,
        }}
      >
        <Stack
          direction={{
            base: "column",
            sm: "row",
          }}
          gap={{
            base: 10,
            sm: 20,
          }}
        >
          {data.map((item, index) => (
            <VStack alignItems="flex-start" key={index} gap={4}>
              <Heading
                as="h4"
                size="md"
                textTransform="uppercase"
                letterSpacing="5px"
                color="white"
              >
                {item.title}
              </Heading>

              <VStack alignItems="flex-start" spacing={2}>
                {item.links.map((link, index) => (
                  <Link as={NextLink} href={link.href} key={index}>
                    {link.label}
                  </Link>
                ))}
              </VStack>
            </VStack>
          ))}
        </Stack>

        <VStack alignItems="flex-start" gap={10}>
          <Box>
            <chakra.form>
              <HStack alignItems="flex-end">
                <FormControl>
                  <FormLabel>
                    <Text fontSize="sm" fontWeight="600" color="white">
                      Subscribe to our newsletter
                    </Text>
                  </FormLabel>

                  <Input
                    type="email"
                    placeholder="Your email"
                    _placeholder={{
                      color: "gray.200",
                    }}
                  />
                </FormControl>

                <Button variant="solid" colorScheme="gray" size="md" px={6}>
                  <Text
                    textTransform="uppercase"
                    fontSize="sm"
                    fontWeight={600}
                  >
                    Subscribe
                  </Text>
                </Button>
              </HStack>
            </chakra.form>
          </Box>

          <Box w="full">
            <Text fontSize="sm" fontWeight={600} mb={1} color="white">
              Follow us
            </Text>

            <HStack gap={5}>
              <Link as={NextLink} href="#">
                <SvgIcon
                  color={gray200}
                  iconName={"ic-facebook.svg"}
                  size={30}
                />
              </Link>

              <Link as={NextLink} href="#">
                <SvgIcon
                  color={gray200}
                  iconName={"ic-linkedin.svg"}
                  size={30}
                />
              </Link>

              <Link as={NextLink} href="#">
                <SvgIcon
                  color={gray200}
                  iconName={"ic-twitter.svg"}
                  size={30}
                />
              </Link>

              <Text
                flex={1}
                textAlign="right"
                alignSelf="flex-end"
                fontSize="sm"
              >
                © 2024 All rights reserved
              </Text>
            </HStack>
          </Box>
        </VStack>
      </Stack>
    </Container>
  );
};

export default Footer;
