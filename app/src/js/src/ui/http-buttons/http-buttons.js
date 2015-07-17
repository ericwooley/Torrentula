//All stats
import React, { Component } from 'react';
import ReactInStyle from 'react-in-style';
import HttpActions from '../../actions/http-actions';

class HttpButtons extends Component {

  render() {
    return (
      <div className='item-buttons'>
          {
            this.props.stats.completed ?
              <button className='download-button' onClick={HttpActions.saveDownload(this.props.download)}>Download file</button> : null
          }

          <button className='clear-button' onClick={HttpActions.clearDownload(this.props.download)}>Clear</button>
      </div>
    );
  }
};

TorrentButtons.prototype.displayName = 'TorrentButtons';

export default TorrentButtons;
