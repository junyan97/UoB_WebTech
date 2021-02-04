import React from 'react';
import Table from './Components/Table';
import Spinner from './Components/LoadingAnimation'

let countriesArray = [];

class Countries extends React.Component{
    
    constructor() {
        super();
        this.state = {
            tableData:{}
        }
    }

    componentDidMount() {
        this.getTableData()
        .then(() => {
            this.setTableData();
        })
    }

    async getTableData() {
        countriesArray = [];
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
                Object.values(data).forEach((obj) => {
                    if(obj.Date === "4/12/20"){
                        let tempArr = [];
                        tempArr.push(obj.Country, obj.Confirmed, obj.Deaths, obj.Recovered);
                        countriesArray.push(tempArr);             
                    }
                });
                res();
            })
        })
        await promise;
    }

    setTableData() {
        this.setState({
            tableData:{
                columns: ["Country", "Confirmed", "Death", "Recovered"],
                data: countriesArray,
                options: {
                    rowsPerPage: 10,
                    filterType: "dropdown",
                    responsive: "scrollFullHeightFullWidth",
                    searchOpen: false
                }
            }
        })
    }

    render() {
        if(!this.state.tableData.data){
            return (
                <div className = 'tc '>
                    <h1>Loading...</h1>
                    <Spinner />      
                </div>
            )
        }else{
            return(
                <div className= "mw6-ns center pa5 ph4-ns">
                    <Table tableData={this.state.tableData}/>
                </div>
            )
        } 
    }
}

export default Countries