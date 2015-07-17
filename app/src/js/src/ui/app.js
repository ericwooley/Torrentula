import React, { Component } from 'react';
import TorrentList from './torrent-list';
import TorrentActions from '../actions/torrent-actions';
import ReactInStyle from 'react-in-style';
class App extends Component {
  addTorrent() {
    TorrentActions.addTorrent({test: 'test'});
  }
  render() {
    return (
			<div className="tor-app">

        <div className="header-panel">
          <h3>Torentilla</h3>
          <div className="tagline">A delicious torrent wrapper for your file transfers</div>
        </div>

        <div className="main-panel">
          <TorrentList />
        </div>

        <div className="lower-panel">
        </div>
      </div>
		);
  }
};

App.prototype.displayName = 'App';

const AppStyle = {
  backgroundColor: 'rgb(100, 100, 100)',
  width: '100%',
  height: '100%'
};
ReactInStyle.add(AppStyle, '.tor-app');

export default App;
