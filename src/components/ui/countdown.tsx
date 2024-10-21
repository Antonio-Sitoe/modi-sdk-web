import { useEffect, Dispatch, SetStateAction } from 'react'

function Countdown({
  setValue,
  time,
  setTime,
}: {
  time: number
  setValue: Dispatch<SetStateAction<boolean>>
  setTime: Dispatch<SetStateAction<number>>
}) {
  useEffect(() => {
    if (time > 0) {
      const timerId = setTimeout(() => {
        setTime(time - 1)
      }, 1000)

      return () => clearTimeout(timerId)
    }
    if (time !== 0) {
      setValue(true)
    } else {
      setValue(false)
    }
  }, [setTime, setValue, time])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
  }

  return (
    <p className="text-center font-montSerrat font-base mt-4">
      {formatTime(time)}
    </p>
  )
}

export default Countdown
