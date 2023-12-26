import {
  Text,
  HStack,
  Avatar,
  Button,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { usePostKickStudent } from "API/post/post.classes.kick";
import SvgIcon from "components/SvgIcon";
import { EClassRole } from "enums/classes";
import { useStores } from "hooks/useStores";
import { IAttendeeProfile } from "interfaces/classes";
import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { gray700, red500 } from "theme/colors.theme";

const Attendance = ({
  profile,
  role,
  refetch,
}: {
  profile?: IAttendeeProfile;
  refetch?: () => Promise<void>;
  role?: EClassRole;
}) => {
  const { classStore, authStore } = useStores();
  const toast = useToast();
  const { isStudentOfClass, currentClass, isOwnerOfClass } = classStore;
  const { mutateAsync: kickStudent, isLoading: isKickingStudent } =
    usePostKickStudent();

  const isAvailableToKick = useMemo(() => {
    if (!profile) return false;
    if (profile?.id === authStore?.user?.id) return false;
    if (isOwnerOfClass) return true;
    if (isStudentOfClass) return false;
    if (role === EClassRole.TEACHER) return false;

    return true;
  }, [isStudentOfClass, currentClass, isOwnerOfClass, role, profile]);

  const onDelete = async () => {
    try {
      await kickStudent({
        classId: currentClass?.id ?? "",
        attendeeId: profile?.id ?? "",
      });

      toast({
        title: "Success",
        description: "Student kicked successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while kicking student",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    } finally {
      classStore?.fetchCurrentClass();
      refetch?.();
    }
  };

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
      <HStack>
        {profile?.email && (
          <Tooltip label={profile?.email}>
            <Button
              p={0}
              variant={"ghost"}
              onClick={() => {
                window.open(`mailto:${profile?.email}`);
              }}
            >
              <SvgIcon iconName="ic-mail.svg" fill={gray700} color={gray700} />
            </Button>
          </Tooltip>
        )}
        {isAvailableToKick && (
          <Button
            variant={"ghost"}
            p={0}
            onClick={onDelete}
            isLoading={isKickingStudent}
          >
            <SvgIcon iconName="ic-delete.svg" fill={red500} color={red500} />
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default observer(Attendance);
