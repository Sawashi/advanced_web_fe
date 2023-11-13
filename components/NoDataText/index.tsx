import React from 'react'
import { Text } from '@chakra-ui/react'

const NoDataText = () => {
  return (
    <Text fontSize="md" fontWeight={600} lineHeight={6} color="gray.500" fontStyle="italic">
      N/A
    </Text>
  )
}

export default NoDataText
