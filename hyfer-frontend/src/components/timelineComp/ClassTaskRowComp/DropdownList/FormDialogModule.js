import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import {
  Dialog, DialogTitle, Select,
  DialogContent,
  MenuItem,FormControl,
} from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
//import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';


class FormDialogModule extends Component {
  state = {
    open: false,
    selectedDate: '',
    selectedGroup: '',
    selectedModuleId: '',
    duration: '',
    validDate: null,
    errorMessage: '',
    mountedFirstTime: false,
    minDate: '',
    maxDate: '',
  };

  //Fullscreen form actions of open close plus state of open:false,
  ComponentDidMount() {
    this.setState({
      open: this.props.open,
    });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  
  render() {
    
    return (<Fragment> 
      <Dialog open={this.props.open}
      onClose = {this.props.onClose}
      >
        <Toolbar>
              <Button color="inherit" onClick={this.handleClose}>
                save
              </Button>
              <IconButton color="inherit" onClick={this.props.onClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" >
              </Typography>
        </Toolbar>
        <DialogTitle id="form-dialog-title">
          Add a new module
          </DialogTitle>
        <DialogContent>
          <form>
            <FormControl >
              <ListItemText primary="Select Group" />
              <Select
                value={this.state.age}
                onChange={this.handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Class13</MenuItem>
                <MenuItem value={20}>Class14</MenuItem>
                <MenuItem value={30}>Class15</MenuItem>
              </Select>
              <Divider />
            </FormControl >
            <br/>
              <FormControl >
              <ListItemText primary="Select Module" />
              <Select
            value={this.state.age}
            onChange={this.handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>HTML-CSS</MenuItem>
            <MenuItem value={20}>JavaScript</MenuItem>
            <MenuItem value={30}>Database</MenuItem>
          </Select>
        </FormControl>
        <br/>
              <FormControl >
              <ListItemText primary="Select Duration" />
              <Select
            value={this.state.age}
            onChange={this.handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>HTML-CSS</MenuItem>
            <MenuItem value={20}>JavaScript</MenuItem>
            <MenuItem value={30}>Database</MenuItem>
          </Select>
        </FormControl>
        <br/>
              <FormControl >
              <ListItemText primary="Select Start Date" />
              <Select
            value={this.state.age}
            onChange={this.handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>HTML-CSS</MenuItem>
            <MenuItem value={20}>JavaScript</MenuItem>
            <MenuItem value={30}>Database</MenuItem>
          </Select>
        </FormControl>
          </form>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

FormDialogModule.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default FormDialogModule;
