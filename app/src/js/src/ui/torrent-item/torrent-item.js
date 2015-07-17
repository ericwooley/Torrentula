//Contains name, hash, progress, stats
import React, { Component } from 'react';
import TorrentActions from '../../actions/torrent-actions';
import ReactInStyle from 'react-in-style';
import prettyBytes from 'pretty-bytes';

import TorrentInfo from '../torrent-info';

class TorrentItem extends Component {

  //Component lifecycle
  componentDidMount() {
    if (this.props.torrent) {
      this.startUpdating()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.interval !== undefined) {
      cancelAnimationFrame(this.interval);
    }

    if (nextProps.torrent) {
      this.startUpdating();
    }
  }

  componentWillDismount() {
    cancelAnimationFrame(this.interval);
  }

  //Render loop
  startUpdating() {
    this.interval = requestAnimationFrame(this.tick);
  }

  tick() {
    requestAnimationFrame(this.tick);
    this.updateStats();
  }

  updateStats() {
    this.setState(this.getStats());
  }

  //Dynamic stats
  getStats() {
    return {
      progress: this.getProgress(),
      peers: this.getPeers(),
      downloadSpeed: this.getDownloadSpeed(),
      uploadSpeed: this.getUploadSpeed(),
      completed: this.getCompleted()
    }
  }

  getProgress() {
    const torrent = this.props.torrent;
    return torrent ? (100 * torrent.downloaded / torrent.parsedTorrent.length).toFixed(1) : 0;
  }

  getPeers() {
    return torrent ? torrent.swarm.wires.length : 0;
  }

  getDownloadSpeed() {
    return prettyBytes(torrent.swarm.downloadSpeed());
  }

  getUploadSpeed() {
    return prettyBytes(torrent.swarm.downloadSpeed());
  }

  getCompleted() {
    return (torrent.downloaded / torrent.parsedTorrent.length) === 1;
  }

  //Static getters
  getMeta() {
    return {
      name: this.getName(),
      size: this.getSize(),
      infoHash: this.getInfoHash(),
      magnet: this.getMagnet()
    }
  }
  getName() {
    return this.props.torrent.files[0].name;
  }

  getFileSize() {
    return prettyBytes(this.props.torrent.files[0]);
  }

  getInfoHash() {
    return props.torrent.infoHash;
  }

  getMagnet() {
    return props.torrent.magnetURI
  }

  render() {
    return (
      <div className='item' progress={this.state.progress}>
        <div className='name'>{this.getName()}</div>
        <TorrentInfo stats={this.state} meta={this.getMeta()} />
        <TorrentActions torrent={this.props.torrent} />
      </div>
    );
  }
};

TorrentItem.prototype.displayName = 'TorrentItem';

const ListStyle = {
  backgroundColor: 'rgb(200, 200, 200)',
};

ReactInStyle.add(ListStyle, '.item');

export default TorrentItem;
