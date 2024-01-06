import {
  Box,
  HStack,
  Heading,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react";
import React, { useCallback } from "react";
import { Fade } from "react-awesome-reveal";

type Props = {
  id: string;
};

const FeaturesSection: React.FC<Props> = ({ id }) => {
  const featureData = [
    {
      title: "Automated Gradebook",
      description:
        "Quickly calculate and track grades with automated weightings for various assignments and tests.",
      image: "/assets/feat1.png",
    },
    {
      title: "Classroom Management Tools",
      description:
        "Easily organize seating, schedule activities, and plan lessons with interactive tools.",
      image: "/assets/feat2.png",
    },
    {
      title: "Interactive Quizzes and Polls",
      description:
        "Engage students and assess understanding with real-time quizzes and polls.",
      image: "/assets/feat3.png",
    },
    {
      title: "Customizable Reporting",
      description:
        "Generate concise reports on performance and attendance for meetings and records.",
      image: "/assets/feat4.png",
    },
    {
      title: "Secure Communication Portal",
      description:
        "Safely communicate with students and parents, sharing updates and feedback privately.",
      image: "/assets/feat5.png",
    },
    {
      title: "Attendance Management",
      description:
        "Record and monitor attendance with simple, user-friendly options for absences and participation.",
      image: "/assets/feat6.png",
    },
  ];

  const renderFeatures = useCallback(() => {
    return featureData.map((feature, index) => {
      return (
        <Fade direction="up" triggerOnce key={index}>
          <VStack
            boxShadow="xl"
            borderRadius="xl"
            p={10}
            gap={5}
            w="full"
            h="full"
          >
            <HStack w="full" gap={5}>
              <Box>
                <Image
                  src={feature.image}
                  alt={feature.title}
                  objectFit="contain"
                  w={20}
                />
              </Box>

              <Heading as="h3" size="md" flex={1}>
                {feature.title}
              </Heading>
            </HStack>

            <Text flex={1} color="gray.600">
              {feature.description}
            </Text>
          </VStack>
        </Fade>
      );
    });
  }, [featureData]);

  return (
    <VStack id={id} as="section" mt={20} py={10}>
      <Fade direction="up" triggerOnce>
        <Heading as="h3" size="md">
          Why Choose Us?
        </Heading>

        <Heading as="h2" size="xl" textAlign="center" letterSpacing="5px">
          What We Offer
        </Heading>
      </Fade>

      <SimpleGrid
        columns={{
          base: 1,
          md: 2,
          lg: 3,
        }}
        spacing={10}
        mx={{
          base: 0,
          md: 10,
        }}
        mt={5}
      >
        {renderFeatures()}
      </SimpleGrid>
    </VStack>
  );
};

export default observer(FeaturesSection);
