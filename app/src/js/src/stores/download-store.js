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

function fileNameFromURL(url) {
  url = stripTrailingSlash(url);
  return url.split('/').pop();
}

let fb = null;
let client = null;
function main(bg) {
  client = bg.client;
  fb = bg.fb;
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
    this.removeDownload(download);
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
    const fileName = fileNameFromURL(url);
    //Move to download
    const download = new Download({url, name: fileName, method: 'HTTP'});
    this.state.downloads.push(download);
    this.emitChange();

    download.startDownloadAsHttp(url, urlMD5, blob => {
      this.seedBlob(blob, fileName, (torrent, magnetURI) => {
        download.switchToTorrentMode(torrent);
        this.emitChange();
        this.saveURLwithHash(urlMD5, magnetURI)
      }.bind(this));
    }.bind(this));
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
