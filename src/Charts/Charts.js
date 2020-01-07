import React, {Component} from 'react';
import './Charts.css';
import axios from 'axios';


import CanvasJSReact from '../canvasjs.react';


const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;


class Charts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timePeriod: ['Daily', 'Hourly'],
            dataType: ['impressions', 'clicks', 'revenue', 'events'],
            selectedTime: "Daily",
            selectedType: ['impressions'],
            data: [],
            selectedData: [],
            selectedDay: "",
            labels: []
        };
        this.changeTime = this.changeTime.bind(this);
        this.changeType = this.changeType.bind(this);
        this.changeDay = this.changeDay.bind(this);

        this.getHourlyData = this.getHourlyData.bind(this);
        this.getDailyData = this.getDailyData.bind(this);



    }

    // componentWillMount(){}
     componentDidMount() {
         this.getDailyData();



     };
     getDailyData=()=> {
        let events = [];
        let stats = [];

        axios.get('/events/daily').then( (res) => {
            events = res.data;

            axios.get('/stats/daily').then( (resp) => {
                stats = resp.data;

                let data = [];

                for (let i = 0; i < events.length; i++) {
                    data[i] = {...events[i], ...stats[i]};
                }

                this.getHourlyData().then((response) => {


                        data.forEach((item, index) => {
                            item['hourly'] = response[index];
                        });



                           const  selectedDay = data[0].date;

                           let labels = [];

                                data.forEach(item => {
                                    const newLabel = {label: item.date.toString(), y: parseInt(item[this.state.selectedType])};
                                    labels.push(newLabel);

                                });
                    this.setState({
                        labels: labels,
                        data:data,
                        selectedDay:selectedDay
                    })


                    });

            });
        });


    };

       getHourlyData(){
       return new Promise(function(resolve,reject) {
        let events = [];
        let stats = [];
        axios.get('/events/hourly').then(  res => {
            events = res.data;
            axios.get('/stats/hourly').then(   resp => {
                stats = resp.data;
                let data = [];

                for (let i = 0; i < events.length; i++) {
                    data[i] = {...events[i], ...stats[i]};
                }
                let daily = [];

                data.forEach((item, index) => {

                    if (index === 0) {
                        const arr = [item];
                        daily.push(arr);
                    } else if (item.date === daily[daily.length - 1][daily[daily.length - 1].length - 1].date) {
                        daily[daily.length - 1].push(item);
                    } else {
                        const arr = [item];
                        daily.push(arr);
                    }
                });

                resolve(daily);
            });
        });


    })}


    // componentWillUnmount(){}

    // componentWillReceiveProps(){}
    // shouldComponentUpdate(){}
    // componentWillUpdate(){}
    // componentDidUpdate(){}
    changeTime(event) {
        this.setState({
            selectedTime: event.target.value
        }, () => {
            if (this.state.selectedTime === "Daily") {
               let labels = [];
                this.state.data.forEach(item => {
                    const newLabel = {label: item.date, y: parseInt(item[this.state.selectedType])};
                    labels.push(newLabel);

                });
                this.setState({
                    labels: labels
                })
            } else {
                let labels = [];
                this.state.data.forEach(item => {
                    if (item.date === this.state.selectedDay) {
                        item.hourly.forEach(hour => {
                                const newLabel = {label: hour.hour, y: parseInt(hour[this.state.selectedType])};
                                labels.push(newLabel);

                            }
                        );
                        this.setState({
                            labels: labels
                        })
                    }
                });
            }
        })
    }

    changeType(event) {
        this.setState({
            selectedType: event.target.value
        }, () => {
            if (this.state.selectedTime === "Daily") {

                    let labels = [];
                    this.state.data.forEach(item => {
                        const newLabel = {label: item.date.toString(), y: parseInt(item[this.state.selectedType])};
                        labels.push(newLabel);

                    });
                    this.setState({
                        labels: labels
                    })
                }
             else {
                this.setState({
                    labels: []
                },() =>{
                this.state.data.forEach(item => {
                    if (item.date === this.state.selectedDay) {
                        let labels = [];
                        item.hourly.forEach(hour => {
                            const newLabel = {label: hour.hour.toString(), y: parseInt(hour[this.state.selectedType])};
                            labels.push(newLabel);

                        });
                        this.setState({
                            labels: labels
                        })

                    }
                });
            });
            }
        })

    }

    changeDay(event) {
        this.setState({
            selectedDay: event.target.value
        }, () => {

            this.state.data.forEach(item => {
                if (item.date === this.state.selectedDay) {
                    let labels = [];
                    item.hourly.forEach(hour => {
                            const newLabel = {label: hour.hour, y: parseInt(hour[this.state.selectedType])};
                            labels.push(newLabel);

                        });
                    this.setState({
                        labels: labels
                    })
                }
            })

        })

    }

    render() {


        const options = {
            title: {
                text: "Chart"
            },
            data: [
                {
                    // Change type to "doughnut", "line", "splineArea", etc.
                    type: "column",
                    dataPoints: this.state.labels
                }
            ]
        };

        return (
            <div>
                <label>
                    <select onChange={this.changeTime} value={this.state.selectedTime}>
                        {this.state.timePeriod.map((item, id) =>
                            <option key={id} value={item}>{item}</option>
                        )}
                    </select>
                    <select onChange={this.changeType} value={this.state.selectedType}>
                        {this.state.dataType.map((item, id) =>
                            <option key={id} value={item}>{item}</option>
                        )}
                    </select>
                    {this.state.selectedTime === 'Hourly' &&
                    <select onChange={this.changeDay} value={this.state.selectedDay}>
                        {this.state.data.map((item, id) =>
                            <option key={id} value={item.date}>{item.date}</option>
                        )}
                    </select>
                    }
                </label>
                <CanvasJSChart options={options}/>
            </div>
        );
    }
}

export default Charts;