/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'

// Styles
import '@mdi/font/css/materialdesignicons.css'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
// export default createVuetify({
//   theme: {
//     defaultTheme: 'system',
//   },
// })

import 'vuetify/styles'

export default createVuetify({
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          'primary': '#3B7D96',
          'secondary': '#ea914e',
          // 'surface': '#ea914e', // 自訂 v-list 背景色
          // 'on-surface': '#FFFFFF', // 確保文字對比度
        },
      },
    },
  },
})
