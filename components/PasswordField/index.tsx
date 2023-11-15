import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
} from "@chakra-ui/react";
import get from "lodash/get";
import { Controller, useFormContext } from "react-hook-form";
import Icon from "components/Icon";

export interface IPasswordField {
  autoFocus?: boolean;
  name?: string;
  label?: string;
  placeholder?: string;
  height?: string;
}
const PasswordField = (props: IPasswordField) => {
  const {
    name = "password",
    label = "Your Password",
    placeholder = "Your Password",
    autoFocus,
    height = "40px",
  } = props;

  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl
      id={name}
      isInvalid={!!get(errors, name, false)}
      isRequired={true}
    >
      <HStack>
        <FormLabel marginBottom={2} marginRight={2} color="gray.900">
          {label}
        </FormLabel>
      </HStack>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            autoFocus={autoFocus}
            type="password"
            autoComplete="password"
            placeholder={placeholder}
            height={height}
          />
        )}
      />
      <HStack mt={1}>
        <Icon
          iconName="ic-error-form.svg"
          alt=""
          size={15}
          visible={!!get(errors, `${name}.message`, "")}
        />
        <FormErrorMessage>
          {/* @ts-ignore */}
          {errors[name] && errors[name]?.message}
        </FormErrorMessage>
      </HStack>
    </FormControl>
  );
};

export default PasswordField;
