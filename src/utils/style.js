const needUnit = ['fontSize', 'width', 'height', 'top', 'left', 'borderWidth', 'letterSpacing', 'borderRadius']

const filterKeys = ['width, height', 'scale']
export function getCanvasStyle(canvasStyleData) {
  const result = {}
  Object.keys(canvasStyleData)
    .filter((key) => !filterKeys.includes(key))
    .forEach((key) => {
      result[key] = canvasStyleData[key]
      if (key === 'fontSize') {
        result[key] += 'px'
      }
    })

  return result
}

export function getStyle(style, filter = []) {
  const result = {}
  Object.keys(style).forEach((key) => {
    if (!filter.includes(key)) {
      if (key != 'rotate') {
        if (style[key] !== '') {
          result[key] = style[key]

          if (needUnit.includes(key)) {
            result[key] += 'px'
          }
        }
      } else {
        result.transform = `rotate(${style[key]}deg)`
      }
    }
  })

  return result
}

export function getShapeStyle(style) {
  const result = {}
  ;['width', 'height', 'top', 'left', 'rotate'].forEach((attr) => {
    if (attr != 'rotate') {
      result[attr] = style[attr] + 'px'
    } else {
      result.transform = `rotate(${style[attr]}deg)`
    }
  })

  return result
}
