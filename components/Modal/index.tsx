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
};

function Modal({
  isVisible,
  onClose,
  size = "md",
  title,
  children,
  actions,
}: ModalProps) {
  return (
    <CKModal
      onClose={() => {
        onClose?.();
      }}
      size={size}
      isOpen={isVisible}
      isCentered
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
            <React.Fragment>{action}</React.Fragment>
          ))}
        </ModalFooter>
      </ModalContent>
    </CKModal>
  );
}

export default Modal;
