new Vue({
  el: '#app',
  data: {
    adaptersList: [],
    section: 0,
    selectedAdapters: [],
    openAtLogin: false
  },

  methods: {
    saveAdapters() {
      require('electron').ipcRenderer.send('selectedAdapters', this.selectedAdapters);
    },
  },

  watch: {
    openAtLogin: async function (val) {
      require('electron').ipcRenderer.send('openAtLogin', val);
    },
  },

  async beforeMount() {

    require('electron').ipcRenderer.on('data', (event, data) => {
      this.adaptersList = data.adaptersList;
      this.selectedAdapters = data.selectedAdapters;
      this.openAtLogin = data.openAtLogin;
    });

    require('electron').ipcRenderer.on('shouldUseDarkColors', (event, shouldUseDarkColors) => {
      document.documentElement.setAttribute('data-theme', shouldUseDarkColors ? 'dark' : 'light');
      document.querySelector('body').style.display = 'inherit';
    });
  }
})
