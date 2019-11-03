new Vue({
  el: '#app',
  data: {
    adaptersList: [],
    section: 0,
    selectedAdapters: []
  },

  methods: {
    saveAdapters() {
      require('electron').ipcRenderer.send('selectedAdapters', this.selectedAdapters);
    },
  },

  beforeMount() {
    require('electron').ipcRenderer.on('data', (event, data) => {
      this.adaptersList = data.adaptersList;
    });

    require('electron').ipcRenderer.on('shouldUseDarkColors', (event, shouldUseDarkColors) => {
      document.documentElement.setAttribute('data-theme', shouldUseDarkColors ? 'dark' : 'light');
      document.querySelector('body').style.display = 'inherit';
    });
  }
})
