import prettyBytes from 'pretty-bytes';

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

  startDownloadAsHttp(url, urlMD5, cb) {
    console.log('downloading blob', url);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = (e) => {
      if (xhr.status == 200) {
        const blob = xhr.response;
        cb(blob);
      }
    };
    xhr.send();
  }

  switchToTorrentMode(torrent) {
    this.torrent = torrent;
    this.magnetLink = torrent.magnetURI;
    this.method = 'TORRENT';
    this.progress = null;
  }
}
export default Download;
