// Genera un mosaico de ruido de 256px y lo expone como --grano-url (sin archivo de imagen)
export function crearGrano() {
  const lado = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = lado
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const datos = ctx.createImageData(lado, lado)
  for (let i = 0; i < datos.data.length; i += 4) {
    const v = Math.random() * 255
    datos.data[i] = datos.data[i + 1] = datos.data[i + 2] = v
    datos.data[i + 3] = 255
  }
  ctx.putImageData(datos, 0, 0)
  document.documentElement.style.setProperty('--grano-url', `url(${canvas.toDataURL('image/png')})`)
}
