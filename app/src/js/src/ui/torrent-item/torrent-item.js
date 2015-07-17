//Contains name, hash, progress, stats
import React, { Component } from 'react';
import TorrentActions from '../../actions/torrent-actions';
import ReactInStyle from 'react-in-style';
import prettyBytes from 'pretty-bytes';

class Item extends Component {

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
      uploadSpeed: this.getUploadSpeed()
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

  //Static getters
  getName() {
    return this.props.torrent.files[0].name;
  }

  getFileSize() {
    return prettyBytes(this.props.torrent.files[0]);
  }

  getInfoHash() {
    return props.torrent.infoHash;
  }

  render() {
    return (
      <div className='item' progress={this.state.progress}>
        <div className='name'>{this.getName()}</div>
        <div className='hash'>{this.getInfoHash()}</div>
        <div className='size'>{this.getFileSize()}</div>
        <div className='peers'>{this.state.peers}</div>
        <div className='download'>{this.state.downloadSpeed}</div>
        <div className='upload'>{this.state.uploadSpeed}</div>
      </div>
    );
  }
};

Item.prototype.displayName = 'Item';

const ListStyle = {
  backgroundColor: 'rgb(200, 200, 200)',
};
ReactInStyle.add(ListStyle, '.item');

export default Item;
