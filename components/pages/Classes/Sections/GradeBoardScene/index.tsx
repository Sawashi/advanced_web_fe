import {
  Center,
  HStack,
  Spinner,
  VStack,
  Text,
  Button,
} from "@chakra-ui/react";
import EmptyList from "components/EmptyState/EmptyList";
import Table from "components/Table";
import { ETabName } from "enums/classes";
import { useStores } from "hooks/useStores";
import { IClass } from "interfaces/classes";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import routes from "routes";
import useGradeBoardTable from "./useGradeBoardTable";
import SvgIcon from "components/SvgIcon";
import { CSVLink } from "react-csv";
import { useGetClassGradeBoard } from "API/get/get.class.export-grade-board";
import { getGradesTemplate } from "API/get/get.templates.student-list";
import { gray400 } from "theme/colors.theme";

interface Props {
  details: IClass;
}

const GradeBoardScene = ({ details }: Props) => {
  const router = useRouter();
  const { settingStore, classStore } = useStores();
  const { studentList } = classStore;
  const {
    tableData,
    headerList,
    isHeaderEmpty,
    isLoadingGradeBoard,
    isRowsEmpty,
  } = useGradeBoardTable(details?.id ?? "");
  const { mutateAsync: getGradeBoard, isLoading: isLoadingExportGradeBoard } =
    useGetClassGradeBoard(details?.id ?? "");
  settingStore?.setHeaderLoading(
    isLoadingGradeBoard || isLoadingExportGradeBoard
  );

  const [gradeCSV, setGradeCSV] = React.useState<string>("");
  const [templateCSV, setTemplateCSV] = React.useState<string>("");
  const csvRef = useRef<any>(null);
  const templateCSVRef = useRef<any>(null);

  const handleExportGradeBoard = async () => {
    try {
      const res = await getGradeBoard();
      setGradeCSV(res);
      setTimeout(() => {
        csvRef?.current?.link?.click();
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  const onDownloadTemplate = async () => {
    try {
      const res = await getGradesTemplate();
      const studentIds = studentList?.map((student) => student?.id);
      const template =
        res + studentIds?.map((studentId) => `${studentId},`).join("\n");
      setTemplateCSV(template);
      setTimeout(() => {
        templateCSVRef?.current?.link?.click();
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  const goToGradeStructure = async () => {
    await router.push(
      routes.classes.details.value(details?.id ?? "", ETabName.GradeStructure)
    );
    router.reload();
  };

  const goToStudents = async () => {
    await router.push(
      routes.classes.details.value(details?.id ?? "", ETabName.Students)
    );
    router.reload();
  };

  if (isLoadingGradeBoard) {
    return (
      <Center mt={20}>
        <Spinner boxSize={30} />
      </Center>
    );
  }

  return (
    <VStack alignSelf={"center"} alignItems={"center"} h="full" flex={1}>
      {isHeaderEmpty ? (
        <EmptyList
          title={"Compositions are empty"}
          description={"Please add some compositions"}
          _button={{
            text: "Add composition",
            onClick: goToGradeStructure,
          }}
        />
      ) : isRowsEmpty ? (
        <EmptyList
          title={"Grade board is empty"}
          description={"Please add some students"}
          _button={{
            text: "Add student",
            onClick: goToStudents,
          }}
        />
      ) : (
        <VStack
          w={"full"}
          p={10}
          borderColor={"gray.300"}
          alignItems={"start"}
          h={"full"}
          gap={5}
        >
          <HStack w={"full"} justifyContent={"space-between"}>
            <Text fontSize={"xl"} fontWeight={"bold"}>
              Grade board
            </Text>

            <HStack>
              <Button
                variant={"ghost"}
                onClick={onDownloadTemplate}
                rightIcon={
                  <SvgIcon
                    iconName={"ic-download.svg"}
                    size={20}
                    color={gray400}
                  />
                }
              >
                <Text fontSize={"md"} fontWeight={"bold"}>
                  Download template
                </Text>
              </Button>

              <Button
                variant={"primary"}
                onClick={handleExportGradeBoard}
                rightIcon={
                  <SvgIcon iconName={"ic-export.svg"} size={20} color="white" />
                }
              >
                <Text fontSize={"md"} fontWeight={"bold"}>
                  Export
                </Text>
              </Button>

              <CSVLink
                data={gradeCSV}
                filename={`${details?.name
                  ?.toLowerCase()
                  ?.replaceAll(" ", "-")}-${details?.id}-grades.csv`}
                target="_blank"
                style={{ display: "none" }}
                asyncOnClick={true}
                ref={csvRef}
              />

              <CSVLink
                data={templateCSV}
                filename={`${details?.name
                  ?.toLowerCase()
                  ?.replaceAll(" ", "-")}-${details?.id}-grades-template.csv`}
                target="_blank"
                style={{ display: "none" }}
                asyncOnClick={true}
                ref={templateCSVRef}
              />
            </HStack>
          </HStack>
          <Table
            tableData={tableData}
            headerList={headerList}
            hasNoSort={true}
          />
        </VStack>
      )}
    </VStack>
  );
};

export default observer(GradeBoardScene);
