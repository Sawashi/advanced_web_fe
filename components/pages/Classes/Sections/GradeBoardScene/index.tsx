import {
  Center,
  HStack,
  Spinner,
  VStack,
  Text,
  Button,
} from "@chakra-ui/react";
import { useGetGradeBoard } from "API/get/get.class.grade-boards";
import EmptyList from "components/EmptyState/EmptyList";
import Table from "components/Table";
import { ETabName } from "enums/classes";
import { useStores } from "hooks/useStores";
import { IClass } from "interfaces/classes";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import routes from "routes";
import { checkValidArray, getValidArray } from "utils/common";
import useGradeBoardTable, { getCaseHeaderList } from "./useGradeBoardTable";
import SvgIcon from "components/SvgIcon";
import { CSVLink } from "react-csv";
import { useGetClassGradeBoard } from "API/get/get.class.export-grade-board";

interface Props {
  details: IClass;
}

const GradeBoardScene = ({ details }: Props) => {
  const router = useRouter();
  const { settingStore } = useStores();
  const { data: gradeBoard, isLoading: isLoadingGradeBoard } = useGetGradeBoard(
    details?.id ?? ""
  );
  const { mutateAsync: getGradeBoard, isLoading: isLoadingExportGradeBoard } =
    useGetClassGradeBoard(details?.id ?? "");
  settingStore?.setHeaderLoading(isLoadingGradeBoard || isLoadingExportGradeBoard);
  const isHeaderEmpty = !checkValidArray(gradeBoard?.header?.compositions);
  const isRowsEmpty = !checkValidArray(gradeBoard?.rows);
  const { tableData } = useGradeBoardTable(gradeBoard);
  const [template, setTemplate] = React.useState<string>("");
  const csvRef = useRef<any>(null);

  const handleExportGradeBoard = async () => {
    try {
      const res = await getGradeBoard();
      setTemplate(res);
      setTimeout(() => {
        csvRef?.current?.link?.click();
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
    <VStack alignSelf={"center"} alignItems={"center"}>
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
              data={template}
              filename={"grade-board-template.csv"}
              target="_blank"
              style={{ display: "none" }}
              asyncOnClick={true}
              ref={csvRef}
            />
          </HStack>
          <Table
            tableData={tableData}
            headerList={getCaseHeaderList(
              getValidArray(gradeBoard?.header?.compositions)
            )}
            hasNoSort={true}
          />
        </VStack>
      )}
    </VStack>
  );
};

export default observer(GradeBoardScene);
