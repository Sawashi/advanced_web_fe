import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import SvgIcon from "components/SvgIcon";
import { useStores } from "hooks/useStores";
import { IGradeComposition } from "interfaces/classes";
import { observer } from "mobx-react";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { gray600 } from "theme/colors.theme";

const StructureItem = ({
  item,
  index,
  onEdit,
  onRemove,
}: {
  item: IGradeComposition;
  index: number;
  onEdit?: (item: IGradeComposition) => void;
  onRemove?: (item: IGradeComposition) => void;
}) => {
  return (
    <Draggable draggableId={item?.id} index={index}>
      {(provided) => (
        <Card
          width={"full"}
          ref={provided.innerRef}
          boxShadow={"md"}
          {...provided.draggableProps}
        >
          <CardBody justifyContent={"flex-end"} py={10}>
            <HStack
              w={"full"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <HStack w={"full"}>
                <HStack gap={6} flex={1}>
                  <Box {...provided.dragHandleProps}>
                    <SvgIcon iconName="ic-menu.svg" size={25} color={gray600} />
                  </Box>
                  <Text
                    noOfLines={1}
                    w={"full"}
                    fontSize={"lg"}
                    fontWeight={"bold"}
                  >
                    {item?.name}
                  </Text>
                </HStack>

                <Text fontSize={"lg"} fontWeight={"bold"}>
                  {item?.percentage}%
                </Text>
              </HStack>

              <Menu>
                <MenuButton aria-label="Options">
                  <Button
                    as={"div"}
                    variant={"ghost"}
                    borderRadius={"full"}
                    _hover={{
                      bgColor: "gray.200",
                    }}
                    onClick={() => {}}
                  >
                    <SvgIcon
                      iconName={"ic-threedot-vertical.svg"}
                      size={20}
                      color={gray600}
                    />
                  </Button>
                </MenuButton>
                <MenuList bgColor={"white.100"}>
                  <MenuItem
                    onClick={() => {
                      onEdit?.(item);
                    }}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      onRemove?.(item);
                    }}
                  >
                    Remove
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </CardBody>
        </Card>
      )}
    </Draggable>
  );
};

export default observer(StructureItem);
