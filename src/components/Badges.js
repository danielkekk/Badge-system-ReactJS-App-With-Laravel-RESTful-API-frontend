import React from 'react';
import {Table, Button, Modal, Alert} from 'react-bootstrap';
import {request} from "../common";
import {FieldGroup} from "./FieldGroup";
import FileUploadComponent from './FileUploadComponent';
import Image from './Image';

class Badges extends React.Component {
    state = {
        badges: [],
        idForDeleteModal: false,
        addModalShow: false,
        addPicModalShow: false,
        badgeId: null,
        filename: 'nopic.png',
        name: '',
        description: '',
        xp: 100,
        validation: null,
        errorMessage: null,
    };
    
    componentDidMount() {
        this.getBadgeList();
    }
    
    createErrorMessage = (message) => {
        this.setState({
            errorMessage: message,
        });
    };

    getBadgeList = async () => {
        try {
            const result = await request('/api/getbadges', 'GET');
            this.setState({badges: result.data.success});
        } catch (error) {
            console.error(error);
        }
    };
    
    onInputChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        });
    };
    
    validationState = (field, number=false) => {
        
        if (number === false && this.state[field].length === 0) return 'error';
        if (number === true && (parseInt(this.state[field], 10) <= 0 || parseInt(this.state[field], 10) > 10000)) return 'error';
        return 'success';
    };
    
    
    /*Add new badge modal functions*/
    showAddModal = (badgeId=null, name=null, description=null, xp=null, filename=null) => () => {
        if (badgeId && name && description && xp && filename)
            this.setState({addModalShow: true, badgeId: badgeId, name: name, 
                           description: description, xp: xp, filename: filename});
        else
            this.setState({addModalShow: true});
    };

    hideAddModal = () => {
        this.setState({
            addModalShow: false,
            validation: null,
            name: '',
            badgeId: null,
            description: '',
            xp: 100,
            filename: 'nopic.png',
            errorMessage: '',
        });
    };
    
    onFormSubmit = async (e) => {
        e.preventDefault();

        if (
            this.validationState('name') === 'success' &&
            this.validationState('description') === 'success' &&
            this.validationState('xp', true) === 'success'
        ) {
            try {
                let method = 'POST';
                let url = '/api/badge';
                const payload = {
                    name: this.state.name,
                    description: this.state.description,
                    xp: this.state.xp,
                };
                if (this.state.badgeId) {
                    payload.id = this.state.badgeId;
                    method = 'PATCH';
                    url += '/' + this.state.badgeId;
                }
                await request(url, method, payload);
                this.getBadgeList();
                this.hideAddModal();
            } catch (error) {
                console.error(error);
                this.setState({errorMessage: error.error});
            }
        } else {
            this.setState({validation: true});
        }
    };
    
    
    /*Add pic modal functions*/
    showAddPicModal = (badgeId, filename) => () => {
        this.setState({
            addPicModalShow: true,
            badgeId: badgeId,
            filename: filename,
        });
    };

    hideAddPicModal = () => {
        this.setState({
            addPicModalShow: false,
            badgeId: null,
            filename: 'nopic.png',
            errorMessage: '',
        });
    };
    
    refreshBadgesPageFromFileUploadComponent = () => {
        window.location.reload();
    };
    
    
    /*Delete modal functions*/
    showDeleteModal = (badgeId) => () => {
        this.setState({idForDeleteModal: badgeId});
    };

    hideDeleteModal = () => {
        this.setState({idForDeleteModal: false,errorMessage: '',});
    };

    deleteBadge = async () => {
        try {
            await request('/api/badge/' + this.state.idForDeleteModal, 'DELETE');
            this.getBadgeList();
            this.props.history.push('/badges');
        } catch (error) {
            console.error(error);
            this.setState({errorMessage: error.error});
        }
        
        this.setState({idForDeleteModal: false});
    };
    
    
    render() {
        const btnStyles = {float: 'left', margin: '0px 0px 0px 5px'};
        
        return (
            <div>
                {this.state.addModalShow &&
                <Modal show={!!this.state.addModalShow}
                       onHide={this.hideAddModal}>
                    <form onChange={this.onInputChange}
                          onSubmit={this.onFormSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add user badge</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.errorMessage && <Alert
                                bsStyle="danger">{this.state.errorMessage}</Alert>}
                            <FieldGroup id="name"
                                        type="text"
                                        label="Name"
                                        validationState={this.state.validation && this.validationState('name')}
                                        defaultValue={this.state.name}/>
                            <FieldGroup id="description"
                                        type="textarea"
                                        label="Description"
                                        validationState={this.state.validation && this.validationState('description')}
                                        defaultValue={this.state.description}/> 
                            <FieldGroup id="xp"
                                        type="number"
                                        step="100"
                                        min="100"
                                        max="10000"
                                        label="Xp"
                                        validationState={this.state.validation && this.validationState('xp', true)}
                                        defaultValue={this.state.xp}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button type="submit"
                                    bsStyle={'primary'}>Add</Button>
                            <Button onClick={this.hideAddModal}>Cancel</Button>
                        </Modal.Footer>
                    </form>
                </Modal>}
                
                
                
                {this.state.addPicModalShow &&
                <Modal show={!!this.state.addPicModalShow}
                   onHide={this.hideAddPicModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add image to user badge</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {!this.state.errorMessage && <Alert
                            bsStyle="info">Feltölthető formátum: PNG, Max méret: 0.5MB, Min méret: 100x100 pixel, Max méret: 1024x1024 pixel</Alert>}
                        {this.state.errorMessage && <Alert
                            bsStyle="danger">{this.state.errorMessage}</Alert>}
                        <Image src={'http://localhost:8000/uploads/'+this.state.filename} width={150} height={150} mode='fit'/>  
                        <FileUploadComponent badgeId={this.state.badgeId} refresh={this.refreshBadgesPageFromFileUploadComponent}
                                             createErrorMessage={this.createErrorMessage}/>
                    </Modal.Body>
                </Modal>}
                
                
                
                {this.state.idForDeleteModal &&
                <Modal show={!!this.state.idForDeleteModal}
                       onHide={this.hideDeleteModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete badge</Modal.Title>
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
                
                
                <Button href="#" style={{float: "right"}} onClick={this.showAddModal(null,null,null,null,null)}>Add new badge</Button>
                <h1>Badges</h1>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>XP</th>
                        <th>Image</th>
                        <th>Edit</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.badges.map(badge => <tr key={badge.id}>
                        <td>{badge.id}</td>
                        <td>{badge.name}</td>
                        <td>{badge.description}</td>
                        <td>{badge.xp}</td>
                        <td><Image src={'http://localhost:8000/uploads/'+badge.filename} width={150} height={150} mode='fit'/></td>
                        <td>
                            <Button bsStyle="info"
                                    bsSize="xsmall"
                                    style={btnStyles}
                                    onClick={this.showAddModal(badge.id, badge.name, badge.description, badge.xp, badge.filename)}>E</Button>
                            <Button bsStyle="info"
                                    bsSize="xsmall"
                                    style={btnStyles}
                                    onClick={this.showAddPicModal(badge.id, badge.filename)}>IMG</Button>
                            <Button bsStyle="danger"
                                    bsSize="xsmall"
                                    style={btnStyles}
                                    onClick={this.showDeleteModal(badge.id)}>X</Button>
                        </td>
                    </tr>)}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default Badges;
