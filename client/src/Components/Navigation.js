import React from 'react';
import {Link} from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';

const signOut = (changeRoute) => {
  fetch('/api/user/logout', {
    method: 'get',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': window.localStorage.getItem('token')
    }
  })
  .then(response => response.json())
  .then(response => {
    window.localStorage.clear();
    changeRoute('signin');          
  })  
}

const Navigation = ({changeRoute, }) => {
    return (
      
      <Navbar collapseOnSelect bg="dark" expand="lg" variant="dark">
        <Navbar.Brand as={Link} to="/About">Covid19</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">           
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/" >
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/Countries">
              Countries
            </Nav.Link>
          </Nav>
          <Nav className="auto">
            <Nav.Link as={Link} to = "/updateprofile" className="orange">
              {
                window.localStorage.getItem('firstname')
              }
            </Nav.Link>
            <Nav.Link onClick={()=>signOut(changeRoute)}>
              Sign Out
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
}

export default Navigation;