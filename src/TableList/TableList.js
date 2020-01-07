import React, { Component } from 'react';
import './TableList.css';
import axios from 'axios';
import Fuse from 'fuse.js';





class TableList extends Component {
   constructor(props){
     super(props);

     this.state = {
         data:[],
       pois:[],
       value:""
     };

    this.search = this.search.bind(this);
   }

  // componentWillMount(){}
   componentDidMount(){
       axios.get('/poi').then( res => {

               this.setState({
                   pois:res.data,
                   data: res.data
               })
           }
       );
   }
  // componentWillUnmount(){}

  // componentWillReceiveProps(){}
  // shouldComponentUpdate(){}
  // componentWillUpdate(){}
  // componentDidUpdate(){}

  search(event){
    this.setState({value: event.target.value},() =>{
        if (this.state.value === ""){
            this.setState({
                pois:this.state.data
            })
        }
        else {
            const options = {
                shouldSort: true,
                threshold: 0.4,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [
                    "name"
                ]
            };

            const fuse = new Fuse(this.state.data, options);
            const result = fuse.search(this.state.value);

            this.setState({
                pois: result
            })
        }
      });



  }

  render() {


    return (
      <div>
        <input onChange={this.search} value={this.state.value} type="text" placeholder="Search.."/>
        <table>
            <tbody>
            <tr>
                <th>Name</th>
                <th>Latitude</th>
                <th>Longitude</th>
            </tr>
            {this.state.pois.map((poi) => (
                <tr key={poi.poi_id}>
                <td>{poi.name}</td>
                <td>{poi.lat}</td>
                <td>{poi.lon}</td>
                </tr>
                ))
            }
            </tbody>
        </table>
      </div>
    );
  }
}

export default TableList;