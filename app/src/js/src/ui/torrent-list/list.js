import React, { Component } from 'react';
import TorrentActions from '../../actions/torrent-actions';
import ReactInStyle from 'react-in-style';
import TorrentItem from '../torrent-item';
class List extends Component {
  renderItems() {
    return [
      <TorrentItem />,
      <TorrentItem />,
      <TorrentItem />
    ]
  }
  render() {
    return (
			<div className='list-item'>
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
