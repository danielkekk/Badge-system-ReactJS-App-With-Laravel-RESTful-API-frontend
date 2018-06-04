import React from 'react';
import {withRouter} from 'react-router-dom';
import {
    Grid,
    Row,
    Col,
} from 'react-bootstrap';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {request} from "../common";

class Dashboard extends React.Component {
    state = {
        data_chart1 : [],
        data_chart2 : [],
        data_chart3 : [],
    };

    componentDidMount() {
        this.getAllUsersBadgeNum();
        this.getAllUsersXpNum();
        this.getAllBadgesNum();
    }

    getAllUsersBadgeNum = async () => {
        try {
            const result = await request('/api/getallusersbadgenum/', 'GET');
            
            this.setState({
                data_chart1: result.data.success,
            });
        } catch (error) {
            console.error(error);
        }
    };
    
    getAllUsersXpNum = async () => {
        try {
            const result = await request('/api/getallusersxpnum/', 'GET');
            
            this.setState({
                data_chart2: result.data.success,
            });
        } catch (error) {
            console.error(error);
        }
    };
    
    getAllBadgesNum = async () => {
        try {
            const result = await request('/api/getallbadgesnum/', 'GET');
            
            this.setState({
                data_chart3: result.data.success,
            });
        } catch (error) {
            console.error(error);
        }
    };

    onInputChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        });
    };

    render() {
        return (
            <div>
                <h1>Statistics</h1>
                <Grid>
                    <Row>
                        <Col md={6} mdOffset={3}>
                          <BarChart width={600} height={300} data={this.state.data_chart1}
                                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                           <CartesianGrid strokeDasharray="3 3"/>
                           <XAxis dataKey="name"/>
                           <YAxis/>
                           <Tooltip/>
                           <Legend />
                           <Bar type="monotone" dataKey="badge_pcs" barSize={40} fill="#8884d8" />
                          </BarChart>
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col md={6} mdOffset={3}>
                          <BarChart width={600} height={300} data={this.state.data_chart2}
                                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                           <CartesianGrid strokeDasharray="3 3"/>
                           <XAxis dataKey="name"/>
                           <YAxis/>
                           <Tooltip/>
                           <Legend />
                           <Bar type="monotone" dataKey="xp_sum" barSize={40} fill="#1abae8" />
                          </BarChart>
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col md={6} mdOffset={3}>
                          <BarChart width={600} height={300} data={this.state.data_chart3}
                                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                           <CartesianGrid strokeDasharray="3 3"/>
                           <XAxis dataKey="name"/>
                           <YAxis/>
                           <Tooltip/>
                           <Legend />
                           <Bar type="monotone" dataKey="badge_pcs" barSize={40} fill="#8884d8" />
                          </BarChart>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default withRouter(Dashboard);
