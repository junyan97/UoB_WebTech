import React from 'react'

class Maincounter extends React.Component{

    constructor(props){
        super(props);
        this.state = {
          mainCounter:props.mainCounter,
        }
      }

    static defaultProps = {
        numCases: "No data",
        numDeath: "No data",
        numRecover: "No data"
    }

    render() {
        return(
            <div>
                <div className = 'tc pa1'>
                    <h1 className = 'f1 pa3'>Coronavirus cases:</h1>
                    <div className = 'f2'>
                        {this.props.mainCounter.numCases}
                    </div>
                </div>
                <div className = 'tc pa1'>
                    <h1 className = 'f1 pa3'>Total Deaths:</h1>
                    <div className = 'f2'>
                        {this.props.mainCounter.numDeath}
                    </div>
                </div>
                <div className = 'tc pa1'>
                    <h1 className = 'f1 pa3'>Recovered:</h1>
                    <div className = 'f2'>
                        {this.props.mainCounter.numRecover}
                    </div>
                </div>
            </div>
        );
    }
}

export default Maincounter;
