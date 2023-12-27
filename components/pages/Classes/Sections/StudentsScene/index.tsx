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
} from "@chakra-ui/react";
import { IClass } from "interfaces/classes";
import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { useStores } from "hooks/useStores";
import { checkValidArray, getValidArray } from "utils/common";
import EmptyList from "components/EmptyState/EmptyList";
import Table from "components/Table";
import { getCaseHeaderList } from "./utils";
import useViewModel from "./useViewModel";
import MappedUserStudent from "./MappedUserStudent";

export interface Props {
  details: IClass;
}
interface IStudentTableData {
  studentId: JSX.Element;
  studentName: JSX.Element;
  action: JSX.Element;
}

const StudentsScene = ({ details }: Props) => {
  const { settingStore, classStore, authStore } = useStores();
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
  } = useViewModel({ details });

  console.log(unMappedAttendeeStudentList);

  const tableData: IStudentTableData[] = useMemo(() => {
    const data = getValidArray(studentsList)?.map((student) => {
      const isCurrentStudent = student?.user?.id === authStore?.user?.id;

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
        action: isStudentOfClass ? (
          !student?.user ? (
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
            <MappedUserStudent item={student} onRemove={onUnmappingStudent} />
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
                  onRemove={onUnmappingStudent}
                />
              )}
            </MenuButton>
            <MenuList>
              {unMappedAttendeeStudentList?.map((attendee) => (
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
      };
    });

    return data;
  }, [studentsList, authStore?.user, isAssignable, isStudentOfClass]);

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
                  onClick: () => {},
                }
              : undefined
          }
        />
      )}
    </VStack>
  );
};

export default observer(StudentsScene);
