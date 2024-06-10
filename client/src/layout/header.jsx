import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import Rute from '../router/index'
import { Link, useLocation } from 'react-router-dom'

function Header(children) {
    const location = useLocation();
    const activeCheck = (path) => {return location.pathname === path ? {color: 'white'} : {color: 'grey'}};
    const projectName = process.env.REACT_APP_PROJECT_NAME;
    return (
        <>
            <Navbar expand="lg" className="bg-dark" variant="dark">
                <Container>
                    <Navbar.Brand href="/">{projectName}</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id="navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/" style={activeCheck('/')}>Home</Nav.Link>
                            <Nav.Link as={Link} to="/admin" style={activeCheck('/admin')}>Admin</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container>
                <Rute>
                    {children}
                </Rute>
            </Container>
        </>
    );
}

export default Header
