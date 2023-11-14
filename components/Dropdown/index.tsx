import { Menu, MenuList } from '@chakra-ui/react'
import { Token, Width } from 'types/chakra'
import { IDropdown } from 'types/common/select'
import { getValidArray } from 'utils/common'
import DropdownButton from './DropdownButton'
import DropdownSelection from './DropdownSelection'

interface IDropdownProps {
  options: IDropdown[]
  name: string
  item: IDropdown
  setValue: (name: string, value: IDropdown) => void
  width?: Token<Width | number, 'sizes'>
  maxWidth?: Token<Width | number, 'sizes'>
  text?: string
  isMatchWidth?: boolean
}

const Dropdown = (props: IDropdownProps) => {
  const { options, name, setValue, item, width, maxWidth, text, isMatchWidth } = props
  return (
    <Menu closeOnSelect={true} autoSelect={false} computePositionOnMount matchWidth={isMatchWidth}>
      {({ isOpen }) => (
        <>
          <DropdownButton item={item} placeHolder={text} isOpen={isOpen} width={width} />
          <MenuList zIndex="1001" maxWidth={maxWidth} minWidth="auto">
            {getValidArray(options).map((option: IDropdown, index: number) => (
              <DropdownSelection
                key={`${name}-${index}`}
                onClick={() => setValue(name, option)}
                label={option.title}
                isSelected={option.value === item?.value}
                width={width}
                maxWidth={maxWidth}
              />
            ))}
          </MenuList>
        </>
      )}
    </Menu>
  )
}

export default Dropdown
