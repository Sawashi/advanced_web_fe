import { RefObject, useEffect, useRef } from 'react'
import { EScrollDirection } from 'enums/common'

export default function useDraggableScroll(
  direction: EScrollDirection = EScrollDirection.BOTH,
  speed: number = 1
): RefObject<HTMLDivElement> {
  const ref: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)

  //* INFO: The initial position (scroll progress and mouse location) when the mouse is pressed down on the refement
  let initialPosition = { scrollTop: 0, scrollLeft: 0, mouseX: 0, mouseY: 0 }

  useEffect(() => {
    const mouseMoveHandler = (event: MouseEvent) => {
      if (ref.current) {
        //* INFO: Calculate how far the user has moved
        const dx: number = event.clientX - initialPosition.mouseX
        const dy: number = event.clientY - initialPosition.mouseY

        //* INFO: Scroll the element according to those differences with scroll speed
        if (direction !== EScrollDirection.HORIZONTAL) {
          ref.current.scrollTop = initialPosition.scrollTop - dy * speed
        }
        if (direction !== EScrollDirection.VERTICAL) {
          ref.current.scrollLeft = initialPosition.scrollLeft - dx * speed
        }
      }
    }

    const mouseUpOrLeaveHandler = () => {
      if (ref.current) {
        //* INFO: Return to cursor: grab after the user is no longer pressing
        ref.current.style.cursor = 'grab'

        //* INFO: Remove the event listeners since it is not necessary to track the mouse position anymore
        ref.current.removeEventListener('mousemove', mouseMoveHandler)
        ref.current.removeEventListener('mouseup', mouseUpOrLeaveHandler)
        ref.current.removeEventListener('mouseleave', mouseUpOrLeaveHandler)
      }
    }

    const onMouseDown = (event: MouseEvent) => {
      if (ref.current) {
        //* INFO: Save the position at the moment the user presses down
        initialPosition = {
          scrollLeft: ref.current.scrollLeft,
          scrollTop: ref.current.scrollTop,
          mouseX: event.clientX,
          mouseY: event.clientY
        }

        //* INFO: Show a cursor: grabbing style and set user-select: none to avoid highlighting while dragging
        ref.current.style.cursor = 'grabbing'
        ref.current.style.userSelect = 'none'

        //* INFO: Add the event listeners that will track the mouse position for the rest of the interaction
        ref.current.addEventListener('mousemove', mouseMoveHandler)
        ref.current.addEventListener('mouseup', mouseUpOrLeaveHandler)
        ref.current.addEventListener('mouseleave', mouseUpOrLeaveHandler)

        event.preventDefault()
      }
    }

    if (ref.current) {
      ref.current.addEventListener('mousedown', onMouseDown)
    }
  }, [ref.current])

  return ref
}
