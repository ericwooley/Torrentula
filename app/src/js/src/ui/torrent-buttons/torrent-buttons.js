//All stats
import React, { Component } from 'react';
import ReactInStyle from 'react-in-style';
import TorrentActions from '../../actions/download-actions';

class TorrentButtons extends Component {



  render() {
    // console.log(this.props);
    return (
      <div className='item-buttons'>
          <button className='button-options' onClick={() => this.props.onExpand}><i className='icon-cog'></i></button>
          {
            this.props.info.completed ?
              <button className='button-download' onClick={() => this.props.download.saveFile() }><i className='icon-down-circled'></i></button> :
              (this.props.download.url ? <button className='button-revert' onClick={() => TorrentActions.downloadWithHttp(this.props.download)}><i className='icon-link'></i></button> : null)
          }

          <button className='button-clear' onClick={() => TorrentActions.clearDownload(this.props.download)}><i className='icon-cancel-circled'></i></button>

      </div>
    );
  }
};

TorrentButtons.prototype.displayName = 'TorrentButtons';

export default TorrentButtons;
