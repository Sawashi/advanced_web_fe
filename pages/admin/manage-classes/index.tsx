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
import { getIn } from "yup";
import { useRouter } from "next/router";
import routes from "routes";
import { useStores } from "hooks/useStores";
import { auth } from "API";
import { getAllClasses, getClassDetails } from "API/get/get.class.details";
import { IClass } from "interfaces/classes";
import { softDeleteClass } from "API/patch/patch.class";
import { restoreClass } from "API/patch/patch.class";
import NewPagination from "components/NewPagination/NewPagination";
const ManageClasses = () => {
  const toast = useToast();
  const router = useRouter();
  const [ClassList, setClassList] = useState<IClass[]>([]);
  const [ListToShow, setListToShow] = useState<IClass[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const { authStore } = useStores();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string>(""); // Track the column to be sorted
  const [pageNow, setPageNow] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const ClassListSorted = ListToShow; // Create a copy to avoid mutating the original array

  const handleSort = (column: string) => {
    // If clicking on the same column, toggle the sort order
    const newSortOrder =
      column === sortColumn && sortOrder === "asc" ? "desc" : "asc";

    setSortOrder(newSortOrder);
    setSortColumn(column);

    ClassListSorted?.sort((a, b) => {
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
  const getClassListAtPage = async (pageNumber: number) => {
    try {
      const res1 = await getAllClasses(pageNumber.toString());
      setClassList(res1.data);
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
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const deactiveClass = async (id: string) => {
    try {
      await softDeleteClass(id);
      getClassListAtPage(pageNow);
      toast({
        status: "success",
        description: "Deactive class successfully",
      });
    } catch (error) {
      toast({
        status: "error",
        description: "Deactive class failed",
      });
    }
  };
  const activeClass = async (id: string) => {
    try {
      await restoreClass(id);
      getClassListAtPage(pageNow);
      toast({
        status: "success",
        description: "Active class successfully",
      });
    } catch (error) {
      toast({
        status: "error",
        description: "Active class failed",
      });
    }
  };
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
    getClassListAtPage(1);
  }, []);
  useEffect(() => {
    setListToShow(
      ClassList?.filter((thisClass) =>
        thisClass?.name?.includes(inputValue ?? "")
      )
    );
  }, [inputValue]);

  return (
    <AdminLayout title="Manage classes">
      <VStack w="full" flex={1} h="full" alignItems={"center"} p={5} gap={5}>
        <VStack w="full" flex={1} h="full" alignItems={"left"} p={5} gap={5}>
          <Heading as="h2" size="2xl" noOfLines={1}>
            Classes list
          </Heading>
          <Input
            variant="outline"
            placeholder="Search by name"
            onChange={handleInputChange}
            value={inputValue}
          />
          <TableContainer>
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th onClick={() => handleSort("id")}>
                    ID {renderSortIcon("id")}
                  </Th>
                  <Th onClick={() => handleSort("name")}>
                    Name {renderSortIcon("name")}
                  </Th>
                  <Th onClick={() => handleSort("owner")}>
                    Owner email {renderSortIcon("owner")}
                  </Th>
                  <Th onClick={() => handleSort("createdAt")}>
                    Created {renderSortIcon("createdAt")}
                  </Th>
                  <Th onClick={() => handleSort("status")}>
                    Status {renderSortIcon("status")}
                  </Th>
                  <Th>Functions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {ListToShow?.map((thisClass) => (
                  <Tr key={thisClass.id}>
                    <Td>{thisClass.id}</Td>
                    <Td>{thisClass.name}</Td>
                    <Td>{thisClass.owner?.email}</Td>
                    <Td>{thisClass.createdAt?.toString()}</Td>
                    <Td>
                      {thisClass.deletedAt ? (
                        <Tag variant="solid" colorScheme="cyan">
                          Deactived
                        </Tag>
                      ) : (
                        <Tag variant="solid" colorScheme="green">
                          Active
                        </Tag>
                      )}
                    </Td>
                    <Td>
                      {thisClass.deletedAt ? (
                        <Button
                          colorScheme="green"
                          variant="solid"
                          onClick={() =>
                            activeClass(thisClass.id?.toString() ?? "")
                          }
                        >
                          Active
                        </Button>
                      ) : (
                        <Button
                          colorScheme="red"
                          variant="solid"
                          onClick={() =>
                            deactiveClass(thisClass.id?.toString() ?? "")
                          }
                        >
                          Deactive
                        </Button>
                      )}
                      <Button
                        colorScheme="blue"
                        variant="solid"
                        style={{ marginLeft: "10px" }}
                        onClick={() => {
                          router.push("class-detail/" + thisClass.id);
                        }}
                      >
                        Detail
                      </Button>
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
            getUserListAtPage={getClassListAtPage}
          />
        </VStack>
      </VStack>
    </AdminLayout>
  );
};
export default ManageClasses;
