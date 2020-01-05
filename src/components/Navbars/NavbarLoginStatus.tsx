import React from 'react'
import { Link } from 'react-router-dom'
import { NavItem, Button } from 'reactstrap'
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
    this.setState({ modalOpen: !this.state.modalOpen })
  }

  public render() {
    return (
      <AuthContext.Consumer>
        {(props: { currentUser: { photoURL: string | undefined } }) => {
          if (props.currentUser) {
            return (
              <NavItem>
                <img
                  className="img-fluid rounded-circle shadow-lg profile-pic"
                  src={props.currentUser.photoURL}
                  // tslint:disable-next-line: jsx-no-lambda
                  onClick={this.toggleModal}
                  alt=""
                />
                <ProfileModal
                  isOpen={this.state.modalOpen}
                  toggleModal={this.toggleModal}
                />
              </NavItem>
            )
          } else {
            return (
              <NavItem>
                <Button
                  tag={Link}
                  to="/login"
                  className="nav-link d-none d-lg-block nav-login btn-round"
                >
                  Sign In
                </Button>
              </NavItem>
            )
          }
        }}
      </AuthContext.Consumer>
    )
  }
}

export default NavbarLoginStatus
