import withAuth from "HOCs/withAuth";
import { observer } from "mobx-react";
import UserLayout from "components/Layout/UserLayout";
import { VStack } from "@chakra-ui/react";

const ClassDetail = () => {
  return (
    <UserLayout title="Class">
      <VStack
        w="full"
        flex={1}
        h="full"
        alignItems={"center"}
        p={5}
        gap={5}
      ></VStack>
    </UserLayout>
  );
};

export default withAuth(observer(ClassDetail));
