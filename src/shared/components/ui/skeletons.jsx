import React from 'react'
import PropTypes from 'prop-types'
import { Skeleton } from './skeleton'
import { cn } from '@/shared/utils/cn'

// Table skeleton with configurable rows and columns
export const TableSkeleton = ({ rows = 5, columns = 4, className }) => {
  return (
    <div className={className}>
      {/* Header */}
      <div className="flex gap-4 mb-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 w-24" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4 mb-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={`cell-${rowIndex}-${colIndex}`} 
              className="h-4 flex-1" 
            />
          ))}
        </div>
      ))}
    </div>
  )
}

TableSkeleton.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number,
  className: PropTypes.string
}

// Card skeleton with title, description, and actions
export const CardSkeleton = ({ showActions = true, className }) => {
  return (
    <div className={cn('p-4 sm:p-6 border rounded-lg', className)}>
      <div className="space-y-3 sm:space-y-4">
        {/* Title */}
        <Skeleton className="h-5 sm:h-6 w-3/4" />
        
        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-3 sm:h-4 w-full" />
          <Skeleton className="h-3 sm:h-4 w-2/3" />
        </div>
        
        {/* Actions */}
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Skeleton className="h-8 sm:h-9 w-full sm:w-20" />
            <Skeleton className="h-8 sm:h-9 w-full sm:w-24" />
          </div>
        )}
      </div>
    </div>
  )
}

CardSkeleton.propTypes = {
  showActions: PropTypes.bool,
  className: PropTypes.string
}

// Form skeleton with labels and inputs
export const FormSkeleton = ({ fields = 3, showSubmit = true, className }) => {
  return (
    <div className={className}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="mb-3 sm:mb-4">
          {/* Label */}
          <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 mb-2" />
          {/* Input */}
          <Skeleton className="h-9 sm:h-10 w-full" />
        </div>
      ))}
      
      {showSubmit && (
        <div className="pt-2">
          <Skeleton className="h-10 sm:h-11 w-full sm:w-32" />
        </div>
      )}
    </div>
  )
}

FormSkeleton.propTypes = {
  fields: PropTypes.number,
  showSubmit: PropTypes.bool,
  className: PropTypes.string
}

// Navigation skeleton
export const NavigationSkeleton = ({ items = 5, className }) => {
  return (
    <div className={className}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  )
}

NavigationSkeleton.propTypes = {
  items: PropTypes.number,
  className: PropTypes.string
}

// Dashboard stats skeleton
export const StatsSkeleton = ({ count = 4, className }) => {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-3 sm:p-4 border rounded-lg">
          <Skeleton className="h-3 sm:h-4 w-12 sm:w-16 mb-2" />
          <Skeleton className="h-6 sm:h-8 w-16 sm:w-20" />
        </div>
      ))}
    </div>
  )
}

StatsSkeleton.propTypes = {
  count: PropTypes.number,
  className: PropTypes.string
}

// List skeleton
export const ListSkeleton = ({ items = 5, className }) => {
  return (
    <div className={className}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-3 border-b last:border-b-0">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

ListSkeleton.propTypes = {
  items: PropTypes.number,
  className: PropTypes.string
}

// Content skeleton for articles/posts
export const ContentSkeleton = ({ lines = 6, className }) => {
  return (
    <div className={className}>
      {/* Title */}
      <Skeleton className="h-8 w-3/4 mb-4" />
      
      {/* Content lines */}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton 
            key={i} 
            className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} 
          />
        ))}
      </div>
    </div>
  )
}

ContentSkeleton.propTypes = {
  lines: PropTypes.number,
  className: PropTypes.string
}

// Search skeleton
export const SearchSkeleton = ({ className }) => {
  return (
    <div className={className}>
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  )
}

SearchSkeleton.propTypes = {
  className: PropTypes.string
}

// Profile skeleton
export const ProfileSkeleton = ({ className }) => {
  return (
    <div className={className}>
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

ProfileSkeleton.propTypes = {
  className: PropTypes.string
}
