//Contains name, hash, progress, stats
import React, { Component } from 'react';
import TorrentActions from '../../actions/torrent-actions';
import ReactInStyle from 'react-in-style';
import prettyBytes from 'pretty-bytes';

import TorrentInfo from '../torrent-info';
import TorrentButtons from '../torrent-buttons';
import HttpInfo from '../http-info';
import HttpButtons from '../http-buttons';

class DownloadItem extends Component {

  constructor() {
    super();
    this.state = {};
  }

  //Component lifecycle
  componentDidMount() {

    this.startUpdatingStats();
  }

  //Render loop
  startUpdatingStats() {
    this.interval = requestAnimationFrame(this.tick.bind(this));
  }

  tick() {
    const isTorrent = this.props.download.method === 'TORRENT';
    this.setState({
      isTorrent
    });

    isTorrent ? this.updateTorrentStats() : this.updateHttpStats();
    requestAnimationFrame(this.tick.bind(this));
  }

  updateTorrentStats() {
    this.setState(this.getTorrentStats());
  }

  updateHttpStats() {
    this.setState(this.getHttpStats());
  }

  getTorrentStats() {
    const torrent = this.props.download.torrent;
    return {
      progress : torrent ? (100 * torrent.downloaded / torrent.parsedTorrent.length).toFixed(1) : 0,
      peers: torrent ? torrent.swarm.wires.length : 0,
      downloadSpeed: torrent ? prettyBytes(torrent.swarm.downloadSpeed()) : 0,
      uploadSpeed: torrent ? prettyBytes(torrent.swarm.uploadSpeed()) : 0,
      completed: torrent ? (torrent.downloaded / torrent.parsedTorrent.length) === 1 : false,
      size: torrent ? prettyBytes(torrent.files[0].length) : 0
    };
  }

  getHttpStats() {
    const download = this.props.download;
    return {
      size: download.size ? download.size : 0,
      progress: download.progress ? download.progress : 0,
      downloadSpeed: download.downloadSpeed ? download.downloadSpeed : 0
    }
  }

  render() {
    return (
      <div className='item' data-progress={this.state.progress}>
        <div className='name'>{this.props.download.name}</div>
        {
          this.state.isTorrent ?
          [<TorrentInfo info={this.state} download={this.props.download} key="torrentInfo"/>,
          <TorrentButtons info={this.state} download={this.props.download} key="torrentButtons" />] :
          [<HttpInfo info={this.state} download={this.props.download} key="httpInfo"/>,
          <HttpButtons info={this.state} download={this.props.download} key="httpButtons"/>]
        }
      </div>
    );
  }
};

DownloadItem.prototype.displayName = 'DownloadItem';

const ListStyle = {
  backgroundColor: 'rgb(200, 200, 200)'
};

ReactInStyle.add(ListStyle, '.item');

export default DownloadItem;
