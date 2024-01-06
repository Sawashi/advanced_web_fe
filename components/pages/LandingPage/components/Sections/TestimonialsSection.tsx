import { Box, Heading, Image, Text, VStack, useToken } from "@chakra-ui/react";
import { observer } from "mobx-react";
import React, { useCallback } from "react";
import { Fade } from "react-awesome-reveal";

import { Autoplay, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import { convertBreakPointToNumber } from "utils/common";

type Props = {
  id: string;
};

const TestimonialsSection: React.FC<Props> = ({ id }) => {
  const testimonialsData = [
    {
      name: "Sarah Parker",
      title: "5th Grade Teacher",
      avatar: "https://i.pravatar.cc/300?img=1",
      text: "This platform has transformed my classroom management. The intuitive design and powerful features allow me to track grades and communicate with parents seamlessly. It's a game-changer for educators!",
    },
    {
      name: "David Lee",
      title: "High School Math Instructor",
      avatar: "https://i.pravatar.cc/300?img=2",
      text: "I've been using this tool for a year, and it's significantly reduced the time I spend on administrative tasks. The automated gradebook and customizable reporting have made it easier to understand and support my students' progress.",
    },
    {
      name: "Emily Johnson",
      title: "English Department Head",
      avatar: "https://i.pravatar.cc/300?img=3",
      text: "From the interactive quizzes to the detailed student profiles, every feature seems designed with teachers in mind. Communication with parents has never been easier or more secure. This platform is an essential part of our daily teaching toolkit.",
    },
    {
      name: "Mark Thompson",
      title: "Elementary School Principal",
      avatar: "https://i.pravatar.cc/300?img=4",
      text: "Our entire school has adopted this platform, and it's improved our overall efficiency and student engagement. The attendance management and integration with other tools have streamlined many of our processes. I highly recommend it to any educational institution.",
    },
    {
      name: "Linda Kim",
      title: "Science Educator",
      avatar: "https://i.pravatar.cc/300?img=5",
      text: "The attention to detail is what sets this platform apart. From tracking student grades to providing interactive learning tools, it's a comprehensive solution that addresses all our needs. It's been a valuable asset in enhancing our students' learning experience.",
    },
  ];

  const renderTestimonials = useCallback(() => {
    const [sm, md, lg] = useToken("breakpoints", ["sm", "md", "lg"]);

    const breakpoints = {
      [Math.ceil(convertBreakPointToNumber(sm))]: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      [Math.ceil(convertBreakPointToNumber(md))]: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      [Math.ceil(convertBreakPointToNumber(lg))]: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    };

    return (
      <Swiper
        pagination={{
          clickable: true,
        }}
        keyboard={{
          enabled: true,
        }}
        navigation={true}
        modules={[Pagination, Keyboard, Autoplay]}
        autoplay={{
          delay: 2000,
        }}
        breakpoints={breakpoints}
        style={{
          width: "100%",
          height: "100%",
          paddingTop: "5rem",
          paddingBottom: "2rem",
          // @ts-ignore
          "--swiper-pagination-bottom": "0px",
        }}
      >
        {testimonialsData.map((testimonial, index) => {
          return (
            <SwiperSlide
              key={index}
              style={{
                height: "auto",
                padding: "10px",
              }}
            >
              <Fade
                triggerOnce
                style={{
                  height: "100%",
                }}
              >
                <VStack
                  position="relative"
                  p={12}
                  h="full"
                  borderRadius="xl"
                  boxShadow="md"
                >
                  <Box
                    flex={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="absolute"
                    left={0}
                    right={0}
                    top={0}
                    transform={`translateY(-50%)`}
                  >
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      w={20}
                      h={20}
                      borderRadius="full"
                      objectFit="contain"
                    />
                  </Box>

                  <Heading as="h3" size="md">
                    {testimonial.name}
                  </Heading>

                  <Heading as="h4" size="sm" mb={3}>
                    {testimonial.title}
                  </Heading>

                  <Text as="blockquote" fontSize="lg" fontWeight="medium">
                    {testimonial.text}
                  </Text>
                </VStack>
              </Fade>
            </SwiperSlide>
          );
        })}
      </Swiper>
    );
  }, [testimonialsData]);

  return (
    <VStack
      id={id}
      as="section"
      mt={20}
      py={10}
      px={{
        base: 2,
        md: 10,
        lg: 20,
      }}
    >
      <Heading as="h2" size="xl" mb={5}>
        <Fade triggerOnce direction="up">
          <Text>What Our Customers Are Saying</Text>
        </Fade>
      </Heading>

      {renderTestimonials()}
    </VStack>
  );
};

export default observer(TestimonialsSection);
