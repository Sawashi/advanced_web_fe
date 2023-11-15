import Head from "next/head";
import Header from "components/Header";
import { Box, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
const Home = () => {
  const [dataToShow, setDataToShow] = useState<any[]>([]);

  const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 50) + 1;
    return randomNumber;
  };

  const handleFetchDataRandom = async () => {
    const randomPage = generateRandomNumber();
    const response = await fetch(
      `https://api.unsplash.com/photos?page=${randomPage}&per_page=30&client_id=pzObb_eHBRNoysOGQ9e1bmJ_z3w_W-p2Q7zEOGGx7m8`
    );
    const data = await response.json();
    return data;
  };

  const handleLoadMore = async () => {
    const newData = await handleFetchDataRandom();
    setDataToShow(dataToShow.concat(newData));
  };
  useEffect(() => {
    const fetchData = async () => {
      const result = await handleFetchDataRandom();
      setDataToShow(result);
    };
    fetchData();
  }, []);
  return (
    <div>
      <Header />
      <Text fontSize="4xl" sx={{ margin: "2%" }}>
        Here are some wonderful images for today!
      </Text>
      <InfiniteScroll
        dataLength={dataToShow.length}
        next={handleLoadMore}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <Box
          padding={4}
          w="100%"
          maxW="80%"
          mx="auto"
          sx={{ columnCount: [1, 2, 3, 4, 5], columnGap: "8px" }}
        >
          {dataToShow.map((image) => (
            <Image
              key={image.id}
              w="100%"
              borderRadius="xl"
              mb={2}
              sx={{ display: "inline-block" }}
              src={image.urls.raw}
              alt="Alt"
            />
          ))}
        </Box>
      </InfiniteScroll>
    </div>
  );
};

export default Home;
