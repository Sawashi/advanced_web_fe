import {
  Text,
  HStack,
  Avatar,
  Button,
  Tooltip,
} from "@chakra-ui/react";
import SvgIcon from "components/SvgIcon";
import { IAttendeeProfile } from "interfaces/classes";
import { observer } from "mobx-react";
import React from "react";
import { gray700 } from "theme/colors.theme";

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

export default observer(Attendance);
