import { Button as CkButton } from '@chakra-ui/react'
import chakraShouldForwardProp from 'utils/chakraShouldForwardProp'

export const SubmitButton = chakraShouldForwardProp(CkButton, () => ({
  size: 'md',
  fontSize: 'md',
  background: 'brand.primary.500',
  color: 'white',
  _hover: {
    background: 'brand.primary.500'
  },
  _focus: {
    background: 'brand.primary.500'
  }
}))
