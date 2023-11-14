/* eslint-disable max-lines */
import { Fragment, ReactNode, useMemo } from 'react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { Table, Thead, Tbody, Tr, Th, Td, Box, Stack } from '@chakra-ui/react'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import Skeleton from 'react-loading-skeleton'
import { useTable, useExpanded, useSortBy, Column, PluginHook } from 'react-table'
import SvgIcon from 'components/SvgIcon'
import { useStores } from 'hooks/useStores'
import { ExpandableCellProps } from './components/ExpandableCell'
import CkPagination from '../CkPagination'

export interface IPagination {
  tableLength: number
  pageIndex: number
  gotoPage: (pageIndex: number) => void
}

interface ITableProps {
  tableData: any
  headerList: ITableHeader[]
  subComponent?: any
  pagination?: IPagination
  hasNoSort?: boolean
  columnWidth?: number
  isManualSort?: boolean
  pageSize?: number
  includePagination?: boolean
  setPageSize?: (page: number) => void
  hideHeader?: boolean
  bodyClass?: string
  setSort?: (name: string) => void
  setOrderBy?: (orderBy: number) => void
}

export declare interface ITableHeader {
  Header: string | ReactNode
  accessor?: string
  Cell?: (props: ExpandableCellProps) => ReactNode
  columns?: ITableHeader[]
  align?: EAlignEnum
  disableSortBy?: boolean
  width?: number
}

export enum EAlignEnum {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center'
}

