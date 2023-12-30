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
import { gray400, gray500, red500 } from "theme/colors.theme";
import get from "lodash/get";
import { CSVLink } from "react-csv";
import { getTemplateStudentList } from "API/get/get.templates.student-list";

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
    onDeleteStudentList,
  } = useViewModel({ details });
  const [template, setTemplate] = React.useState<string>("");
  const csvRef = useRef<any>(null);

  const handleUploadList = (event: ChangeEvent<HTMLInputElement>) => {
    const file = get(event, "target.files[0]");
    if (file) {
      onUploadingStudentList(file);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const res = await getTemplateStudentList();
      setTemplate(res);
      csvRef?.current?.link?.click();
    } catch (error) {
      console.error(error);
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
            <MappedUserStudent item={student} isAbleToUnmap={isAbleToUnmap} />
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
              _hover={{
                bg: "red.300",
              }}
              rounded={"full"}
            >
              <SvgIcon
                iconName="ic-person-remove.svg"
                size={20}
                color={red500}
              />
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
          <VStack w={"full"} gap={0}>
            <HStack w={"full"} justifyContent={"space-between"} mb={5}>
              <Text fontSize={"xl"} fontWeight={"bold"}>
                Students
              </Text>

              <HStack
                alignItems={"center"}
                gap={2}
                onClick={() => {
                  setIsOpenCollapse(!isOpenCollapse);
                }}
              >
                <Text
                  fontSize={"md"}
                  fontWeight={"normal"}
                  _hover={{
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  {studentsList?.length} students
                </Text>
                <SvgIcon
                  iconName={isOpenCollapse ? "ic-up.svg" : "ic-down.svg"}
                />
              </HStack>
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

                {!isStudentOfClass && (
                  <HStack w={"full"} justifyContent={"space-between"} mt={2}>
                    <Text fontSize={"md"} fontWeight={"600"} color="red.500">
                      Delete all students
                    </Text>

                    <Button
                      variant={"icon"}
                      p={0}
                      onClick={() => {
                        onDeleteStudentList();
                        setIsOpenCollapse(false);
                      }}
                    >
                      <SvgIcon
                        iconName={"ic-delete.svg"}
                        size={30}
                        color={red500}
                      />
                    </Button>
                  </HStack>
                )}
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
        <VStack gap={10}>
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
                    rightIcon: (
                      <SvgIcon
                        iconName={"ic-upload.svg"}
                        size={25}
                        color={gray400}
                      />
                    ),
                  }
                : undefined
            }
          />

          <Button
            display={!isStudentOfClass ? "flex" : "none"}
            variant={"link"}
            onClick={handleDownloadTemplate}
            rightIcon={
              <SvgIcon iconName={"ic-download.svg"} size={25} color={gray500} />
            }
          >
            Download a sample CSV file
          </Button>

          <CSVLink
            data={template}
            filename={"sample.csv"}
            target="_blank"
            style={{ display: "none" }}
            ref={csvRef}
          ></CSVLink>
        </VStack>
      )}

      <Box display={"none"}>
        <input
          type="file"
          accept=".csv"
          onChange={handleUploadList}
          ref={fileRef}
        />
      </Box>
    </VStack>
  );
};

export default observer(StudentsScene);
