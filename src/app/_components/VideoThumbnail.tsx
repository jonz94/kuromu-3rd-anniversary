function getThumbnailUrl(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

export function VideoThumbnail({ videoId }: { videoId: string }) {
  const thumbnailUrl = getThumbnailUrl(videoId)

  return (
    <picture>
      <img
        src={thumbnailUrl}
        alt="thumbnail"
        width={480}
        height={270}
        className="h-[270px] w-[480px] object-cover"
        loading="lazy"
      />
    </picture>
  )
}
