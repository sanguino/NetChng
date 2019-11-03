const { spawn } = require('child_process');

function* matchAll(str, regexp) {
  const flags = regexp.global ? regexp.flags : regexp.flags + "g";
  const re = new RegExp(regexp, flags);
  let match;
  while (match = re.exec(str)) {
    yield match;
  }
}

class Networksetup {
  static getList () {
    return new Promise((resolve, reject) => {
      const listCommand = spawn('networksetup', ['-listnetworkserviceorder']);
      let out = '';

      listCommand.stdout.on('data', (data) => {
        out += data;
      });

      listCommand.on('close', (code) => {
        if (code === 0) {
          const regex = /\(\d*\)\s(.*)/gm
          const netList = Array.from(matchAll(out, regex), m => m[1]);
          resolve(netList);
        } else {
          reject(code);
        }
      });
    });
  }

  static orderList (adapter) {
    return new Promise( async (resolve, reject) => {
      let list = await Networksetup.getList();
      list = list.filter(item => item !== adapter);
      list.unshift(adapter);
      const orderCommand = spawn('networksetup', ['-ordernetworkservices', ...list]);
      orderCommand.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }
}

module.exports = Networksetup;
