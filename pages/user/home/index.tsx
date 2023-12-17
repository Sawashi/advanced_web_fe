import withAuth from "HOCs/withAuth";
import { observer } from "mobx-react";
import UserLayout from "components/Layout/UserLayout";
import { VStack, Text } from "@chakra-ui/react";
import { useStores } from "hooks/useStores";

const Home = () => {
  const { authStore } = useStores();
  return (
    <UserLayout title="Home">
      <VStack w="full" flex={1} h="full" alignItems={"start"} p={5}>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="text.primary"
          textAlign="center"
        >
          {`Welcome, ${authStore?.user?.firstName} ${authStore?.user?.lastName}`}
        </Text>
      </VStack>
    </UserLayout>
  );
};

export default withAuth(observer(Home));
