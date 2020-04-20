import React, { useContext } from 'react'
import { useHistory } from 'react-router'
import { Button } from 'reactstrap'
import { AuthContext } from '../../contexts/Auth'
import Navbar from '../Navbars/Navbar'
import LinkDiscordButton from './LinkDiscordButton'

const Discord = () => {
  const { currentUser, userData } = useContext(AuthContext)
  const history = useHistory()
  return (
    <>
      <Navbar />
      <div className="discord-page match">
        <div className="discord-container">
          <img
            className="discord-logo"
            src="https://discordapp.com/assets/e4923594e694a21542a489471ecffa50.svg"
          />
          {currentUser ? (
            <div className="profile-images">
              <div className="user1 animated fadeInLeftBig">
                <div
                  className="profile-img-div"
                  style={{ backgroundImage: `url(${userData.photoURL})` }}
                />
              </div>
              <div className="user2 animated fadeInRightBig">
                {userData.discord ? (
                  <div
                    className="profile-img-div"
                    style={{
                      backgroundImage: `url(https://cdn.discordapp.com/avatars/${userData.discord.id}/${userData.discord.avatar}.png)`,
                    }}
                  />
                ) : (
                  <div
                    className="profile-img-div"
                    style={{
                      backgroundImage: `url(https://discordapp.com/assets/f8389ca1a741a115313bede9ac02e2c0.svg)`,
                    }}
                  />
                )}
              </div>
            </div>
          ) : null}
          <div className="description">
            {/* <h2 className="title">Connect Discord</h2> */}
            <p>
              {currentUser
                ? !userData.discord
                  ? 'Link your Discord account to interact with the musictaste.space bot on servers!'
                  : 'You have already linked your Discord account, nice!'
                : 'Compare music tastes with friends on musictaste.space and now on selected Discord servers. You can link your Discord account here once you log in!'}
            </p>
            <LinkDiscordButton />
          </div>
        </div>

        <div className="discord-container discord-bot">
          {/* <div className="description">Invite Discord Bot</div> */}

          <div className="discord-bot-img" />
          <div className="description">
            The Discord Bot is currently in <i>beta</i> and is being tested
            selectively on a few servers. Want to give it a go? Click{' '}
            <a
              className="discord-link"
              href="https://discordapp.com/oauth2/authorize?client_id=699855489487470594&scope=bot"
            >
              here
            </a>{' '}
            to invite the bot to a server you manage. Use '!mt help' to see all
            commands.
            <br /> <br />
            <strong>
              Please keep in mind that some functionality may be unstable and
              availability is not guaranteed.
            </strong>{' '}
            If you spot bugs or have feature request, please reach out to me on{' '}
            <a className="discord-link" href="https://twitter.com/_kalpal">
              Twitter
            </a>
            !
          </div>
        </div>
      </div>
    </>
  )
}

export default Discord
