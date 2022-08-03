
import {useState, useEffect, useCallback} from 'react'

function useCaretPosition({initialValue, isFocus, ref}) {
  const [caretPosition, setCaretPosition] = useState(initialValue ? initialValue.length : 0)

  const updateCaretPosition = useCallback(() => {
    setCaretPosition(ref.current.selectionStart)
    ref.current.focus()
  }, [ref])

  useEffect(() => {
    ref.current.setSelectionRange(caretPosition + 1, caretPosition + 1)
  }, [caretPosition, isFocus, ref])

  return {updateCaretPosition}
}

export default useCaretPosition
