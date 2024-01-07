import {
  VStack,
  HStack,
  Text,
  Center,
  Spinner,
  Tabs,
  TabList,
  Tab,
} from "@chakra-ui/react";
import { useGetClassReviews } from "API/get/get.class.reviews";
import EmptyList from "components/EmptyState/EmptyList";
import { useStores } from "hooks/useStores";
import { IClass, IReview } from "interfaces/classes";
import { observer } from "mobx-react";
import React from "react";
import { checkValidArray, getValidArray } from "utils/common";
import ReviewsDetailItem from "./ReviewDetailsItem";
import { EReviewStatus } from "enums/classes";

interface Props {
  details: IClass;
}

const TeacherReviewsScene = ({ details }: Props) => {
  const { settingStore } = useStores();
  const [filterStatus, setFilterStatus] = React.useState<EReviewStatus>();

  const {
    data: getClassReviews,
    isLoading: isClassReviewsLoading,
    refetch: refetchClassReviews,
  } = useGetClassReviews(details?.id ?? "", {
    "filter.status": filterStatus,
  });
  const { data: classReviews } = getClassReviews ?? {};

  settingStore?.setHeaderLoading(isClassReviewsLoading);

  if (isClassReviewsLoading) {
    return (
      <Center mt={20}>
        <Spinner boxSize={30} />
      </Center>
    );
  }

  const renderReviewItem = (item: IReview) => {
    return (
      <ReviewsDetailItem
        review={item}
        key={item.id}
        refetch={async () => {
          refetchClassReviews();
        }}
      />
    );
  };

  const onChangeTab = async (index: number) => {
    switch (index) {
      case 0:
        setFilterStatus(undefined);
        break;
      case 1:
        setFilterStatus(EReviewStatus.PENDING);
        break;
      case 2:
        setFilterStatus(EReviewStatus.ACCEPTED);
        break;
      case 3:
        setFilterStatus(EReviewStatus.REJECTED);
        break;
      default:
        break;
    }
  };

  return (
    <VStack alignSelf={"center"} alignItems={"center"} h="full" flex={1}>
      <VStack
        w={"full"}
        maxW={"container.lg"}
        p={10}
        borderColor={"gray.300"}
        alignItems={"start"}
        h={"full"}
        gap={5}
      >
        <HStack w={"full"} justifyContent={"space-between"}>
          <Text fontSize={"xl"} fontWeight={"bold"}>
            Reviews
          </Text>
        </HStack>

        <Tabs isFitted variant="enclosed" w={"full"} onChange={onChangeTab}>
          <TabList mb="1em">
            <Tab
              _selected={{
                color: "primary.500",
                fontWeight: "bold",
                bg: "primary.100",
              }}
            >
              All
            </Tab>
            <Tab
              _selected={{
                color: "yellow.800",
                fontWeight: "bold",
                bg: "yellow.100",
              }}
            >
              Pending ⌛️
            </Tab>
            <Tab
              _selected={{
                color: "green.500",
                fontWeight: "bold",
                bg: "green.100",
              }}
            >
              Approved ✅
            </Tab>
            <Tab
              _selected={{
                color: "red.500",
                fontWeight: "bold",
                bg: "red.100",
              }}
            >
              Rejected ❌
            </Tab>
          </TabList>
        </Tabs>
        {checkValidArray(classReviews) ? (
          <VStack px={5} w={"full"} gap={7}>
            {getValidArray(classReviews)?.map(renderReviewItem)}
          </VStack>
        ) : (
          <EmptyList
            title={"No reviews"}
            description={"There are no reviews"}
          />
        )}
      </VStack>
    </VStack>
  );
};

export default observer(TeacherReviewsScene);
