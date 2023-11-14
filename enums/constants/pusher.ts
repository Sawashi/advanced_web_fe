export const pusherChannels = {
  leaseAgreement: {
    signed: {
      value: (applicationId: string) => `leaseAgreement.signed.${applicationId}`
    }
  },
  driverLicense: {
    verified: {
      value: (customerUid: string) => `driverLicense.verified.${customerUid}`
    }
  }
}
