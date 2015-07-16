import React, { Component } from 'react';
import TorrentActions from '../../actions/torrent-actions';
import ReactInStyle from 'react-in-style';
class Item extends Component {
  render() {
    return (
			<div className='item'>
        Item
      </div>
		);
  }
};

Item.prototype.displayName = 'Item';

const ListStyle = {
  backgroundColor: 'rgb(200, 200, 200)',
};
ReactInStyle.add(ListStyle, '.item');

export default Item;
