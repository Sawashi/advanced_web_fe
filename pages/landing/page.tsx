import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  useBreakpointValue,
  Stack,
  Heading,
  Text,
  Container,
  Center,
} from "@chakra-ui/react";
// Here we have used react-icons package for the icons
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
// And react-slick as our Carousel Lib
import Slider from "react-slick";
import Header from "components/Header";
const settings = {
  dots: true,
  arrows: false,
  fade: true,
  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
};
const Home = () => {
  // As we have used custom buttons, we need a reference variable to
  // change the state
  const [slider, setSlider] = React.useState<Slider | null>(null);

  // These are the breakpoints which changes the position of the
  // buttons as the screen size changes
  const top = useBreakpointValue({ base: "90%", md: "50%" });
  const side = useBreakpointValue({ base: "30%", md: "40px" });

  // This list contains all the data for carousels
  // This can be static or loaded from a server
  const handleFetchData = async (stringToSearch: String) => {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?page=${1}&query=${stringToSearch}&client_id=pzObb_eHBRNoysOGQ9e1bmJ_z3w_W-p2Q7zEOGGx7m8`
    );
    const data = await response.json();
    return data.results;
  };
  const [dataToShow, setDataToShow] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const tempArr1 = await handleFetchData("polar");
      console.log(tempArr1);
      const tempArr2 = await handleFetchData("cat");
      const tempArr3 = await handleFetchData("bird");
      let result: any[][] = [tempArr1, tempArr2, tempArr3];
      setDataToShow(result);
    };
    fetchData();
  }, []);
  const cards = [
    {
      title: "Cat",
      text: "Beautiful image about cats",
      image: dataToShow[1]?.[0]?.urls.raw || null,
    },
    {
      title: "Polar",
      text: "Beautiful image about polars",
      image: dataToShow[0]?.[0]?.urls.raw || null,
    },
    {
      title: "Bird",
      text: "Beautiful images about birds",
      image: dataToShow[2]?.[0]?.urls.raw || null,
    },
  ];
  return (
    <div>
      <Header />
      <Text fontSize="5xl">Explore our collection today!</Text>
      <Center>
        <Box
          position={"relative"}
          height={"500px"}
          width={"90%"}
          overflow={"hidden"}
        >
          {/* CSS files for react-slick */}
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
          />
          {/* Left Icon */}
          <IconButton
            aria-label="left-arrow"
            variant="ghost"
            position="absolute"
            left={side}
            top={top}
            transform={"translate(0%, -50%)"}
            zIndex={2}
            onClick={() => slider?.slickPrev()}
          >
            <BiLeftArrowAlt size="40px" />
          </IconButton>
          {/* Right Icon */}
          <IconButton
            aria-label="right-arrow"
            variant="ghost"
            position="absolute"
            right={side}
            top={top}
            transform={"translate(0%, -50%)"}
            zIndex={2}
            onClick={() => slider?.slickNext()}
          >
            <BiRightArrowAlt size="40px" />
          </IconButton>
          {/* Slider */}
          <Slider {...settings} ref={(slider) => setSlider(slider)}>
            {cards.map((card, index) => (
              <Box
                key={index}
                height={"6xl"}
                position="relative"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                backgroundSize="cover"
                backgroundImage={`url(${card.image})`}
              >
                {/* This is the block you need to change, to customize the caption */}
                <Container
                  size="container.lg"
                  height="600px"
                  position="relative"
                >
                  <Stack
                    spacing={6}
                    w={"full"}
                    maxW={"lg"}
                    position="absolute"
                    top="50%"
                    transform="translate(0, -50%)"
                  >
                    <Heading
                      fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                      sx={{ color: "white" }}
                    >
                      {card.title}
                    </Heading>
                    <Text fontSize={{ base: "md", lg: "lg" }} color="white">
                      {card.text}
                    </Text>
                  </Stack>
                </Container>
              </Box>
            ))}
          </Slider>
        </Box>
      </Center>
    </div>
  );
};

export default Home;
