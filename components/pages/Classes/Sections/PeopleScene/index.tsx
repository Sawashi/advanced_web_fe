import {
  VStack,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { useGetClassAttendees } from "API/get/get.class.attendees";
import { EClassRole } from "enums/classes";
import { useStores } from "hooks/useStores";
import { IClass, IAttendeeProfile } from "interfaces/classes";
import { observer } from "mobx-react";
import React from "react";
import { getValidArray } from "utils/common";
import Teachers from "./Teachers";
import Attendance from "./Attendance";
import Students from "./Students";

interface Props {
  details: IClass;
}

const Owner = ({ owner }: { owner?: IAttendeeProfile }) => {
  return (
    <VStack
      divider={<Divider h={"1px"} w={"full"} bgColor={"blue.800"} />}
      w={"full"}
      alignItems={"start"}
      gap={5}
    >
      <Heading size="lg">Owner</Heading>
      <Attendance profile={owner} />
    </VStack>
  );
};

const PeopleScene = ({ details }: Props) => {
  const { data: attendees, isLoading } = useGetClassAttendees(
    details?.id ?? ""
  );

  const { settingStore } = useStores();

  const teacherList = getValidArray(attendees?.data)?.filter(
    (item) => item?.role === EClassRole.TEACHER
  );

  const studentList = getValidArray(attendees?.data)?.filter(
    (item) => item?.role === EClassRole.STUDENT
  );

  React.useEffect(() => {
    settingStore.setHeaderLoading(isLoading);
  }, [isLoading]);

  return (
    <VStack alignSelf={"center"} alignItems={"center"}>
      <VStack
        w={"full"}
        maxW={"container.lg"}
        p={10}
        borderColor={"gray.300"}
        alignItems={"start"}
        gap={20}
        h={"full"}
      >
        <Owner owner={details?.owner} />
        <Teachers data={teacherList} />
        <Students data={studentList} />
      </VStack>
    </VStack>
  );
};

export default observer(PeopleScene);
