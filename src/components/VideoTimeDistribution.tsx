'use client'

import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { fetchVideosData } from '~/query'

function formatDateString(input: Date | string | number) {
  const date = new Date(input)

  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`
}

function getName(timeSlot: string) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const hour = Number.parseInt(timeSlot.split(':')![0]!)

  switch (hour) {
    case 0:
      return '午夜'

    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return '凌晨'

    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
      return '早上'

    case 12:
      return '中午'

    case 13:
    case 14:
    case 15:
    case 16:
    case 17:
      return '下午'

    case 18:
      return '傍晚'

    case 19:
    case 20:
    case 21:
    case 22:
    case 23:
    default:
      return '晚上'
  }
}

// Function to generate time slots for a single video
function getVideoTimeSlots(start: string, end: string) {
  const slots = new Set<string>()
  const startTime = new Date(start)
  const endTime = new Date(end)

  // Round down to nearest 30-minute slot
  const currentSlot = new Date(startTime)
  currentSlot.setMinutes(Math.floor(currentSlot.getMinutes() / 30) * 30)
  currentSlot.setSeconds(0)
  currentSlot.setMilliseconds(0)

  while (currentSlot < endTime) {
    const slotEnd = new Date(currentSlot)
    slotEnd.setMinutes(currentSlot.getMinutes() + 30)

    const formattedSlot = `${currentSlot.getHours().toString().padStart(2, '0')}:${currentSlot
      .getMinutes()
      .toString()
      .padStart(2, '0')} 到 ${slotEnd.getHours().toString().padStart(2, '0')}:${slotEnd
      .getMinutes()
      .toString()
      .padStart(2, '0')}`

    slots.add(formattedSlot)
    currentSlot.setMinutes(currentSlot.getMinutes() + 30)
  }

  return [...slots]
}

function formatTimeSlot(hours: number, minutes: number) {
  const start = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  const endMinutes = (minutes + 30) % 60
  const endHours = hours + (minutes + 30 >= 60 ? 1 : 0)
  const end = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`

  return `${start} 到 ${end === '24:00' ? '00:00' : end}`
}

// Initialize distribution with all possible time slots
function initializeDistribution() {
  const distribution: Record<string, number> = {}
  for (let hours = 0; hours < 24; hours++) {
    for (let minutes = 0; minutes < 60; minutes += 30) {
      distribution[formatTimeSlot(hours, minutes)] = 0
    }
  }

  return distribution
}

export function VideoTimeDistribution() {
  const {
    data: allVideos,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideosData,
  })

  // Calculate distribution across all videos
  const calculateDistribution = useCallback(() => {
    const distribution = initializeDistribution()

    ;(allVideos ?? []).forEach((video) => {
      const slots = getVideoTimeSlots(video.startTimestamp, video.endTimestamp)
      slots.forEach((slot) => {
        distribution[slot] = (distribution[slot] ?? 0) + 1
      })
    })

    return Object.entries(distribution).sort(([slotA], [slotB]) => {
      const [hoursA] = slotA.split(':')
      const [hoursB] = slotB.split(':')
      return parseInt(hoursA ?? '0') - parseInt(hoursB ?? '0')
    })
  }, [allVideos])

  const distribution = useMemo(() => calculateDistribution(), [calculateDistribution])

  // Find max count for scaling the visualization
  const maxCount = useMemo(() => Math.max(...distribution.map(([_, count]) => count)), [distribution])

  if (isLoading) {
    return (
      <div className="text-center">
        <p>資料載入中</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center">
        <p>資料載入時發生異常：</p>
        <p>{error.message}</p>
      </div>
    )
  }

  if (!allVideos) {
    return null
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>庫庫台直播時間分佈</CardTitle>
        <CardDescription className="flex flex-col gap-y-1">
          <p>如果庫主播在某個時間段內正在進行直播，就會為該時段計數一次</p>
          <p>
            統計資料從 {formatDateString(allVideos.at(0)?.startTimestamp ?? 0)} 開始至{' '}
            {formatDateString(allVideos.at(allVideos.length - 1)?.startTimestamp ?? 0)}，共計 {allVideos.length ?? 0}{' '}
            次直播
          </p>
          <p>
            <span className="text-red-500">*</span>
            <span>註一：只有統計 YouTube 平台上有公開的一般直播</span>
          </p>
          <p>
            <span className="text-red-500">*</span>
            <span>註二：會限直播、被版權炮、轉為非公開的直播，或是非 YouTube 平台的直播不包含在統計資料內</span>
          </p>
          {/* <ol className="list-decimal pl-4 pt-2">
            <li>將一天每 30 分鐘劃分為固定的時間段。</li>
            <li>若庫主播在該時段內有進行直播，則該時段計數+1。</li>
            <li>最終統計所有時段的資料，結果如下。</li>
          </ol> */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {distribution.map(([timeSlot, count]) => (
            <div key={timeSlot} className="flex items-center gap-4">
              <div className="w-32 text-sm">
                {getName(timeSlot)} {timeSlot}
              </div>
              <div className="flex-1">
                <div
                  className="h-6 rounded bg-primary"
                  style={{
                    width: `${(count / maxCount) * 100}%`,
                    opacity: 0.3 + (count / maxCount) * 0.7,
                  }}
                />
              </div>
              <div className="w-8 text-right">{count}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
