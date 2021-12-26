import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    /* themes: {
      light: {
        primary: '#ee44aa',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      },
    }, */
    themes: {
      light: {
        primary: '#10ac84',
        secondary: '#7261a8',
        accent: '#0abde3',
        error: '#ee5253',
        info: '#54a0ff',
        success: '#4CAF50',
        warning: '#ff9f43',
        background: '#F5F7FA',
        fieldtext: '#FFFFFF'
      },
    },
  },
});
