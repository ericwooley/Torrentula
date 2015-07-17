import prettyBytes from 'pretty-bytes';
import mimeType from './mime-type';
class Download {
  constructor({method, url, magnetLink, torrent, progress, name, size = 0, downloadSpeed = 0}) {
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
    this.size = size;

    this.stats = {};
  }

  stopDownload() {
    if (this.method === 'TORRENT' && this.torrent) {
      this.torrent.client.remove(this.torrent);
    } else {
      this.fileXhr.abort();
    }
  }

  startDownloadAsHttp(url, urlMD5, cb) {
    console.log('downloading blob', url);
    const headerXhr = new XMLHttpRequest();
    headerXhr.open('HEAD', url);
    headerXhr.onreadystatechange = () => {
      if (headerXhr.readyState === 2) { //Headers recieved
        this.size = parseInt(headerXhr.getResponseHeader('Content-Length'), 10);
      }
    }
    headerXhr.send();

    this.fileXhr = new XMLHttpRequest();
    this.fileXhr.open('GET', url, true);
    this.fileXhr.responseType = 'blob';
    this.fileXhr.onload = (e) => {
      if (this.fileXhr.status == 200) {
        const blob = this.fileXhr.response;
        cb(blob);
      }
    };
    this.fileXhr.onreadystatechange = () => {
      if (this.fileXhr.readyState === 2) {
        this.startTime = Date.now();
      }
    }
    this.fileXhr.onprogress = e => {
      if (e.lengthComputable) {

        this.progress = (e.loaded / e.total) * 100;
        this.time = Date.now();

        const deltaSize = (this.progress / 100) * this.size;
        const deltaTime = this.time - this.startTime;

        this.downloadSpeed = deltaSize / (deltaTime / 1000); //bytes per second

        this.size = e.total;

      }
    }
    this.fileXhr.send();
  }

  saveFile() {
    if (this.method === 'TORRENT' && this.torrent) {
      chrome.fileSystem.chooseEntry({type: 'saveFile', suggestedName: this.torrent.files[0].name}, (fileEntry) => {
        fileEntry.createWriter((fileWriter) => {
          fileWriter.onerror = (e) => {
            console.log('Write failed: ' + e);
          };
          this.torrent.files[0].getBuffer((err, buffer) => {
            console.log('got buffer');
            if (err) {
              console.log('got err', err);
              throw err;
            }
            console.log('got to there');
            console.log({type: mimeType(this.torrent.files[0].name)}, this.torrent.files[0].name)
            const blobMeta = {type: mimeType(this.torrent.files[0].name)};
            const blob = new Blob([buffer], blobMeta);
            fileWriter.write(blob);
          });
        });
      });
    }
  }

  switchToTorrentMode(torrent) {
    this.torrent = torrent;
    this.magnetLink = torrent.magnetURI;
    this.method = 'TORRENT';
    this.progress = null;
  }
}
export default Download;
