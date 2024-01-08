import withAuth from "HOCs/withAuth";
import { observer } from "mobx-react";
import UserLayout from "components/Layout/UserLayout";
import { VStack, Text, HStack, useToast } from "@chakra-ui/react";
import { useStores } from "hooks/useStores";
import { useGetClassesAsStudent } from "API/get/get.classes.student";
import { useEffect, useMemo } from "react";
import { useGetClassesAsOwner } from "API/get/get.classes.owned";
import { useGetClassesAsTeacher } from "API/get/get.classes.teacher";
import ClassesList from "components/pages/Classes/ClassesList";
import { getValidArray } from "utils/common";
import routes from "routes";
import Link from "next/link";
import SvgIcon from "components/SvgIcon";
import { checkValidArray } from "utils/common";

const Home = () => {
  const { authStore, settingStore } = useStores();
  const query = {
    limit: 3,
  };
  const { data: studentClasses, isLoading: isLoadingStudentClasses } =
    useGetClassesAsStudent(authStore?.user?.id ?? "", query);

  const { data: ownedClasses, isLoading: isLoadingOwnedClasses } =
    useGetClassesAsOwner(authStore?.user?.id ?? "", query);

  const { data: teachingClasses, isLoading: isLoadingTeachingClasses } =
    useGetClassesAsTeacher(authStore?.user?.id ?? "", query);

  useEffect(() => {
    settingStore?.setHeaderLoading(
      isLoadingStudentClasses ||
        isLoadingOwnedClasses ||
        isLoadingTeachingClasses
    );
  }, [
    isLoadingStudentClasses,
    isLoadingOwnedClasses,
    isLoadingTeachingClasses,
  ]);

  const showingList = useMemo(() => {
    return [
      {
        title: "Enrolled",
        data: studentClasses?.data,
        goTo: routes.user.enrolled_classes.value,
        total: studentClasses?.meta?.totalItems ?? 0,
      },
      {
        title: "Teaching",
        data: teachingClasses?.data,
        goTo: routes.user.teaching_classes.value,
        total: teachingClasses?.meta?.totalItems ?? 0,
      },
      {
        title: "Owned",
        data: ownedClasses?.data,
        goTo: routes.user.owned_classes.value,
        total: ownedClasses?.meta?.totalItems ?? 0,
      },
    ];
  }, [studentClasses, ownedClasses, teachingClasses]);

  return (
    <UserLayout title="Home">
      <VStack w="full" flex={1} h="full" alignItems={"center"} p={5} gap={5}>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="text.primary"
          textAlign="center"
          borderRadius={10}
        >
          {`Welcome,`}
          <Text
            as="span"
            fontSize="2xl"
            fontWeight="bold"
            color="green.500"
            textAlign="center"
            borderRadius={10}
          >
            {` ${
              (authStore?.user?.firstName ?? "") +
              " " +
              (authStore?.user?.lastName ?? "")
            }`}
          </Text>
        </Text>

        <VStack
          w="full"
          alignItems={"start"}
          justifyContent="space-between"
          p={5}
        >
          {getValidArray(showingList)?.map((item) =>
            checkValidArray(item?.data) ? (
              <VStack w="full" alignItems={"start"} key={item?.title}>
                <HStack
                  w="full"
                  flex={1}
                  alignItems={"start"}
                  justifyContent="space-between"
                >
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color="text.primary"
                    textAlign="center"
                  >
                    {item?.title}
                  </Text>
                  <Link href={item?.goTo} passHref>
                    <HStack
                      cursor="pointer"
                      alignItems={"center"}
                      justifyContent="space-between"
                    >
                      <Text
                        fontSize="lg"
                        color="text.primary"
                        textAlign="center"
                        _hover={{
                          color: "green.500",
                        }}
                      >
                        {`${item?.total ?? 0} classes`}
                      </Text>
                      <SvgIcon iconName="ic-right.svg" />
                    </HStack>
                  </Link>
                </HStack>
                <ClassesList
                  classes={getValidArray(item?.data)}
                  typeOfClass={item?.title}
                  isLoading={settingStore?.isHeaderLoading}
                />
              </VStack>
            ) : null
          )}
        </VStack>
      </VStack>
    </UserLayout>
  );
};

export default withAuth(observer(Home));
