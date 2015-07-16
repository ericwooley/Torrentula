import alt from '../alt';
import TorrentActions from '../actions/torrent-actions';

let client = null;

function main(bg) {
  client = bg.client
}
chrome.runtime.getBackgroundPage(main);
class TorrentStore {
  constructor() {
    this.bindListeners({
      addTorrent: TorrentActions.addTorrent
    });

    this.state = {
      torrents: []
    };
  }
  addTorrent({file}) {
    client.seed(file)
  }
}

export default alt.createStore(TorrentStore, 'TorrentStore');
