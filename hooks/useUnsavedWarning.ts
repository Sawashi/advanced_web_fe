import { Dispatch, SetStateAction, useEffect, useState } from 'react'

interface IUnsavedWarning {
  isDirty: boolean
  setDirty: Dispatch<SetStateAction<boolean>>
}

export default function useUnsavedWarning(enable: boolean = false): IUnsavedWarning {
  const [isDirty, setDirty] = useState<boolean>(enable)

  useEffect(() => {
    function onUnload(event: BeforeUnloadEvent): string {
      event = event || window.event
      if (isDirty) {
        event.preventDefault()
        if (event) {
          //* INFO: for IE, Firefox,...
          event.returnValue = 'Are you sure you want to leave?'
        }
        //* INFO: for Safari
        return 'You have unsaved changes'
      }
      return ''
    }

    //* INFO: Detecting browser closing
    window.addEventListener('beforeunload', onUnload)
    return () => {
      window.removeEventListener('beforeunload', onUnload)
    }
  }, [isDirty])

  return { isDirty, setDirty }
}
