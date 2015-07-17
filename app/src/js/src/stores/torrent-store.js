import alt from '../alt';
import TorrentActions from '../actions/torrent-actions';
import md5 from 'md5';
import blobToBuffer from 'blob-to-buffer';
let fb = null;
let client = null;
function main(bg) {
  client = bg.client;
  fb = bg.fb;
}
function fileNameFromURL(url) {
  return url.split('\\').pop().split('/').pop();
}

class Download {
  constructor({method, url, magnetLink, torrent, progress, name}) {
    if (!name) {
      throw new Error('Name is required');
    }
    if (!method) {
      throw new Error('Method is required');
    }
    if (!url) {
      throw new Error('url is required');
    }
    this.method = method;
    this.url = url;
    this.magnetLink = magnetLink;
    this.torrent = torrent;
    this.name = name;
    this.progress = progress;
  }
}



chrome.runtime.getBackgroundPage(main);
class TorrentStore {
  constructor() {
    this.bindListeners({
      addTorrentFromUrl: TorrentActions.addTorrent
    });

    this.state = {
      downloads: []
    };
  }
  // Bound functions
  addTorrentFromUrl({url = 'https://www.petfinder.com/wp-content/uploads/2012/11/140272627-grooming-needs-senior-cat-632x475.jpg'}) {
    const urlMD5 = md5(url);
    fb.child(urlMD5).on('value', (snapshot) => {
      const magnetLink = snapshot.val();
      if (magnetLink) {
        this.addTorrentFromHash({magnetLink});
      } else {
        this.downloadUrlAsBlob({url, urlMD5});
      }
    }, (errorObject) => {
      console.log('The read failed: ' + errorObject.code);
    });
  }

  // Non-bound functions
  addTorrentFromHash({magnetLink}) {
    console.log('got hash', magnetLink);
    client.add(magnetLink, (torrent) => {
      console.log('downloading torrent from hash', this.state.downloads, magnetLink);
      this.state.downloads.push({torrent});
      this.emitChange();
    });
  }
  downloadUrlAsBlob({url, urlMD5}) {
    const self = this;
    const fileName = fileNameFromURL(url);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = (e) => {
      if (xhr.status == 200) {
        const myBlob = xhr.response;
        self.seedBlob(myBlob, fileName, (magnetURI) => {
          self.saveURLwithHash(urlMD5, magnetURI)
        });
      }
    };
    xhr.send();
  }
  saveURLwithHash(urlMD5, torrentHash) {
    fb.child(urlMD5).set(torrentHash);
  }
  seedBlob(blob, fileName, cb) {
    blobToBuffer (blob, (err, buffer) => {
      if (err) {
        throw err;
      }
      buffer.name = fileName;
      client.seed(buffer, (torrent) => {
        const magnetLink = torrent.magnetURI;
        console.log('torrentHash', this.state.downloads, torrent, magnetLink);
        this.state.downloads.push({torrent, magnetLink, method: 'TORRENT', name: fileName});
        cb(magnetURI);
      })
    });
  }
}

export default alt.createStore(TorrentStore, 'TorrentStore');
