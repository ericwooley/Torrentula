//All stats
import React, { Component } from 'react';
import ReactInStyle from 'react-in-style';
import TorrentActions from '../../actions/torrent-actions';

class TorrentButtons extends Component {



  render() {
    // console.log(this.props);
    return (
      <div className='item-buttons'>
          {
            this.props.info.completed ?
              <button className='download-button' onClick={() => this.props.download.saveFile() }>Download file</button> : null
          }

          <button className='clear-button' onClick={() => TorrentActions.clearDownload(this.props.download)}>Clear</button>
          <button className='revert-button' onClick={() => TorrentActions.downloadWithHttp(this.props.download)}>Clear</button>
      </div>
    );
  }
};

TorrentButtons.prototype.displayName = 'TorrentButtons';

export default TorrentButtons;
