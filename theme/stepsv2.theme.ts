import { StepsStyleConfig } from 'chakra-ui-steps'
export const CustomStepsV2 = {
  ...StepsStyleConfig,
  baseStyle: (props: any) => {
    return {
      ...StepsStyleConfig.baseStyle(props),
      stepIconContainer: {
        ...StepsStyleConfig.baseStyle(props).stepIconContainer,
        background: 'transparent',
        cursor: 'pointer',
        transitionDuration: '0.8s',
        border: { base: '2px solid #CBD5E0', lg: '2px solid #E2E8F0' },
        '&': {
          width: { lg: 8 },
          height: { lg: 8 }
        },
        '& > span': {
          fontSize: '0'
        },
        '& > span::before': {
          content: '""',
          display: 'inline-block',
          width: { base: 4, lg: 3 },
          height: { base: 4, lg: 3 },
          borderRadius: '50%',
          background: { base: 'gray.300', lg: 'gray.200' }
        },
        '&[aria-current="step"]': {
          border: { base: '2px solid #319795', lg: '2px solid #00FCF1' },
          background: 'transparent',
          '& > span': {
            fontSize: '0'
          },
          '& > span::before': {
            content: '""',
            display: 'inline-block',
            width: { base: 4, lg: 3 },
            height: { base: 4, lg: 3 },
            borderRadius: '50%',
            background: { base: 'teal.500', lg: '#00FCF1' }
          }
        },
        '&[data-highlighted]': {
          background: { base: 'teal.500', lg: '#00FCF1' },
          border: { base: '2px solid #319795', lg: '2px solid #00FCF1' },
          color: 'gray.800',
          transitionDuration: '0.8s',
          '>div>svg>g': {
            fill: { base: 'white', lg: 'gray.800' }
          }
        }
      },
      connector: {
        ...StepsStyleConfig.baseStyle(props).connector,
        borderColor: { base: 'gray.300', lg: 'gray.200' },
        margin: 0,
        marginLeft: { lg: 'calc(32px / 2)' },
        '& > div': {
          height: 8
        },
        left: 'calc(((158px + 32px) / 2) + 80px)',
        right: 'calc((183px - 32px) / -2 + 80px)',
        '&[data-highlighted]': {
          borderColor: { base: 'teal.500', lg: '#00FCF1' }
        }
      },
      label: {
        ...StepsStyleConfig.baseStyle(props).label,
        color: 'gray.50',
        fontSize: 'sm',
        cursor: 'pointer',
        '[aria-current="step"]': {
          color: 'gray.50',
          fontWeight: 600
        }
      },
      steps: {
        ...StepsStyleConfig.baseStyle(props).steps,
        li: {
          alignItems: { base: 'center', lg: 'flex-start' },
          flexDirection: { base: 'row', lg: 'column' }
        },
        'li:last-child': {
          justifyContent: 'flex-start',
          width: 'auto'
        },
        'li:last-child > div: last-child': {
          display: 'none'
        }
      }
    }
  }
}
