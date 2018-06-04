import React from 'react';
import {
    Navbar,
    Nav,
    NavItem,
    Row,
    Grid,
    Col,
} from 'react-bootstrap';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect,
} from 'react-router-dom';
import {
    LinkContainer,
} from 'react-router-bootstrap';

import Login from './components/Login';
import Logout from './components/Logout';
import NotFound from './components/NotFound';
import Register from './components/Register';
import Users from './components/Users';
import Badges from './components/Badges';
import Badge from './components/Badge';
import Dashboard from './components/Dashboard';
import Myprofile from './components/Myprofile';
import Mybadges from './components/Mybadges';

class App extends React.Component {
    state = {
        token: localStorage.getItem('token'),
        userid: localStorage.getItem('userid'),
        role: localStorage.getItem('role'),
        name: localStorage.getItem('name')
    };

    saveToken = (token, userid, role, name) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userid', userid);
        localStorage.setItem('role', role);
        localStorage.setItem('name', name);
        this.setState({token: token, userid: userid, role: role, name: name});
    };

    removeToken = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userid');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        this.setState({token: null, userid: null, role: null, name: null});
    };
    
    getUserId = () => {
        return this.state.userid;
    };

    render() {
        return (
            <Router>
                <div>
                    <Navbar inverse>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <Link to="/">Badge</Link>
                            </Navbar.Brand>
                        </Navbar.Header>

                        {this.state.token && (parseInt(this.state.role) === 1) && <Nav>
                            <LinkContainer to="/users">
                                <NavItem eventKey={1}>Users</NavItem>
                            </LinkContainer>
                            <LinkContainer to="/badges">
                                <NavItem eventKey={2}>Badges</NavItem>
                            </LinkContainer>
                            <LinkContainer to="/dashboard">
                                <NavItem eventKey={3}>Dashboard</NavItem>
                            </LinkContainer>
                        </Nav>}
                        
                        {this.state.token && (parseInt(this.state.role) === 2) && <Nav>
                            <LinkContainer to="/myprofile">
                                <NavItem eventKey={4}>My Profile</NavItem>
                            </LinkContainer>
                            <LinkContainer to="/mybadges">
                                <NavItem eventKey={5}>My Badges</NavItem>
                            </LinkContainer>
                        </Nav>}
                        
                        <Nav pullRight>
                            {!this.state.token && <LinkContainer to="/register">
                                <NavItem eventKey={6}>Register</NavItem>
                            </LinkContainer>}
                            {this.state.token && <LinkContainer to="/logout">
                                <NavItem eventKey={7}>Logout</NavItem>
                            </LinkContainer>}
                        </Nav>
                        
                        <Nav pullRight>
                            {this.state.token && <NavItem eventKey={8} disabled><span style={{color: '#BBB'}}>Hello {this.state.name},</span></NavItem>}
                        </Nav>
                    </Navbar>

                    <Grid>
                        <Row>
                            <Col xs={12}>
                                <Switch>
                                    {this.state.token && (parseInt(this.state.role) === 1) && <Redirect exact from={'/'} to={'/users'}/>}
                                    {this.state.token && (parseInt(this.state.role) === 2) && <Redirect exact from={'/'} to={'/myprofile'}/>}
                                    {this.state.token && (parseInt(this.state.role) === 1) && <Route path="/users" component={Users}/>}
                                    {this.state.token && (parseInt(this.state.role) === 1) && <Route path="/dashboard" component={Dashboard}/>}
                                    {this.state.token && (parseInt(this.state.role) === 1) && <Route exact path="/badges" component={Badges}/>}
                                    {this.state.token && (parseInt(this.state.role) === 1) && <Route path="/badges/edit/:id?" component={Badge}/>}
                                
                                    {this.state.token && (parseInt(this.state.role) === 2) && <Route 
                                        path="/myprofile" 
                                        render={() => <Myprofile userId={this.state.userid}/>}
                                    />}
                                    {this.state.token && (parseInt(this.state.role) === 2) && <Route 
                                        path="/mybadges" 
                                        render={() => <Mybadges userId={this.state.userid}/>}
                                    />}
                                
                                    {this.state.token && <Route
                                        path="/logout"
                                        render={() => <Logout removeToken={this.removeToken} getUserId={this.getUserId}/>}
                                    />}
                                    {!this.state.token && <Route path="/register" component={Register}/>}
                                    {!this.state.token && <Route
                                        path="/"
                                        render={() => <Login saveToken={this.saveToken}/>}
                                    />}
                                    
                                    <Route path="/" component={NotFound}/>
                                </Switch>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </Router>
        );
    }
}

export default App;