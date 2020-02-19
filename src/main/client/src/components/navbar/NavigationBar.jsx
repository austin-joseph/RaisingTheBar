import React, { Component } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import Logo from "./../../assets/1.png";
import './NavigationBar.scss';

export default class NavigationBar extends Component {
  render() {
    return (
      <Navbar expand="lg" className="navbar-fixed-top custom-navbar">
        <Navbar.Brand href="/">
          <img className="logo" src={Logo} alt="" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Item><Nav.Link href="javascript:history.back()"> Back </Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link href="/"> Home </Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link href="/workshop"> Workshop </Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link href="/creator"> Creation Suite </Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link href="/user/logout"> Logout </Nav.Link></Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}
