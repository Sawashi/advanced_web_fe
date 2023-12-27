/* eslint-disable max-lines */
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Table as CkTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
} from "@chakra-ui/react";
import get from "lodash/get";
import { observer } from "mobx-react-lite";
import React, {
  Dispatch,
  Fragment,
  ReactNode,
  SetStateAction,
  useMemo,
} from "react";
import Skeleton from "react-loading-skeleton";
import {
  useTable,
  useExpanded,
  useSortBy,
  Column,
  PluginHook,
  SortingRule,
} from "react-table";
import Icon from "components/Icon";
import { useStores } from "hooks/useStores";
import { IExpandableCellProps } from "./components/ExpandableCell";
import Pagination from "./components/Pagination";
import { TableWrapper } from "./table.styles";
export interface IPagination {
  tableLength: number;
  pageIndex: number;
  gotoPage: (pageIndex: number) => void;
}

interface ITableProps {
  tableData: any;
  headerList: ITableHeader[];
  subComponent?: any;
  pagination?: IPagination;
  hasNoSort?: boolean;
  columnWidth?: number;
  isManualSort?: boolean;
  pageSize?: number;
  includePagination?: boolean;
  setPageSize?: (page: number) => void;
  hideHeader?: boolean;
  bodyClass?: string;
  isSmallSize?: boolean;
  setSort?: Dispatch<SetStateAction<string>>;
  setOrderBy?: (orderBy: number) => void;
  sort?: string;
  orderBy?: number;
}

export declare interface ITableHeader {
  Header: string | ReactNode;
  accessor?: string;
  Cell?: (props: IExpandableCellProps) => ReactNode;
  columns?: ITableHeader[];
  align?: EAlignEnum;
  disableSortBy?: boolean;
}

export enum EAlignEnum {
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center",
}

