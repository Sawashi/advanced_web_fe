import { VStack, useToast } from "@chakra-ui/react";
import { useStores } from "hooks/useStores";
import { observer } from "mobx-react";
import React from "react";
import TeacherStreamHeaderScene from "./TeacherStreamHeaderScene";
import CodeClassModal from "./CodeClassModal";

interface Props {}

const TeacherStreamScene = (props: Props) => {
  const { classStore } = useStores();
  const { currentClass } = classStore;
  const [isCodeModalVisible, setIsCodeModalVisible] = React.useState(false);

  const onCloseCodeModal = () => {
    setIsCodeModalVisible(false);
  };

  return (
    <VStack w={"full"} h={"full"}>
      <TeacherStreamHeaderScene
        onOpenCodeModal={() => {
          setIsCodeModalVisible(true);
        }}
      />
      <CodeClassModal
        isVisible={isCodeModalVisible}
        onClose={onCloseCodeModal}
        code={currentClass?.code ?? ""}
      />
    </VStack>
  );
};

export default observer(TeacherStreamScene);
