import React, { Component } from 'react';
import Student from './student';
import Styles from '../../assets/styles/selectStudent.css';
import Modal from '../../Helpers/Modal/Modal';
import Table from './table';
import Icon from '@material-ui/core/Icon';

class StudentList extends Component {
  render() {
    const {
      members,
      selected,
      handelSelected,
      closeModal,
      visible,
      selectedStudents,
      filterStudents,
      handleFieldChange,
      searchMember,
      filterByGroupName,
      couponCodes,
      noAvailableTickets,
    } = this.props;

    let filterMembers = members;
    searchMember.trim().toLowerCase();
    if (searchMember.length) {
      filterMembers = filterMembers.filter(el =>
        el.full_name.toLowerCase().match(searchMember)
      );
    } else if (filterByGroupName) {
      filterMembers = filterMembers.filter(
        el => el.group_name === filterByGroupName
      );
    } else if (filterByGroupName === 'All') {
      return filterMembers;
    }

    return (
      <div>
        <div className={Styles.btnContainer}>
          <button
            onClick={closeModal}
            className={Styles.btn}
            title="Click to Add or Edit List"
          >
            <Icon color="action">playlist_add</Icon>
          </button>
        </div>
        <div className={Styles.studentContainer}>
          <Modal closeModal={closeModal} visible={visible}>
            <div className={Styles.headerContainer}>
              <ul>
                <li className={Styles.headerList}>
                  <div>
                    <input
                      type="text"
                      name="search"
                      className={Styles.SearchInput}
                      placeholder="Search.."
                      onChange={e => handleFieldChange(e, 'searchMember')}
                    />
                  </div>
                </li>
                <li className={Styles.headerList}>
                  <div className={Styles.groupsSelected}>
                    <select
                      title="Filter By Class name"
                      onChange={e => handleFieldChange(e, 'filterByGroupName')}
                      name="studentList"
                      className={Styles.selectMenu}
                    >
                      <option value="All">Select Class</option>
                      {members
                        .map(member => member.group_name)
                        .filter((elem, pos, arr) => {
                          return arr.indexOf(elem) === pos;
                        })
                        .filter(elem => elem !== null)
                        .map(groupName => {
                          return (
                            <option key={groupName} value={groupName}>
                              {groupName}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </li>
                <li>
                  <div>
                    <button
                      title="Click to Add Student"
                      className={
                        noAvailableTickets
                          ? Styles.disabledBtn
                          : Styles.selectedBtn
                      }
                      disabled={noAvailableTickets}
                      onClick={filterStudents}
                    >
                      <Icon color="action">group_add</Icon>
                    </button>
                  </div>
                </li>
              </ul>
            </div>
            <div className={Styles.sContainer}>
              {filterMembers.map((member, i) => {
                return (
                  <Student
                    key={i}
                    member={member}
                    selected={selected}
                    handelSelected={handelSelected}
                    couponCodes={couponCodes}
                    selectedStudents={selectedStudents}
                  />
                );
              })}
            </div>
          </Modal>
          {selectedStudents.length > 0 ? (
            <Table selectedStudents={selectedStudents} />
          ) : (
            <div className={Styles.emptyStudents}>
              <span className={Styles.emptyMsg}>
                there is no student selected !
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default StudentList;