const Table = (props: ITableProps) => {
  const {
    headerList,
    tableData,
    hasNoSort,
    hideHeader,
    bodyClass = "tbody",
    isManualSort,
    setSort,
    setOrderBy,
    // setPageSize,
    pagination = { pageIndex: 1, tableLength: 0, gotoPage: () => {} },
    pageSize,
    includePagination = false,
    // TODO: use later
    // isSmallSize,
    subComponent,
    sort,
    orderBy,
  } = props;
  const columns: Column<object>[] = (useMemo(() => headerList, [headerList]) ||
    []) as Column<object>[];
  const { settingStore } = useStores();
  const { isLoading } = settingStore;
  const isEmptyTable: boolean = tableData?.length === 0;
  const sortBy: SortingRule<object>[] | undefined = useMemo(
    () =>
      isManualSort ? [] : [{ id: headerList[0]?.accessor ?? "", desc: false }],
    [isManualSort]
  );
  const tablePlugins: Array<PluginHook<object>> = [];
  if (!hasNoSort) {
    tablePlugins.push(useSortBy);
  }
  tablePlugins.push(useExpanded);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = useTable(
    {
      columns,
      data: tableData,
      initialState: {
        sortBy,
      },
      autoResetSortBy: !isManualSort,
      disableSortRemove: isManualSort,
      manualSortBy: isManualSort,
    },
    ...tablePlugins
  );
  const paginationComponent: JSX.Element | null =
    includePagination && pageSize && !isEmptyTable ? (
      <Box pt={4}>
        <Pagination pagination={pagination} pageSize={pageSize} />
      </Box>
    ) : null;

  return (
    <TableWrapper>
      <CkTable
        {...getTableProps()}
        variant="simple"
        colorScheme="gray"
        outline="none"
        position="relative"
      >
        <Thead
          position="sticky"
          top={0}
          backgroundColor={"white"}
          display={hideHeader ? "none" : "table-header-group"}
        >
          {headerGroups.map((headerGroup) => {
            const { key, ...restHeaderGroup } =
              headerGroup.getHeaderGroupProps();
            return (
              <Tr key={`tr-${key}`} {...restHeaderGroup}>
                {headerGroup.headers.map((column: Record<string, any>) => {
                  if (isManualSort && column?.isSorted) {
                    setOrderBy && setOrderBy(column.isSortedDesc ? -1 : 1);
                    setSort && setSort(column?.id);
                  }
                  const align: EAlignEnum =
                    get(column, "align", EAlignEnum.LEFT) || EAlignEnum.LEFT;
                  const { key: colKey, ...colProps } = column.getHeaderProps(
                    column?.Header ? column.getSortByToggleProps : undefined
                  );
                  return (
                    <Th
                      key={`th-${colKey}`}
                      {...colProps}
                      whiteSpace="nowrap"
                      paddingLeft={2}
                      paddingY={3}
                      borderBottomWidth="1px"
                      borderColor="gray.200"
                      textAlign={align}
                      color="gray.500"
                      fontSize="12px"
                      fontWeight={600}
                    >
                      {column.render("Header")}
                      &nbsp;
                      {hasNoSort || column?.disableSortBy ? (
                        ""
                      ) : (
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <TriangleDownIcon boxSize={3} />
                            ) : (
                              <TriangleUpIcon boxSize={3} />
                            )
                          ) : null}
                          {/* {column?.id === sort ? (
                            orderBy === 1 ? (
                              <TriangleUpIcon />
                            ) : (
                              <TriangleDownIcon />
                            )
                          ) : null} */}
                        </span>
                      )}
                    </Th>
                  );
                })}
              </Tr>
            );
          })}
        </Thead>
        <Tbody
          {...getTableBodyProps()}
          color="gray.700"
          fontWeight="500"
          fontSize="sm"
          className={bodyClass}
        >
          {rows.map((row, index: number) => {
            prepareRow(row);
            const isExpanded = get(row, "isExpanded", false);
            const isClickable = get(row, "original.onClick");
            const isBold: boolean = get(row, "original.isBold", false);
            const isHightLight: boolean | undefined = get(
              row,
              "original.isHightLight"
            );
            const backGroundColor: string = isHightLight
              ? "#E6FFFA !important"
              : "unset !important";
            return (
              <Fragment key={`row-${index}`}>
                {isLoading && <Skeleton height={48} className="skeleton" />}
                {isLoading && <Tr height={8}></Tr>}
                <Tr
                  {...row.getRowProps()}
                  fontWeight={isBold ? "bold" : "500"}
                  backgroundColor={
                    isHightLight !== undefined ? backGroundColor : undefined
                  }
                  marginBottom={isHightLight ? 4 : 0}
                  display={isLoading ? "none" : "table-row"}
                  cursor={isClickable ? "pointer" : "unset"}
                  onClick={isClickable ? isClickable : undefined}
                >
                  {row.cells.map((cell) => {
                    const { key, ...restCell } = cell.getCellProps();
                    const align: EAlignEnum =
                      get(cell, "column.align", EAlignEnum.LEFT) ||
                      EAlignEnum.LEFT;
                    const isExpandCell = cell.column.id === "isExpand";
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
                          <Icon
                            iconName={
                              isExpanded ? "expand_row.svg" : "collapse_row.svg"
                            }
                            size={20}
                            // @ts-ignore //* INFO: react-table-v6 missing this prop interface
                            {...row.getToggleRowExpandedProps()}
                          />
                        </Td>
                      );
                    }
                    return (
                      <Td
                        {...restCell}
                        key={key}
                        textAlign={align}
                        paddingLeft={2}
                        paddingY={3}
                        borderBottomWidth="1px"
                        borderColor="gray.200"
                        color="gray.900"
                        fontWeight={400}
                        fontSize="sm"
                      >
                        {cell.render("Cell")}
                      </Td>
                    );
                  })}
                </Tr>
                {!isLoading && isHightLight && isBold && (
                  <Tr>
                    <Td padding={2}></Td>
                  </Tr>
                )}
                {!isLoading &&
                  subComponent &&
                  (get(row, "isExpanded", false) ? (
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
            );
          })}
        </Tbody>
      </CkTable>
      {paginationComponent}
    </TableWrapper>
  );
};

export default observer(Table);
