import React, { Component, PropTypes } from 'react';
import connectToStores from 'alt/utils/connectToStores';
import TorrentActions from '../../actions/download-actions';
import ReactInStyle from 'react-in-style';
import DownloadItem from '../download-item';
import DownloadStore from '../../stores/download-store';


@connectToStores
class List extends Component {

  static PropTypes = {
    torrents: PropTypes.array
  }

  static getStores() {
    return [DownloadStore];
  }

  static getPropsFromStores() {
    return DownloadStore.getState();
  }

  renderItems() {
    return this.props.downloads.map((download, index) => <DownloadItem key={`${index}`} download={download} />);
  }

  render() {
    return (
			<div className='list-items'>
        {this.renderItems()}
      </div>
		);
  }
};

List.prototype.displayName = 'List';

const ListStyle = {
  backgroundColor: 'rgb(150, 150, 150)',
  width: '90%',
  height: '90%'
};
ReactInStyle.add(ListStyle, '.list-item');

export default List;
