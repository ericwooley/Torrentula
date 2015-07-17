//All stats
import React, { Component } from 'react';
import ReactInStyle from 'react-in-style';

class TorrentInfo extends Component {

  render() {
    return (
      <div className='item-stats'>

        <div className='meta'>
          <div className='hash'>{this.props.download.meta.hash}</div>
          <div className='magnet'>{this.props.download.meta.magnet}</div>
        </div>

        <div className='stats'>
          <div className='size'>{this.props.download.stats.size}</div>
          <div className='peers'>{this.props.download.stats.peers}</div>
          <div className='download'>{this.props.download.stats.downloadSpeed}</div>
          <div className='upload'>{this.props.download.stats.uploadSpeed}</div>
        </div>

      </div>
    );
  }
};

TorrentInfo.prototype.displayName = 'TorrentInfo';

export default TorrentInfo;
