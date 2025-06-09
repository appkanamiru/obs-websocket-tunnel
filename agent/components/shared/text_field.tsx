import { HTMLInputTypeAttribute, useRef, useState } from 'react'
import clsx from 'clsx'

type TextFieldProps = {
  label?: string
  name?: string
  type?: HTMLInputTypeAttribute
  value?: string
  defaultValue?: string
  size?: number
  maxLength?: number
  helperText?: string
  required?: boolean
  disabled?: boolean
  error?: boolean
  labelBgColor?: string
  onChange?: (value: string) => void
}

export default function TextField({
  label,
  name,
  type,
  value,
  defaultValue,
  size,
  maxLength,
  helperText,
  required,
  disabled,
  error,
  labelBgColor = 'bg-white',
  onChange,
}: TextFieldProps) {
  const ref = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div
      className={clsx('w-min mt-2', {
        'opacity-40': disabled,
      })}
    >
      <div
        onClick={() => ref.current?.focus()}
        className={clsx('transition rounded relative p-3', {
          'outline-2': isFocused,
          'outline-1': !isFocused,
          'outline-red-600': error,
          'outline-blue-500': !error && isFocused,
          'outline-gray-500': !error && !isFocused,
          'cursor-pointer': !disabled,
          'cursor-not-allowed': disabled,
        })}
      >
        <label
          className={clsx('transition absolute px-1', {
            'text-red-600': error,
            'text-blue-500': !error && isFocused,
            'text-gray-500': !error && !isFocused,
            'translate-x-6': !isFocused && (value === undefined || value?.length === 0),
            [`${labelBgColor} -translate-y-5.5 text-xs`]:
              isFocused || (value !== undefined && value.length !== 0),
            'cursor-pointer': !disabled,
            'cursor-not-allowed': disabled,
          })}
        >
          {label}
        </label>
        <input
          ref={ref}
          name={name}
          type={type}
          value={value}
          defaultValue={defaultValue}
          size={size}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          onChange={(e) => onChange?.(e.currentTarget.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={clsx('outline-none transition', {
            'cursor-pointer': !disabled,
            'cursor-not-allowed': disabled,
          })}
        />
      </div>
      <div className="flex justify-between px-2 text-xs h-4 mt-1">
        <div className={clsx({ 'text-red-600': error, 'text-gray-500': !error })}>{helperText}</div>
        <div className={clsx('text-gray-500', { hidden: maxLength === undefined })}>
          {value?.length} / {maxLength}
        </div>
      </div>
    </div>
  )
}
