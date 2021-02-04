import React from 'react';
import { Line } from 'react-chartjs-2';

class Linechart extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          chartData:props.chartData,
        }
      }

    static defaultProps = {
        displayTitle:false,
        displayLegend: true,
        legendPosition:'bottom',
    }  

    render() {
        return(
            <Line
                data = {this.state.chartData}
                height = {250}
                options = {{
                    responsive: true,
                    maintainAspectRatio:true,
                    title:{
                        display:this.props.displayTitle,
                    },
                    legend:{
                        display:this.props.displayLegend,
                        position:this.props.legendPosition
                    },
                    scales: {
                        xAxes: [{
                            scaleLabel: {
                                display: false,
                                labelString: 'Time'
                            },
                            gridLines: {
                                drawOnChartArea: false
                            },
                            ticks: {
                                maxTicksLimit:5

                            }
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Cases'
                            },
                            gridLines: {
                                drawOnChartArea: false
                            },
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 10,
                                beginAtZero: true
                            }
                        }]
                    }
                }}
            />
        );
    }
}

export default Linechart;