import withAuth from "HOCs/withAuth";
import { observer } from "mobx-react";
import UserLayout from "components/Layout/UserLayout";
import { useGetClassesAsStudent } from "API/get/get.classes.student";
import { useStores } from "hooks/useStores";
import { useEffect } from "react";
import ClassesList from "components/pages/Classes/ClassesList";
import { getValidArray } from "utils/common";
import { VStack } from "@chakra-ui/react";

const EnrolledClasses = () => {
  const { authStore, settingStore } = useStores();
  const { data: studentClasses, isLoading: isLoadingStudentClasses } =
    useGetClassesAsStudent(authStore?.user?.id ?? "");

  useEffect(() => {
    settingStore?.setHeaderLoading(isLoadingStudentClasses);
  }, [isLoadingStudentClasses]);

  return (
    <UserLayout title="Home">
      <VStack w="full" flex={1} h="full" alignItems={"start"}>
        <ClassesList classes={getValidArray(studentClasses?.data)} />
      </VStack>
    </UserLayout>
  );
};

export default withAuth(observer(EnrolledClasses));
