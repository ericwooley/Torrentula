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

  killTorrent() {
    if (this.method === 'TORRENT' && this.torrent) {
      this.torrent.destroy();
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

    const fileXhr = new XMLHttpRequest();
    fileXhr.open('GET', url, true);
    fileXhr.responseType = 'blob';
    fileXhr.onload = (e) => {
      if (fileXhr.status == 200) {
        const blob = fileXhr.response;
        cb(blob);
      }
    };
    fileXhr.onreadystatechange = () => {
      if (fileXhr.readyState === 2) {
        this.startTime = Date.now();
      }
    }
    fileXhr.onprogress = e => {
      if (e.lengthComputable) {

        this.progress = (e.loaded / e.total) * 100;
        this.time = Date.now();

        const deltaSize = (this.progress / 100) * this.size;
        const deltaTime = this.time - this.startTime;

        this.downloadSpeed = deltaSize / (deltaTime / 1000); //bytes per second

        this.size = e.total;

      }
    }
    fileXhr.send();
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
    console.log(torrent);
    this.torrent = torrent;
    this.magnetLink = torrent.magnetURI;
    this.method = 'TORRENT';
  }
}
export default Download;
