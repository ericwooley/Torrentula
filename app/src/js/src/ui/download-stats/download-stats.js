//All stats
//Loaded size, total size, download speed, upload speed
import React, { Component } from 'react';
import ReactInStyle from 'react-in-style';
import DownloadStore from '../../stores/download-store';
import connectToStores from 'alt/utils/connectToStores';
import prettyBytes from 'pretty-bytes';

@connectToStores
class DownloadStats extends Component {

  constructor() {
    super();
    this.state = {
      loadedSize: 0,
      totalSize: 0,
      downloadSpeed: 0,
      uploadSpeed: 0
    };
  }

  componentDidMount() {
    this.startUpdatingStats();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.interval);
  }

  static getStores() {
    return [DownloadStore];
  }

  static getPropsFromStores() {
    return DownloadStore.getState();
  }

  //Render loop
  startUpdatingStats() {
    this.interval = requestAnimationFrame(this.tick.bind(this));
  }

  tick() {
    this.getStats();
    this.interval = requestAnimationFrame(this.tick.bind(this));
  }

  getStats() {
    let stats = {
      loadedSize: 0,
      totalSize: 0,
      downloadSpeed: 0,
      uploadSpeed: 0
    };

    this.props.downloads.map(download => {
      let downloadStats = this.getStatsFromDownload(download);
      for (let stat in stats) {
        stats[stat] += downloadStats[stat];
      }
    });

    this.setState(stats);
  }

  getStatsFromDownload(download) {
    const isTorrent = (download.method === 'TORRENT');
    let loadedSize = 0,
      size = 0,
      progress = 0,
      totalSize = 0,
      downloadSpeed = 0,
      uploadSpeed = 0;

    if (isTorrent) {
      if (download.torrent) {
        progress = (download.torrent.downloaded / download.torrent.parsedTorrent.length).toFixed(1) || 0;
        totalSize = download.torrent.files[0].length || 0;
        downloadSpeed = download.torrent.swarm.downloadSpeed(),
        uploadSpeed = download.torrent.swarm.uploadSpeed()
      }
    } else {
      progress = download.progress || 0;
      totalSize = download.size || 0;
      downloadSpeed = download.downloadSpeed || 0;
    }

    loadedSize = (progress / 100) * totalSize;

    return {
      loadedSize,
      totalSize,
      downloadSpeed,
      uploadSpeed
    };
  }

  render() {
    return (
      <div className='total-stats'>
          <div className="size">
            Size: <span className='loaded-size'>{prettyBytes(this.state.loadedSize)}</span> / <span className='total-size'>{prettyBytes(this.state.totalSize)}</span>
          </div>
          <div className="speed">
            <span className='loaded-size'>Down: {prettyBytes(this.state.downloadSpeed)}</span>
            <span className='loaded-size'>Up: {prettyBytes(this.state.uploadSpeed)}</span>
          </div>
      </div>
    );
  }
};

DownloadStats.prototype.displayName = 'DownloadStats';

export default DownloadStats;
