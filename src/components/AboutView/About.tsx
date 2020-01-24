import React from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'
import Navbar from '../Navbars/Navbar'
import { Button } from 'reactstrap'

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
              <a href="https://kalana.io">Kalana Vithana</a> (that&rsquo;s me!)
              utilising the Spotify API to allow you to gain insights into your
              listening habits and compare your music taste with friends.
              I&rsquo;ve always loved my music and consider it a big influencer
              to my personality, so when I kept running into the same question
              of: &ldquo;So what kind of music do you listen to?&rdquo;, I knew
              there must be an easier (and more fun) way to see which tracks,
              artists and genres you had in common. So that&rsquo;s when I
              created <strong>musictaste.space</strong> as a summer project in
              early 2020.
            </span>
          </p>
          <p>
            <span>
              Once you log in, you&rsquo;ll be prompted to import your Spotify
              data (which you can do once a week!), and after it&rsquo;s done
              analysing it, you&rsquo;ll be able to see your top artists, tracks
              and genres as part of your insights. With your code and URL,
              you&rsquo;re able to match with friends (or even anonymously with
              strangers) to get a score on how compatible you are, as well as a
              breakdown on the specifics of what you had in common.
            </span>
          </p>
          <p>
            <span>
              If you run into bugs, have any feature requests or just want to
              chat about music, feel free to reach out to me on{' '}
              <a href="https://www.twitter.com/_kalpal">my Twitter</a>.
            </span>
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
              The match score algorithm is not just based on the number of
              tracks and artists you have in common. The algorithm analyses all
              your top tracks for the genres which each artist falls into, as
              well as importing related artists to those in your top 50. Each
              artist can be classified into multiple genres by Spotify, so the
              algorithm sorts genres with heavier preference for matches in
              nicher categories, such as &ldquo;indietronica&rdquo; over broad
              ones such as &ldquo;pop&rdquo;.&nbsp;
            </span>
          </p>
          <p>
            <span>
              Your compatibility in terms of your genres and top artists are
              weighted significantly higher than matches in your top tracks,
              which I think makes sense. Even though you might not listen to the
              exact same songs, if you have a preference to the same genres
              (especially those of niches), it&rsquo;s a greater indicator of
              you two having a good musical compatibility.&nbsp;
            </span>
          </p>
          <p>
            <span>
              The algorithm used for creating a playlist of tracks you have in
              common also uses a similar thought process. It puts all of the
              tracks you had in common into a bucket first, and then looks at
              your matched artists (and the artists of the matched shared
              tracks) and goes through both of your top track libraries to see
              if there are other tracks by those artists which only one of you
              might have discovered. After this, it attempts to extract niche
              categories which you both had in common, and does a second pass
              through both of your top track libraries to see if any tracks fall
              into those niche categories. The end result is (hopefully) a
              playlist which contains songs which both of you already love, in
              combination with tracks that lie in either one of your top track
              libraries which the other might also end up enjoying.
            </span>
          </p>
          <h2>
            <span>Technology&nbsp;</span>
          </h2>
          <p>
            <span>
              <strong>musictaste.space</strong> is built on a React frontend,
              with a serverless stack powered by Firebase Firestore and Firebase
              Cloud Functions. The project&rsquo;s own API really only exists
              because it&rsquo;s difficult to run the comparison algorithm
              client-side when access tokens for both users are required to pull
              in additional Spotify data. The majority of calls for data, and
              even the state management is done using the Firestore. I would
              link my repo here but the code is a bit of a mess right now
              so&hellip; maybe someday.
            </span>
          </p>
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
