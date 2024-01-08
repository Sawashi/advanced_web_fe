import {
  ModalOverlay,
  Modal as CKModal,
  ModalContent,
  ModalHeader,
  Button,
  ModalBody,
  ModalFooter,
  HStack,
  Box,
} from "@chakra-ui/react";
import SvgIcon from "components/SvgIcon";
import React from "react";

type ModalProps = {
  isVisible: boolean;
  onClose?: () => void;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  title?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode[];
  scrollBehavior?: "inside" | "outside";
};

function Modal({
  isVisible,
  onClose,
  size = "md",
  title,
  children,
  actions,
  scrollBehavior,
}: ModalProps) {
  return (
    <CKModal
      onClose={() => {
        onClose?.();
      }}
      size={size}
      isOpen={isVisible}
      isCentered
      scrollBehavior={scrollBehavior}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader borderBottomWidth={1}>
          <HStack w="full" justifyContent={"space-between"} gap={5}>
            <Box flex={1}>{title}</Box>
            {onClose ? (
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  onClose?.();
                }}
                p={0}
                bgColor={"transparent"}
                _hover={{
                  bgColor: "transparent",
                }}
                rounded={"full"}
              >
                <SvgIcon iconName="ic-close.svg" />
              </Button>
            ) : null}
          </HStack>
        </ModalHeader>

        <ModalBody>{children}</ModalBody>
        <ModalFooter gap={3}>
          {actions?.map((action) => (
            <React.Fragment key={Math.random().toString(36).substr(2, 9)}>
              {action}
            </React.Fragment>
          ))}
        </ModalFooter>
      </ModalContent>
    </CKModal>
  );
}

export default Modal;
