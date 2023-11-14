import Pusher, { Options } from 'pusher-js'

class PusherService {
  private pusher: Pusher | null = null
  private key: string = process.env.PUSHER_KEY ?? ''
  private config: Options = {
    cluster: process.env.PUSHER_CLUSTER ?? ''
  }

  public getPusher(): Pusher {
    if (!this.pusher) {
      // Enable pusher logging - don't include this in production
      // Pusher.logToConsole = process.env.ENVIRONMENT !== EnvironmentEnum.PRODUCTION

      this.pusher = new Pusher(this.key, this.config)
    }

    return this.pusher
  }
}

const pusherService = new PusherService()
export const pusher = pusherService.getPusher()
