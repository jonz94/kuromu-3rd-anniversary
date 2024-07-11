export function convertARGB2rgbString(argb: number) {
  const argbString = argb.toString(16).padStart(8, '0')

  const [a, r, g, b] = (argbString.substring(0, 8).match(/.{1,2}/g) as [string, string, string, string]).map((hex) =>
    parseInt(hex, 16),
  )

  return `rgb(${r},${g},${b},${(a ?? 0) / 255})`
}
