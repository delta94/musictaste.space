import React, { useEffect, useState } from 'react'

import { useToasts } from 'react-toast-notifications'
import * as serviceWorker from '../serviceWorker'

export const ServiceWorker = React.createContext<{
  updateAvailable: boolean
}>({ updateAvailable: false })

export const ServiceWorkerProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [updateAvailable, setupdateAvailable] = useState<boolean>(false)
  const { addToast } = useToasts()

  //   const a = 1
  const onUpdateReady = (registration: ServiceWorkerRegistration) => {
    const waitingServiceWorker = registration.waiting

    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener('statechange', (event) => {
        // @ts-ignore
        if (event?.target?.state === 'activated') {
          window.location.reload()
        }
      })
      setupdateAvailable(true)
      addToast(
        "🙌 New Update! I'll refresh the page in a few seconds to show you the latest build.",
        {
          appearance: 'success',
          autoDismiss: true,
        }
      )
      setTimeout(
        () => waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' }),
        5000
      )
    }
  }

  const config = { onUpdate: onUpdateReady }

  useEffect(() => {
    serviceWorker.register(config)
  }, [config])

  return (
    <ServiceWorker.Provider
      value={{
        updateAvailable,
      }}
    >
      {children}
    </ServiceWorker.Provider>
  )
}
