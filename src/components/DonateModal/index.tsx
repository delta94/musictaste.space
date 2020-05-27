import React from 'react'
import GoogleAnalytics from 'react-ga'
import { Button, Modal } from 'reactstrap'

interface DonateModalProps {
  isOpen: boolean
  toggleModal: () => void
}
const DonateModal = (props: DonateModalProps) => {
  return (
    <Modal
      modalClassName="modal-mini modal-primary donate-modal"
      isOpen={props.isOpen}
      toggle={props.toggleModal}
    >
      <div className="modal-header justify-content-center">
        <button className="close" onClick={props.toggleModal}>
          <i className="tim-icons icon-simple-remove text-white" />
        </button>
      </div>
      <div
        className="modal-img-div shadow-md ml-3"
        style={{
          backgroundImage: `url(https://kalana.io/wp-content/uploads/2020/05/ScreenShot2020-05-28at1.27.08am.png)`,
        }}
      />
      <div className="modal-body mt-2">
        <p>
          <strong>Hiya! Had any great matches yet?</strong>
        </p>
        <p>
          I hope you're enjoying using the site and have found some cool
          similarities with pals you previously didn't know about, and maybe
          discovered a little bit more about your own tastes as well. Perhaps
          even... found a musically compatible soulmate?{' '}
          <span role="img" aria-label="love hearts">
            💞
          </span>
        </p>
        <p>
          musictaste.space started off as a fun little summer project and has
          now exploded into crunching over 50 thousand matches a day! With this
          recent burst in love, costs have also skyrocketed.{' '}
          <span role="img" aria-label="rocket">
            🚀
          </span>
        </p>
        <p>
          musictaste.space runs no ads and doesn't sell your data, so it's left
          to our amazing and generous community of users for keeping it alive -
          people like yourself{' '}
          <span role="img" aria-label="hands in the air">
            🙌
          </span>
          ! Without them, the website would shut down in a matter of days. If
          you can spare a few dollarydoos to help keep the lights on, please
          consider donating! If not, that's cool too!
        </p>
        <p>
          Stay safe, and happy comparing{' '}
          <span role="img" aria-label="love hearts">
            ❤️
          </span>
          !
        </p>
        <p className="mt-3">
          <a href="https://twitter.com/_kalpal" className="cool-link">
            @_kalpal
          </a>
        </p>
      </div>
      <div className="modal-footer">
        <Button
          className="btn-neutral"
          color="link"
          type="button"
          // tslint:disable-next-line: jsx-no-lambda
          onClick={() => {
            GoogleAnalytics.event({
              category: 'Donation',
              action: 'CTA Donation Click',
              label: 'Clicked Ko-fi link from donation CTA modal',
            })
            window.open('https://ko-fi.com/kalpal', 'name')
          }}
        >
          Donate
        </Button>
        <Button
          className="btn-neutral"
          color="link"
          onClick={props.toggleModal}
          type="button"
        >
          Close
        </Button>
      </div>
    </Modal>
  )
}

export default DonateModal
