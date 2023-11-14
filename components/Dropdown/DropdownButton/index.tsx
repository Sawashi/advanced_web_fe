import { useRef, useState, LegacyRef, useEffect } from 'react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Button, MenuButton, useOutsideClick } from '@chakra-ui/react'
import { Token, MinWidth, Width } from 'types/chakra'
import { IDropdown } from 'types/common'

interface IDropdownButtonProps {
  item?: IDropdown
  placeHolder?: string
  isOpen: boolean
  minWidth?: Token<MinWidth | number, 'sizes'>
  width?: Token<Width | number, 'sizes'>
  isTable?: boolean
}

const DropdownButton = (props: IDropdownButtonProps) => {
  const { item, placeHolder, isOpen, width, isTable } = props
  const itemTitle = item?.title ?? ''
  const menuButtonRef: LegacyRef<HTMLButtonElement> = useRef(null)
  const [isFocused, setIsFocused] = useState<boolean>(false)

  useOutsideClick({
    ref: menuButtonRef,
    handler: () => setIsFocused(false)
  })

  useEffect(() => {
    if (isOpen) {
      setIsFocused(true)
    }
  }, [isOpen])

  return (
    <MenuButton
      ref={menuButtonRef}
      width={width ?? { base: '400px', lg: '178px' }}
      isActive={isOpen}
      isTruncated
      fontSize={{ base: 'lg', lg: 'md' }}
      color="gray.700"
      border={item?.value !== undefined ? '1px solid #319795' : '1px solid #E2E8F0'}
      background="white"
      colorScheme="white"
      fontWeight="normal"
      as={Button}
      iconSpacing={5}
      textAlign={{ base: isTable ? 'center' : 'left', md: 'left' }}
      rightIcon={<ChevronDownIcon />}
      _focus={{ boxShadow: isFocused ? 'outline' : 'none' }}
      height={{ base: '48px', lg: '40px' }}
    >
      {item?.value !== undefined ? itemTitle : placeHolder}
    </MenuButton>
  )
}

export default DropdownButton
