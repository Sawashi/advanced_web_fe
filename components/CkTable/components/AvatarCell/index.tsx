import { Avatar } from '@chakra-ui/react'

interface IAvatarCellProps {
  value: string
}

const AvatarCell = (props: IAvatarCellProps) => {
  const { value } = props
  return <Avatar colorScheme="teal" src={value} size="sm" />
}

export default AvatarCell
