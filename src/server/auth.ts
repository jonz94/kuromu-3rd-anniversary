/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { getServerSession, type DefaultSession, type NextAuthOptions } from 'next-auth'
import { type Adapter } from 'next-auth/adapters'
import DiscordProvider from 'next-auth/providers/discord'

import { env } from '~/env'
import { db } from '~/server/db'
import { accounts, sessions, users, verificationTokens } from '~/server/db/schema'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user']
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),

    // YouTube OAuth for YouTube Data API v3
    {
      id: 'youtube',
      name: 'YouTube',
      type: 'oauth',
      version: '2.0',

      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,

      authorization: {
        url: 'https://accounts.google.com/o/oauth2/v2/auth',
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          client_id: env.GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/youtube.readonly',
        },
      },

      token: {
        async request(context) {
          const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            body: new URLSearchParams({
              code: context.params.code ?? '',
              redirect_uri: context.provider.callbackUrl,
              client_id: context.provider.clientId ?? '',
              client_secret: context.provider.clientSecret ?? '',
              scope: 'https://www.googleapis.com/auth/youtube.readonly',
              grant_type: 'authorization_code',
            }),
          }).then((response) => response.json())

          return {
            tokens: {
              access_token: response.access_token,
              expires_at: Math.floor(Date.now() / 1000) + response.expires_in,
              refresh_token: response.refresh_token,
              token_type: response.token_type,
              scope: response.scope,
            },
          }
        },
      },

      userinfo: {
        async request(context) {
          const accessToken = context.tokens.access_token

          if (accessToken === undefined) {
            throw new Error('[request uesrinfo] access_token is empty')
          }

          const result = await fetch(
            'https://www.googleapis.com/youtube/v3/channels?part=id,snippet&maxResults=1&mine=true',
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          ).then((response) => response.json())

          const youtubeChannelId = result.items[0]?.id ?? ''

          return {
            sub: youtubeChannelId,
            name: result.items[0]?.snippet?.title,
            email: `${youtubeChannelId}@no-reply.youtube.com`,
            image: result.items[0]?.snippet?.thumbnails?.high?.url,
          }
        },
      },

      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: `${profile.sub}@no-reply.youtube.com`,
          image: profile.image,
        }
      },
    },
  ],
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions)
