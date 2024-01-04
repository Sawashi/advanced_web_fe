import { Stack as CkStack, chakra } from '@chakra-ui/react'

export const TableWrapper = chakra(CkStack, {
  baseStyle: {
    width: 'full',
    overflowX: 'auto',
    flex: 1,
    height: 'full',
    '&::-webkit-scrollbar': {
      width: 2,
      height: 2,
      borderRadius: 8
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'gray.200',
      borderRadius: 8
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'gray.400',
      borderRadius: 8
    }
  }
})
