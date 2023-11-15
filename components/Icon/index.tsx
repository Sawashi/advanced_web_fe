import cx from 'classnames'
import Image, { ImageProps } from 'next/image'
import { SyntheticEvent } from 'react'

export type IIconProps = Partial<ImageProps> & {
  iconName: string
  size?: number
  className?: string
  visible?: boolean
  onClick?: (event?: SyntheticEvent) => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

const Icon = (props: IIconProps) => {
  const {
    iconName,
    size,
    alt,
    width,
    height,
    className,
    onClick,
    onMouseEnter,
    onMouseLeave,
    visible = true,
    color,
    ...others
  } = props
  const defaultSize: number = 32
  const iconSize: number = size ? size : defaultSize

  if (!visible) return null

  return (
    <Image
      {...others}
      src={`/assets/icons/${iconName}`}
      alt={alt || ''}
      unoptimized
      loading="eager"
      width={width || iconSize}
      height={height || iconSize}
      className={cx(className, { [`is-clickable`]: onClick })}
      onClick={onClick}
      color={color}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  )
}

export default Icon
