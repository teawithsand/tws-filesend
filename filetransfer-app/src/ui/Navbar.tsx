import React from "react"
import { Container, Nav, Navbar as BSNavbar } from "react-bootstrap"

export const Navbar = () => {
    return <BSNavbar expand="lg" className="bg-body-tertiary mb-3">
        <Container>
            <BSNavbar.Brand href="/">tws-filetool app</BSNavbar.Brand>
            <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
            <BSNavbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/send">Send</Nav.Link>
                    <Nav.Link href="/receive">Receive</Nav.Link>
                </Nav>
            </BSNavbar.Collapse>
        </Container>
    </BSNavbar>
}