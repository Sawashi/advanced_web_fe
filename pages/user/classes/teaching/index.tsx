import withAuth from "HOCs/withAuth";
import { observer } from "mobx-react";
import UserLayout from "components/Layout/UserLayout";
import { useStores } from "hooks/useStores";
import { useEffect } from "react";
import ClassesList from "components/pages/Classes/ClassesList";
import { getValidArray } from "utils/common";
import { VStack } from "@chakra-ui/react";
import { useGetClassesAsTeacher } from "API/get/get.classes.teacher";

const TeachingClasses = () => {
  const { authStore, settingStore } = useStores();
  const { data: teachingClasses, isLoading: isLoadingTeachingClasses } =
    useGetClassesAsTeacher(authStore?.user?.id ?? "");

  useEffect(() => {
    settingStore?.setHeaderLoading(isLoadingTeachingClasses);
  }, [isLoadingTeachingClasses]);

  return (
    <UserLayout title="Home">
      <VStack w="full" flex={1} h="full" alignItems={"start"}>
        <ClassesList
          classes={getValidArray(teachingClasses?.data)}
          isLoading={isLoadingTeachingClasses}
        />
      </VStack>
    </UserLayout>
  );
};

export default withAuth(observer(TeachingClasses));
