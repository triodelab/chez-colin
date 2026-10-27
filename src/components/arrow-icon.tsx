type ArrowIconProps = {
  className?: string
  direction?: 'up-right' | 'left' | 'right'
}

const paths = {
  'up-right': 'M5 19 19 5M9 5h10v10',
  left: 'M19 12H5m6-6-6 6 6 6',
  right: 'M5 12h14m-6-6 6 6-6 6',
}

export function ArrowIcon({ className, direction = 'up-right' }: ArrowIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={`arrow-icon${className ? ` ${className}` : ''}`}
      fill="none"
      focusable="false"
      height="24"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d={paths[direction]} />
    </svg>
  )
}
