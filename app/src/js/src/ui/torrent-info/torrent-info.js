//All stats
import React, { Component } from 'react';
import ReactInStyle from 'react-in-style';

class TorrentInfo extends Component {

  getMagnetLink() {
    return this.props.download.torrent ? this.props.download.magnetLink : 'Loading';
  }

  getHash() {
    return this.props.download.torrent ? this.props.download.torrent.infoHash : 'Loading';
  }

  render() {
    return (
      <div className='item-stats'>

        <div className='meta'>
          <div className='magnet'>Magnet: {this.getMagnetLink()}</div>
          <div className='hash'>Hash: {this.getHash()}</div>
        </div>

        <div className='stats'>
          <div className='size'>Size: {this.props.info.size}</div>
          <div className='peers'>Peers: {this.props.info.peers}</div>
          <div className='download'>Download Speed: {this.props.info.downloadSpeed}</div>
          <div className='upload'>Upload Speed: {this.props.info.uploadSpeed}</div>
        </div>

      </div>
    );
  }
};

TorrentInfo.prototype.displayName = 'TorrentInfo';

export default TorrentInfo;
