import { ReactNode } from 'react'
import { Row, UseExpandedRowProps } from 'react-table'

export interface IExpandableCellProps {
  row: Row & UseExpandedRowProps<Row>
  value: ReactNode
}

const ExpandableCell = (props: IExpandableCellProps) => {
  const { row, value } = props
  return <span {...row.getToggleRowExpandedProps()}>{value}</span>
}

export default ExpandableCell
