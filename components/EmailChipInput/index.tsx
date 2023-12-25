import React, {
  FC,
  useState,
  ChangeEvent,
  KeyboardEvent,
  ClipboardEvent,
} from "react";
import {
  Box,
  Input,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
} from "@chakra-ui/react";

const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = (email: string): boolean => EMAIL_REGEXP.test(email);

interface ChipProps {
  email: string;
  onCloseClick: (email: string) => void;
}

export const Chip: FC<ChipProps> = ({ email, onCloseClick }) => (
  <Tag key={email} borderRadius="full" variant="solid" colorScheme="green">
    <TagLabel>{email}</TagLabel>
    <TagCloseButton
      onClick={() => {
        onCloseClick(email);
      }}
    />
  </Tag>
);

interface ChipListProps {
  emails: string[];
  onCloseClick: (email: string) => void;
}

export const ChipList: FC<ChipListProps> = ({ emails = [], onCloseClick }) => (
  <Wrap spacing={1} mb={3}>
    {emails.map((email) => (
      <Chip email={email} key={email} onCloseClick={onCloseClick} />
    ))}
  </Wrap>
);

interface ChipEmailInputProps {
  [key: string]: any;
}

export const ChipEmailInput: FC<ChipEmailInputProps> = ({ ...rest }) => (
  <Box>
    <Input type="email" {...rest} />
  </Box>
);

interface EmailChipInputProps {
  emails: string[];
  setEmails: React.Dispatch<React.SetStateAction<string[]>>;
}

export const EmailChipInput: FC<EmailChipInputProps> = ({
  emails = [],
  setEmails,
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  const emailChipExists = (email: string): boolean => emails.includes(email);

  const addEmails = (emailsToAdd: string[]): void => {
    const validatedEmails = emailsToAdd
      .map((e) => e.trim())
      .filter((email) => isValidEmail(email) && !emailChipExists(email));

    const newEmails = [...emails, ...validatedEmails];

    setEmails(newEmails);
    setInputValue("");
  };

  const removeEmail = (email: string): void => {
    const index = emails.findIndex((e) => e === email);
    if (index !== -1) {
      const newEmails = [...emails];
      newEmails.splice(index, 1);
      setEmails(newEmails);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (["Enter", "Tab", ","].includes(e.key)) {
      e.preventDefault();

      addEmails([inputValue]);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text");
    const pastedEmails = pastedData.split(",");
    addEmails(pastedEmails);
  };

  const handleCloseClick = (email: string): void => {
    removeEmail(email);
  };

  return (
    <>
      <ChipList emails={emails} onCloseClick={handleCloseClick} />

      <ChipEmailInput
        placeholder="Enter emails"
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        value={inputValue}
      />
    </>
  );
};
