import { Text, Tag, Button, Avatar, Tooltip } from "@chakra-ui/react";
import { IStudent } from "interfaces/classes";
import React from "react";
import { useStores } from "hooks/useStores";
import SvgIcon from "components/SvgIcon";
import { red500 } from "theme/colors.theme";

const MappedUserStudent = ({
  item,
  onRemove,
}: {
  item: IStudent;
  onRemove: (userId: string) => Promise<void>;
}) => {
  const { classStore, authStore } = useStores();
  const { isStudentOfClass } = classStore;
  const isCurrentStudent = item?.user?.id === authStore?.user?.id;
  const isAbleToUnmap = !isStudentOfClass || isCurrentStudent;

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
        {isAbleToUnmap ? (
          <Button
            isDisabled={!isAbleToUnmap}
            onClick={() => {
              onRemove(authStore?.user?.id ?? "");
            }}
            display={isAbleToUnmap ? "flex" : "none"}
            variant={"icon"}
            p={0}
          >
            <SvgIcon iconName="ic-delete.svg" size={20} color={red500} />
          </Button>
        ) : null}
      </Tag>
    </Tooltip>
  );
};

export default MappedUserStudent;
