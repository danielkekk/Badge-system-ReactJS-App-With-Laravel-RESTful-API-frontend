import React from 'react';
import {Table} from 'react-bootstrap';
import {request} from "../common";

class Myprofile extends React.Component {
    state = {
        user: null
    };

    componentDidMount() {
        this.getUserById(this.props.userId);
    }

    getUserById = async (userid) => {
        try {
            const result = await request('/api/user', 'POST', {userid: userid});
            this.setState({user: result.data.success});
        } catch (error) {
            console.error(error);
        }
    };

    render() {
        return (
            <div>
                <h1>My Profile</h1>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.user && <tr key={this.state.user.id}>
                        <td>{this.state.user.id}</td>
                        <td>{this.state.user.name}</td>
                        <td>{this.state.user.email}</td>
                        <td>{(parseInt(this.state.user.role) == 2) ? 'user' : 'admin'}</td>
                    </tr>}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default Myprofile;
