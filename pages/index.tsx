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
  Button,
  createIcon,
  useColorModeValue,
  Flex,
  IconProps,
  Icon,
  Image,
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
      <div>
        <Text
          fontSize="5xl"
          sx={{
            margin: "2%",
          }}
        >
          Explore our collection today!
        </Text>
      </div>

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
      <Container maxW={"7xl"}>
        <Stack
          align={"center"}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
          direction={{ base: "column", md: "row" }}
        >
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
            >
              <Text
                as={"span"}
                position={"relative"}
                _after={{
                  content: "''",
                  width: "full",
                  height: "30%",
                  position: "absolute",
                  bottom: 1,
                  left: 0,
                  bg: "red.400",
                  zIndex: -1,
                }}
              >
                Register an account
              </Text>
              <br />
              <Text as={"span"} color={"red.400"}>
                use everywhere!
              </Text>
            </Heading>
            <Text color={"gray.500"}>
              Register an account for you right now so that you can download and
              upload wonderful image on our website
            </Text>
            <Text color={"gray.500"}>Furthermore, it's completely free!</Text>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: "column", sm: "row" }}
            >
              <Button
                rounded={"full"}
                size={"lg"}
                fontWeight={"normal"}
                px={6}
                colorScheme={"red"}
                bg={"red.400"}
                _hover={{ bg: "red.500" }}
              >
                Get started
              </Button>
              <Button
                rounded={"full"}
                size={"lg"}
                fontWeight={"normal"}
                px={6}
                leftIcon={<PlayIcon h={4} w={4} color={"gray.300"} />}
              >
                Preview
              </Button>
            </Stack>
          </Stack>
          <Flex
            flex={1}
            justify={"center"}
            align={"center"}
            position={"relative"}
            w={"full"}
          >
            <Blob
              w={"150%"}
              h={"150%"}
              position={"absolute"}
              top={"-20%"}
              left={0}
              zIndex={-1}
              color={useColorModeValue("red.50", "red.400")}
            />
            <Box
              position={"relative"}
              height={"300px"}
              rounded={"2xl"}
              boxShadow={"2xl"}
              width={"full"}
              overflow={"hidden"}
            >
              <IconButton
                aria-label={"Play Button"}
                variant={"ghost"}
                _hover={{ bg: "transparent" }}
                icon={<PlayIcon w={12} h={12} />}
                size={"lg"}
                color={"white"}
                position={"absolute"}
                left={"50%"}
                top={"50%"}
                transform={"translateX(-50%) translateY(-50%)"}
              />
              {/* image */}
              <Image src="https://images.unsplash.com/photo-1503424886307-b090341d25d1?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></Image>
            </Box>
          </Flex>
        </Stack>
      </Container>
    </div>
  );
};
const PlayIcon = createIcon({
  displayName: "PlayIcon",
  viewBox: "0 0 58 58",
  d: "M28.9999 0.562988C13.3196 0.562988 0.562378 13.3202 0.562378 29.0005C0.562378 44.6808 13.3196 57.438 28.9999 57.438C44.6801 57.438 57.4374 44.6808 57.4374 29.0005C57.4374 13.3202 44.6801 0.562988 28.9999 0.562988ZM39.2223 30.272L23.5749 39.7247C23.3506 39.8591 23.0946 39.9314 22.8332 39.9342C22.5717 39.9369 22.3142 39.8701 22.0871 39.7406C21.86 39.611 21.6715 39.4234 21.5408 39.1969C21.4102 38.9705 21.3421 38.7133 21.3436 38.4519V19.5491C21.3421 19.2877 21.4102 19.0305 21.5408 18.8041C21.6715 18.5776 21.86 18.3899 22.0871 18.2604C22.3142 18.1308 22.5717 18.064 22.8332 18.0668C23.0946 18.0696 23.3506 18.1419 23.5749 18.2763L39.2223 27.729C39.4404 27.8619 39.6207 28.0486 39.7458 28.2713C39.8709 28.494 39.9366 28.7451 39.9366 29.0005C39.9366 29.2559 39.8709 29.507 39.7458 29.7297C39.6207 29.9523 39.4404 30.1391 39.2223 30.272Z",
});

const Blob = (props: IconProps) => {
  return (
    <Icon
      width={"100%"}
      viewBox="0 0 578 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
        fill="currentColor"
      />
    </Icon>
  );
};

export default Home;
