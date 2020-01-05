import React, { useContext, useState, useEffect } from 'react'
import firebase from '../Firebase'
import { AuthContext } from '../../contexts/Auth'


export function Me(props) {
    const { currentUser, spotifyToken } = useContext(AuthContext)
    return <div>Hello world.</div>
}