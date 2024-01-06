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
import { getClassStudents } from "API/get/get.class.students";
const ManageClasses = () => {
  const toast = useToast();
  const [classInfo, setClassInfo] = useState<IClass>();
  const [MemberList, setMemberList] = useState<IClass[]>([]);
  const [ListToShow, setListToShow] = useState<IClass[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const { authStore } = useStores();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string>(""); // Track the column to be sorted
  const router = useRouter();
  const MemberListSorted = ListToShow; // Create a copy to avoid mutating the original array

  const handleSort = (column: string) => {
    // If clicking on the same column, toggle the sort order
    const newSortOrder =
      column === sortColumn && sortOrder === "asc" ? "desc" : "asc";

    setSortOrder(newSortOrder);
    setSortColumn(column);

    MemberListSorted?.sort((a, b) => {
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
  const getMemberList = async () => {
    try {
      const res = await getClassStudents(router.query.id as string);
      setMemberList(res.data);
      setListToShow(res.data);
      console.log(res.data);
    } catch (error) {
      toast({
        status: "error",
        description: "Get user list failed",
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
    async function getClassInfo() {
      const res = await getClassDetails(router.query.id as string);
      setClassInfo(res);
    }
    getClassInfo();
    getInfoForCurrentUser();
    getMemberList();
    console.log(router.query?.id);
  }, []);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  useEffect(() => {
    setListToShow(
      MemberList?.filter((thisClass) =>
        thisClass?.name?.includes(inputValue ?? "")
      )
    );
  }, [inputValue]);
  const deactiveClass = async (id: string) => {
    try {
      await softDeleteClass(id);
      getMemberList();
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
      getMemberList();
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
  return (
    <AdminLayout title="Manage classes">
      <VStack w="full" flex={1} h="full" alignItems={"center"} p={5} gap={5}>
        <VStack w="full" flex={1} h="full" alignItems={"left"} p={5} gap={5}>
          <Heading as="h2" size="2xl" noOfLines={1}>
            {classInfo?.name}
          </Heading>
          <Input
            variant="outline"
            placeholder="Search by name"
            onChange={handleInputChange}
            value={inputValue}
          />
          <Heading as="h2" size="1xl" noOfLines={1}>
            Member list
          </Heading>
          <TableContainer>
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th onClick={() => handleSort("name")}>
                    Name {renderSortIcon("name")}
                  </Th>
                  <Th onClick={() => handleSort("name")}>
                    Student ID {renderSortIcon("name")}
                  </Th>
                  <Th onClick={() => handleSort("name")}>
                    User ID {renderSortIcon("name")}
                  </Th>
                  <Th onClick={() => handleSort("name")}>
                    Mapped status {renderSortIcon("name")}
                  </Th>
                  <Th>Function</Th>
                </Tr>
              </Thead>
              <Tbody>
                {ListToShow?.map((member) => (
                  <Tr key={member.id}>
                    <Td>{member.name}</Td>
                    <Td>{member.id}</Td>
                    {member?.user?.id ? (
                      <Td>{member.user.id}</Td>
                    ) : (
                      <Td>Not mapped</Td>
                    )}
                    <Td>
                      {member?.user?.id ? (
                        <Tag variant="solid" colorScheme="green">
                          Mapped
                        </Tag>
                      ) : (
                        <Tag variant="solid" colorScheme="red">
                          Unmapped
                        </Tag>
                      )}
                    </Td>
                    <Td>
                      {member?.user?.id ? (
                        <Button colorScheme="red" variant="solid">
                          Unmap
                        </Button>
                      ) : (
                        <Button colorScheme="green" variant="solid">
                          Map
                        </Button>
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
export default ManageClasses;
