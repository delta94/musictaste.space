import React, { useEffect } from 'react'

import { useToasts } from 'react-toast-notifications'
import { getToast } from './util/api'

export const AppWideToast = ({ children }: { children: React.ReactNode }) => {
  const { addToast } = useToasts()

  useEffect(() => {
    getToast().then((data) => {
      if (data?.display) {
        addToast(
          <span>
            {data.message}
            {data.twitter ? (
              <span>
                {' '}
                Follow updates on my{' '}
                <a className="cool-link" href="https://www.twitter.com/_kalpal">
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
    })
  }, [addToast])
  return <>{children}</>
}

export default AppWideToast
