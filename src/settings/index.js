let AutoLaunch = require('auto-launch');

new Vue({
  el: '#app',
  data: {
    adaptersList: [],
    section: 0,
    selectedAdapters: [],
    startOnLogin: false
  },

  methods: {
    saveAdapters() {
      require('electron').ipcRenderer.send('selectedAdapters', this.selectedAdapters);
    },
  },

  watch: {
    startOnLogin: async function (val) {
      val ? this.autoLaunch.enable() : this.autoLaunch.disable();
    },
  },

  async beforeMount() {

    this.autoLaunch = new AutoLaunch({
      name: 'NetChng',
      path: process.execPath,
      mac: {
        useLaunchAgent: true
      }
    });

    this.startOnLogin = await this.autoLaunch.isEnabled();
    console.log(' this.autoLaunch.isEnabled()', this.startOnLogin)

    require('electron').ipcRenderer.on('data', (event, data) => {
      this.adaptersList = data.adaptersList;
    });

    require('electron').ipcRenderer.on('shouldUseDarkColors', (event, shouldUseDarkColors) => {
      document.documentElement.setAttribute('data-theme', shouldUseDarkColors ? 'dark' : 'light');
      document.querySelector('body').style.display = 'inherit';
    });
  }
})
