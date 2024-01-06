import { extendTheme } from "@chakra-ui/react";
import { Dict } from "@chakra-ui/utils";
import { colors } from "./colors.theme";
import {
  backgroundBlue50,
  backgroundButton,
  backgroundButtonHover,
  backgroundGrey200,
  backgroundGrey500,
  backgroundGrey600,
  backgroundPrimary,
  backgroundSecondary,
  backgroundWhite500,
  backgroundWhite600,
  breakPointValues,
  containerSizes,
  focusBorderColorPrimary,
  textGrey200,
  textGrey500,
  textGrey600,
  textGrey700,
  textGrey800,
  textPrimary,
  textSecondary,
} from "./globalStyles";
import { CustomInput } from "./input.theme";
import { CustomSelect } from "./Select.theme";
import { CustomTextArea } from "./textArea.theme";
import { CustomButton } from "./button.theme";

export function getTheme(): Dict {
  const theme = extendTheme({
    breakpoints: breakPointValues,
    sizes: {
      container: containerSizes,
    },
    components: {
      CloseButton: {
        sizes: {
          xl: {
            width: 12,
            height: 12,
          },
        },
      },
      Input: CustomInput,
      Select: CustomSelect,
      Textarea: CustomTextArea,
      Button: CustomButton,
      // INFO: Fix modal content not full height on iOS safari
      // More detail:https://github.com/chakra-ui/chakra-ui/issues/4680
      Modal: {
        baseStyle: {
          dialogContainer: {
            "@supports(height: -webkit-fill-available)": {},
            height: "100%",
          },
        },
      },
    },
    shadows: {
      outline: `0 0 0 3px ${focusBorderColorPrimary}`,
    },
    styles: {
      global: {
        "html, body": {
          background: "white",
        },
        html: {
          scrollBehavior: "smooth",
        },
        ".is-clickable": {
          cursor: "pointer",
        },
        ".offset-anchor": {
          scrollMarginTop: "100px",
        },
      },
    },
    colors: {
      ...colors,
      text: {
        primary: textPrimary,
        secondary: textSecondary,
        grey: {
          200: textGrey200,
          500: textGrey500,
          600: textGrey600,
          700: textGrey700,
          800: textGrey800,
        },
      },
      background: {
        primary: backgroundPrimary,
        secondary: backgroundSecondary,
        button: backgroundButton,
        buttonHover: backgroundButtonHover,
        grey: {
          200: backgroundGrey200,
          500: backgroundGrey500,
          600: backgroundGrey600,
        },
        white: {
          500: backgroundWhite500,
          600: backgroundWhite600,
        },
        blue: {
          50: backgroundBlue50,
        },
      },
    },
    fonts: {
      heading: "Poppins",
      body: "Poppins",
      mono: "Poppins",
    },
  });

  return theme;
}
