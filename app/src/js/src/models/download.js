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
      torrent.remove();
    }
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
