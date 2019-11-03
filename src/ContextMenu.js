const {app, Menu, Tray} = require('electron');
const path = require('path');
const {menubar} = require('menubar');
const Networksetup = require('./Networksetup.js');
const settings = require('electron-settings');

async function createTemplate(openModal) {
  const list = await Networksetup.getList();
  let template = [{label: 'About Netchngr'}, {type: 'separator'},];
  const selectedAdapters = settings.has('selectedAdapters') ? settings.get('selectedAdapters') : [];
  const filteredList = list.filter(adapter => selectedAdapters.includes(adapter));

  template = template.concat(filteredList.map(item => ({label: item, type: 'radio', click(e) {
      Networksetup.orderList(e.label);
    }})));

  template.push({type: 'separator'});
  template.push({
    label: 'Settings', click() {
      openModal({
        adaptersList: list,
        selectedAdapters: selectedAdapters,
      })
    }
  });
  template.push({
    label: 'Quit', click() {
      app.exit(0)
    }
  });
  return template;
}

class ContextMenu {
  constructor() {
    this.iconPath = path.join(__dirname, 'assets', 'IconTemplate.png');
    this.tray = new Tray(this.iconPath);
  }
  async create (openModal) {
    const template = await createTemplate(openModal);
    const contextMenu = Menu.buildFromTemplate(template);
    this.tray.setContextMenu(contextMenu);

    const mb = menubar({ tray: this.tray });

    mb.on('ready', () => {
      //console.log('Menubar ready.');
    });
  }
}

module.exports = ContextMenu;




