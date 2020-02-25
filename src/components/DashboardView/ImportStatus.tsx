import React from 'react'
import { Dot } from '../Aux/Dot'

interface IStatus {
  exists: boolean
  lastImport?: Date
  status: {
    topTracks: boolean
    topTracksLT: boolean
    topTracksMT: boolean
    topTracksST: boolean
    topArtists: boolean
    relatedArtists: boolean
    genres: boolean
    specialSauce: boolean
  }
}

const ImportStatus = (props: any) => {
  const i = props.importStatus as IStatus
  if (i.status.genres) {
    return (
      <div className="import-status">
        Adding special sauce<Dot>.</Dot>
        <Dot>.</Dot>
        <Dot>.</Dot>
      </div>
    )
  }
  if (i.status.relatedArtists) {
    return (
      <div className="import-status">
        Figuring out your top genres<Dot>.</Dot>
        <Dot>.</Dot>
        <Dot>.</Dot>
      </div>
    )
  }
  // if (i.status.topArtists) {
  //   return (
  //     <div className="import-status">
  //       Getting related artists<Dot>.</Dot>
  //       <Dot>.</Dot>
  //       <Dot>.</Dot>
  //     </div>
  //   )
  // }
  if (i.status.topTracks) {
    return (
      <div className="import-status">
        Calculating your favourite artists<Dot>.</Dot>
        <Dot>.</Dot>
        <Dot>.</Dot>
      </div>
    )
  }
  if (i.status.topTracksMT) {
    return (
      <div className="import-status">
        Going through your newly discovered<Dot>.</Dot>
        <Dot>.</Dot>
        <Dot>.</Dot>
      </div>
    )
  }
  if (i.status.topTracksLT) {
    return (
      <div className="import-status">
        Searching for your guilty pleasures<Dot>.</Dot>
        <Dot>.</Dot>
        <Dot>.</Dot>
      </div>
    )
  } else {
    return (
      <div className="import-status">
        Getting all time favourites<Dot>.</Dot>
        <Dot>.</Dot>
        <Dot>.</Dot>
      </div>
    )
  }
}

export default ImportStatus
