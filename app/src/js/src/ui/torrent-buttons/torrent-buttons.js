//All stats
import React, { Component } from 'react';
import ReactInStyle from 'react-in-style';
import TorrentActions from '../../actions/torrent-actions';

class TorrentButtons extends Component {

  render() {
    return (
      <div className='item-buttons'>
          {
            this.props.stats.completed ?
              <button className='download-button' onClick={TorrentActions.saveTorrent(this.props.torrent)}>Download file</button> : null
          }

          <button className='clear-button' onClick={TorrentActions.clearTorrent(this.props.torrent)}>Clear</button>
      </div>
    );
  }
};

TorrentButtons.prototype.displayName = 'TorrentButtons';

export default TorrentButtons;
