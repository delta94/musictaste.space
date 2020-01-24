import Color from 'color'
import React from 'react'

class Canvas extends React.Component<
  {
    text: string
    image: { url: string; height: number; width: number }
    setPlaylistImage: (url: string) => void
  },
  {}
> {
  public text: string
  public image: { url: string; height: number; width: number }
  public textColor: any | undefined
  public altTextColor: any | undefined
  public altBGColor: any | undefined
  public bgColor: any | undefined
  public gradients: string[][]
  constructor(props: any) {
    super(props)
    this.text = props.text
    this.image = props.image
    this.gradients = [
      ['#ED213A', '#93291E'],
      ['#FDC830', '#F37335'],
      ['#00B4DB', '#0083B0'],
      ['#DA4453', '#89216B'],
      ['#636363', '#a2ab58'],
      ['#ad5389', '#3c1053'],
      ['#a8c0ff', '#3f2b96'],
      ['#333333', '#dd1818'],
      ['#bc4e9c', '#f80759'],
      ['#11998e', '#11998e'],
      ['#FC466B', '#3F5EFB'],
      ['#00b09b', '#96c93d'],
      ['#00F260', '#0575E6'],
      ['#fc4a1a', '#f7b733'],
      ['#22c1c3', '#fdbb2d'],
      ['#ff9966', '#ff5e62'],
      ['#7F00FF', '#7F00FF'],
      ['#642B73', '#C6426E'],
      ['#36D1DC', '#5B86E5'],
      ['#000046', '#1CB5E0'],
      ['#F2994A', '#F2C94C'],
      ['#30E8BF', '#FF8235'],
      ['#FFAFBD', '#ffc3a0'],
    ]
  }

  public componentDidMount() {
    const canvas = this.refs.canvas as any
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = this.image.url
    const ctx = canvas.getContext('2d')
    img.onload = () => {
      ctx.drawImage(
        img,
        0,
        0,
        300,
        (this.image.height * 300) / this.image.width
      ) // Draw image
      // Create gradient, from middle to borders
      const gradient = ctx.createLinearGradient(0, 0, 300, 300)
      // Opaque white in the middle
      const gcols = this.gradients[
        Math.floor(Math.random() * this.gradients.length)
      ]
      const c1 = new Color(gcols[0]).rgb().array()
      const c2 = new Color(gcols[1]).rgb().array()
      gradient.addColorStop(0, `rgba(${c1[0]},${c1[1]},${c1[2]},0.4)`)

      // Transparent white at the borders
      gradient.addColorStop(1, `rgba(${c2[0]},${c2[1]},${c2[2]},0.8)`)

      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 300, 300) // Fill rectangle over image with the gradient
      ctx.font = '600 20px "Poppins", sans-serif'
      ctx.fillStyle = '#ecf0f1'
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillText('musictaste.space ✦', 15, 280)
      this.props.setPlaylistImage(canvas.toDataURL('image/jpeg', 0.9))
    }
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
