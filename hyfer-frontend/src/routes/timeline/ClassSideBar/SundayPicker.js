import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const WEEKS_BEFORE = 4;
const WEEKS_AFTER = 8;

export default class SundayPicker extends React.Component {
  state = {
    selected: WEEKS_BEFORE,
  };

  sundays = [];

  handleChange = (e) => {
    const selected = e.target.value;
    this.setState({ selected });
    this.props.onChange(this.sundays[selected]);
  };

  componentDidMount() {
    const startDate = this.props.startDate && this.props.startDate.clone().startOf('day').day(0);
    let sunday = moment().utc().startOf('day').day(0).subtract(WEEKS_BEFORE - 1, 'weeks');
    for (let i = 0; i < WEEKS_BEFORE + WEEKS_AFTER; i++) {
      if (startDate && sunday.isSame(startDate)) {
        this.selected = i;
      }
      this.sundays.push(sunday);
      sunday = sunday.clone().add(1, 'week');
    }
    this.props.onChange(this.sundays[this.state.selected]);
  }

  render() {
    return (
      <div>
        <Select
          value={this.state.selected}
          onChange={this.handleChange}
          MenuProps={{ PaperProps: { style: { transform: 'translate3d(0, 0, 0)' } } }}
        >
          {this.sundays.map((sunday, index) => {
            return (
              <MenuItem key={index} value={index} >
                {sunday.format('D MMMM YYYY')}
              </MenuItem>
            );
          })}
        </Select>
      </div>
    );
  }
}

SundayPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  startDate: PropTypes.object,
};
