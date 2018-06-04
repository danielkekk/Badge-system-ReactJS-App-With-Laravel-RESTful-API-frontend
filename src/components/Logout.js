import React from 'react';
import {withRouter} from 'react-router-dom';
import {request} from "../common";

class Logout extends React.Component {
    componentDidMount() {
        const userid = this.props.getUserId();
        this.removeTokenFromDatabase(userid);
        this.props.removeToken();
        this.props.history.push('/');
    }
    
    removeTokenFromDatabase = async (userid) => {
        try {
            await request('/api/logout', 'POST', {userid: userid});
        } catch (error) {
            console.error(error);
        }
    };

    render() {
        return (
            <div/>
        );
    }
}

export default withRouter(Logout);
