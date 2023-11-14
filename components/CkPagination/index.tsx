import React, { useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Button, Flex, Text, Icon, HStack, Menu, MenuList } from '@chakra-ui/react'
import isNaN from 'lodash/isNaN'
import { IPagination } from 'components/CkTable'
import DropdownButton from 'components/Dropdown/DropdownButton'
import DropdownSelection from 'components/Dropdown/DropdownSelection'
import { EBreakPoint } from 'enums/theme'
import useBreakPoint from 'hooks/useBreakPoint'
import PageSizeDropdown from './components/Dropdown'
import { truncatePagination } from './utils'

export interface ICkPaginationProps {
  pagination: IPagination
  pageSize: number
  setPageSize: (page: number) => void
  showPageSize?: boolean
  pageSizeOptions?: number[]
}

const CkPagination = (props: ICkPaginationProps) => {
  const { pagination, pageSize, setPageSize, showPageSize = true, pageSizeOptions = [10, 20, 40, 100] } = props
  const { gotoPage, pageIndex, tableLength } = pagination
  const isMobile: boolean = useBreakPoint(EBreakPoint.BASE, EBreakPoint.MD)

  const numberOfPages: number = Math.ceil(tableLength / pageSize)

  const truncatedCkPagination: string[] = truncatePagination(Number(pageIndex), Number(numberOfPages))

  function goPreviousPage(): void {
    gotoPage(Number(pageIndex) - 1)
  }

  function goNextPage(): void {
    gotoPage(Number(pageIndex) + 1)
  }

  function changePageSize(size: number): void {
    setPageSize(Number(size))
    localStorage.setItem('pageSize', `${size}`)
  }

  useEffect(() => {
    if (window) {
      const pageSizeFromLocalStorage = localStorage.getItem('pageSize')
      if (pageSizeFromLocalStorage && !isNaN(Number(pageSizeFromLocalStorage))) {
        setPageSize(Number(pageSizeFromLocalStorage))
      }
    }
  }, [])

  const SelectPageDropdown = () => (
    <Menu closeOnSelect={true} autoSelect={false} computePositionOnMount>
      {({ isOpen }) => (
        <>
          <DropdownButton
            placeHolder={'Go To'}
            isOpen={isOpen}
            minWidth={{ base: '110px', md: '150px' }}
            width={{ base: '110px', md: '150px' }}
            isTable
          />
          <MenuList
            zIndex="1001"
            minWidth={{ base: '110px', md: '150px' }}
            padding={tableLength === 0 ? '0' : 'none'}
            border={tableLength === 0 ? '0' : 'none'}
          >
            {Array.from({ length: Math.ceil(tableLength / pageSize) }, (_, i) => i + 1).map(option => (
              <DropdownSelection
                key={option}
                onClick={() => gotoPage(Number(option))}
                width={{ base: '110px', md: '150px' }}
                label={option}
                isSelected={option === pageIndex}
              />
            ))}
          </MenuList>
        </>
      )}
    </Menu>
  )

  return (
    <Flex justifyContent="space-between" hidden={numberOfPages < 1} flexWrap="nowrap" width="full">
      <HStack spacing={2}>
        <Button
          colorScheme="gray"
          variant="primary"
          paddingX={2}
          marginLeft={0}
          background="gray.50"
          borderColor="gray.200"
          disabled={pageIndex === 1}
          onClick={goPreviousPage}
          color="gray.800"
        >
          <Icon width={6} height={6} as={ChevronLeftIcon} />
        </Button>
        {Array.isArray(truncatedCkPagination) &&
          truncatedCkPagination.map((item: string, index: number) => {
            if (isNaN(item)) {
              return <Text key={index}>{item}</Text>
            }
            const isActive: boolean = Number(pageIndex) === Number(item)
            if (isMobile && !isActive) {
              return <></>
            }
            return (
              <Button
                colorScheme={isActive ? 'primary' : 'gray'}
                variant={isActive ? 'primary' : 'outline'}
                background={isActive ? '#00A9EB' : 'gray.50'}
                borderColor="gray.200"
                padding={2}
                marginRight={2}
                lineHeight={1.5}
                border={0}
                key={`pagination-${index}`}
                onClick={() => (isActive || item === '...' ? {} : gotoPage(Number(item)))}
                cursor={isActive || item === '...' ? 'default' : 'pointer'}
              >
                {item}
              </Button>
            )
          })}
        <Button
          colorScheme="gray"
          variant="outline"
          paddingX={2}
          marginLeft={0}
          background="gray.50"
          borderColor="gray.200"
          disabled={pageIndex === numberOfPages}
          onClick={goNextPage}
          color="gray.800"
        >
          <Icon width={6} height={6} as={ChevronRightIcon} />
        </Button>
      </HStack>
      {showPageSize && (
        <Flex flexDirection="row" marginLeft={4} display={{ base: 'none', md: 'flex' }}>
          <Text marginRight={4} alignSelf="center" fontWeight={500} marginBottom={0}>
            Show
          </Text>
          <PageSizeDropdown item={pageSize} options={pageSizeOptions} onChange={changePageSize} width="150px" />
        </Flex>
      )}
      {isMobile && <SelectPageDropdown />}
    </Flex>
  )
}

export default CkPagination
