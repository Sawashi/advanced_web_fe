import { HStack, VStack, Text, Divider } from "@chakra-ui/react";
import { IReview } from "interfaces/classes";

type Props = {
  review: IReview;
};

const ReviewsDetailItem = ({ review }: Props) => {
  return (
    <VStack w={"full"}>
      <VStack
        w={"full"}
        maxW={"container.lg"}
        p={5}
        borderColor={"gray.300"}
        backgroundColor={"gray.100"}
        borderWidth={1}
        borderRadius={6}
        alignItems={"start"}
        h={"full"}
        gap={5}
      >
        <HStack
          w={"full"}
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={5}
          divider={<Divider orientation="vertical" borderColor="gray.300" />}
        >
          <VStack flex={1}
          alignItems={"start"}
            >
            
          </VStack>
          <VStack flex={1}></VStack>
        </HStack>
        <VStack w={"full"} maxW={"container.lg"} alignItems={"start"}>
          <Text fontSize={"md"} fontWeight={"bold"} color={"primary.500"}>
            Explanation
          </Text>
          <Text fontSize={"xs"} fontWeight={"normal"} color={"gray.500"} ml={2}>
            {review?.studentExplanation}
          </Text>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default ReviewsDetailItem;
