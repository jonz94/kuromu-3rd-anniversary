'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchLastUpdatedAt } from '~/query'

export function LastUpdatedAt() {
  const {
    data: lastUpdatedAt,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['lastUpdatedAt'],
    queryFn: fetchLastUpdatedAt,
  })

  if (isLoading) {
    return <p className="text-xl">資料載入中...</p>
  }

  if (error) {
    return (
      <div>
        <p>資料載入時發生異常：</p>
        <p>{error.message}</p>
      </div>
    )
  }

  if (!lastUpdatedAt) {
    return (
      <div>
        <p>發生錯誤：</p>
        <p>資料更新日期格式異常</p>
      </div>
    )
  }

  return (
    <p className="text-xl">
      資料更新於 {lastUpdatedAt.getFullYear()} 年 {lastUpdatedAt.getMonth() + 1} 月 {lastUpdatedAt.getDate()} 日
    </p>
  )
}
