import {
  Avatar,
  Box,
  FormControl,
  FormErrorMessage,
  IconButton,
} from "@chakra-ui/react";
import { get } from "lodash";
import { ChangeEvent, memo, useEffect, useRef, useState } from "react";
import SvgIcon from "components/SvgIcon";

interface IAvatarUploadProps {
  handleUploadFile?: (file: File) => void;
  src: string;
  isDisable?: boolean;
  error?: string;
}

const AvatarUpload = (props: IAvatarUploadProps) => {
  const { src, isDisable = false, error } = props;
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (src) {
      setSelectedImage(src);
    } else {
      setSelectedImage("");
    }
  }, [src]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = get(event, "target.files[0]");
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      props.handleUploadFile && props.handleUploadFile(file);
    }
  };

  const fileRef = useRef<any>(null);

  return (
    <FormControl isInvalid={!!error}>
      <Box
        position={"relative"}
        width="fit-content"
        cursor={!isDisable ? "pointer" : "not-allowed"}
      >
        <Avatar size="xl" src={selectedImage || ""} />
        {!isDisable && (
          <IconButton
            position="absolute"
            borderRadius="100%"
            right={0}
            bottom={0}
            aria-label="Search database"
            bg={"gray.300"}
            icon={<SvgIcon iconName="ic-camera.svg" />}
            onClick={() => {
              !isDisable &&
                fileRef &&
                fileRef.current &&
                fileRef.current.click();
            }}
          />
        )}

        <Box display={"none"}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileRef}
          />
        </Box>
      </Box>

      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default memo(AvatarUpload);
