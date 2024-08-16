export const downloadFile = (blob: Blob | MediaSource, filename: string) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  URL.revokeObjectURL(url)
  document.body.removeChild(link)
}
