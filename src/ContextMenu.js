const {app, Menu, Tray} = require('electron');
const path = require('path');
const {menubar} = require('menubar');
const Networksetup = require('./Networksetup.js');

function createTemplate(list = [], openModal) {
  const template = [{label: 'About Netchngr'}, {type: 'separator'},]
  list.forEach(item => template.push({label: item, type: 'radio', click(e) {
      Networksetup.orderList(e.label);
    }}));
  template.push({type: 'separator'});
  template.push({
    label: 'Settings', click() {
      openModal({adaptersList: list})
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
  create (list, openModal) {
    const template = createTemplate(list, openModal);
    const contextMenu = Menu.buildFromTemplate(template);
    this.tray.setContextMenu(contextMenu);

    const mb = menubar({ tray: this.tray });

    mb.on('ready', () => {
      //console.log('Menubar ready.');
    });
  }
}

module.exports = ContextMenu;




