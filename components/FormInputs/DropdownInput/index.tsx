import { useController } from 'react-hook-form'
import DropdownInput, { IDropdownInputProps } from 'components/Inputs/DropdownInput'

interface IFormDropdownInputProps<_, TDropdown> {
  controllerProps: any
  inputProps: IDropdownInputProps<TDropdown>
}

const FormDropdownInput = <IForm, TDropdown = number>(props: IFormDropdownInputProps<IForm, TDropdown>) => {
  const { controllerProps, inputProps } = props
  const { field } = useController(controllerProps)

  return <DropdownInput {...inputProps} {...field} />
}

export default FormDropdownInput
