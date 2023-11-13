import amplitude, { AmplitudeClient } from 'amplitude-js'
import { CategoryEnum } from 'enums/analytics'
import { LocalStorageKeyEnum, StorageType } from 'enums/common'
import { IApplicationFormValues } from 'interfaces/application'
import { IAtlasUser } from 'interfaces/user'
import { AMPLITUDE_API_KEY, GET_ATLAS_APP_ID, GOOGLE_ANALYTICS_TRACKING_ID } from 'pages/_document'

//* INFO: log the pageview with their URL
export const pageView = (url: string) => {
  if (GOOGLE_ANALYTICS_TRACKING_ID && window?.gtag) {
    window.gtag('config', GOOGLE_ANALYTICS_TRACKING_ID, {
      // eslint-disable-next-line camelcase
      page_path: url
    })
  }
}

//* INFO: log specific events happening.
export const logEvent = (category: CategoryEnum, action: string) => {
  if (!category || !action) {
    return
  }

  // *TODO: remove the Amplitude service and will replace it with Google Analytics
  // if (AMPLITUDE_API_KEY) {
  //   if (!window.amplitude && window) {
  //     initAmplitude()
  //   }
  //   const pageUrl: string = window?.location?.href ?? ''
  //   const lastViewedPropertyId: string | undefined =
  //     localStorage.getItem(LocalStorageKeyEnum.LAST_VIEWED_PROPERTY_ID) || undefined
  //   const amplitudeInstance = amplitude.getInstance()
  //   amplitudeInstance.logEvent(action, { category, lastViewedPropertyId, pageUrl })
  // }

  if (GOOGLE_ANALYTICS_TRACKING_ID && window?.gtag) {
    window.gtag('event', action, { category })
  } else {
    console.log(`Log category = ${category}, action: ${action}`)
  }
}

export function identifyAtlasUser(user: IApplicationFormValues): void {
  if (!user?.lastName && !user?.firstName) {
    return
  }
  const name = `${user.firstName} ${user.lastName}`
  const phone = user?.phoneNumber ?? ''
  const email = user?.email ?? ''
  const photo = user?.driverLicenseFrontPhotoUrl ?? ''
  if (GET_ATLAS_APP_ID && window?.Atlas && window?.Atlas?.identify && phone) {
    const newUser: IAtlasUser = {
      userId: phone,
      name,
      email,
      fields: { phone, photo }
    }
    if (!email) {
      delete newUser?.email
    }
    window.Atlas.identify(newUser)
  }
}

export function identifyAmplitudeUser(user: IApplicationFormValues): void {
  // *TODO: remove the Amplitude service and will replace it with Google Analytics
  // if (!user?.lastName || !user?.firstName) {
  //   return
  // }
  // const phone = user?.phoneNumber ?? ''
  // const amplitudeInstance = amplitude.getInstance()
  // if (AMPLITUDE_API_KEY && window?.amplitude && phone) {
  //   amplitudeInstance.setUserProperties(user)
  // }
}

export function initAmplitude(): void {
  const userId: string | undefined = localStorage.getItem(LocalStorageKeyEnum.PHONE_NUMBER) ?? undefined
  const amplitudeInstance: AmplitudeClient = amplitude.getInstance()
  amplitudeInstance.init(AMPLITUDE_API_KEY, userId, {
    batchEvents: true,
    eventUploadThreshold: 10,
    eventUploadPeriodMillis: 10000,
    storage: StorageType.LOCAL_STORAGE,
    saveEvents: true,
    includeReferrer: true,
    includeUtm: true,
    includeGclid: true,
    includeFbclid: true,
    logAttributionCapturedEvent: true
  })
  if (window) {
    window.amplitude = amplitudeInstance
  }
}
