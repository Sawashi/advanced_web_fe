import { VStack, HStack, Text, Center, Spinner } from "@chakra-ui/react";
import { useGetGradesOfStudent } from "API/get/get.class.student-grades";
import EmptyList from "components/EmptyState/EmptyList";
import SvgIcon from "components/SvgIcon";
import { ETabName } from "enums/classes";
import { useStores } from "hooks/useStores";
import { IClass } from "interfaces/classes";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React from "react";
import routes from "routes";
import { green500 } from "theme/colors.theme";
import { getValidArray } from "utils/common";

interface Props {
  details: IClass;
}

const StudentGradeBoard = ({ details }: Props) => {
  const { classStore } = useStores();
  const router = useRouter();
  const { data: gradesList, isLoading: isLoadingGradesList } =
    useGetGradesOfStudent({
      classId: details?.id ?? "",
      studentId: classStore?.currentStudentId ?? "",
    });

  const totalGrade = React.useMemo(() => {
    return getValidArray(gradesList)?.reduce((acc, curr) => {
      return (
        acc + ((curr?.grade ?? 0) * (curr?.composition?.percentage ?? 0)) / 100
      );
    }, 0);
  }, [gradesList]);

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

  if (isLoadingGradesList) {
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
            {getValidArray(gradesList)?.length} items
          </Text>
        </HStack>

        <HStack w={"full"} justifyContent={"space-between"}>
          <Text fontSize={"md"} fontWeight={"normal"}>
            Total: {totalGrade} / 100
          </Text>
        </HStack>

        {getValidArray(gradesList)?.map((grade) => {
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
              <HStack>
                {isFinalized ? (
                  <SvgIcon
                    iconName={"ic-lock.svg"}
                    size={20}
                    color={green500}
                  />
                ) : null}
                <Text fontSize={"md"} fontWeight={"normal"}>
                  {grade?.composition?.name} ({grade?.composition?.percentage}%)
                </Text>
              </HStack>

              <Text fontSize={"md"} fontWeight={"normal"}>
                <Text fontSize={"md"} fontWeight={"bold"} as={"span"}>
                  {grade?.grade}
                </Text>{" "}
                / 100
              </Text>
            </HStack>
          );
        })}
      </VStack>
    </VStack>
  );
};

export default observer(StudentGradeBoard);
