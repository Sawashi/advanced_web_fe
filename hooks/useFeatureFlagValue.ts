import { useContext, useEffect, useState } from 'react'
import EFeatureFlags from 'enums/featureFlags'
import { FlagsClient, FlagsContext, FlagValue } from 'react-unleash-flags'

interface IFeatureFlagValue {
  isEnabled?: boolean
  flagName: string
}

export default function useFeatureFlagValue(
  name: EFeatureFlags,
  singleEnvironment: boolean = false
): IFeatureFlagValue {
  const [isEnabled, setIsEnabled] = useState<boolean>()
  const flagsClient: FlagsClient | undefined = useContext(FlagsContext)

  //* INFO: Flag name with environment
  const flagName: string = singleEnvironment ? name : `${process.env.REACT_APP_FLAGS_CTX_APP_NAME}-${name}`
  const flag: FlagValue | undefined = flagsClient ? flagsClient.getFlag(flagName) : undefined

  useEffect(() => {
    if (flag) {
      //* INFO: Set flag value if fetched
      if (flag?.enabled) {
        setIsEnabled(true)
      } else {
        setIsEnabled(false)
      }
    }
  }, [flag])

  return { isEnabled, flagName }
}
