import { Box, Card, VStack, CardBody, HStack, Text } from "@chakra-ui/react";
import { IClass } from "interfaces/classes";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface Props {
  details: IClass;
}

interface Item {
  id: string;
  content: string;
}

// fake data generator
const getItems = (count: number) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

const reorder = (list: Item[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  padding: grid,
  width: 250,
});

const GradeStructureScene = ({ details }: Props) => {
  const [items, setItems] = useState<Item[]>(getItems(10));

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
        gap={20}
        h={"full"}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item?.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        {item.content}
                        <span
                          style={{ float: "right" }}
                          {...provided.dragHandleProps}
                        >
                          &#x2630;
                        </span>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </VStack>
    </VStack>
  );
};

export default observer(GradeStructureScene);
