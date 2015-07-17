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
    return {
      progress : this.torrent ? (100 * this.torrent.downloaded / this.torrent.parsedTorrent.length).toFixed(1) : 0,
      peers: this.torrent ? torrent.swarm.wires.length : 0,
      downloadSpeed: this.torrent ? prettyBytes(torrent.swarm.downloadSpeed()) : 0,
      uploadSpeed: this.torrent ? prettyBytes(torrent.swarm.uploadSpeed()) : 0,
      completed: this.torrent ? (this.torrent.downloaded / this.torrent.parsedTorrent.length) === 1 : false,
      size: this.torrent ? prettyBytes(this.props.torrent.files[0]) : 0
    }
  }
}
export default Download;
