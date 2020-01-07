import React, { Component } from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from 'react-router-dom';
import Home from './Home/Home';
import TableList from './TableList/TableList';
import Charts from './Charts/Charts';

class App extends Component {
  render() {
    return (
      <div>
          <Router>
          <ul className={'list'}>
              <li><button><Link className={'link'} to='/'>Home</Link></button></li>
              <li><button><Link className={'link'} to='/list'>Table List</Link></button></li>
              <li><button><Link className={'link'} to='/chart'>Charts</Link></button></li>
          </ul>
            <Switch>
                <Route path='/list' component={TableList}/>
                <Route path='/chart' component={Charts}/>
                <Route path='/' component={Home}/>

            </Switch>
          </Router>
      </div>
    );
  }
}

export default App;
