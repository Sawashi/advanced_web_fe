import {
  VStack,
  HStack,
  Text,
  Center,
  Spinner,
  Button,
  Tooltip,
} from "@chakra-ui/react";
import { useGetGradesOfStudent } from "API/get/get.class.student-grades";
import EmptyList from "components/EmptyState/EmptyList";
import SvgIcon from "components/SvgIcon";
import { ETabName } from "enums/classes";
import { useStores } from "hooks/useStores";
import { IClass, ICompositionGrade, IReview } from "interfaces/classes";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import routes from "routes";
import { cyan500, red500, yellow700 } from "theme/colors.theme";
import { checkValidArray, getValidArray } from "utils/common";
import RequestReviewModal from "./RequestReviewModal";
import { useGetMyReviews } from "API/get/get.class.my-reviews";

interface Props {
  details: IClass;
}
interface IGradeReview extends ICompositionGrade {
  review?: IReview;
}

const StudentGradeBoard = ({ details }: Props) => {
  const { classStore, settingStore } = useStores();
  const router = useRouter();
  const [isRequestReviewModalVisible, setIsRequestReviewModalVisible] =
    useState(false);
  const [selectedGrade, setSelectedGrade] = useState<ICompositionGrade>();
  const { data: gradesList, isLoading: isLoadingGradesList } =
    useGetGradesOfStudent({
      classId: details?.id ?? "",
      studentId: classStore?.currentStudentId ?? "",
    });

  const { data: getMyReviewsData, isLoading: isLoadingMyReviews } =
    useGetMyReviews(classStore?.currentClass?.id ?? "");

  const [renderList, setRenderList] = useState<IGradeReview[]>();

  const totalGrade = React.useMemo(() => {
    return getValidArray(renderList)?.reduce((acc, curr) => {
      return (
        acc + ((curr?.grade ?? 0) * (curr?.composition?.percentage ?? 0)) / 100
      );
    }, 0);
  }, [renderList]);

  settingStore?.setHeaderLoading(isLoadingGradesList || isLoadingMyReviews);

  useEffect(() => {
    let tempRenderList: IGradeReview[] = [];
    if (checkValidArray(gradesList)) {
      tempRenderList = getValidArray(gradesList)?.map((grade) => {
        return {
          ...grade,
          review: getValidArray(getMyReviewsData?.data)?.find(
            (review) => review?.grade?.id === grade?.id
          ),
        };
      });
    }
    setRenderList(tempRenderList);
  }, [getMyReviewsData, gradesList]);

  if (!classStore?.currentStudentId) {
    return (
      <EmptyList
        title={"You are not mapped to any student"}
        description={"Please map to a student to view this page"}
        _button={{
          text: "Map to a student",
          onClick: async () => {
            await router.push(
              routes.classes.details.value(details?.id ?? "", ETabName.Students)
            );
            router.reload();
          },
        }}
      />
    );
  }

  if (isLoadingGradesList || isLoadingMyReviews) {
    return (
      <Center mt={20}>
        <Spinner boxSize={30} />
      </Center>
    );
  }

  return (
    <VStack alignSelf={"center"} alignItems={"center"}>
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
            My grade board
          </Text>

          <Text fontSize={"md"} fontWeight={"normal"}>
            {getValidArray(renderList)?.length} items
          </Text>
        </HStack>

        <HStack w={"full"} justifyContent={"space-between"}>
          <Text fontSize={"md"} fontWeight={"normal"}>
            Total: {totalGrade} / 100
          </Text>
        </HStack>

        {getValidArray(renderList)?.map((grade) => {
          const isFinalized = grade?.composition?.finalized;
          return (
            <HStack
              w={"full"}
              justifyContent={"space-between"}
              key={grade?.id}
              boxShadow={"md"}
              h={10}
              p={5}
              py={10}
              borderRadius={10}
              bgColor={isFinalized ? "gray.50" : "white"}
            >
              <HStack
                flex={1}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <HStack>
                  {isFinalized ? (
                    <SvgIcon
                      iconName={"ic-lock.svg"}
                      size={20}
                      color={red500}
                    />
                  ) : null}
                  <Text fontSize={"md"} fontWeight={"bold"}>
                    {grade?.composition?.name} ({grade?.composition?.percentage}
                    %)
                  </Text>
                </HStack>

                <Text fontSize={"md"} fontWeight={"normal"}>
                  <Text fontSize={"md"} fontWeight={"bold"} as={"span"}>
                    {grade?.grade}
                  </Text>{" "}
                  / 100
                </Text>
              </HStack>
              {!!grade?.review ? (
                <Text fontSize={"md"} fontWeight={"normal"}>
                  <Tooltip label={"Your pending review"}>
                    <Button
                      variant={"ghost"}
                      p={0}
                      bgColor={"transparent"}
                      _hover={{
                        bgColor: "transparent",
                      }}
                      rounded={"full"}
                      onClick={() => {
                        setSelectedGrade(grade);
                        setIsRequestReviewModalVisible(true);
                      }}
                      rightIcon={
                        <SvgIcon
                          iconName={"ic-pending-review.svg"}
                          size={20}
                          color={cyan500}
                        />
                      }
                    />
                  </Tooltip>
                </Text>
              ) : isFinalized ? (
                <Tooltip label={"Request change grade"}>
                  <Button
                    variant={"ghost"}
                    p={0}
                    bgColor={"transparent"}
                    _hover={{
                      bgColor: "transparent",
                    }}
                    rounded={"full"}
                    onClick={() => {
                      setSelectedGrade(grade);
                      setIsRequestReviewModalVisible(true);
                    }}
                    rightIcon={
                      <SvgIcon
                        iconName={"ic-report.svg"}
                        size={20}
                        color={yellow700}
                      />
                    }
                  />
                </Tooltip>
              ) : null}
            </HStack>
          );
        })}
      </VStack>
      <RequestReviewModal
        isVisible={isRequestReviewModalVisible && !!selectedGrade}
        onClose={() => setIsRequestReviewModalVisible(false)}
        initGrade={selectedGrade ?? {}}
      />
    </VStack>
  );
};

export default observer(StudentGradeBoard);
