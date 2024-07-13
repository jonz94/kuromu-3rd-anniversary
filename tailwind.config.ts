import { type Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Noto Sans TC',
          'Noto Sans JP',
          'Noto Sans KR',
          'Noto Sans SC',
          'Source Han Sans TC',
          'Source Han Sans JP',
          'Source Han Sans KR',
          'Source Han Sans SC',
          '微軟正黑體',
          ...fontFamily.sans,
        ],
      },
    },
  },
  plugins: [],
} satisfies Config
