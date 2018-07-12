const fs = require('fs');
const EventEmitter = require('events');
const event = new EventEmitter();

class DirWatcher {
  constructor() {
    this.watch = this.watch.bind(this);
  }

  watch(path = '', delay = 3000) {
    console.log(`start watch ${path}`);
    fs.watch(path, (eventType, filename) => {
      if (eventType === 'change') {
        event.emit('dirwatcher:changed', filename, watcher);
      }
    });
  }
}

module.exports.default = DirWatcher;
module.exports.dirWatcherEvent = event;
