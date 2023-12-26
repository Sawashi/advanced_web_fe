import { Box, VStack, HStack, Text, Button } from "@chakra-ui/react";
import { IClass, IGradeComposition } from "interfaces/classes";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import StructureItem from "./StructureItem";
import { useGetClassGradeCompositions } from "API/get/get.class.gradeComposition";
import { checkValidArray, getValidArray } from "utils/common";
import { useStores } from "hooks/useStores";
import EmptyList from "components/EmptyState/EmptyList";
import UpsertCompositionModal from "./UpsertCompositionModal";

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
  const { totalPercentage } = classStore;
  const [items, setItems] = useState<IGradeComposition[]>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedComposition, setSelectedComposition] = useState<
    IGradeComposition | undefined
  >();
  const {
    data: classCompositions,
    isLoading: isCompositionsLoading,
    refetch: refetchCompositions,
  } = useGetClassGradeCompositions(details?.id ?? "");

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

  const onAddComposition = () => {
    setIsModalVisible(true);
    setSelectedComposition(undefined);
  };

  const onCloseModal = () => {
    setIsModalVisible(false);
    setSelectedComposition(undefined);
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
          gap={5}
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
                    <StructureItem
                      item={item}
                      index={index}
                      onEdit={(composition) => {
                        setIsModalVisible(true);
                        setSelectedComposition(composition);
                      }}
                    />
                  ))}
                </VStack>
              )}
            </Droppable>
          </DragDropContext>

          <Box w={"full"} mt={5}>
            <Button
              w={"full"}
              variant={"outline"}
              colorScheme={"blue"}
              py={7}
              onClick={onAddComposition}
            >
              Add new item
            </Button>
          </Box>
        </VStack>
      ) : (
        <EmptyList
          title="Seems like there's no grade structure yet"
          description="Try creating one"
          _button={{
            text: "Create grade structure",
            onClick: onAddComposition,
          }}
        />
      )}
      <UpsertCompositionModal
        isVisible={isModalVisible}
        onClose={onCloseModal}
        composition={selectedComposition}
        refetch={() => {
          refetchCompositions();
        }}
      />
    </VStack>
  );
};

export default observer(GradeStructureScene);
