export const CustomButton = {
  variants: {
    outline: {
      field: {
        background: "inherit",
        border: "1px solid",
        borderColor: "inherit",
        _focus: {
          borderColor: "teal.500",
          borderWidth: 2,
          boxShadow: "0 0 0 2px teal.500",
        },
        _invalid: {
          borderColor: "red.500",
          borderWidth: 2,
          boxShadow: "0 0 0 2px red.500",
        },
        _hover: { borderColor: "gray.300" },
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
  },
  defaultProps: {
    size: "md",
    variant: "outline",
  },
};
