import { Box, Card, VStack, CardBody, HStack, Text } from "@chakra-ui/react";
import { IClass, IGradeComposition } from "interfaces/classes";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import StructureItem from "./StructureItem";

interface Props {
  details: IClass;
}

const getItems = (count: number): IGradeComposition[] =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    name: `item ${k}`,
    percentage: 5,
  }));

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
  const [items, setItems] = useState<IGradeComposition[]>(getItems(10));

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const itemsReOrder = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setItems(itemsReOrder);
  };

  return (
    <VStack alignSelf={"center"} alignItems={"center"}>
      <VStack
        w={"full"}
        maxW={"container.lg"}
        p={10}
        borderColor={"gray.300"}
        alignItems={"start"}
        h={"full"}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <VStack
                w={"full"}
                gap={5}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {items.map((item, index) => (
                  <StructureItem item={item} index={index} />
                ))}
                {provided.placeholder}
              </VStack>
            )}
          </Droppable>
        </DragDropContext>
      </VStack>
    </VStack>
  );
};

export default observer(GradeStructureScene);
