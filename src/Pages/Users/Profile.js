import React from 'react'
import store from '../../store/UserStore'
import styles from '../../assets/styles/profile.css'
import { Link } from 'react-router-dom'
import { getAllGroupsWithIds } from '../../util'
import { error_bundle } from '../../notify';

export default class Profile extends React.Component {
    state = {
        classOptions: []
    }

    componentDidMount() {
        let getData = async () => {

            let groupData = await getAllGroupsWithIds().catch(error_bundle) // catching the error in the end of the line

            groupData.map(group => {
                return {
                    groupsName: group.group_name,
                    groupsId: group.id
                }
            })

            this.setState({
                classOptions: groupData
            })
        }
        getData()
        window.scrollTo(0, 0)
    }

    componentWillMount = () => {
        this.subscription = store.subscribe(state => {
            this.setState(state);
        });
    }

    setInputActive = (e) => {
        e.target.parentElement.className += ' ' + styles.isActive
        e.target.parentElement.className += ' ' + styles.isCompleted
    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    checkHasValue(val) {
        return (!val || val.length === 0) ? '' : styles.isCompleted;
    }


    render() {
        return (
            <div className={styles.profilePage}>
                <Link to='/users'>
                    <input className={styles.backButton}
                        type="button"
                        value="&#8249;"
                    />
                </Link>
                <h1>Edit Profile</h1>
                <div className={styles.profileContainer}>
                    <div className={styles.matDiv + ' ' + this.checkHasValue(store.state.full_name)}>
                        <label htmlFor="first-name" className={styles.matLabel}>First Name</label>
                        <input className={styles.matInput}
                            type="text" value={store.state.full_name}
                            id="first-name"
                            onChange={(e) => { store.setState({ full_name: e.target.value }); }}
                            onFocus={(e) => { this.setInputActive(e) }}
                        />
                    </div>

                    <div className={styles.small + ' ' + styles.matDiv + ' ' + styles.isCompleted}>
                        <label htmlFor="role" className={styles.matLabel}>Role</label>
                        <select value={store.state.role}
                            id="role"
                            className={styles.matInput}
                            onChange={(e) => { store.setState({ role: e.target.value }); }}
                        >
                            <option value="guest" disabled hidden>Role</option>
                            <option value="teacher">Teacher</option>
                            <option value="student">Student</option>
                        </select>
                    </div>

                    <div className={styles.small + ' ' + styles.matDiv + ' ' + styles.isCompleted}>
                        <label htmlFor="Class" className={styles.matLabel}>Class</label>
                        <select className={styles.matInput}
                            value={'{"name":"' + store.state.group_name + '","id":"' + store.state.group_id + '"}'}
                            onChange={(e) => {
                                store.setState({ group_name: JSON.parse(e.target.value).name, group_id: +JSON.parse(e.target.value).id })
                            }}>

                            {this.state.classOptions.map(group => {

                                let optionValue = `{"name":"${group.group_name}","id":"${group.id}"}`
                                return (<option key={group.id} value={optionValue}>{group.group_name}</option>)

                            })}
                        </select>
                    </div>
                    <div className={styles.matDiv + ' ' + this.checkHasValue(store.state.email)}>
                        <label htmlFor="e-mail" className={styles.matLabel}>e-mail</label>
                        <input type="email"
                            className={styles.matInput}
                            //The default props 'value' of an input should be an empty string
                            value={store.state.email || ''}
                            id="e-mail"
                            onChange={(e) => { store.setState({ email: e.target.value }); }}
                            onFocus={(e) => { this.setInputActive(e) }} />
                    </div>
                    <div className={styles.matDiv + ' ' + this.checkHasValue(store.state.slack_username)}>
                        <label htmlFor="slack-username" className={styles.matLabel}>Slack Username</label>
                        <input type="text"
                            value={store.state.slack_username || ''}
                            className={styles.matInput}
                            id="slack-username"
                            onChange={(e) => { store.setState({ slack_username: e.target.value }); }}
                            onFocus={(e) => { this.setInputActive(e) }}
                        />
                    </div>
                    <div className={styles.matDiv + ' ' + this.checkHasValue(store.state.freecodecamp_username)}>
                        <label htmlFor="freecodecamp-username" className={styles.matLabel}>FreeCodeCamp Username</label>
                        <input type="text"
                            value={store.state.freecodecamp_username || ''}
                            className={styles.matInput}
                            id="freecodecamp-username"
                            onChange={(e) => { store.setState({ freecodecamp_username: e.target.value }); }}
                            onFocus={(e) => { this.setInputActive(e) }}
                        />
                    </div>
                    <div className={styles.matDiv + ' ' + this.checkHasValue(store.state.mobile)}>
                        <label htmlFor="mobile" className={styles.matLabel}>Mobile</label>
                        <input type="tel"
                            value={store.state.mobile || ''}
                            className={styles.matInput}
                            id="mobile"
                            onChange={(e) => { store.setState({ mobile: e.target.value }); }}
                            onFocus={(e) => { this.setInputActive(e) }}
                        />
                    </div>
                    <Link to='/users'>
                        <input className={styles.saveProfile}
                            type="submit"
                            value="Save"
                            onClick={() => store.saveProfile('loadUsers')}
                        />
                    </Link>
                    <input className={styles.resetProfile}
                        type="reset"
                        value="Reset"
                        onClick={store.resetProfile}
                    />
                </div>

            </div>
        )
    }
}
