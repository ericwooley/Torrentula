import React, { Component } from 'react';
import TorrentList from './torrent-list';
import TorrentActions from '../actions/torrent-actions';
import ReactInStyle from 'react-in-style';
class App extends Component {
  render() {
    return (
			<div className="tor-app">
        <h3>App</h3>
        <TorrentList />
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
