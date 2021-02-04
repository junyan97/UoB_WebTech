import React from 'react';
import Maincounter from './Maincounter';
import Linechart from './Components/Linechart';
import Spinner from './Components/LoadingAnimation';

let dateArray = [];
let deathArray = [];
let confirmedArray = [];
let recoveredArray = [];

  class Mainpage extends React.Component{

    constructor() {
        super ();
        this.state = {
            mainCounter:{},     
            chartCasesData:{},
            chartDeathData:{},
            chartRecoveredData: {},
        }
    }

    componentDidMount() {
        this.getRawData()
        .then(() => {
            this.setFetchedData();
        }) 
    }

    async getRawData() {
        dateArray = [];
        deathArray = [];
        confirmedArray = [];
        recoveredArray = [];
        let promise = new Promise((res, rej) => {
            fetch('/api/stat/getallcountries', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': window.localStorage.getItem('token')
                }
            })
            .then(response => response.json())
            .then(function(data){
                if (data.error) {
                    this.setState({route: 'signin'});
                }
                let tempdate = "";
                let arrayIndex = -1;
                Object.values(data).forEach((obj) => {
                    if(obj.Date === tempdate){
                        deathArray[arrayIndex] += parseInt(obj.Deaths);
                        confirmedArray[arrayIndex] += parseInt(obj.Confirmed);
                        recoveredArray[arrayIndex] += parseInt(obj.Recovered);
                    }else{
                        tempdate = obj.Date;
                        arrayIndex++;
                        dateArray.push(obj.Date);
                        deathArray.push(parseInt(obj.Deaths));
                        confirmedArray.push(parseInt(obj.Confirmed));
                        recoveredArray.push(parseInt(obj.Recovered));
                    }
                });
                res();
            })
        })
        await promise;
    }

    setFetchedData() {
        this.setState({
            chartCasesData:{
                labels: dateArray,
                datasets: [
                    {
                        borderWidth: 1,
                        pointRadius: 0,
                        data: confirmedArray,
                        label: 'Number of Cases',
                        borderColor: 'rgba(75,192,192,1)',
                        backgroundColor: ['rgba(0, 255, 255, 0.6)'],
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    }
                ]
            },
            chartDeathData:{
                labels: dateArray,
                datasets: [
                    {
                        borderWidth: 1,
                        pointRadius: 0,
                        data: deathArray,
                        label: 'Number of Deaths',
                        borderColor: 'rgba(75,192,192,1)',
                        backgroundColor: ['rgba(0, 255, 128, 0.6)'],
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    }
                ] 
            },
            chartRecoveredData:{
                labels: dateArray,
                datasets: [
                    {         
                        borderWidth: 1,
                        pointRadius: 0,
                        data: recoveredArray,
                        label: 'Number of Recovered',
                        borderColor: 'rgba(75,192,192,1)',
                        backgroundColor: ['rgba(255, 128, 0, 0.6)'],
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    }
                ] 
            },
            mainCounter:{
                numCases: confirmedArray[confirmedArray.length - 1],
                numDeath: deathArray[deathArray.length - 1],
                numRecover: recoveredArray[recoveredArray.length - 1]
            }
        })
    }


    render() {
        if(!this.state.chartCasesData.labels){
            return (
                <div className = 'tc '>
                    <h1>Loading...</h1>
                    <Spinner />      
                </div>
            )
        }else{
            return(
                <div>          
                    <div>
                    <Maincounter mainCounter={this.state.mainCounter}/>
                        <div className = 'tc'>
                            <div className = 'dib br3 pa5 ma2 bw2 shadow-5' >
                                <h3>Number of Cases</h3>
                                <Linechart chartData = {this.state.chartCasesData}/>
                            </div>
                            <div className = 'dib br3 pa5 ma2 bw2 shadow-5' >
                                <h3>Number of Death</h3>
                                <Linechart chartData = {this.state.chartDeathData}/>
                            </div>
                            <div className = 'dib br3 pa5 ma2 bw2 shadow-5' >
                                <h3>Number of Recovered</h3>
                                <Linechart chartData = {this.state.chartRecoveredData}/>
                            </div>  
                        </div>
                    </div>   
                </div>
            );
        }
    }     
  }

  export default Mainpage;