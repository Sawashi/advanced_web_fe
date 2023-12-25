import {
  VStack,
  Image,
  Text,
  Button,
  Tooltip,
  Collapse,
  HStack,
  useToast,
} from "@chakra-ui/react";
import SvgIcon from "components/SvgIcon";
import { TeacherClassBackground } from "constants/pages/classes";
import { useStores } from "hooks/useStores";
import { capitalize } from "lodash";
import { observer } from "mobx-react";
import React from "react";
import { gray500 } from "theme/colors.theme";

interface Props {
  onOpenCodeModal?: () => void;
}

const TeacherStreamHeaderScene = ({ onOpenCodeModal }: Props) => {
  const { classStore } = useStores();
  const { currentClass } = classStore;
  const [showDetails, setShowDetails] = React.useState(false);
  const toast = useToast();

  return (
    <VStack
      w={"full"}
      h={"full"}
      alignItems={"center"}
      shadow={"md"}
      borderRadius={10}
      overflow={"hidden"}
    >
      <VStack w={"full"} position={"relative"}>
        <Image
          src={TeacherClassBackground}
          w={"full"}
          h={"full"}
          objectFit={"contain"}
        />
        <Tooltip label={"Edit class"}>
          <Button
            zIndex={1}
            rounded={"full"}
            position={"absolute"}
            onClick={() => {
              alert("This is a class");
            }}
            variant={"icon"}
            right={0}
            top={5}
          >
            <SvgIcon iconName={"ic-edit.svg"} fill="white" color="white" />
          </Button>
        </Tooltip>

        <HStack position={"absolute"} zIndex={1} right={0} bottom={5}>
          <Button
            rounded={"full"}
            onClick={() => {
              setShowDetails(!showDetails);
            }}
            p={0}
            justifyItems={"center"}
            alignItems={"center"}
            variant={"icon"}
          >
            <SvgIcon iconName={"ic-info.svg"} fill="white" color="white" />
          </Button>

          <Button
            rounded={"full"}
            onClick={() => {
              setShowDetails(!showDetails);
            }}
            p={0}
            justifyItems={"center"}
            alignItems={"center"}
            variant={"icon"}
          >
            <SvgIcon
              iconName={"ic-threedot-vertical.svg"}
              size={20}
              fill="white"
              color="white"
            />
          </Button>
        </HStack>

        <VStack
          w={"full"}
          h={"full"}
          position={"absolute"}
          alignItems={"start"}
          justifyContent={"flex-end"}
          bottom={0}
          left={0}
          p={5}
          bgGradient={"linear(to-t, blackAlpha.500, transparent)"}
          borderRadius={10}
        >
          <Text color={"white"} fontSize={"3xl"} fontWeight={"bold"}>
            {currentClass?.name}
          </Text>
          <Text color={"white"} fontSize={"xl"} fontWeight={"normal"}>
            {currentClass?.description}
          </Text>
        </VStack>
      </VStack>
      <Collapse
        in={showDetails}
        animateOpacity
        style={{
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          width: "100%",
        }}
      >
        <VStack w={"full"} alignItems={"start"} p={5} gap={3}>
          <HStack
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontWeight={"bold"}>ID:</Text>
            <HStack
              spacing={2}
              alignItems={"center"}
              justifyContent={"flex-end"}
              onClick={() => {
                navigator.clipboard.writeText(currentClass?.code ?? "");
                toast({
                  title: "Copied!",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
              }}
            >
              <Text textAlign={"right"}>{currentClass?.id}</Text>
              <SvgIcon
                iconName={"ic-copy.svg"}
                fill={gray500}
                color={gray500}
                size={20}
              />
            </HStack>
          </HStack>
          <HStack
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontWeight={"bold"}>Code:</Text>

            <HStack
              spacing={2}
              alignItems={"center"}
              justifyContent={"flex-end"}
              onClick={() => {
                onOpenCodeModal?.();
              }}
            >
              <Text>{currentClass?.code}</Text>
              <SvgIcon
                iconName={"ic-frame.svg"}
                fill={gray500}
                color={gray500}
                size={20}
              />
            </HStack>
          </HStack>

          <HStack
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontWeight={"bold"}>Role:</Text>
            <Text>{capitalize(currentClass?.role) ?? ""}</Text>
          </HStack>
        </VStack>
      </Collapse>
    </VStack>
  );
};

export default observer(TeacherStreamHeaderScene);
