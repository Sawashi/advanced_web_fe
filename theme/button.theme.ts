import { background } from "@chakra-ui/react";

export const CustomButton = {
  variants: {
    outline: {
      background: "inherit",
      border: "1px solid",
      borderColor: "gray.500",
      _active: {
        background: "gray.200",
      },
      _hover: {
        background: "gray.100",
      },
    },
    primary: {
      background: "primary.500",
      color: "white",
      _hover: { background: "primary.600" },
      _focus: {
        background: "primary.600",
        boxShadow: "0 0 0 2px primary.500",
      },
      _disabled: {
        background: "gray.400",
        color: "white",
        cursor: "not-allowed",
      },
    },
    ghost: {
      _hover: {
        background: "gray.200",
      },
      _active: {
        background: "gray.300",
      },
    },
    icon: {
      background: "transparent",
      cursor: "pointer",
      _hover: {
        background: "transparent",
      },
      _focus: { background: "transparent" },
      _disabled: {
        background: "transparent",
        color: "gray.400",
        cursor: "not-allowed",
      },
    },
  },
  defaultProps: {
    size: "md",
    variant: "outline",
  },
};
