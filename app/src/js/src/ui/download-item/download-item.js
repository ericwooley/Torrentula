//Contains name, hash, progress, stats
import React, { Component } from 'react';
import TorrentActions from '../../actions/download-actions';
import ReactInStyle from 'react-in-style';
import prettyBytes from 'pretty-bytes';

import TorrentInfo from '../torrent-info'
import HttpInfo from '../http-info';

class DownloadItem extends Component {

  constructor() {
    super();
    this.state = {};
  }

  //Component lifecycle
  componentDidMount() {

    this.startUpdatingStats();
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.interval);
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
    this.interval = requestAnimationFrame(this.tick.bind(this));
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
      progress : (torrent && torrent.parsedTorrent) ? (100 * torrent.downloaded / torrent.parsedTorrent.length).toFixed(1) : 0,
      peers: torrent && torrent.swarm? torrent.swarm.wires.length : 0,
      downloadSpeed: torrent && torrent.swarm? prettyBytes(torrent.swarm.downloadSpeed()) : 0,
      uploadSpeed: torrent && torrent.swarm? prettyBytes(torrent.swarm.uploadSpeed()) : 0,
      completed: (torrent && torrent.parsedTorrent) ? (torrent.downloaded / torrent.parsedTorrent.length) === 1 : false,
      size: torrent && torrent.files[0]? prettyBytes(torrent.files[0].length) : 0
    };
  }

  getHttpStats() {
    const download = this.props.download;
    return {
      size: download.size ? prettyBytes(download.size) : 0,
      progress: download.progress ? download.progress : 0,
      downloadSpeed: download.downloadSpeed ? prettyBytes(download.downloadSpeed) + '/s' : 0,
      completed: download.size && download.progress ? (download.progress === 100) : false
    }
  }

  getProgressBarColor() {
    if (this.state.completed) {
      return 'rgba(82, 252, 155, 0.43)'
    } else {
      return 'rgba(82, 252, 155, 0.18)'
    }
  }

  render() {

    return (
      <div className='item'>
        <div className={`progress-bar ${this.state.completed ? "completed" : ""}`} style={{
            width: this.state.progress + '%',
            backgroundColor: this.getProgressBarColor()
          }} />
          {
            this.state.isTorrent ? <TorrentInfo name={this.props.download.name} info={this.state} download={this.props.download} /> :
            <HttpInfo name={this.props.download.name} info={this.state} download={this.props.download} key="httpInfo"/>
          }
      </div>
    );
  }
};

DownloadItem.prototype.displayName = 'DownloadItem';

const ListStyle = {
  backgroundColor: 'rgb(200, 200, 200)',
  width: '100%',
  position: 'relative',
  overflow: 'auto',
  zoom: 1
};

const progressBarStyle = {
  position: 'absolute',
  top: '0',
  left: '0',
  height: '100%'
}

const detailsStyle = {
  position: 'relative',
  top: '0',
  left: '0',
  zIndex: '2'
}

ReactInStyle.add(ListStyle, '.item');
ReactInStyle.add(progressBarStyle, '.progress-bar');
ReactInStyle.add(detailsStyle, '.download-details');

export default DownloadItem;
