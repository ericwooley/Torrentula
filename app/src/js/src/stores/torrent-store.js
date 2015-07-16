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

chrome.runtime.getBackgroundPage(main);
class TorrentStore {
  constructor() {
    this.bindListeners({
      addTorrentFromUrl: TorrentActions.addTorrent
    });

    this.state = {
      torrents: []
    };
  }
  addTorrentFromUrl({url = 'https://www.petfinder.com/wp-content/uploads/2012/11/140272627-grooming-needs-senior-cat-632x475.jpg'}) {
    const urlMD5 = md5(url);
    fb.child(urlMD5).on('value', (snapshot) => {
      const hashFromServer = snapshot.val();
      if (hashFromServer) {
        this.addTorrentFromHash({hashFromServer});
      } else {
        this.downloadUrlAsBlob({url, urlMD5});
      }
    }, (errorObject) => {
      console.log('The read failed: ' + errorObject.code);
    });

  }
  addTorrentFromHash({hash}) {
    client.add(hash, (torrent) => {
      this.state.torrents.push(torrent);
    });
  }
  downloadUrlAsBlob({url, urlMD5}) {
    const self = this;
    const fileName = fileNameFromURL(url);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function(e) {
      if (this.status == 200) {
        const myBlob = this.response;
        self.seedBlob(myBlob, fileName, (torrentHash) => {
          self.saveURLwithHash(urlMD5, torrentHash)
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
        const torrentHash = torrent.infoHash;
        console.log('torrentHash', torrent, torrentHash);
        this.state.torrents.push(torrent);
        cb(torrentHash);
      })
    });
  }
}

export default alt.createStore(TorrentStore, 'TorrentStore');
