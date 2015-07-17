import alt from '../alt';
import TorrentActions from '../actions/torrent-actions';
import md5 from 'md5';
import blobToBuffer from 'blob-to-buffer';
import Download from '../models/download';

function stripTrailingSlash(str) {
  if (str.substr(-1) === '/') {
    return str.substr(0, str.length - 1);
  }
  return str;
}
function parseQuery(qstr) {
  const query = {};
  const a = qstr.split('&');
  for (let i = 0; i < a.length; i++) {
    const b = a[i].split('=');
    query[decodeURIComponent(b[0])] = decodeURIComponent(b[1]);
  }

  return query;
}


let fb = null;
let client = null;
function main(bg) {
  client = bg.client;
  fb = bg.fb;
}
function fileNameFromURL(url) {
  url = stripTrailingSlash(url);
  return url.split('/').pop();
}

chrome.runtime.getBackgroundPage(main);
class DownloadStore {
  constructor() {
    this.bindListeners({
      addTorrentFromUrl: TorrentActions.addDownload,
      clearDownload: TorrentActions.clearDownload
    });
    chrome.runtime.onMessageExternal.addListener((url, sender, sendResponse) => {
      this.addTorrentFromUrl({url});
    });
    this.state = {
      downloads: []
    };
  }
  clearDownload(download) {
    download.killTorrent();
    removeDownload(download);
  }
  // Bound functions
  addTorrentFromUrl({url}) {
    const urlMD5 = md5(url);
    fb.child(urlMD5).once('value', (snapshot) => {
      const magnetLink = snapshot.val();
      if (magnetLink) {
        this.addTorrentFromHash({magnetLink, url});
      } else {
        this.downloadUrlAsBlob({url, urlMD5});
      }
    }, (errorObject) => {
      console.log('The read failed: ' + errorObject.code);
    });
  }

  removeDownload(download) {
    const newDownloads = [];
    for (let i = 0; i < this.state.downloads.length; i++) {
      const dl = this.state.downloads[i];
      if (dl !== download) {
        newDownloads.push(dl);
      }
    }
    this.state.downloads = newDownloads;
    this.emitChange();

  }

  // Non-bound functions
  addTorrentFromHash({magnetLink, url}) {
    console.log('downloading magnet link', magnetLink);
    const name = parseQuery(magnetLink).dn;
    const dl = new Download({name, method: 'TORRENT', url});
    this.state.downloads.push(dl);
    this.emitChange();
    client.add(magnetLink, (torrent) => {
      console.log('magnit link download successful');
      dl.switchToTorrentMode(torrent);
      this.emitChange();
    });
  }
  downloadUrlAsBlob({url, urlMD5}) {
    console.log('downloading blob', url);
    const self = this;
    const fileName = fileNameFromURL(url);
    const xhr = new XMLHttpRequest();
    const download = new Download({url, name: fileName, method: 'HTTP'});
    this.state.downloads.push(download);
    this.emitChange();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = (e) => {
      if (xhr.status == 200) {
        const myBlob = xhr.response;
        self.seedBlob(myBlob, fileName, (torrent, magnetURI) => {
          download.switchToTorrentMode(torrent);
          this.emitChange();
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
        this.emitChange();
        cb(torrent, magnetLink);
      })
    });
  }
}

export default alt.createStore(DownloadStore, 'DownloadStore');
