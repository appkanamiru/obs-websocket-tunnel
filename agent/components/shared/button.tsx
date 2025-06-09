import { ElementType } from 'react'
import clsx from 'clsx'

type ButtonProps = {
  label?: string
  disabled?: boolean
  icon?: ElementType
  bgColor?: string
  textColor?: string
  onClick?: () => void
}
export default function Button({
  label = '',
  disabled = false,
  icon: Icon,
  bgColor = 'bg-white',
  textColor = 'text-gray-950',
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={clsx(
        'rounded-full px-2 py-1 text-base shadow-sm font-semibold w-full transition outline-none',
        bgColor,
        textColor,
        {
          'opacity-40 cursor-not-allowed': disabled,
          'hover:brightness-90 cursor-pointer': !disabled,
        },
      )}
    >
      {Icon && (
        <div>
          <Icon />
        </div>
      )}
      <div>{label}</div>
    </button>
  )
}
