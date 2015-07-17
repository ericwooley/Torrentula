//All stats
import React, { Component } from 'react';
import ReactInStyle from 'react-in-style';

class TorrentInfo extends Component {

  render() {
    return (
      <div className='item-stats'>

        <div className='meta'>
          <div className='hash'>{this.props.meta.hash}</div>
          <div className='size'>{this.props.meta.size}</div>
          <div className='magnet'>{this.props.meta.magnet}</div>
        </div>

        <div className='stats'>
          <div className='peers'>{this.props.stats.peers}</div>
          <div className='download'>{this.props.stats.downloadSpeed}</div>
          <div className='upload'>{this.props.stats.uploadSpeed}</div>
        </div>

      </div>
    );
  }
};

TorrentInfo.prototype.displayName = 'TorrentInfo';

export default TorrentInfo;
