import { useSystem } from '@/contexts/useSystem'
import React from 'react'

export function Call() {
  const { theme } = useSystem()
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.8125 18.6875L11.5 21C11.0125 21.4875 10.2375 21.4875 9.7375 21.0125C9.6 20.875 9.4625 20.75 9.325 20.6125C8.0375 19.3125 6.875 17.95 5.8375 16.525C4.8125 15.1 3.9875 13.675 3.3875 12.2625C2.8 10.8375 2.5 9.475 2.5 8.175C2.5 7.325 2.65 6.5125 2.95 5.7625C3.25 5 3.725 4.3 4.3875 3.675C5.1875 2.8875 6.0625 2.5 6.9875 2.5C7.3375 2.5 7.6875 2.575 8 2.725C8.325 2.875 8.6125 3.1 8.8375 3.425L11.7375 7.5125C11.9625 7.825 12.125 8.1125 12.2375 8.3875C12.35 8.65 12.4125 8.9125 12.4125 9.15C12.4125 9.45 12.325 9.75 12.15 10.0375C11.9875 10.325 11.75 10.625 11.45 10.925L10.5 11.9125C10.3625 12.05 10.3 12.2125 10.3 12.4125C10.3 12.5125 10.3125 12.6 10.3375 12.7C10.375 12.8 10.4125 12.875 10.4375 12.95C10.6625 13.3625 11.05 13.9 11.6 14.55C12.1625 15.2 12.7625 15.8625 13.4125 16.525C13.5375 16.65 13.675 16.775 13.8 16.9C14.3 17.3875 14.3125 18.1875 13.8125 18.6875Z"
        fill={theme.primary}
      />
      <path
        d="M27.4625 22.9125C27.4625 23.2625 27.4 23.625 27.275 23.975C27.2375 24.075 27.2 24.175 27.15 24.275C26.9375 24.725 26.6625 25.15 26.3 25.55C25.6875 26.225 25.0125 26.7126 24.25 27.0251C24.2375 27.0251 24.225 27.0375 24.2125 27.0375C23.475 27.3375 22.675 27.5 21.8125 27.5C20.5375 27.5 19.175 27.2 17.7375 26.5875C16.3 25.975 14.8625 25.1501 13.4375 24.1125C12.95 23.7501 12.4625 23.3875 12 23L16.0875 18.9125C16.4375 19.175 16.75 19.375 17.0125 19.5125C17.075 19.5375 17.15 19.575 17.2375 19.6125C17.3375 19.65 17.4375 19.6625 17.55 19.6625C17.7625 19.6625 17.925 19.5875 18.0625 19.45L19.0125 18.5125C19.325 18.2 19.625 17.9625 19.9125 17.8125C20.2 17.6375 20.4875 17.55 20.8 17.55C21.0375 17.55 21.2875 17.6 21.5625 17.7125C21.8375 17.825 22.125 17.9875 22.4375 18.2L26.575 21.1375C26.9 21.3625 27.125 21.625 27.2625 21.9375C27.3875 22.25 27.4625 22.5625 27.4625 22.9125Z"
        fill={theme.primary}
      />
    </svg>
  )
}

export function Sms() {
  const { theme } = useSystem()
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.25 4.375H8.75C5 4.375 2.5 6.25 2.5 10.625V19.375C2.5 23.75 5 25.625 8.75 25.625H21.25C25 25.625 27.5 23.75 27.5 19.375V10.625C27.5 6.25 25 4.375 21.25 4.375ZM21.8375 11.9875L17.925 15.1125C17.1 15.775 16.05 16.1 15 16.1C13.95 16.1 12.8875 15.775 12.075 15.1125L8.1625 11.9875C7.7625 11.6625 7.7 11.0625 8.0125 10.6625C8.3375 10.2625 8.925 10.1875 9.325 10.5125L13.2375 13.6375C14.1875 14.4 15.8 14.4 16.75 13.6375L20.6625 10.5125C21.0625 10.1875 21.6625 10.25 21.975 10.6625C22.3 11.0625 22.2375 11.6625 21.8375 11.9875Z"
        fill={theme.primary}
      />
    </svg>
  )
}

export function ErrorSvg() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_72_1948)">
        <path
          d="M8.49935 1.41663C4.58935 1.41663 1.41602 4.58996 1.41602 8.49996C1.41602 12.41 4.58935 15.5833 8.49935 15.5833C12.4093 15.5833 15.5827 12.41 15.5827 8.49996C15.5827 4.58996 12.4093 1.41663 8.49935 1.41663ZM9.20768 12.0416H7.79102V10.625H9.20768V12.0416ZM9.20768 9.20829H7.79102V4.95829H9.20768V9.20829Z"
          fill="#EB3223"
        />
      </g>
      <defs>
        <clipPath id="clip0_72_1948">
          <rect width="17" height="17" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
