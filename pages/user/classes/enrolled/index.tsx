import withAuth from "HOCs/withAuth";
import { observer } from "mobx-react";
import UserLayout from "components/Layout/UserLayout";
import { useGetClassesAsStudent } from "API/get/get.classes.student";
import { useStores } from "hooks/useStores";
import { useEffect, useState } from "react";
import ClassesList from "components/pages/Classes/ClassesList";
import { getValidArray } from "utils/common";
import { VStack, Text, HStack, Input } from "@chakra-ui/react";
import SvgIcon from "components/SvgIcon";
import { gray500 } from "theme/colors.theme";
import { debounce } from "lodash";

const EnrolledClasses = () => {
  const { authStore, settingStore } = useStores();
  const [search, setSearch] = useState<string>("");
  const {
    data: studentClasses,
    isLoading: isLoadingStudentClasses,
    refetch,
  } = useGetClassesAsStudent(authStore?.user?.id ?? "", {
    search,
  });
  const debouncedSearch = debounce((value: string) => {
    setSearch(value);
  }, 500);

  useEffect(() => {
    settingStore?.setHeaderLoading(isLoadingStudentClasses);
  }, [isLoadingStudentClasses]);

  return (
    <UserLayout
      title="Home"
      onCloseCreateClassModal={() => {
        refetch();
      }}
      onCloseJoinClassModal={() => {
        refetch();
      }}
    >
      <VStack w="full" flex={1} h="full" alignItems={"start"} p={5} gap={5}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Enrolled Classes
        </Text>
        <HStack w="full" alignItems={"center"}>
          <SvgIcon iconName="ic-search.svg" color={gray500} size={25} />
          <Input
            placeholder="Search"
            w="full"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </HStack>
        <ClassesList
          classes={getValidArray(studentClasses?.data)}
          typeOfClass="Enrolled"
          isLoading={isLoadingStudentClasses}
        />
      </VStack>
    </UserLayout>
  );
};

export default withAuth(observer(EnrolledClasses));
