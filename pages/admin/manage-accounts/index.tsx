import AdminLayout from "components/Layout/AdminLayout";
import { Text, VStack, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { getCurrentUser } from "API/get/get.me";
import { getIn } from "yup";
import { useRouter } from "next/router";
import routes from "routes";
import { useStores } from "hooks/useStores";
import { auth } from "API";
const ManageAccounts = () => {
  const toast = useToast();
  const { authStore } = useStores();
  useEffect(() => {
    async function getInfoForCurrentUser() {
      const res = await getCurrentUser();
      if (res.role !== "admin") {
        toast({
          status: "error",
          description: "Your are not admin",
        });
        authStore.logout();
      }
    }
    getInfoForCurrentUser();
  }, []);
  return (
    <AdminLayout title="Manage accounts">
      <VStack w="full" flex={1} h="full" alignItems={"center"} p={5} gap={5}>
        <Text>Oh, hi</Text>
      </VStack>
    </AdminLayout>
  );
};
export default ManageAccounts;
