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

  //Component lifecycle
  componentDidMount() {
    this.isTorrent = (this.props.download.method === 'TORRENT');
  }

  render() {
    return (
      <div className='item' progress={this.props.download.progress}>
        <div className='name'>{this.props.download.name}</div>
        {
          this.isTorrent ?
          [<TorrentInfo download={this.props.download} key="torrentInfo"/>,
          <TorrentButtons download={this.props.download} key="torrentButtons" />] :
          [<HttpInfo download={this.props.download} key="httpInfo"/>,
          <HttpButtons download={this.props.download} key="httpButtons"/>]
        }
      </div>
    );
  }
};

DownloadItem.prototype.displayName = 'DownloadItem';

const ListStyle = {
  backgroundColor: 'rgb(200, 200, 200)',
};

ReactInStyle.add(ListStyle, '.item');

export default DownloadItem;
