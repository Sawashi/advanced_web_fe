import { Box, Card, VStack, CardBody, HStack, Text } from "@chakra-ui/react";
import { IClass, IGradeComposition } from "interfaces/classes";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import StructureItem from "./StructureItem";
import { useGetClassGradeCompositions } from "API/get/get.class.gradeComposition";
import { checkValidArray, getValidArray } from "utils/common";
import { useStores } from "hooks/useStores";
import EmptyList from "components/EmptyState/EmptyList";

interface Props {
  details: IClass;
}

const reorder = (
  list: IGradeComposition[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const GradeStructureScene = ({ details }: Props) => {
  const { settingStore, classStore } = useStores();
  const { data: classCompositions, isLoading: isCompositionsLoading } =
    useGetClassGradeCompositions(details?.id ?? "");
  const { totalPercentage } = classStore;

  const [items, setItems] = useState<IGradeComposition[]>();

  settingStore?.setHeaderLoading(isCompositionsLoading);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const itemsReOrder = reorder(
      getValidArray(items),
      result.source.index,
      result.destination.index
    );

    setItems(itemsReOrder);
  };

  React.useEffect(() => {
    if (classCompositions) {
      setItems(classCompositions);
      classStore.setCompositions(classCompositions);
    }
  }, [classCompositions]);

  return (
    <VStack alignSelf={"center"} alignItems={"center"}>
      {checkValidArray(items) ? (
        <VStack
          w={"full"}
          maxW={"container.lg"}
          p={10}
          borderColor={"gray.300"}
          alignItems={"start"}
          h={"full"}
        >
          <HStack w={"full"} justifyContent={"space-between"}>
            <Text fontSize={"xl"} fontWeight={"bold"}>
              Grade structure
            </Text>

            <Text fontSize={"md"} fontWeight={"normal"}>
              {items?.length} items
            </Text>
          </HStack>

          <HStack w={"full"} justifyContent={"space-between"}>
            <Text fontSize={"md"} fontWeight={"normal"}>
              Total percentage: {totalPercentage}%
            </Text>
          </HStack>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <VStack
                  w={"full"}
                  gap={5}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {getValidArray(items).map((item, index) => (
                    <StructureItem item={item} index={index} />
                  ))}
                  {provided.placeholder}
                </VStack>
              )}
            </Droppable>
          </DragDropContext>
        </VStack>
      ) : (
        <EmptyList
          title="Seems like there's no grade structure yet"
          description="Try creating one"
          _button={{
            text: "Create grade structure",
            onClick: () => {},
          }}
        />
      )}
    </VStack>
  );
};

export default observer(GradeStructureScene);
