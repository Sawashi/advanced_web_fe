import SVG, { Props as SVGProps } from 'react-inlinesvg'

export interface ISvgIconProps extends Omit<SVGProps, 'src' | 'preProcessor'> {
  iconName: string
  size?: number
  width?: number
  height?: number
  color?: string
}

const DEFAULT_SIZE: number = 32

const SvgIcon = ({ iconName, size, width, height, color, ...props }: ISvgIconProps) => {
  const iconSize: number = size ? size : DEFAULT_SIZE
  const icon = require(`assets/icons/${iconName || 'default'}.svg`).default
  return (
    <SVG
      src={icon}
      width={width ?? iconSize}
      height={height ?? iconSize}
      preProcessor={code => {
        if (color) return code.replaceAll(/fill=".*?"/g, `fill="${color}"`)
        return code
      }}
      {...props}
    />
  )
}

export default SvgIcon
