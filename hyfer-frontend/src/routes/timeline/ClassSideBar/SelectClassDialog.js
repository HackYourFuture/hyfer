import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import withMobileDialog from '@material-ui/core/withMobileDialog';

@inject('timelineStore')
@observer
class SelectClassDialog extends React.Component {

  handleClick = (groupName) => {
    this.props.onSelect(groupName);
  };

  renderListItems() {
    const { groups } = this.props.timelineStore;
    return groups.map(({ group_name }) => {
      const number = group_name.match(/(\d+)$/)[1];
      return (
        <div key={group_name} >
          <ListItem button onClick={() => this.handleClick(group_name)}>
            <ListItemText primary={`Class ${number}`} />
          </ListItem>
          <Divider />
        </div>
      );
    });
  }

  render() {
    const { fullScreen } = this.props;
    return (
      <Dialog
        fullScreen={fullScreen}
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Archived classes"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select an archived class to display in the timeline.
          </DialogContentText>
          <List component="nav">
            {this.renderListItems()}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

SelectClassDialog.wrappedComponent.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  timelineStore: PropTypes.object.isRequired,
};

export default withMobileDialog()(SelectClassDialog);
