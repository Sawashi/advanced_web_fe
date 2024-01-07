import { Box, Button, HStack } from "@chakra-ui/react";
import React, { useState } from "react";

interface NewPaginationProps {
  currentPage: number;
  totalPages: number;
  isDisabled?: boolean;
  getUserListAtPage: (page: number) => void;
}

const NewPagination: React.FC<NewPaginationProps> = ({
  currentPage,
  totalPages,
  isDisabled = false,
  getUserListAtPage,
}) => {
  const [activePage, setActivePage] = useState(currentPage);

  const handlePrevious = async () => {
    if (activePage > 1) {
      setActivePage(activePage - 1);
      await getUserListAtPage(activePage - 1);
    }
  };

  const handleNext = async () => {
    if (activePage < totalPages) {
      setActivePage(activePage + 1);
      console.log("Active page: " + activePage);
      await getUserListAtPage(activePage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxButtons = 5;
    const halfMaxButtons = Math.floor(maxButtons / 2);
    let startPage = Math.max(1, activePage - halfMaxButtons);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (totalPages <= maxButtons) {
      startPage = 1;
      endPage = totalPages;
    } else if (activePage <= halfMaxButtons) {
      startPage = 1;
      endPage = maxButtons;
    } else if (activePage >= totalPages - halfMaxButtons) {
      startPage = totalPages - maxButtons + 1;
      endPage = totalPages;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant={i === activePage ? "solid" : "outline"}
          colorScheme="teal"
          onClick={async () => {
            setActivePage(i);
            await getUserListAtPage(i);
          }}
          isDisabled={isDisabled}
        >
          {i}
        </Button>
      );
    }

    return pageNumbers;
  };

  return (
    <Box mt={4} textAlign="center">
      <HStack spacing={2}>
        <Button
          onClick={handlePrevious}
          isDisabled={isDisabled || activePage === 1}
        >
          Previous
        </Button>
        {renderPageNumbers()}
        <Button
          onClick={handleNext}
          isDisabled={isDisabled || activePage === totalPages}
        >
          Next
        </Button>
      </HStack>
    </Box>
  );
};

export default NewPagination;
