import React, { Component } from 'react';
import DownloadActions from '../../actions/download-actions';
import ReactInStyle from 'react-in-style';

class AddTorrent extends Component {
  addTorrentFileFromFile(ev) {

    const elem = ev.target;

    if (elem.files.length === 0) return null;
    const reader = new FileReader;
    let index = 0;
    const results = [];
    function read(index) {
      const file = elem.files[index];
      reader.readAsArrayBuffer(file);
    }
    reader.addEventListener('load', (e) => {
      results.push({
        file: elem.files[index],
        target: e.target
      });
      index ++;
      if (index === elem.files.length) {
        DownloadActions.downloadBlob({blobs: results.map(file => file.file)});
      }
      else read(index)
    });
    read(index);
  }
  addTorrentFromHash(e) {
    const hash = e.target.value
    if (hash.length === 40) {
      DownloadActions.downloadHash(hash);
    }
  }
  render() {
    return (
			<div className="add-torrent">
        <input type="file" onChange={this.addTorrentFileFromFile} />
        <input type="text" onChange={this.addTorrentFromHash} />
      </div>
		);
  }
};

AddTorrent.prototype.displayName = 'AddTorrent';

const Style = {
  backgroundColor: 'rgb(250, 250, 250)',
  width: '200px',
  position: 'fixed',
  padding: '10px',
  top: 0,
  right: 0,
  border: '0 0 1px 1px dashed black'
};

ReactInStyle.add(Style, '.add-torrent');

export default AddTorrent;
