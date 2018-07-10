import React, { Component } from 'react';
import Modal from '../../../../../Helpers/Modal/Modal';
// import { timelineStore } from '../../../../../store/';
//import classes from './assignTeacherModal.css';
//import { errorMessage } from '../../../../../notify';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
//import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
//import IconButton from '@material-ui/core/IconButton';
//import CommentIcon from '@material-ui/icons/Comment';
import { inject, observer } from 'mobx-react';
  
const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

@inject('userStore', 'global')
  @observer
class AssignTeacherModal extends Component {
  state = {
    teacher1: '',
    teacher2: '',
    selectedTeacher1: '',
    selectedTeacher2: '',
    warningMessage: '',
    checked: [0],
  };

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  };

  // handleAssignTeachers = () => {
  
  //  //const { selectedModule } = this.props;
  // // const groupsId = selectedModule.id;
  // // const item = selectedModule;
  //   try{
  //    // this.props.userStore.getRunningModuleTeachers(groupsId);
  //   this.props.closeModal();
  //   }
  //   catch(error){
  //     errorMessage(error);
  //   }
  // };

  //handleChangeTeacher = (e, num) => {
  //   if (num === 1) {
  //     this.setState({
  //       teacher1: e.target.value,
  //     });

  //   } else {
  //     this.setState({
  //       teacher2: e.target.value,
  //     });
  //   }
  // };

  // renderSelectTeacher = num => {
  //   const { teachers } = this.props;
  //   return (
  //     <select
  //       className={classes.select}
  //       name={`teacherSelect${num}`}
  //       value={this.state[`teacher${num}`]}
  //       onChange={e => this.handleChangeTeacher(e, num)}
  //     >
  //       <option value="" />
  //       {teachers.map(teacher => (
  //         <option key={teacher.id} value={teacher.id}>
  //           {teacher.username}
  //         </option>
  //       ))}
  //     </select>
  //   );
  // };

  // unAssignTeacher = num => {
  //   if (num === 1) {
  //     this.setState({ teacher1: '', selectedTeacher1: null });
  //   } else {
  //     this.setState({ teacher2: '', selectedTeacher2: null });
  //   }
  //   // this.setState({
  //   //   warningMessage:
  //   //     'You can only reassign a teacher! If you leave them open to the way they were'
  //   // })
  // };

  // renderAssignedTeacher = (teacher, num) => {
  //   return (
  //     <span className={classes.assignedTeacherWrapper}>
  //       <span
  //         onClick={() => this.unAssignTeacher(num)}
  //         className={classes.unAssignTeacher}
  //       >
  //         x
  //       </span>
  //       <span className={classes.teachersName}>{teacher.username}</span>
  //     </span>
  //   );
  // };

  // filterTeacher = (teachers, id) => {
  //   return teachers.filter(teacher => teacher.id === id)[0];
  // };

  // UNSAFE_componentWillReceiveProps = props => {
  //   const { teachers, infoSelectedModule } = props;
  //   if (teachers && infoSelectedModule) {
  //     this.setState({ teacher1: teachers[0].id, teacher2: teachers[1].id });
  //     const { teacher1_id, teacher2_id } = infoSelectedModule;
  //     if (teacher1_id) {
  //       this.setState({ selectedTeacher1: teacher1_id });
  //     }
  //     if (teacher2_id) {
  //       this.setState({ selectedTeacher2: teacher2_id });
  //     }
  //   }
  // };
  // componentDidMount() {
  //   this.props.userStore.getTeacher();
  // }
  
  componentWillMount() {
    this.props.userStore.getTeacher();
  }

  render() {
    const { classes } = this.props;
    
    const { selectedModule, teachers, infoSelectedModule } = this.props;
    let title;
    if (selectedModule) {
      const { module_name, group_name } = selectedModule;
      title = `Assign teachers to teach ${group_name} ${module_name} module`;
    }

    let selectTeacher1 = null;
    let selectTeacher2 = null;
    if (teachers && infoSelectedModule) {
      const { selectedTeacher1, selectedTeacher2 } = this.state;
      if (selectedTeacher1) {
        const teacher1 = this.filterTeacher(teachers, selectedTeacher1);
        selectTeacher1 = this.renderAssignedTeacher(teacher1, 1);
      } else {
        selectTeacher1 = this.renderSelectTeacher(1);
      }
      if (selectedTeacher2) {
        const teacher2 = this.filterTeacher(teachers, selectedTeacher2);
        selectTeacher2 = this.renderAssignedTeacher(teacher2, 2);
      } else {
        selectTeacher2 = this.renderSelectTeacher(2);
      }
    }
   // console.log(this.props.userStore.teachers);
    return (
      <Modal
        visible={this.props.visible}
        closeModal={this.props.closeModal}
        title={title}
      >
        <div className={classes.formWrapper}>
         
          {selectTeacher1}
          {selectTeacher2}

<List>
                     {/* {this.handleAssignTeachers} */}

          {this.props.userStore.teachers.map((value,index) => (
            <ListItem
              key={index}
              button
              onClick={this.handleToggle}
              className={classes.listItem}
            >
              <Checkbox
                tabIndex={-1}
                disableRipple
              />
              <ListItemText primary={value.full_name} />
            
            </ListItem>
          ))}
        </List>

          <div
           // className={classes.btnWrapper}
          >
            <span>{this.state.warningMessage}</span>

            
            <div>
              <button
                className={`${classes.btn} ${classes.cancel}`}
                onClick={this.props.closeModal}
              >
                CANCEL
              </button>
              <button
                className={`${classes.btn} ${classes.ok}`}
                onClick={this.handleAssignTeachers}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

AssignTeacherModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AssignTeacherModal);
