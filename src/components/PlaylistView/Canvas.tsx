import Color from 'color'
import React from 'react'
import { gradients } from '../../util/gradients'

class Canvas extends React.Component<
  {
    text: string
    image: { url: string; height?: number; width?: number }
    setPlaylistImage: (url: string) => void
    covidPlaylist?: boolean
  },
  {}
> {
  public text: string
  public image: { url: string; height?: number; width?: number }
  public textColor: any | undefined
  public altTextColor: any | undefined
  public altBGColor: any | undefined
  public bgColor: any | undefined
  public covidPlaylist: boolean
  constructor(props: any) {
    super(props)
    this.text = props.text
    this.image = props.image
    this.covidPlaylist = props.covidPlaylist
  }

  public componentDidMount() {
    const canvas = this.refs.canvas as any
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = this.image.url
    const ctx = canvas.getContext('2d')
    const loadImage = new Promise((resolve, reject) => {
      img.onload = function () {
        // @ts-ignore
        resolve([this.height as number, this.width as number])
      }
      img.onerror = () => reject()
    })
    // @ts-ignore
    loadImage.then(([height, width]) => {
      ctx.drawImage(img, 0, 0, 300, ((height || 300) * 300) / (width || 300)) // Draw image
      // Create gradient, from middle to borders
      const gradient = ctx.createLinearGradient(0, 0, 300, 300)
      // Opaque white in the middle
      const gcols = gradients[Math.floor(Math.random() * gradients.length)]
      const c1 = new Color(gcols[0]).rgb().array()
      const c2 = new Color(gcols[1]).rgb().array()
      gradient.addColorStop(0, `rgba(${c1[0]},${c1[1]},${c1[2]},0.4)`)

      // Transparent white at the borders
      gradient.addColorStop(1, `rgba(${c2[0]},${c2[1]},${c2[2]},0.8)`)

      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 300, 300) // Fill rectangle over image with the gradient
      if (this.covidPlaylist) {
        ctx.font = '600 30px "Poppins", sans-serif'
        ctx.fillStyle = '#ecf0f1'
        ctx.globalCompositeOperation = 'source-over'
        const start = 220
        ctx.fillText('MY', 15, start)
        ctx.fillText('COVID-19', 15, start + 30)
        ctx.fillText('TUNES', 15, start + 60)
      }
      ctx.font = '600 20px "Poppins", sans-serif'
      ctx.fillStyle = '#ecf0f1'
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillText('musictaste.space ✦', 15, 40)
      this.props.setPlaylistImage(canvas.toDataURL('image/jpeg', 0.9))
    })
  }
  public render() {
    return (
      <div>
        <canvas className="canvas" ref="canvas" width={300} height={300} />
      </div>
    )
  }
}

export default Canvas
