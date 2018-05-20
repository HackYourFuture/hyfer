import React, { Component } from 'react'
import Student from './student'
import Styles from '../../assets/styles/selectStudent.css'
import Modal from '../../Helpers/Modal/Modal';

class StudentList extends Component {

  render() {
    const { members,
      selected,
      handelSelected,
      closeModal,
      visible,
      selectedStudents,
      filterStudents,
    } = this.props;



    return (
      <div>
        <div className={Styles.btnContainer}>
          <button onClick={closeModal} className={Styles.btn} >Add/Edit Student </button>
        </div>
        <div className={Styles.studentContainer}>
          <Modal title='Select Student'
            closeModal={closeModal}
            visible={visible}
          >
            {
              members.map(member => {
                return (
                  <Student key={member.id}
                    member={member}
                    selected={selected}
                    handelSelected={handelSelected}
                  />
                )
              })
            }
            <div className={Styles.btnContainer}>
              <button onClick={filterStudents} className={Styles.btn} >+</button>
            </div>
          </Modal>
          {
            selectedStudents.length>0 ? 
              <div>
                {
                  selectedStudents.map(student => (
                    <h2>{student.full_name}</h2>
                  ))
                }
              </div>
          :
              <div className={Styles.emptyStudents} >
                <span className={Styles.emptyMsg}>there is no student selected !</span>
              </div>
          }
        </div>
        
        
      </div>
    )
  }
}

export default StudentList
