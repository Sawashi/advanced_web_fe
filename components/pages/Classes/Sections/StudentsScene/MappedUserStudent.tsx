import { Text, Tag, Avatar, Tooltip } from "@chakra-ui/react";
import { IStudent } from "interfaces/classes";
import React from "react";

const MappedUserStudent = ({
  item,
  isAbleToUnmap = false,
}: {
  item: IStudent;
  isAbleToUnmap?: boolean;
}) => {
  if (!item?.user) {
    return null;
  }

  return (
    <Tooltip label={item?.user?.email} aria-label="A tooltip">
      <Tag
        borderRadius={16}
        p={2}
        px={3}
        cursor={!isAbleToUnmap ? "not-allowed" : "pointer"}
        gap={2}
      >
        <Avatar
          size="xs"
          name={item?.user?.firstName + " " + item?.user?.lastName}
          src={item?.user?.avatar}
        />
        <Text>{item?.user?.firstName + " " + item?.user?.lastName}</Text>
      </Tag>
    </Tooltip>
  );
};

export default MappedUserStudent;
