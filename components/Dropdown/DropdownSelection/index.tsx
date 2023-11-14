import { MenuItem } from '@chakra-ui/react'
import { Token, Width } from 'types/chakra'

interface IDropdownSelectionProps {
  onClick: () => void
  label: string | number
  isSelected?: boolean
  width?: Token<Width | number, 'sizes'>
  minWidth?: Token<Width | number, 'sizes'>
  maxWidth?: Token<Width | number, 'sizes'>
  isTable?: boolean
}

const DropdownSelection = (props: IDropdownSelectionProps) => {
  const { onClick, label, width, minWidth, maxWidth, isTable } = props
  return (
    <MenuItem
      padding="8px 16px"
      width={width ?? { base: '400px', lg: '178px' }}
      minWidth={minWidth}
      maxWidth={maxWidth}
      onClick={onClick}
      className="dropdown-selection"
      // TODO: Integrate later
      // _hover={{ background: backGroundTeal500WithOpacity }}
      background={'white'}
      borderWidth="0"
      outline="none"
      // _focus={{ background: isSelected ? backGroundTeal500WithOpacity : 'none' }}
      paddingLeft={isTable ? { base: '45px', md: '16px' } : 4}
      height={{ base: '48px', lg: '40px' }}
      fontSize={{ base: 'lg', lg: 'md' }}
      justifyContent={{ base: 'center', md: 'flex-start' }}
    >
      {label}
    </MenuItem>
  )
}

export default DropdownSelection
