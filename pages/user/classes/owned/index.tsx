import withAuth from "HOCs/withAuth";
import { observer } from "mobx-react";
import UserLayout from "components/Layout/UserLayout";
import { useStores } from "hooks/useStores";
import { useEffect, useState } from "react";
import ClassesList from "components/pages/Classes/ClassesList";
import { getValidArray } from "utils/common";
import { VStack, Text, Input, HStack, Box } from "@chakra-ui/react";
import { useGetClassesAsOwner } from "API/get/get.classes.owned";
import { debounce } from "lodash";
import SvgIcon from "components/SvgIcon";
import { gray500 } from "theme/colors.theme";

const OwnedClasses = () => {
  const { authStore, settingStore } = useStores();
  const [search, setSearch] = useState<string>("");
  const {
    data: ownedClasses,
    isLoading: isLoadingOwnedClasses,
    refetch,
  } = useGetClassesAsOwner(authStore?.user?.id ?? "", {
    search,
  });

  const debouncedSearch = debounce((value: string) => {
    setSearch(value);
  }, 500);

  useEffect(() => {
    settingStore?.setHeaderLoading(isLoadingOwnedClasses);
  }, [isLoadingOwnedClasses]);

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
          Owned Classes
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
          classes={getValidArray(ownedClasses?.data)}
          typeOfClass="Owned"
          isLoading={isLoadingOwnedClasses}
        />
      </VStack>
    </UserLayout>
  );
};

export default withAuth(observer(OwnedClasses));
