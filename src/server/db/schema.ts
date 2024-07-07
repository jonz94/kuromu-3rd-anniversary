import { relations, sql } from 'drizzle-orm'
import { blob, index, int, primaryKey, sqliteTableCreator, text } from 'drizzle-orm/sqlite-core'
import { type AdapterAccount } from 'next-auth/adapters'

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `${name}`)

export const users = createTable('user', {
  id: text('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name', { length: 255 }),
  email: text('email', { length: 255 }).notNull(),
  emailVerified: int('emailVerified', {
    mode: 'timestamp',
  }).default(sql`CURRENT_TIMESTAMP`),
  image: text('image', { length: 255 }),
})

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}))

export const accounts = createTable(
  'account',
  {
    userId: text('userId', { length: 255 })
      .notNull()
      .references(() => users.id),
    type: text('type', { length: 255 }).$type<AdapterAccount['type']>().notNull(),
    provider: text('provider', { length: 255 }).notNull(),
    providerAccountId: text('providerAccountId', { length: 255 }).notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: int('expires_at'),
    token_type: text('token_type', { length: 255 }),
    scope: text('scope', { length: 255 }),
    id_token: text('id_token'),
    session_state: text('session_state', { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index('account_userId_idx').on(account.userId),
  }),
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessions = createTable(
  'session',
  {
    sessionToken: text('sessionToken', { length: 255 }).notNull().primaryKey(),
    userId: text('userId', { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: int('expires', { mode: 'timestamp' }).notNull(),
  },
  (session) => ({
    userIdIdx: index('session_userId_idx').on(session.userId),
  }),
)

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const verificationTokens = createTable(
  'verificationToken',
  {
    identifier: text('identifier', { length: 255 }).notNull(),
    token: text('token', { length: 255 }).notNull(),
    expires: int('expires', { mode: 'timestamp' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
)

export const rawTextMessages = createTable('raw_text_message', {
  id: text('id').notNull().primaryKey(),
  videoId: text('video_id').notNull(),
  userId: text('user_id').notNull(),
  timestamp: int('timestamp').notNull(),
  videoOffsetTimeMsec: text('video_offset_time_msec').notNull(),

  jsonMessage: blob('json_message').notNull(),
})

export const rawMembershipItems = createTable('raw_membership_item', {
  id: text('id').notNull().primaryKey(),
  videoId: text('video_id').notNull(),
  userId: text('user_id').notNull(),
  timestamp: int('timestamp').notNull(),
  videoOffsetTimeMsec: text('video_offset_time_msec').notNull(),

  headerPrimaryText: text('header_primary_text').notNull(),
  headerSubtext: text('header_subtext').notNull(),
  jsonMessage: blob('json_message').notNull(),
})

export const rawPaidMessages = createTable('raw_paid_message', {
  id: text('id').notNull().primaryKey(),
  videoId: text('video_id').notNull(),
  userId: text('user_id').notNull(),
  timestamp: int('timestamp').notNull(),
  videoOffsetTimeMsec: text('video_offset_time_msec').notNull(),

  headerBackgroundColor: int('header_background_color').notNull(),
  headerTextColor: int('header_text_color').notNull(),
  bodyBackgroundColor: int('body_background_color').notNull(),
  bodyTextColor: int('body_text_color').notNull(),

  purchaseAmount: text('purchase_amount').notNull(),
  jsonMessage: blob('json_message').notNull(),
})

export const rawPaidStickers = createTable('raw_paid_sticker', {
  id: text('id').notNull().primaryKey(),
  videoId: text('video_id').notNull(),
  userId: text('user_id').notNull(),
  timestamp: int('timestamp').notNull(),
  videoOffsetTimeMsec: text('video_offset_time_msec').notNull(),

  moneyChipBackgroundColor: int('money_chip_background_color').notNull(),
  moneyChipTextColor: int('money_chip_text_color').notNull(),
  backgroundColor: int('background_color').notNull(),
  authorNameTextColor: int('author_name_text_color').notNull(),

  purchaseAmount: text('purchase_amount').notNull(),
  jsonSticker: blob('json_sticker').notNull(),
})

export const rawLiveChatSponsorshipsGiftPurchaseAnnouncements = createTable(
  'raw_live_chat_sponsorships_gift_purchase_announcement',
  {
    id: text('id').notNull().primaryKey(),
    videoId: text('video_id').notNull(),
    userId: text('user_id').notNull(),
    timestampUsec: text('timestamp_usec').notNull(),
    videoOffsetTimeMsec: text('video_offset_time_msec').notNull(),

    headerPrimaryText: text('header_primary_text').notNull(),
  },
)

export const rawLiveChatSponsorshipsGiftRedemptionAnnlungements = createTable(
  'raw_live_chat_sponsorships_gift_redemption_announcement',
  {
    id: text('id').notNull().primaryKey(),
    videoId: text('video_id').notNull(),
    userId: text('user_id').notNull(),
    timestampUsec: text('timestamp_usec').notNull(),
    videoOffsetTimeMsec: text('video_offset_time_msec').notNull(),

    jsonMessage: text('json_message').notNull(),
  },
)