const CkTable = (props: ITableProps) => {
  const {
    tableData,
    headerList,
    pagination = { pageIndex: 1, tableLength: 0, gotoPage: () => {} },
    hasNoSort,
    pageSize,
    setPageSize,
    subComponent,
    includePagination = true,
    hideHeader,
    bodyClass = 'tbody',
    isManualSort,
    setSort,
    setOrderBy
  } = props
  const columns: Column<object>[] = (useMemo(() => headerList, [headerList]) || []) as Column<object>[]
  const { spinnerStore } = useStores()
  const { isLoading } = spinnerStore
  const isEmptyTable: boolean = tableData?.length === 0
  // TODO: Integrate later
  // const sortBy = useMemo(() => (isManualSort ? [] : [{ id: headerList[0]?.accessor ?? '', desc: false }]), [
  //   isManualSort
  // ])
  const tablePlugins: Array<PluginHook<object>> = []
  if (!hasNoSort) {
    tablePlugins.push(useSortBy)
  }
  tablePlugins.push(useExpanded)
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, visibleColumns } = useTable(
    {
      columns,
      data: tableData
      // TODO: Integrate later
      // initialState: {
      //   sortBy
      // },
      // autoResetSortBy: !isManualSort,
      // disableSortRemove: isManualSort,
      // manualSortBy: isManualSort
    },
    ...tablePlugins
  )
  const paginationComponent =
    includePagination && pageSize && setPageSize && !isEmptyTable ? (
      <CkPagination pagination={pagination} pageSize={pageSize} setPageSize={setPageSize} />
    ) : null

  return (
    <Stack spacing="24px" width="full">
      <Box padding={0} overflow="auto" width="100%">
        <Table
          {...getTableProps()}
          variant="simple"
          width="full"
          color="gray.600"
          fontWeight={600}
          fontSize="16px"
          lineHeight="24px"
        >
          <Thead display={hideHeader ? 'none' : 'table-header-group'} className="thead">
            {headerGroups.map(headerGroup => {
              const { key, ...restHeaderGroup } = headerGroup.getHeaderGroupProps()
              return (
                <Tr key={`tr-${key}`} {...restHeaderGroup} background="gray.50" _hover={{ background: 'white' }}>
                  {headerGroup.headers.map((column: Record<string, any>) => {
                    if (isManualSort && column?.isSorted) {
                      setSort && setSort(column?.id)
                      setOrderBy && setOrderBy(column.isSortedDesc ? -1 : 1)
                    }
                    const align: EAlignEnum = get(column, 'align', EAlignEnum.LEFT) || EAlignEnum.LEFT
                    const { key: colKey, ...colProps } = column.getHeaderProps(
                      column?.Header ? column.getSortByToggleProps : undefined
                    )
                    const width =
                      column?.width && Math.floor(column?.width / 4) > 0 ? `${Math.floor(column?.width / 4)}` : 'auto'
                    return (
                      <Th
                        key={`th-${colKey}`}
                        {...colProps}
                        whiteSpace="nowrap"
                        paddingY="4"
                        fontWeight={600}
                        fontSize="16px"
                        lineHeight="24px"
                        textAlign={align}
                        textTransform="capitalize"
                        width={width}
                      >
                        {column.render('Header')}
                        &nbsp;
                        {hasNoSort || column?.disableSortBy ? (
                          ''
                        ) : (
                          <span>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <TriangleDownIcon width={2} height={2} />
                              ) : (
                                <TriangleUpIcon width={2} height={2} />
                              )
                            ) : column.Header ? (
                              <SvgIcon iconName="three-lines" size={12} />
                            ) : null}
                          </span>
                        )}
                      </Th>
                    )
                  })}
                </Tr>
              )
            })}
          </Thead>
          <Tbody {...getTableBodyProps()} color="gray.700" fontWeight="500" fontSize="sm" className={bodyClass}>
            {!isLoading &&
              rows.map((row, index: number) => {
                prepareRow(row)
                const isExpanded = get(row, 'isExpanded', false)
                const isBold: boolean = get(row, 'original.isBold', false)
                const isHightLight: boolean | undefined = get(row, 'original.isHightLight')
                const backGroundColor: string = isHightLight ? '#E6FFFA !important' : 'unset !important'
                return (
                  <Fragment key={`row-${index}`}>
                    <Tr height={3}></Tr>
                    <Tr
                      {...row.getRowProps()}
                      className={isExpanded ? 'expanded' : 'normal'}
                      fontWeight={isBold ? 'bold' : '500'}
                      backgroundColor={isHightLight !== undefined ? backGroundColor : undefined}
                      marginBottom={isHightLight ? 4 : 0}
                      display={isLoading ? 'none' : 'table-row'}
                      background="gray.50"
                      _hover={{ background: 'white' }}
                      padding="12px 16px"
                      boxShadow="sm"
                      cursor="pointer"
                      borderRadius="8px"
                    >
                      {row.cells.map(cell => {
                        const { key, ...restCell } = cell.getCellProps()
                        const align: EAlignEnum = get(cell, 'column.align', EAlignEnum.LEFT) || EAlignEnum.LEFT
                        const isExpandCell = cell.column.id === 'isExpand'
                        if (isExpandCell) {
                          return (
                            <Td
                              {...restCell}
                              key={key}
                              borderBottomWidth="0"
                              width="48px"
                              paddingX="14px"
                              className="expand-icon"
                            >
                              <SvgIcon
                                iconName={isExpanded ? 'expand_row' : 'collapse_row'}
                                size={20}
                                // @ts-ignore //* INFO: react-table-v6 missing this prop interface
                                {...row.getToggleRowExpandedProps()}
                              />
                            </Td>
                          )
                        }
                        return (
                          <Td {...restCell} key={key} borderBottomWidth="0" textAlign={align}>
                            {cell.render('Cell')}
                          </Td>
                        )
                      })}
                    </Tr>
                    {isHightLight && isBold && (
                      <Tr>
                        <Td padding={2}></Td>
                      </Tr>
                    )}
                    {subComponent &&
                      (get(row, 'isExpanded', false) ? (
                        <Tr background="teal.50">
                          <Td
                            colSpan={visibleColumns.length}
                            borderBottomWidth="0"
                            paddingTop="0px !important"
                            paddingBottom="16px !important"
                          >
                            {subComponent(row)}
                          </Td>
                        </Tr>
                      ) : (
                        <Tr display="none"></Tr>
                      ))}
                  </Fragment>
                )
              })}
            {isLoading &&
              Array.from({ length: pageSize || 8 }).map((_, index) => (
                <Fragment key={`skeleton-${index}`}>
                  <Tr height={3}></Tr>
                  <Tr>
                    <Td colSpan={visibleColumns.length} borderBottomWidth="0" padding="0">
                      <Skeleton height="64px" />
                    </Td>
                  </Tr>
                </Fragment>
              ))}
          </Tbody>
        </Table>
      </Box>
      {paginationComponent}
    </Stack>
  )
}

export default observer(CkTable)
