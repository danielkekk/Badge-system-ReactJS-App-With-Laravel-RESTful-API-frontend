import React from 'react';
import {Table, Button, Modal, Alert} from 'react-bootstrap';
import {request} from "../common";
import {SelectGroup, FieldGroup} from "./FieldGroup";

class Users extends React.Component {
    state = {
        users: [],
        userIdForAddModal: false,
        badges: [],
        badgeId: '',
        validation: null,
        idsForDeleteModal: false,
        errorMessage: '',
        editModalShow: false,
        editUserId: '', 
        editUserName: '', 
        editUserEmail: '',
        editUserRole: '',
        deleteUserId: false,
        deleteUserName: null
    };

    componentDidMount() {
        this.getUserList();
        this.getBadgeList();
    }
    
    onInputChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        });
    };
    
    validationState = (field) => {
        if (!this.state[field]) return 'error';
        return 'success';
    };

    showEditModal = (id, name, email, role) => () => {
        this.setState({editModalShow: true, editUserId: id, editUserName: name, editUserEmail: email, editUserRole: role});
    };
    
    hideEditModal = () => {
        this.setState({
            editModalShow: false,
            editUserId: '', 
            editUserName: '', 
            editUserEmail: '',
            editUserRole: '',
            validation: null,
            errorMessage: '',
        });
    };
    
    onEditFormSubmit = async (e) => {
        e.preventDefault();
        
        if (
            this.validationState('editUserName') === 'success' &&
            this.validationState('editUserEmail') === 'success'
        ) {
            try {
                let result = await request('/api/user/' + this.state.editUserId, 'PATCH', {name: this.state.editUserName, email: this.state.editUserEmail, role: this.state.editUserRole});
                this.getUserList();
                this.hideEditModal();
            } catch (error) {
                this.setState({
                    validation: true,
                    errorMessage: error.error,
                });
                console.error(error);
            }
        } else {
            this.setState({
                validation: true,
            });
        }
    };
    
    
    /*Delete user modal functions*/
    showDeleteUserModal = (userId, userName) => () => {
        this.setState({deleteUserId: userId, deleteUserName: userName});
    };

    hideDeleteUserModal = () => {
        this.setState({deleteUserId: false, deleteUserName: null});
    };

    deleteUser = async () => {
        try {
            await request('/api/user/' + this.state.deleteUserId, 'DELETE');
            this.getUserList();
        } catch (error) {
            console.error(error);
        }
        this.hideDeleteUserModal();
    };
    
    
    /*Add/delete badges to/from users*/
    getBadgeList = async () => {
        try {
            const result = await request('/api/getbadges', 'GET');
            this.setState({badges: result.data.success});
        } catch (error) {
            console.error(error);
        }
    };

    showAddModal = (userId) => () => {
        this.setState({userIdForAddModal: userId});
    };

    hideAddModal = () => {
        this.setState({
            userIdForAddModal: false,
            validation: null,
            badgeId: '',
            errorMessage: '',
        });
    };

    onFormSubmit = async (e) => {
        e.preventDefault();

        if (
            this.validationState('badgeId') === 'success'
        ) {
            try {
                await request('/api/user/' + this.state.userIdForAddModal + '/badge/' + this.state.badgeId, 'POST');
                this.getUserList();
                this.hideAddModal();
            } catch (error) {
                this.setState({
                    validation: true,
                    errorMessage: error.error,
                });
                console.error(error);
            }
        } else {
            this.setState({
                validation: true,
            });
        }
    };

    getUserList = async () => {
        try {
            const result = await request('/api/getusers', 'GET');
            this.setState({users: result.data.success});
        } catch (error) {
            console.error(error);
        }
    };

    showDeleteModal = (userId, badgeId) => () => {
        this.setState({idsForDeleteModal: {userId, badgeId}});
    };

    hideDeleteModal = () => {
        this.setState({idsForDeleteModal: false});
    };

    deleteBadge = async () => {
        try {
            await request('/api/user/' + this.state.idsForDeleteModal.userId + '/badge/' + this.state.idsForDeleteModal.badgeId, 'delete');
            this.getUserList();
        } catch (error) {
            console.error(error);
        }
        this.setState({idsForDeleteModal: false});
    };

    render() {
        const btnStyles = {float: 'left', margin: '0px 0px 0px 5px'};
        
        return (
            <div>
            
                {this.state.editModalShow &&
                <Modal show={!!this.state.editModalShow}
                       onHide={this.hideEditModal}>
                    <form onChange={this.onInputChange}
                          onSubmit={this.onEditFormSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit user profile</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.errorMessage && <Alert
                                bsStyle="danger">{this.state.errorMessage}</Alert>}
                            <FieldGroup id="editUserName"
                                        type="text"
                                        label="Name"
                                        validationState={this.state.validation && this.validationState('editUserName')}
                                        defaultValue={this.state.editUserName}/>
                            <FieldGroup id="editUserEmail"
                                        type="text"
                                        label="Email"
                                        validationState={this.state.validation && this.validationState('editUserEmail')}
                                        defaultValue={this.state.editUserEmail}/>
                            {(parseInt(this.state.editUserId) !== parseInt(localStorage.getItem('userid'))) && 
                            <SelectGroup id="editUserRole"
                                         label="Badge"
                                         validationState={this.state.validation && this.validationState('editUserRole')}
                                         value={this.state.editUserRole}>
                                    <option value="1" key="role_1" selected={parseInt(this.state.editUserRole) === 1}>admin</option>
                                    <option value="2" key="role_2" selected={parseInt(this.state.editUserRole) === 2}>user</option>
                            </SelectGroup>}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button type="submit"
                                    bsStyle={'primary'}>Add</Button>
                            <Button onClick={this.hideEditModal}>Cancel</Button>
                        </Modal.Footer>
                    </form>
                </Modal>}
                
                {this.state.deleteUserId &&
                <Modal show={!!this.state.deleteUserId}
                       onHide={this.hideDeleteUserModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete user</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete {this.state.deleteUserName}?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.deleteUser}
                                bsStyle={'danger'}>Yes</Button>
                        <Button onClick={this.hideDeleteUserModal}
                                bsStyle={'primary'}>No</Button>
                    </Modal.Footer>
                </Modal>}
                
                
                
                {this.state.userIdForAddModal &&
                <Modal show={!!this.state.userIdForAddModal}
                       onHide={this.hideAddModal}>
                    <form onChange={this.onInputChange}
                          onSubmit={this.onFormSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add user badge</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.errorMessage && <Alert
                                bsStyle="danger">{this.state.errorMessage}</Alert>}
                            <SelectGroup id="badgeId"
                                         label="Badge"
                                         validationState={this.state.validation && this.validationState('badgeId')}
                                         value={this.state.badgeId}>
                                <option value=""/>
                                {this.state.badges.map(badge => <option
                                    value={badge.id}
                                    key={`badge_${badge.id}`}>{badge.name} ({badge.xp} XP)</option>)}
                            </SelectGroup>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button type="submit"
                                    bsStyle={'primary'}>Add</Button>
                            <Button onClick={this.hideAddModal}>Cancel</Button>
                        </Modal.Footer>
                    </form>
                </Modal>}

                {this.state.idsForDeleteModal &&
                <Modal show={!!this.state.idsForDeleteModal}
                       onHide={this.hideDeleteModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete user badge</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete the badge?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.deleteBadge}
                                bsStyle={'danger'}>Yes</Button>
                        <Button onClick={this.hideDeleteModal}
                                bsStyle={'primary'}>No</Button>
                    </Modal.Footer>
                </Modal>}

                <h1>Users</h1>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Badges</th>
                        <th>Edit</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.users.map(user => <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{(parseInt(user.role) == 2) ? 'user' : 'admin'}</td>
                        <td>
                            {user.badges.map(badge =>
                                <div key={`user_${user.id}_badge_${badge.id}`}
                                     style={{marginBottom: '5px'}}>
                                    <Button bsStyle="danger"
                                            bsSize="xsmall"
                                            style={{float: 'right'}}
                                            onClick={this.showDeleteModal(user.id, badge.id)}>X</Button>
                                    <div>{badge.name} ({badge.xp} XP)</div>
                                </div>
                            )}
                            <Button bsSize="xsmall"
                                    block
                                    onClick={this.showAddModal(user.id)}>Add badge</Button>
                        </td>
                        <td>
                            <Button bsStyle="info"
                                    bsSize="xsmall"
                                    style={btnStyles}
                                    onClick={this.showEditModal(user.id, user.name, user.email, user.role)}>E</Button>
                            <Button bsStyle="danger"
                                    bsSize="xsmall"
                                    style={btnStyles}
                                    onClick={this.showDeleteUserModal(user.id, user.name)}>X</Button>
                        </td>
                    </tr>)}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default Users;
