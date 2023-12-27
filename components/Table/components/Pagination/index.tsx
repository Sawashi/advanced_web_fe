import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Button, Flex, Text, Box, Icon } from "@chakra-ui/react";
import isNaN from "lodash/isNaN";
import React from "react";
import { IPagination } from "components/Table";
import { truncatePagination } from "./utils";

export interface IPaginationProps {
  pagination: IPagination;
  pageSize: number;
  showGoToPage?: boolean;
}

const Pagination = (props: IPaginationProps) => {
  const { pagination, pageSize, showGoToPage = false } = props;
  const { gotoPage, pageIndex, tableLength } = pagination;

  const numberOfPages: number = Math.ceil(tableLength / pageSize) || 1;

  const truncatedPagination: string[] = truncatePagination(
    Number(pageIndex),
    Number(numberOfPages)
  );

  function goPreviousPage(): void {
    gotoPage(Number(pageIndex) - 1);
  }

  function goNextPage(): void {
    gotoPage(Number(pageIndex) + 1);
  }

  return (
    <Flex justifyContent="center" flexWrap="nowrap">
      <Box gap={2} marginLeft={showGoToPage ? "auto" : 0}>
        <Button
          colorScheme="gray"
          variant="outline"
          background={{ base: "teal.500", md: "gray.50" }}
          borderColor="gray.200"
          padding="6px"
          marginRight={{ base: 0, md: 2 }}
          onClick={goPreviousPage}
          color={{ base: "white", md: "gray.800" }}
          _hover={{ backgroundColor: { base: "blue.600", md: "unset" } }}
          isDisabled={pageIndex === 1}
        >
          <Icon width="20px" height="20px" as={ChevronLeftIcon} />
        </Button>
        {Array.isArray(truncatedPagination) &&
          truncatedPagination.map((item: string, index: number) => {
            if (isNaN(item)) {
              return <Text key={index}>{item}</Text>;
            }
            const isActive = pageIndex === Number(item);
            return (
              <Button
                width={8}
                height={10}
                fontSize={12}
                colorScheme={isActive ? "blue.600" : "gray"}
                variant={isActive ? "solid" : "outline"}
                background={!isActive ? "gray.50" : "blue.600"}
                borderColor="gray.200"
                borderRadius={8}
                padding={2}
                marginRight={2}
                lineHeight={1.5}
                key={`pagination-${index}`}
                onClick={() =>
                  isActive || item === "..." ? {} : gotoPage(Number(item))
                }
                cursor={isActive || item === "..." ? "default" : "pointer"}
              >
                {item}
              </Button>
            );
          })}
        <Button
          colorScheme="gray"
          variant="outline"
          paddingX={{ base: 6, md: 2 }}
          marginLeft={{ base: 4, md: 0 }}
          background={{ base: "blue.600", md: "gray.50" }}
          borderColor="gray.200"
          isDisabled={pageIndex === numberOfPages}
          onClick={goNextPage}
          color={{ base: "white", md: "gray.800" }}
          _hover={{ backgroundColor: { base: "blue.600", md: "unset" } }}
        >
          <Icon width="20px" height="20px" as={ChevronRightIcon} />
        </Button>
      </Box>
    </Flex>
  );
};

export default Pagination;
