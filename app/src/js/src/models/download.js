import prettyBytes from 'pretty-bytes';

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

    this.stats = {};

    this.meta = {
      name,
      url,
      magnetLink
    };

    this.startCollectingStats();
  }

  switchToTorrentMode(torrent) {
    this.torrent = torrent;
    this.magnetLink = torrent.magnetURI;
    this.method = 'TORRENT';
    this.progress = null;
  }

  startCollectingStats() {
    this.interval = requestAnimationFrame(this.tick.bind(this));
  }

  stopCollectingStats() {
    cancelAnimationFrame(this.interval);
  }

  tick() {
    requestAnimationFrame(this.tick.bind(this));
    this.updateStats();
  }

  updateStats() {
    if (this.method === 'TORRENT') {
      this.setTorrentStats();
    }
  }

  setTorrentStats() {
    const torrent = this.torrent
    return {
      progress : torrent ? (100 * torrent.downloaded / torrent.parsedTorrent.length).toFixed(1) : 0,
      peers: torrent ? torrent.swarm.wires.length : 0,
      downloadSpeed: torrent ? prettyBytes(torrent.swarm.downloadSpeed()) : 0,
      uploadSpeed: torrent ? prettyBytes(torrent.swarm.uploadSpeed()) : 0,
      completed: torrent ? (torrent.downloaded / torrent.parsedTorrent.length) === 1 : false,
      size: torrent ? prettyBytes(torrent.files[0].length) : 0
    }
  }
}
export default Download;
