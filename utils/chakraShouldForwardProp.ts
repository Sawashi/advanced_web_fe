import { chakra, shouldForwardProp } from "@chakra-ui/react";
import isValidHTMLProp from "@emotion/is-prop-valid";
import { FC } from "react";
import { BaseStyle } from "types/common";

export function chakraShouldForwardProp<AdditionalProps>(
  CkComponent: FC<AdditionalProps>,
  baseStyle: BaseStyle
) {
  return chakra(CkComponent, {
    shouldForwardProp: (prop: string) => {
      // *INFO:  don't forward Chakra's props
      const isChakraProp = !shouldForwardProp(prop);
      if (isChakraProp) return false;

      // *INFO: forward valid HTML props
      const isValidProp = isValidHTMLProp(prop);
      if (isValidProp) return true;

      // *INFO: else, only forward `sample` prop
      return ["sample"].includes(prop);
    },
    baseStyle,
  });
}
export default chakraShouldForwardProp;
