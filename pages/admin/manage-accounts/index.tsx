import AdminLayout from "components/Layout/AdminLayout";
import {
  Button,
  Heading,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "API/get/get.me";
import { getIn } from "yup";
import { useRouter } from "next/router";
import routes from "routes";
import { useStores } from "hooks/useStores";
import { auth } from "API";
import { getAllAccounts } from "API/get/get.account";
import { IUser } from "interfaces/user";
import { updateSomeoneAccount } from "API/patch/patch.auth.account";
const ManageAccounts = () => {
  const [userLists, setUserLists] = useState<IUser[]>();
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
    async function getUserLists() {
      const res = await getAllAccounts();
      console.log(res.data);
      if (res) {
        setUserLists(res.data);
      }
    }
    getInfoForCurrentUser();
    getUserLists();
  }, []);
  const onClickBan = async (id: string) => {
    try {
      const resBan = await updateSomeoneAccount(id, { status: "blocked" });
      if (resBan) {
        toast({
          status: "success",
          description: "Ban account successfully",
        });
      }
      try {
        const resReload = await getAllAccounts();
        if (resReload) {
          setUserLists(resReload.data);
        }
      } catch (error) {}
    } catch (error) {
      toast({
        status: "error",
        description: "Ban account failed",
      });
    }
  };
  const onClickUnban = async (id: string) => {
    try {
      const resBan = await updateSomeoneAccount(id, { status: "active" });
      if (resBan) {
        toast({
          status: "success",
          description: "Unban account successfully",
        });
      }
      try {
        const resReload = await getAllAccounts();
        if (resReload) {
          setUserLists(resReload.data);
        }
      } catch (error) {}
    } catch (error) {
      toast({
        status: "error",
        description: "Unban account failed",
      });
    }
  };
  return (
    <AdminLayout title="Manage accounts">
      <VStack w="full" flex={1} h="full" alignItems={"center"} p={5} gap={5}>
        <VStack w="full" flex={1} h="full" alignItems={"left"} p={5} gap={5}>
          <Heading as="h2" size="2xl" noOfLines={1}>
            Account list
          </Heading>
          <TableContainer>
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Status</Th>
                  <Th>Date created</Th>
                  <Th>Functions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {userLists?.map((user) => (
                  <Tr key={user.id}>
                    <Td>{user.firstName + " " + user.lastName}</Td>
                    <Td>{user.email}</Td>
                    <Td>
                      {user.status == "pending" ? (
                        <Tag variant="solid" colorScheme="yellow">
                          Pending
                        </Tag>
                      ) : (
                        <></>
                      )}
                      {user.status == "active" ? (
                        <Tag variant="solid" colorScheme="green">
                          Active
                        </Tag>
                      ) : (
                        <></>
                      )}
                      {user.status == "blocked" ? (
                        <Tag variant="solid" colorScheme="red">
                          Banned
                        </Tag>
                      ) : (
                        <></>
                      )}
                    </Td>
                    <Td>{user.createdAt?.toString()}</Td>
                    <Td>
                      {user.status == "pending" ? (
                        <Button
                          colorScheme="red"
                          variant="solid"
                          onClick={() => onClickBan(user.id ?? "")}
                        >
                          Ban
                        </Button>
                      ) : (
                        <></>
                      )}
                      {user.status == "active" ? (
                        <Button
                          colorScheme="red"
                          variant="solid"
                          onClick={() => onClickBan(user.id ?? "")}
                        >
                          Ban
                        </Button>
                      ) : (
                        <></>
                      )}
                      {user.status == "blocked" ? (
                        <Button
                          colorScheme="green"
                          variant="solid"
                          onClick={() => onClickUnban(user.id ?? "")}
                        >
                          Unban
                        </Button>
                      ) : (
                        <></>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </VStack>
      </VStack>
    </AdminLayout>
  );
};
export default ManageAccounts;
