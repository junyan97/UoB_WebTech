import './App.css'
import React from 'react';
import About from './About';
import Mainpage from './Mainpage';
import Countries from './Countries';
import PageNotFound from './PageNotFound';
import Particles from 'react-particles-js';
import Navigation from './Components/Navigation';
import Login from './Components/Login';
import Register from './Components/Register';
import Updateprofile from './Components/Updateprofile';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const particlesOptions = {
    particles: {
      number: {
        value: 30,
        density: {
          enable: true,
          value_area: 800
        }
      }
    }
  }

class App extends React.Component {

  constructor() {
      super();
      this.state = {
        route: 'signin'
      }
  }

  changeRoute = (route) => {
    this.setState({route: route});
  }
  

  render() {
      return(
          <Router>
              <div>
                  <Particles className='particles'
                      params={particlesOptions}
                  />
                  {
                    this.state.route === 'home'
                    ?(
                      <React.Fragment>
                        <Navigation changeRoute = {this.changeRoute}/>
                        <Switch>
                          <Route exact path = "/" component = {Mainpage} />
                          <Route exact path = "/About" component = {About} />
                          <Route exact path = "/Countries" component = {Countries} />
                          <Route exact path = "/Updateprofile" render={(props) => <Updateprofile changeRoute = {this.changeRoute} />} />
                          <Route path = "*" component = {PageNotFound} />       
                        </Switch>
                      </React.Fragment>  
                    )   
                    :(
                      this.state.route === 'signin'
                      ?<Login changeRoute = {this.changeRoute} routeState = {this.state.route}/>
                      :(
                        this.state.route === 'register'
                        ?<Register changeRoute = {this.changeRoute}/>
                        :(
                          < Login changeRoute = {this.changeRoute} routeState = {this.state.route}/>
                         )
                       )
                      
                     )
                  }       
              </div>
          </Router>
      )
  }

}

export default App;