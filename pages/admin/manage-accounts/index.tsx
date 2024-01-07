import AdminLayout from "components/Layout/AdminLayout";
import {
  Button,
  Heading,
  Input,
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
import { useStores } from "hooks/useStores";
import { getAllAccounts } from "API/get/get.account";
import { IUser } from "interfaces/user";

import { updateSomeoneAccount } from "API/patch/patch.auth.account";
import NewPagination from "components/NewPagination/NewPagination";
import { set } from "lodash";
import { useRouter } from "next/router";
const ManageAccounts = () => {
  const [userLists, setUserLists] = useState<IUser[]>();
  const [ListToShow, setListToShow] = useState<IUser[]>();
  const toast = useToast();
  const [inputValue, setInputValue] = useState<string>("");
  const { authStore } = useStores();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string>(""); // Track the column to be sorted
  const [pageNow, setPageNow] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const userListsSorted = ListToShow; // Create a copy to avoid mutating the original array
  const router = useRouter();
  const handleSort = (column: string) => {
    // If clicking on the same column, toggle the sort order
    const newSortOrder =
      column === sortColumn && sortOrder === "asc" ? "desc" : "asc";

    setSortOrder(newSortOrder);
    setSortColumn(column);

    userListsSorted?.sort((a, b) => {
      // Sort alphabetically based on the column
      const valueA = String(a[column]).toLowerCase();
      const valueB = String(b[column]).toLowerCase();

      return newSortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };
  const renderSortIcon = (column: string) => {
    if (column === sortColumn) {
      return sortOrder === "asc" ? (
        <Text as="span">v</Text>
      ) : (
        <Text as="span">^</Text>
      );
    }
    return null;
  };
  const getUserListsAtPage = async (pageNumber: number) => {
    try {
      const res1 = await getAllAccounts(pageNumber.toString());
      setUserLists(res1.data);
      setListToShow(res1.data);
      setPageNow(pageNumber);
      setTotalPages(res1.meta.totalPages);
    } catch (error) {
      toast({
        status: "error",
        description: "Get user list failed",
      });
    }
  };
  useEffect(() => {
    async function getInfoForCurrentUser() {
      try {
        const res = await getCurrentUser();
        if (res.role !== "admin") {
          toast({
            status: "error",
            description: "Your are not admin",
          });
          authStore.logout();
        } else {
          getUserListsAtPage(1);
        }
      } catch (error) {
        toast({
          status: "error",
          description: "Something went wrong",
        });
        router.push("auth/login");
      }
    }
    getInfoForCurrentUser();
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
        await getUserListsAtPage(pageNow);
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
        await getUserListsAtPage(pageNow);
      } catch (error) {}
    } catch (error) {
      toast({
        status: "error",
        description: "Unban account failed",
      });
    }
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  useEffect(() => {
    setListToShow(
      userLists?.filter((user) => user?.email?.includes(inputValue ?? ""))
    );
  }, [inputValue]);
  useEffect(() => {
    console.log("Page useEffect: " + pageNow);
  }, [pageNow]);
  return (
    <AdminLayout title="Manage accounts">
      <VStack w="full" flex={1} h="full" alignItems={"center"} p={5} gap={5}>
        <VStack w="full" flex={1} h="full" alignItems={"left"} p={5} gap={5}>
          <Heading as="h2" size="2xl" noOfLines={1}>
            Account list
          </Heading>
          <Input
            variant="outline"
            placeholder="Search by email"
            onChange={handleInputChange}
            value={inputValue}
          />
          <TableContainer>
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th onClick={() => handleSort("userId")}>
                    ID {renderSortIcon("userId")}
                  </Th>
                  <Th onClick={() => handleSort("firstName")}>
                    Name {renderSortIcon("firstName")}
                  </Th>
                  <Th onClick={() => handleSort("email")}>
                    Email {renderSortIcon("email")}
                  </Th>
                  <Th onClick={() => handleSort("status")}>
                    Status {renderSortIcon("status")}
                  </Th>
                  <Th onClick={() => handleSort("createdAt")}>
                    Date created {renderSortIcon("createdAt")}
                  </Th>
                  <Th onClick={() => handleSort("status")}>
                    Role {renderSortIcon("status")}
                  </Th>
                  <Th>Functions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {ListToShow?.map((user) => (
                  <Tr key={user.id}>
                    <Td>{user.id}</Td>
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
                    <Td>{user.role}</Td>
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
          <NewPagination
            currentPage={pageNow}
            totalPages={totalPages}
            isDisabled={false}
            getUserListAtPage={getUserListsAtPage}
          />
        </VStack>
      </VStack>
    </AdminLayout>
  );
};
export default ManageAccounts;
