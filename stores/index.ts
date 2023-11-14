import AuthStore from 'stores/authStore'
import TestStore from 'stores/testStore'

export class RootStore {
  testStore: TestStore
  authStore: AuthStore

  constructor() {
    this.testStore = new TestStore(this)
    this.authStore = new AuthStore(this)
  }
}

export const rootStore = new RootStore()
