import { StepsStyleConfig } from 'chakra-ui-steps'
export const CustomSteps = {
  ...StepsStyleConfig,
  baseStyle: (props: any) => {
    return {
      ...StepsStyleConfig.baseStyle(props),
      stepIconContainer: {
        ...StepsStyleConfig.baseStyle(props).stepIconContainer,
        background: 'white',
        border: '1px solid #E2E8F0',
        '&': {
          width: '32px !important',
          height: '32px !important'
        },
        '&[aria-current="step"]': {
          border: 'unset',
          background: 'teal.500',
          '& > span': {
            color: 'gray.50',
            fontSize: 'sm'
          }
        },
        '&[data-highlighted]': {
          background: 'white',
          border: '1px solid #E2E8F0',
          color: 'gray.500',
          '>div>svg>g': {
            fill: 'gray.500'
          }
        }
      },
      connector: {
        ...StepsStyleConfig.baseStyle(props).connector,
        borderColor: 'gray.300',
        left: 'calc(((158px + 40px) / 2) + 80px)',
        right: 'calc((183px - 40px) / -2 + 80px)',
        '&[data-highlighted]': {
          borderColor: 'gray.300'
        }
      },
      label: {
        ...StepsStyleConfig.baseStyle(props).label,
        color: 'gray.500',
        fontSize: 'sm',
        '[aria-current="step"]': {
          color: '#242E2E',
          fontWeight: 600
        }
      }
    }
  }
}
