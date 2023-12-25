import {
  VStack,
  Text,
  Heading,
  Divider,
  HStack,
  Avatar,
  Button,
  Tooltip,
} from "@chakra-ui/react";
import { useGetClassAttendees } from "API/get/get.class.attendees";
import SvgIcon from "components/SvgIcon";
import { EClassRole } from "enums/classes";
import { useStores } from "hooks/useStores";
import { IClass, IAttendeeProfile, IAttendee } from "interfaces/classes";
import { observer } from "mobx-react";
import React from "react";
import { gray700 } from "theme/colors.theme";
import { getValidArray } from "utils/common";

interface Props {
  details: IClass;
}

const Attendance = ({ profile }: { profile?: IAttendeeProfile }) => {
  return (
    <HStack w={"full"} justifyContent={"space-between"} key={profile?.id}>
      <HStack gap={3}>
        <Avatar
          size={"sm"}
          name={`${profile?.firstName} ${profile?.lastName}`}
          src={profile?.avatar}
          borderColor={"blue.800"}
          borderWidth={1}
        />
        <Text>{`${profile?.firstName} ${profile?.lastName}`}</Text>
      </HStack>
      {profile?.email && (
        <Tooltip label={profile?.email}>
          <Button
            variant={"ghost"}
            onClick={() => {
              window.open(`mailto:${profile?.email}`);
            }}
          >
            <SvgIcon iconName="ic-mail.svg" fill={gray700} color={gray700} />
          </Button>
        </Tooltip>
      )}
    </HStack>
  );
};

const Teachers = ({ data }: { data?: IAttendee[] }) => {
  const { classStore } = useStores();
  const { isStudentOfClass } = classStore;
  return (
    <VStack
      divider={<Divider h={"1px"} w={"full"} bgColor={"blue.800"} />}
      w={"full"}
      alignItems={"start"}
      gap={5}
    >
      <HStack w={"full"} justifyContent={"space-between"} alignItems={"center"}>
        <Heading size="lg">Teachers</Heading>
        <HStack gap={3} justifyItems={"end"} alignItems={"center"}>
          <Text>{`${data?.length ?? 0} teachers`}</Text>
          {!isStudentOfClass && (
            <Tooltip label={"Add teacher"}>
              {/* TODO: Add teacher */}
              <Button variant={"icon"} onClick={() => {}}>
                <SvgIcon iconName={"ic-add.svg"} />
              </Button>
            </Tooltip>
          )}
        </HStack>
      </HStack>
      <VStack
        divider={<Divider h={"1px"} w={"full"} />}
        w={"full"}
        alignItems={"start"}
        gap={3}
      >
        {getValidArray(data)?.map((item) => (
          <Attendance profile={item?.user} />
        ))}
      </VStack>
    </VStack>
  );
};

const Students = ({
  data,
  isStudent,
}: {
  data?: IAttendee[];
  isStudent?: boolean;
}) => {
  const { classStore } = useStores();
  const { isStudentOfClass } = classStore;
  return (
    <VStack
      divider={<Divider h={"1px"} w={"full"} bgColor={"blue.800"} />}
      w={"full"}
      alignItems={"start"}
      gap={5}
    >
      <HStack w={"full"} justifyContent={"space-between"} alignItems={"center"}>
        <Heading size="lg">
          {isStudent ? "Your classmates" : "Students"}
        </Heading>
        <HStack gap={3} justifyItems={"end"} alignItems={"center"}>
          <Text>{`${data?.length ?? 0} teachers`}</Text>
          {!isStudentOfClass && (
            <Tooltip label={"Add student"}>
              {/* TODO: Add student */}
              <Button variant={"icon"} onClick={() => {}}>
                <SvgIcon iconName={"ic-add.svg"} />
              </Button>
            </Tooltip>
          )}
        </HStack>
      </HStack>
      <VStack
        divider={<Divider h={"1px"} w={"full"} />}
        w={"full"}
        alignItems={"start"}
        gap={3}
      >
        {getValidArray(data)?.map((item) => (
          <Attendance profile={item?.user} />
        ))}
      </VStack>
    </VStack>
  );
};

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
        <Students
          data={studentList}
          isStudent={details?.role === EClassRole.STUDENT}
        />
      </VStack>
    </VStack>
  );
};

export default observer(PeopleScene);
