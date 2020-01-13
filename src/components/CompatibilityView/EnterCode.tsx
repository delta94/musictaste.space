import React, { useEffect, useState } from 'react'
import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'
import firebase from '../Firebase'

const EnterCode = (
  { history, userData }: { history: any; userData: IUserProfile },
  ...props: any
) => {
  const [code, setCode] = useState('')
  const [exists, setExists] = useState(true)
  const [backgroundColor, setBackgroundColor] = useState('#dff9fb')
  const [fails, setFails] = useState(0)

  const changeCode = (e: any) => {
    const val = (e.target.value as string)
      .replace(' ', '-')
      .replace(/[^\w-]+/g, '')
      .toLowerCase()
    setCode(val)
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
  }, [code])

  const validateCode = async (code: string) => {
    if (code !== userData.matchCode && code !== userData.anonMatchCode) {
      const d = await firebase.app
        .firestore()
        .collection('users-lookup')
        .doc(code)
        .get()
      if (d.exists) {
        history.push('/match?request=' + code)
      } else {
        setExists(false)
        setFails(fails + 1)
      }
    } else {
      setExists(false)
      setFails(fails + 1)
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
