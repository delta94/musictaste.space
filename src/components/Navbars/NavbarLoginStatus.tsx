import { motion } from 'framer-motion'
import React from 'react'
import GoogleAnalytics from 'react-ga'
import { Button, NavItem } from 'reactstrap'
import { AuthContext } from '../../contexts/Auth'
import ProfileModal from './ProfileModal'

class NavbarLoginStatus extends React.Component<{}, { modalOpen: boolean }> {
  constructor(props: Readonly<{}>) {
    super(props)
    this.state = {
      modalOpen: false,
    }
  }

  public toggleModal = () => {
    if (!this.state.modalOpen) {
      GoogleAnalytics.event({
        category: 'Interaction',
        label: 'Modal',
        action: 'User profile modal opened',
      })
    }
    this.setState({ modalOpen: !this.state.modalOpen })
  }
  public handleClickLogin(e: any) {
    GoogleAnalytics.event({
      category: 'Account',
      action: 'Logged In From Navbar',
      label: 'Navbar Log In',
    })
    e.stopPropagation()
    window.open('/login', '_blank', 'height=585,width=500')
  }
  public render() {
    return (
      <AuthContext.Consumer>
        {(props: { currentUser: null | firebase.User }) => {
          return (
            <motion.div animate={true}>
              {props.currentUser ? (
                <NavItem>
                  <div
                    className="profile-pic-div shadow-lg img-fluid"
                    style={{
                      backgroundImage: `url(${props.currentUser.photoURL})`,
                    }}
                    onClick={this.toggleModal}
                  />
                  <ProfileModal
                    isOpen={this.state.modalOpen}
                    toggleModal={this.toggleModal}
                  />
                </NavItem>
              ) : (
                <NavItem>
                  <Button
                    onClick={this.handleClickLogin}
                    className="nav-link d-lg-block nav-login btn-round"
                  >
                    Sign In
                  </Button>
                </NavItem>
              )}
            </motion.div>
          )
        }}
      </AuthContext.Consumer>
    )
  }
}

export default NavbarLoginStatus
