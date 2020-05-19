import React from 'react'
import { Link } from 'react-router-dom'
// reactstrap components
import {
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from 'reactstrap'
import NavbarLoginStatus from './NavbarLoginStatus'

class PagesNavbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collapseOpen: false,
      color: 'navbar-transparent',
    }
  }
  componentDidMount() {
    window.addEventListener('scroll', this.changeColor)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.changeColor)
  }
  changeColor = () => {
    if (
      document.documentElement.scrollTop > 69 ||
      document.body.scrollTop > 69
    ) {
      this.setState({
        color: 'bg-info',
      })
    } else if (
      document.documentElement.scrollTop < 70 ||
      document.body.scrollTop < 70
    ) {
      this.setState({
        color: 'navbar-transparent',
      })
    }
  }
  toggleCollapse = () => {
    document.documentElement.classList.toggle('nav-open')
    this.setState({
      collapseOpen: !this.state.collapseOpen,
    })
  }
  onCollapseExiting = () => {
    this.setState({
      collapseOut: 'collapsing-out',
    })
  }
  onCollapseExited = () => {
    this.setState({
      collapseOut: '',
    })
  }
  render() {
    return (
      <Navbar
        className={'fixed-top ' + this.state.color}
        color-on-scroll="100"
        expand="lg"
      >
        <Container>
          <div className="navbar-translate">
            <NavbarBrand
              data-placement="bottom"
              to="/"
              rel="noopener noreferrer"
              title="Designed and Coded by @_kalpal"
              tag={Link}
            >
              <span>musictaste.space</span>
              {/* <span>musictaste.space •</span> by @_kalpal */}
            </NavbarBrand>
            <button
              aria-expanded={this.state.collapseOpen}
              className="navbar-toggler navbar-toggler"
              onClick={this.toggleCollapse}
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>
          <Collapse
            className={'justify-content-end ' + this.state.collapseOut}
            navbar
            isOpen={this.state.collapseOpen}
            onExiting={this.onCollapseExiting}
            onExited={this.onCollapseExited}
          >
            <div className="navbar-collapse-header">
              <Row>
                <Col className="collapse-brand" xs="6">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <div
                      role="img"
                      className="nav-logo"
                      style={{
                        backgroundImage: 'url(/logo-sml.png)',
                      }}
                      aria-label="coolboy"
                    />
                    {/* 👨‍🎤
                    </span> */}
                  </a>
                </Col>
                <Col className="collapse-close text-right" xs="6">
                  <button
                    aria-expanded={this.state.collapseOpen}
                    className="navbar-toggler"
                    onClick={this.toggleCollapse}
                  >
                    <i className="tim-icons icon-simple-remove" />
                  </button>
                </Col>
              </Row>
            </div>
            <Nav navbar>
              {/* <NavItem className="p-0">
                <NavLink
                  data-placement="bottom"
                  href="https://twitter.com/CreativeTim"
                  rel="noopener noreferrer"
                  target="_blank"
                  title="Follow us on Twitter"
                >
                  <i className="fab fa-twitter" />
                  <p className="d-lg-none d-xl-none">Twitter</p>
                </NavLink>
              </NavItem>
              <NavItem className="p-0">
                <NavLink
                  data-placement="bottom"
                  href="https://www.facebook.com/CreativeTim"
                  rel="noopener noreferrer"
                  target="_blank"
                  title="Like us on Facebook"
                >
                  <i className="fab fa-facebook-square" />
                  <p className="d-lg-none d-xl-none">Facebook</p>
                </NavLink>
              </NavItem>
              <NavItem className="p-0">
                <NavLink
                  data-placement="bottom"
                  href="https://www.instagram.com/CreativeTimOfficial"
                  rel="noopener noreferrer"
                  target="_blank"
                  title="Follow us on Instagram"
                >
                  <i className="fab fa-instagram" />
                  <p className="d-lg-none d-xl-none">Instagram</p>
                </NavLink>
              </NavItem> */}
              <NavItem>
                <NavLink tag={Link} to="/about">
                  About
                </NavLink>
              </NavItem>
              {/* <NavItem>
                <NavLink tag={Link} to="/tally">
                  Tally
                </NavLink>
              </NavItem> */}
              {/* <NavItem>
                <NavLink tag={Link} to="/discord">
                  Discord
                </NavLink>
              </NavItem> */}
              <NavItem>
                <NavLink tag={Link} to="/compatibility">
                  Compatibility
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/insights">
                  Insights
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/dashboard">
                  Dashboard
                </NavLink>
              </NavItem>

              <NavbarLoginStatus />
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    )
  }
}

export default PagesNavbar
