//All stats
import React, { Component } from 'react';
import ReactInStyle from 'react-in-style';

class HttpInfo extends Component {

  render() {
    return (
      <div className='item-stats'>

        <div className='meta'>
          <div className='size'>Size: {this.props.info.size}</div>
        </div>

        <div className='stats'>
          <div className='speed'>Download Speed: {this.props.info.downloadSpeed}</div>
        </div>

      </div>
    );
  }
};

HttpInfo.prototype.displayName = 'HttpInfo';

export default HttpInfo;
