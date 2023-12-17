import withAuth from "HOCs/withAuth";
import { observer } from "mobx-react";
import UserLayout from "components/Layout/UserLayout";
import { useStores } from "hooks/useStores";
import { useEffect } from "react";
import ClassesList from "components/pages/Classes/ClassesList";
import { getValidArray } from "utils/common";
import { VStack } from "@chakra-ui/react";
import { useGetClassesAsOwner } from "API/get/get.classes.owned";

const OwnedClasses = () => {
  const { authStore, settingStore } = useStores();
  const { data: ownedClasses, isLoading: isLoadingOwnedClasses } =
    useGetClassesAsOwner(authStore?.user?.id ?? "");

  useEffect(() => {
    settingStore?.setHeaderLoading(isLoadingOwnedClasses);
  }, [isLoadingOwnedClasses]);

  return (
    <UserLayout title="Home">
      <VStack w="full" flex={1} h="full" alignItems={"start"}>
        <ClassesList classes={getValidArray(ownedClasses?.data)} />
      </VStack>
    </UserLayout>
  );
};

export default withAuth(observer(OwnedClasses));
