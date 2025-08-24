import React from 'react'
import PropTypes from 'prop-types'
import { cn } from '@/shared/utils/cn'

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
        className
      )}
      {...props}
    />
  )
}

Skeleton.propTypes = {
  className: PropTypes.string
}

export { Skeleton }
