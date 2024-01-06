import {
  Box,
  Button,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
  chakra,
} from "@chakra-ui/react";
import { Fragment, useCallback } from "react";
import { Fade } from "react-awesome-reveal";
import CountUp from "react-countup";

type Props = {
  id: string;
};

const HeroSection: React.FC<Props> = ({ id }) => {
  const countUpData = [
    {
      count: 20000,
      label: "Active Users",
    },
    {
      count: 1000,
      label: "Classes",
    },
    {
      count: 2000,
      label: "Teachers",
    },
    {
      count: 15000,
      label: "Students",
    },
  ];

  const renderCountUp = useCallback(() => {
    return countUpData.map((data, index) => {
      return (
        <Fragment key={index}>
          <VStack spacing={2}>
            <Fade triggerOnce>
              <Text
                fontSize={{
                  base: "2xl",
                  lg: "4xl",
                }}
                fontWeight="600"
                lineHeight="1.2"
                textTransform="uppercase"
                minW="150px"
                textAlign="center"
              >
                <CountUp end={data.count} />+
              </Text>

              <Text
                fontSize={{
                  base: "lg",
                  lg: "xl",
                }}
                lineHeight="1.2"
              >
                {data.label}
              </Text>
            </Fade>
          </VStack>

          {index !== countUpData.length - 1 && (
            <Box
              bgColor="gray"
              w={{ base: "100px", md: "1px" }}
              h={{ base: "1px", md: "50px" }}
              opacity={0.5}
              marginX={{
                base: 5,
                xl: 100,
              }}
              marginY={{
                base: 10,
                md: 0,
              }}
            />
          )}
        </Fragment>
      );
    });
  }, []);

  return (
    <VStack as="section" id={id} gap={0}>
      <HStack
        as="section"
        display="flex"
        justifyContent="space-between"
        my="60px"
        width="full"
      >
        <VStack
          justifyContent="space-between"
          alignItems="flex-start"
          mx={{
            base: 5,
            md: 20,
          }}
        >
          <Fade direction="up" cascade damping={0.3} triggerOnce>
            <chakra.h4
              fontSize={{
                base: "lg",
                lg: "xl",
              }}
              fontWeight="bold"
              lineHeight="1.2"
              textTransform="uppercase"
            >
              Welcome to
            </chakra.h4>

            <chakra.h1
              fontSize={{
                base: "3xl",
                lg: "5xl",
              }}
              fontWeight="800"
              lineHeight="1.2"
              textTransform="uppercase"
            >
              Grade Master Hub
            </chakra.h1>

            <chakra.p fontSize="md" lineHeight="1.4" maxW="420px">
              <chakra.span color="gray.700">
                Your streamlined solution for managing student lists and grades.
                Designed for teachers, our intuitive platform simplifies
                academic tracking and assessment, freeing you to focus on what
                truly matters—teaching and inspiring.
              </chakra.span>
            </chakra.p>

            <HStack spacing={5} mt={5} justifyContent="center" w="full">
              <Button
                as={chakra.a}
                href="#"
                colorScheme="primary"
                variant="solid"
                size={{
                  base: "md",
                  md: "lg",
                }}
                px={10}
                borderRadius="full"
                fontSize="md"
              >
                Get Started
              </Button>

              <Button
                as={chakra.a}
                href="#"
                colorScheme="primary"
                variant="outline"
                size={{
                  base: "md",
                  md: "lg",
                }}
                px={10}
                borderRadius="full"
                fontSize="md"
              >
                Learn More
              </Button>
            </HStack>
          </Fade>
        </VStack>

        <Box
          display={{
            base: "none",
            lg: "flex",
          }}
          alignItems="center"
        >
          <Fade triggerOnce>
            <Image
              src="/assets/hero.svg"
              alt="logo"
              w="800px"
              objectFit="contain"
            />
          </Fade>
        </Box>
      </HStack>

      <Stack
        as="section"
        justifyContent="center"
        alignItems="center"
        bg="primary.500"
        color="white"
        width="full"
        py={16}
        direction={{
          base: "column",
          md: "row",
        }}
      >
        {renderCountUp()}
      </Stack>
    </VStack>
  );
};

export default HeroSection;
