import { CloseButton as CkCloseButton } from '@chakra-ui/react'
export interface ICloseButtonProps {
  onClick: () => void
  top?: string
  right?: string
  size?: string
}
const CloseButton = (props: ICloseButtonProps) => {
  const { onClick, top = '4', right = '4', size = 'lg' } = props
  return (
    <CkCloseButton
      position="absolute"
      size={size}
      top={top}
      right={right}
      background="whiteAlpha.500"
      _hover={{
        background: 'whiteAlpha.600'
      }}
      _active={{
        background: 'whiteAlpha.700'
      }}
      onClick={onClick}
      zIndex={1}
    />
  )
}

export default CloseButton
