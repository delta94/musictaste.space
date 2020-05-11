import React from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
import Navbar from '../Navbars/Navbar'

const About = (props: any) => {
  const history = useHistory()

  const handleBackToDashboard = (e: any) => {
    history.push('/dashboard')
  }
  const handleMatchClick = (e: any) => {
    history.push('/match?request=kalana')
  }
  return (
    <>
      <Navbar />
      <Helmet>
        <title>About - musictaste.space</title>
      </Helmet>
      <div className="about">
        <div className="container text-box">
          <p>
            <h2>
              <span>About</span>
            </h2>
            <span>
              <strong>musictaste.space</strong> is a web app created by{' '}
              <a href="https://kalana.io">Kalana Vithana</a> (that's me, hi
              there!) which helps users gain insights into their Spotify
              listening habits and compare their music taste with friends.
              I&rsquo;ve always found a person&rsquo;s music taste to be a great
              indicator of the kind of person they are, so when I kept running
              into the same question when meeting new people of: &ldquo;So what
              kind of music do you listen to?&rdquo;, I knew there must be an
              easier (and more fun) way to see which aspects of your music taste
              you had in common. So, as Summer project in early 2020, I created{' '}
              <strong>musictaste.space</strong>.
            </span>
          </p>
          <p>
            <span>
              After importing your Spotify data, you're able to see your top
              artists, tracks and genres as part of your insights. With your
              code and URL, you&rsquo;re can match with friends (or even
              anonymously by sharing your anon code with strangers) to get a
              score on how compatible you are, as well as a breakdown on which
              artists and songs you have a common interest in.
            </span>
          </p>
          <p>
            <span>
              If you run into bugs, have any feature requests or just want to
              chat about music, feel free to reach out to me on{' '}
              <a href="https://www.twitter.com/_kalpal">my Twitter</a>.
            </span>
          </p>
          <p style={{ textAlign: 'center' }}>
            <strong>
              The musictaste Discord bot is now in beta! Click{' '}
              <Link to="/discord">here</Link> to link your account or invite the
              bot to your channel.
            </strong>
          </p>
          <p>
            <span>
              If you&rsquo;d like to match with me and compare our tastes...
            </span>
          </p>
          <div className="button-div">
            <Button
              className="btn-round sign-in-button"
              size="md"
              onClick={handleMatchClick}
            >
              Match With Me
            </Button>
          </div>
          <h2>
            <span>Algorithm</span>
          </h2>
          <p>
            <span>
              The match algorithm first analyses all your top tracks (in the
              short, medium and long term) for the genres which each
              corresponding artist falls into. Each artist can be classified
              into multiple genres by Spotify, so the algorithm sorts genres
              with heavier preference for matches in nicher categories, such as
              &ldquo;indietronica&rdquo; over broad ones such as
              &ldquo;pop&rdquo;.&nbsp; It then looks at which top artists you
              have in common, along with your top tracks.
            </span>
          </p>
          <p>
            <span>
              Your compatibility in terms of your genres and top artists are
              weighted significantly higher than matches in your top tracks,
              which I think makes sense. Even though you might not listen to the
              exact same songs, if you have a preference to the same genres
              (especially those of niches), it&rsquo;s probably a stronger
              indicator of you two having a good musical compatibility.&nbsp;
            </span>
          </p>
          <p>
            <span>
              Playlist generation uses a similar thought process. It puts all of
              the tracks you have in common into a bucket, and then looks at
              your matched artists and goes through both of your top track
              libraries to see if there are other tracks by those artists. After
              this, it attempts to extract niche genres which you both had in
              common, and does a second pass through both of your top track
              libraries to see if any tracks fall into those niche categories.
              The end result is (hopefully) a playlist which contains songs
              which both of you already love, in combination with tracks that
              lie in either one of your top track libraries which the other
              might also end up enjoying.
            </span>
          </p>
          <h2>
            <span>Privacy & Your Data&nbsp;</span>
          </h2>
          <p>
            <span>
              Your account data (display name, profile image and Spotify
              username) as well as your music data are stored securely on{' '}
              <a href="https://firebase.google.com/products/firestore/">
                Firebase
              </a>
              . By matching with a user, you agree to share identifiable account
              data with them, such as your display name and profile photo, in
              order for your match partner to identify a match as from you. Your
              data may also be used for general statistical analysis or
              demographic comparisons (ie. How many people have Taylor Swift in
              their Top 10 artists? Do more females like her than males?). If
              you'd like your data deleted, please message me on{' '}
              <a href="https://www.twitter.com/_kalpal">Twitter</a>.
            </span>
          </p>
          <h2>
            <span>Technology&nbsp;</span>
          </h2>
          <p>
            <span>
              <strong>musictaste.space</strong> is built with React (
              <a href="https://create-react-app.dev/">create-react-app</a>),
              with a serverless stack powered by{' '}
              <a href="https://firebase.google.com/products/firestore/">
                Firebase Firestore
              </a>{' '}
              and{' '}
              <a href="https://firebase.google.com/products/functions/">
                Firebase Cloud Functions
              </a>
              . The Firestore is being used both as a database and as state
              management using document subscriptions, with Cloud Functions
              assisting in more complicated functionality, such as OAuth2
              authorisation with the{' '}
              <a href="https://developer.spotify.com/documentation/web-api/">
                Spotify API
              </a>
              , as well as facilitating user-to-user matching and playlist
              creation. Files are hosted statically using{' '}
              <a href="https://firebase.google.com/products/hosting/">
                Firebase Hosting
              </a>
              .
            </span>
          </p>
        </div>
        <div className="about-logo">
          <img
            alt="musictaste.space logo"
            className="img-fluid"
            src={'/logo-sml.png'}
          />
        </div>
        <div className="button-div">
          <Button
            className="btn-round sign-in-button"
            size="md"
            onClick={handleBackToDashboard}
          >
            Back To Dashboard
          </Button>
        </div>
      </div>
      <div className="container mb-3">
        <hr />
        Made with ❤️ in Melbourne, Australia.
      </div>
    </>
  )
}

export default About

//        <div className="coming-soon">
//         <div className="description">
//           I'll write this eventually.
//           <br />
//           <span className="follow">
//             Follow updates on my{' '}
//             <a
//               href="https://twitter.com/_kalpal"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="underline"
//             >
//               Twitter!
//             </a>
//           </span>
//         </div>
