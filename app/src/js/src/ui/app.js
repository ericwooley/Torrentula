import React, { Component } from 'react';
import TorrentList from './torrent-list';
import TorrentActions from '../actions/torrent-actions';
class App extends Component {
  render() {
    return (
			<div>
        <TorrentList />
      </div>
		);
  }
};

App.prototype.displayName = 'App';

export default App;
