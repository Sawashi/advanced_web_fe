import { AspectRatio } from '@chakra-ui/react'

interface IIframeProps {
  src?: string
  className?: string
}

const Iframe = (props: IIframeProps) => {
  const { src, className } = props

  return (
    <AspectRatio className={className} ratio={16 / 10}>
      <iframe src={src} allowFullScreen loading="eager" />
    </AspectRatio>
  )
}

export default Iframe
