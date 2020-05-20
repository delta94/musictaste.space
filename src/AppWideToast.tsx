import React, { useEffect } from 'react'

import { useToasts } from 'react-toast-notifications'
import firebase from './util/Firebase'

export const AppWideToast = ({ children }: { children: React.ReactNode }) => {
  const { addToast } = useToasts()

  useEffect(() => {
    firebase.app
      .firestore()
      .collection('app')
      .doc('alert')
      .get()
      .then((d) => {
        if (d.exists) {
          const data = d.data()
          if (data?.display) {
            addToast(
              <span>
                {data.message}
                {data.twitter ? (
                  <span>
                    {' '}
                    Follow updates on my{' '}
                    <a
                      className="cool-link"
                      href="https://www.twitter.com/_kalpal"
                    >
                      Twitter
                    </a>
                    .
                  </span>
                ) : null}
              </span>,
              {
                appearance: data.appearance,
                autoDismiss: data.autoDismiss,
                // @ts-ignore
                autoDismissTimeout: data.autoDismissTimeout,
              }
            )
          }
        }
      })
  }, [addToast])
  return <>{children}</>
}

export default AppWideToast
