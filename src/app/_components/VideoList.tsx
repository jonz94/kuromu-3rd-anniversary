'use client'

import { useQuery } from '@tanstack/react-query'
import { VideoThumbnail } from '~/app/_components/VideoThumbnail'
import { fetchVideosData } from '~/query'

export function VideoList() {
  const {
    data: allVideos,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideosData,
  })

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

  return (
    <div>
      {allVideos?.map((video, index) => {
        const timestamp = new Date(video.startTimestamp).toLocaleString('zh-Hant-TW')

        return (
          <div key={index}>
            <VideoThumbnail videoId={video.id} />
            <p>
              <span>{timestamp}</span>
              <span>{video.title}</span>
            </p>
          </div>
        )
      })}
    </div>
  )
}
