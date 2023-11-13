import { makeObservable, observable } from 'mobx'
import { RootStore } from 'stores'

class TestStore {
  rootStore: RootStore
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeObservable(this, { status: observable })
  }

  status: boolean = true
}

export default TestStore
