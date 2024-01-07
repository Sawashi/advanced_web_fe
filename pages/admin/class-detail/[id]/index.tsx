import AdminLayout from "components/Layout/AdminLayout";
import {
  Box,
  Button,
  HStack,
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
import { ChangeEvent, useEffect, useState } from "react";
import { getCurrentUser } from "API/get/get.me";
import { getIn } from "yup";
import { useRouter } from "next/router";
import routes from "routes";
import { useStores } from "hooks/useStores";
import { auth } from "API";
import { getAllClasses, getClassDetails } from "API/get/get.class.details";
import { IClass, IStudent } from "interfaces/classes";
import {
  mapStudentId,
  softDeleteClass,
  unmapStudentId,
} from "API/patch/patch.class";
import { restoreClass } from "API/patch/patch.class";
import { getClassStudents } from "API/get/get.class.students";
import { useGetClassAttendees } from "API/get/get.class.attendees";
import { getValidArray } from "utils/common";
import { EClassRole } from "enums/classes";
import { CSVLink, CSVDownload } from "react-csv";
interface FileUploadButtonProps {
  onFileUpload: (data: string[][]) => void;
}
const ManageClasses = () => {
  const toast = useToast();
  const [classInfo, setClassInfo] = useState<IClass>();
  const [MemberList, setMemberList] = useState<IStudent[]>([]);
  const [ListToShow, setListToShow] = useState<IStudent[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [userIdInput, setUserIdInput] = useState<string>("");
  const { authStore } = useStores();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string>("");

  const router = useRouter();
  const MemberListSorted = ListToShow;

  const {
    data: attendees,
    isLoading,
    refetch,
  } = useGetClassAttendees(classInfo?.id ?? "");

  const [fileContent, setFileContent] = useState<string[][] | null>(null);
  const getMemberList = async () => {
    try {
      const res = await getClassStudents(router?.query?.id as string);
      setMemberList(res.data);
      setListToShow(res.data);
    } catch (error) {
      toast({
        status: "error",
        description: "Get user list failed",
      });
    }
  };
  const handleCSVData = async (data: string[][]) => {
    try {
      for (let i = 1; i < data.length; i++) {
        const studentId = data[i][1];
        const modifiedStudentId = studentId.slice(1);
        const userId = data[i][0];
        await mapStudentId(classInfo?.id as string, modifiedStudentId, userId);
      }
      await getMemberList();
      toast({
        status: "success",
        description: "Map student id successfully",
      });
    } catch (error) {
      toast({
        status: "error",
        description: "Some data failed to map, check csv again",
      });
    }
  };
  const header = [
    { label: "user_id", key: "user_id" },
    { label: "student_id", key: "student_id" },
  ];
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          const parsedData = parseCSV(result);
          setFileContent(parsedData);
          //Handle data here
          handleCSVData(parsedData);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to parse CSV file.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      };

      reader.readAsText(file);
    }
  };

  const parseCSV = (data: string): string[][] => {
    // Replace carriage return characters with an empty string
    const cleanedData = data.replace(/\r/g, "");
    return cleanedData.split("\n").map((line) => line.split(","));
  };

  const studentList = getValidArray(attendees?.data)?.filter(
    (item) => item?.role === EClassRole.STUDENT
  );

  const handleSort = (column: string) => {
    const newSortOrder =
      column === sortColumn && sortOrder === "asc" ? "desc" : "asc";

    setSortOrder(newSortOrder);
    setSortColumn(column);

    MemberListSorted?.sort((a, b) => {
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
      if (router.isReady) {
        const res = await getClassDetails(router.query.id as string);
        setClassInfo(res);
      }
    }

    getClassInfo();
    getInfoForCurrentUser();
    getMemberList();
  }, [router?.isReady]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleUserIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserIdInput(event.target.value);
  };

  useEffect(() => {
    setListToShow(
      MemberList?.filter((thisPerson) =>
        thisPerson?.id?.includes(inputValue ?? "")
      )
    );
  }, [inputValue]);

  useEffect(() => {
    setUserIdInput(userIdInput);
  }, [userIdInput]);

  const onClickMapStudentId = async (classId: string, studentId: string) => {
    try {
      const res = await mapStudentId(classId, studentId, userIdInput);
      toast({
        status: "success",
        description: "Map student id successfully",
      });
      try {
        await getMemberList();
      } catch (error) {}
    } catch (error) {
      toast({
        status: "error",
        description: "Map student id failed",
      });
    }
  };

  const onClickUnmapStudentId = async (classId: string, userId: string) => {
    try {
      const res = await unmapStudentId(classId, userId);
      toast({
        status: "success",
        description: "Unmap student id successfully",
      });
      try {
        await getMemberList();
      } catch (error) {}
    } catch (error) {
      toast({
        status: "error",
        description: "Map student id failed",
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
            placeholder="Search by student id"
            onChange={handleInputChange}
            value={inputValue}
          />
          <Heading as="h2" size="1xl" noOfLines={1}>
            Member list
          </Heading>
          <HStack>
            <>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <Button
                onClick={() =>
                  (
                    document.querySelector(
                      "input[type=file]"
                    ) as HTMLInputElement
                  )?.click()
                }
              >
                Upload CSV
              </Button>
            </>
            <CSVLink
              data={[]}
              headers={header}
              filename={"admin-student-manager-template.csv"}
            >
              <Button colorScheme="cyan" variant={"solid"}>
                Download template
              </Button>
            </CSVLink>
          </HStack>
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
                        <Button
                          colorScheme="red"
                          variant="solid"
                          onClick={() =>
                            onClickUnmapStudentId(
                              classInfo?.id as string,
                              member.user.id as string
                            )
                          }
                        >
                          Unmap
                        </Button>
                      ) : (
                        <Box>
                          <Input
                            width={"15"}
                            placeholder="User id"
                            onChange={handleUserIdChange}
                          ></Input>{" "}
                          <Button
                            colorScheme="green"
                            variant="solid"
                            onClick={() =>
                              onClickMapStudentId(
                                classInfo?.id as string,
                                member.id as string
                              )
                            }
                          >
                            Map
                          </Button>
                        </Box>
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
