//All stats
import React, { Component } from 'react';
import ReactInStyle from 'react-in-style';

class TorrentInfo extends Component {

  render() {
    return (
      <div className='item-stats'>

        <div className='meta'>
          <div className='magnet'>Magnet: {this.props.download.magnetLink}</div>
          <div className='hash'>Hash: {this.props.download.torrent.infoHash}</div>
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
