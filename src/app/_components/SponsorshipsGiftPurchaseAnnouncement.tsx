'use client'

import { type RawSponsorshipsGiftPurchaseAnnouncementSchemaWithMessageType } from '~/query'

export function SponsorshipsGiftPurchaseAnnouncement({
  sponsorshipsGiftPurchaseAnnouncement,
}: {
  sponsorshipsGiftPurchaseAnnouncement: RawSponsorshipsGiftPurchaseAnnouncementSchemaWithMessageType
}) {
  if (sponsorshipsGiftPurchaseAnnouncement.type !== 'SponsorshipsGiftPurchaseAnnouncement') return null

  return (
    <div className="w-[360px] overflow-hidden rounded-sm">
      <div className="flex bg-[rgb(15,157,88)]">
        <p className="my-auto pl-8 text-xl">
          {sponsorshipsGiftPurchaseAnnouncement.headerPrimaryText
            .replace('Gifted', '送出了')
            .replace('庫洛姆•Kuromu', '個「庫洛姆•Kuromu」')
            .replace(' memberships', '的會籍')}
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/sponsorships_gift_purchase_announcement_artwork.png"
          width={208}
          height={208}
          className="size-[104px]"
          alt=""
        />
      </div>
    </div>
  )
}
