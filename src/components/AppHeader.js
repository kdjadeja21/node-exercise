import React from 'react';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import 'font-awesome/css/font-awesome.min.css';

export default class AppHeader extends React.Component {
  render() {
    return (
      <div>
        <AppBar position='static' style={{ backgroundColor: '#006A69' }}>
          <Toolbar>
            <span style={{ 'font-size': '21px' }}><i className="fa fa-ticket"></i> Support Tickets</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div onClick={this.props.toggleFunction}>
              <IconButton edge="start" color="inherit" aria-label="menu">
                {!this.props.showData ? 'Show Tickets' : 'Create Tickets'}
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    )
  }

}