import {
  VStack,
  Text,
  Box,
  Tag,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  HStack,
  Collapse,
} from "@chakra-ui/react";
import { IClass } from "interfaces/classes";
import { observer } from "mobx-react";
import React, { ChangeEvent, useMemo, useRef } from "react";
import { useStores } from "hooks/useStores";
import { checkValidArray, getValidArray } from "utils/common";
import EmptyList from "components/EmptyState/EmptyList";
import Table from "components/Table";
import { getCaseHeaderList } from "./utils";
import useViewModel from "./useViewModel";
import MappedUserStudent from "./MappedUserStudent";
import SvgIcon from "components/SvgIcon";
import { red500 } from "theme/colors.theme";
import get from "lodash/get";

export interface Props {
  details: IClass;
}
interface IStudentTableData {
  studentId: JSX.Element;
  studentName: JSX.Element;
  user: JSX.Element;
  action: JSX.Element | null;
}

const StudentsScene = ({ details }: Props) => {
  const { authStore } = useStores();
  const [isOpenCollapse, setIsOpenCollapse] = React.useState(false);
  const fileRef = useRef<any>(null);
  const {
    studentsList,
    isStudentOfClass,
    isAssignable,
    onMappingStudent,
    onUnmappingStudent,
    orderBy,
    setOrderBy,
    sort,
    setSort,
    unMappedAttendeeStudentList,
    onUploadingStudentList,
  } = useViewModel({ details });

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = get(event, "target.files[0]");
    if (file) {
      onUploadingStudentList(file);
    }
  };

  const tableData: IStudentTableData[] = useMemo(() => {
    const data = getValidArray(studentsList)?.map((student) => {
      const isCurrentStudent = student?.user?.id === authStore?.user?.id;
      const isAbleToUnmap = !isStudentOfClass || isCurrentStudent;

      return {
        studentId: (
          <Tag
            borderRadius={16}
            paddingX="10px"
            whiteSpace="nowrap"
            fontWeight={"bold"}
            bgColor={isCurrentStudent ? "orange.100" : "gray.200"}
            color={isCurrentStudent ? "orange.400" : "gray.800"}
          >
            {student?.id}
          </Tag>
        ),
        studentName: (
          <Text
            noOfLines={1}
            w={"full"}
            fontSize={"md"}
            fontWeight={"600"}
            color={isCurrentStudent ? "orange.400" : "gray.800"}
          >
            {student?.name}
          </Text>
        ),
        user: isStudentOfClass ? (
          !student?.user ? (
            // student
            <Button
              size="sm"
              background="white"
              border="1px solid #A9A9A9"
              onClick={() => {
                onMappingStudent(authStore?.user?.id ?? "", student?.id ?? "");
              }}
              isDisabled={!isAssignable}
              display={isAssignable ? "flex" : "none"}
            >
              Assign
            </Button>
          ) : (
            <MappedUserStudent item={student} />
          )
        ) : (
          // teacher
          <Menu>
            <MenuButton>
              {!student?.user ? (
                <Button
                  size="sm"
                  background="white"
                  border="1px solid #A9A9A9"
                  isDisabled={!isAssignable}
                  display={isAssignable ? "flex" : "none"}
                >
                  Select
                </Button>
              ) : (
                <MappedUserStudent
                  item={student}
                  isAbleToUnmap={isAbleToUnmap}
                />
              )}
            </MenuButton>
            <MenuList>
              {getValidArray(unMappedAttendeeStudentList)?.map((attendee) => (
                <MenuItem
                  key={attendee?.user?.id}
                  onClick={() => {
                    onMappingStudent(
                      attendee?.user?.id ?? "",
                      student?.id ?? ""
                    );
                  }}
                  display={"flex"}
                  alignItems={"center"}
                  flexDir={"row"}
                  justifyContent={"space-between"}
                  gap={2}
                >
                  <Avatar
                    size="xs"
                    name={
                      attendee?.user?.firstName + " " + attendee?.user?.lastName
                    }
                    src={attendee?.user?.avatar}
                  />
                  <Text noOfLines={1} w={"full"} fontSize={"md"}>
                    {attendee?.user?.firstName + " " + attendee?.user?.lastName}
                  </Text>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        ),
        action:
          !!student?.user && isAbleToUnmap ? (
            <Button
              isDisabled={!isAbleToUnmap}
              onClick={() => {
                onUnmappingStudent(student?.user?.id ?? "");
              }}
              display={isAbleToUnmap ? "flex" : "none"}
              variant={"icon"}
              p={0}
            >
              <SvgIcon iconName="ic-delete.svg" size={20} color={red500} />
            </Button>
          ) : null,
      };
    });

    return data;
  }, [
    studentsList,
    authStore?.user,
    isAssignable,
    isStudentOfClass,
    unMappedAttendeeStudentList,
  ]);

  return (
    <VStack alignSelf={"center"} alignItems={"center"}>
      {checkValidArray(studentsList) ? (
        <VStack
          w={"full"}
          p={10}
          borderColor={"gray.300"}
          alignItems={"start"}
          h={"full"}
          gap={5}
        >
          <VStack w={"full"} gap={5}>
            <HStack w={"full"} justifyContent={"space-between"}>
              <Text fontSize={"xl"} fontWeight={"bold"}>
                Students
              </Text>

              <Text
                fontSize={"md"}
                fontWeight={"normal"}
                _hover={{
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => {
                  setIsOpenCollapse(!isOpenCollapse);
                }}
              >
                {studentsList?.length} students
              </Text>
            </HStack>
            <Collapse
              in={isOpenCollapse}
              animateOpacity
              style={{
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                width: "100%",
              }}
            >
              <VStack w={"full"} alignItems={"start"} p={5} gap={3}>
                <HStack w={"full"} justifyContent={"space-between"}>
                  <Text fontSize={"md"} fontWeight={"500"}>
                    Mapped students
                  </Text>

                  <Text fontSize={"md"} fontWeight={"normal"}>
                    {studentsList?.filter((item) => !!item?.user)?.length}{" "}
                    students
                  </Text>
                </HStack>

                <HStack w={"full"} justifyContent={"space-between"}>
                  <Text fontSize={"md"} fontWeight={"500"}>
                    Unmapped attendees
                  </Text>

                  <Text fontSize={"md"} fontWeight={"normal"}>
                    {unMappedAttendeeStudentList?.length} students
                  </Text>
                </HStack>
              </VStack>
            </Collapse>
          </VStack>

          <Box flex={1} width="full">
            <Table
              tableData={tableData}
              headerList={getCaseHeaderList()}
              setSort={setSort}
              setOrderBy={setOrderBy}
              sort={sort}
              orderBy={orderBy}
            />
          </Box>
        </VStack>
      ) : (
        <EmptyList
          title="Seems like there's no students in this class"
          description={
            !isStudentOfClass
              ? "Create a list of students to start adding grades"
              : "The teacher hasn't added any students yet"
          }
          _button={
            !isStudentOfClass
              ? {
                  text: "Upload students",
                  onClick: () => {
                    fileRef && fileRef.current && fileRef.current.click();
                  },
                }
              : undefined
          }
        />
      )}

      <Box display={"none"}>
        <input
          type="file"
          //csv file
          accept=".csv"
          onChange={handleImageChange}
          ref={fileRef}
        />
      </Box>
    </VStack>
  );
};

export default observer(StudentsScene);
