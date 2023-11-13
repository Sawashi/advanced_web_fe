import { focusBorderColorSecondary } from './globalStyles'

export const CustomTextArea = {
  variants: {
    outline: {
      _focus: {
        borderColor: focusBorderColorSecondary,
        boxShadow: `0 0 0 1px ${focusBorderColorSecondary}`
      }
    },
    filled: {
      _focus: {
        borderColor: focusBorderColorSecondary,
        boxShadow: `0 0 0 1px ${focusBorderColorSecondary}`
      }
    },
    flushed: {
      _focus: {
        borderColor: focusBorderColorSecondary,
        boxShadow: `0 1px 0 0 ${focusBorderColorSecondary}`
      }
    }
  }
}
