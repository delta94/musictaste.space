import React, { useEffect, useState } from 'react'
import GoogleAnalytics from 'react-ga'
import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'
import firebase from '../../util/Firebase'

const EnterCode = ({ userData }: { userData: IUserProfile }) => {
  const history = useHistory()
  const [code, setCode] = useState('')
  const [exists, setExists] = useState(true)
  const [backgroundColor, setBackgroundColor] = useState('#dff9fb')
  const [fails, setFails] = useState(0)
  const { addToast } = useToasts()

  const changeCode = (e: any) => {
    const val = (e.target.value as string)
      .replace(' ', '-')
      .replace(/[^\w-]+/g, '')
      .toLowerCase()
    setCode(val)
  }

  useEffect(() => {
    if (!exists) {
      setBackgroundColor('#ff7979')
    }
  }, [exists])
  useEffect(() => {
    if (!exists) {
      if (fails < 5) {
        setExists(true)
        setBackgroundColor('#dff9fb')
      }
    }
  }, [code, exists, fails])

  const validateCode = async (code: string) => {
    if (code !== userData.matchCode && code !== userData.anonMatchCode) {
      const d = await firebase.app
        .firestore()
        .collection('users-lookup')
        .doc(code)
        .get()
      if (d.exists) {
        GoogleAnalytics.event({
          category: 'Interaction',
          label: 'Match',
          action: 'Code entered from Compatibility page',
        })
        history.push('/match?request=' + code)
      } else {
        setExists(false)
        setFails(fails + 1)
        addToast('Invalid match code 😓', {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    } else {
      addToast('Invalid match code 😓', {
        appearance: 'error',
        autoDismiss: true,
      })
      setExists(false)
      setFails(fails + 1)
    }
  }
  const checkEnterKey = (e: any) => {
    if (e.key === 'Enter') {
      validateCode(code)
    }
  }
  const onSubmitCode = (e: any) => {
    if (exists) {
      validateCode(code)
    }
  }
  return (
    <div className="enter-code" style={{ backgroundColor }}>
      <InputGroup className="code-container" style={{ backgroundColor }}>
        <Input
          type="text"
          className="code input-border"
          placeholder="Enter a code..."
          value={code}
          onChange={changeCode}
          onKeyDown={checkEnterKey}
        />
      </InputGroup>
      <InputGroupAddon addonType="append">
        <InputGroupText className="input-border input-group-append">
          <i
            className="fas fa-chevron-right arrow submit-arrow"
            onClick={onSubmitCode}
          />
        </InputGroupText>
      </InputGroupAddon>
    </div>
  )
}

export default EnterCode
