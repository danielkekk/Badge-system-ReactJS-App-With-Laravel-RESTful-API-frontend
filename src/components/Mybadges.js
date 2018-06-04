import React from 'react';
import {Table} from 'react-bootstrap';
import {request} from "../common";
import Image from './Image';

class Mybadges extends React.Component {
    state = {
        badges: []
    };

    componentDidMount() {
        this.getBadgesByUserId(this.props.userId);
    }

    getBadgesByUserId = async (userid) => {
        try {
            const result = await request('/api/userbadges', 'POST', {userid: userid});
            this.setState({badges: result.data.success});
        } catch (error) {
            console.error(error);
        }
    };
    
    render() {
        return (
            <div>
                <h1>My Badges</h1>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>XP</th>
                        <th>Image</th>
                    </tr>
                    </thead>
                    {(this.state.badges.length > 0) && <tbody>
                    {this.state.badges.map(badge => <tr key={badge.id}>
                        <td>{badge.id}</td>
                        <td>{badge.name}</td>
                        <td>{badge.description}</td>
                        <td>{badge.xp}</td>
                        <td>
                            <Image src={'http://localhost:8000/uploads/' + badge.filename} width={150} height={150} mode='fit'/>  
                        </td>
                    </tr>)}
                    </tbody>}
                </Table>
            </div>
        );
    }
}

export default Mybadges;
