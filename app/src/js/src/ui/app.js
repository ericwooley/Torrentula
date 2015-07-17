import React, { Component } from 'react';
import DownloadList from './download-list';
import DownloadStats from './download-stats';
import ReactInStyle from 'react-in-style';

class App extends Component {
  render() {
    return (
			<div className="tor-app">

        <div className="header-panel">
          <h3>Torentilla</h3>
          <div className="tagline">A delicious torrent wrapper for your file transfers</div>
        </div>

        <div className="main-panel">
          <DownloadList />
        </div>

        <div className="lower-panel">
        </div>

        <div className="file-selector">
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
