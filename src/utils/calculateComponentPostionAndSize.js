import { calculateRotatedPointCoordinate, getCenterPoint } from './translate'

const funcs = {
  lt: calculateLeftTop,
  t: calculateTop,
  rt: calculateRightTop,
  r: calculateRight,
  rb: calculateRightBottom,
  b: calculateBottom,
  lb: calculateLeftBottom,
  l: calculateLeft,
}

function calculateLeftTop(style, curPosition, proportion, needLockProportion, pointInfo) {
  console.log('rotate', style.rotate)
  const { symmetricPoint } = pointInfo
  let newCenterPoint = getCenterPoint(curPosition, symmetricPoint)
  let newTopLeftPoint = calculateRotatedPointCoordinate(curPosition, newCenterPoint, -style.rotate)
  let newBottomRightPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -style.rotate)

  let newWidth = newBottomRightPoint.x - newTopLeftPoint.x
  let newHeight = newBottomRightPoint.y - newTopLeftPoint.y

  if (needLockProportion) {
    // 组件锁定情况处理
  }

  if (newWidth > 0 && newHeight > 0) {
    style.width = Math.round(newWidth)
    style.height = Math.round(newHeight)
    style.left = Math.round(newTopLeftPoint.x)
    style.top = Math.round(newTopLeftPoint.y)
  }
}

function calculateRightTop(style, curPosition, proportion, needLockProportion, pointInfo) {
  const { symmetricPoint } = pointInfo
  let newCenterPoint = getCenterPoint(curPosition, symmetricPoint)
  let newTopRightPoint = calculateRotatedPointCoordinate(curPosition, newCenterPoint, -style.rotate)
  let newBottomLeftPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -style.rotate)

  let newWidth = newTopRightPoint.x - newBottomLeftPoint.x
  let newHeight = newBottomLeftPoint.y - newTopRightPoint.y

  if (needLockProportion) {
    // 组件锁定情况处理
  }

  if (newWidth > 0 && newHeight > 0) {
    style.width = Math.round(newWidth)
    style.height = Math.round(newHeight)
    style.left = Math.round(newBottomLeftPoint.x)
    style.top = Math.round(newTopRightPoint.y)
  }
}

function calculateRightBottom(style, curPosition, proportion, needLockProportion, pointInfo) {
  const { symmetricPoint } = pointInfo
  let newCenterPoint = getCenterPoint(curPosition, symmetricPoint)
  let newTopLeftPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -style.rotate)
  let newBottomRightPoint = calculateRotatedPointCoordinate(curPosition, newCenterPoint, -style.rotate)

  let newWidth = newBottomRightPoint.x - newTopLeftPoint.x
  let newHeight = newBottomRightPoint.y - newTopLeftPoint.y

  if (needLockProportion) {
    // 组件锁定情况处理
  }

  if (newWidth > 0 && newHeight > 0) {
    style.width = Math.round(newWidth)
    style.height = Math.round(newHeight)
    style.left = Math.round(newTopLeftPoint.x)
    style.top = Math.round(newTopLeftPoint.y)
  }
}

function calculateLeftBottom(style, curPosition, proportion, needLockProportion, pointInfo) {
  const { symmetricPoint } = pointInfo
  let newCenterPoint = getCenterPoint(curPosition, symmetricPoint)
  let newTopRightPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -style.rotate)
  let newBottomLeftPoint = calculateRotatedPointCoordinate(curPosition, newCenterPoint, -style.rotate)

  let newWidth = newTopRightPoint.x - newBottomLeftPoint.x
  let newHeight = newBottomLeftPoint.y - newTopRightPoint.y

  if (needLockProportion) {
    // 组件锁定情况处理
  }

  if (newWidth > 0 && newHeight > 0) {
    style.width = Math.round(newWidth)
    style.height = Math.round(newHeight)
    style.left = Math.round(newBottomLeftPoint.x)
    style.top = Math.round(newTopRightPoint.y)
  }
}

function calculateTop(style, curPosition, proportion, needLockProportion, pointInfo) {
  const { symmetricPoint, curPoint } = pointInfo

  // 由于用户拉伸时时以任意角度拉伸的，所以再求得旋转前的坐标时，只取 y 坐标（这里的 x 坐标可能是任意值），x 坐标用 curPoint 的。
  // 这个中心点（第二个参数）用 curPoint、center、symmetricPoint 都可以，只要他们在一条直线上
  const rotatedcurPostion = calculateRotatedPointCoordinate(curPosition, curPoint, -style.rotate)

  // 算出旋转前 y 坐标，再用 curPoint 的 x 坐标，重新计算它们旋转后对应的坐标
  const rotatedTopMiddlePoint = calculateRotatedPointCoordinate(
    {
      x: curPoint.x,
      y: rotatedcurPostion.y,
    },
    curPoint,
    style.rotate
  )

  // 用旋转后的坐标和对称点算出新的高度（勾股定理）
  const newHeight = Math.sqrt(
    (rotatedTopMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedTopMiddlePoint.y - symmetricPoint.y) ** 2
  )

  const newCenter = {
    x: rotatedTopMiddlePoint.x - (rotatedTopMiddlePoint.x - symmetricPoint.x) / 2,
    y: rotatedTopMiddlePoint.y + (symmetricPoint.y - rotatedTopMiddlePoint.y) / 2,
  }

  let width = style.width
  if (needLockProportion) {
    // 组件锁定情况处理
  }

  style.width = width
  style.height = Math.round(newHeight)
  style.top = Math.round(newCenter.y - newHeight / 2)
  style.left = Math.round(newCenter.x - style.width / 2)
}

function calculateRight(style, curPosition, proportion, needLockProportion, pointInfo) {
  const { symmetricPoint, curPoint } = pointInfo
  const rotatedcurPosition = calculateRotatedPointCoordinate(curPosition, curPoint, -style.rotate)
  const rotatedRightMiddlePoint = calculateRotatedPointCoordinate(
    {
      x: rotatedcurPosition.x,
      y: curPoint.y,
    },
    curPoint,
    style.rotate
  )

  const newWidth = Math.sqrt(
    (rotatedRightMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedRightMiddlePoint.y - symmetricPoint.y) ** 2
  )

  const newCenter = {
    x: rotatedRightMiddlePoint.x - (rotatedRightMiddlePoint.x - symmetricPoint.x) / 2,
    y: rotatedRightMiddlePoint.y + (symmetricPoint.y - rotatedRightMiddlePoint.y) / 2,
  }

  let height = style.height
  // 因为调整的是宽度 所以只需根据锁定的比例调整高度即可
  if (needLockProportion) {
    // 组件锁定情况处理
  }

  style.height = height
  style.width = Math.round(newWidth)
  style.top = Math.round(newCenter.y - style.height / 2)
  style.left = Math.round(newCenter.x - newWidth / 2)
}

function calculateBottom(style, curPositon, proportion, needLockProportion, pointInfo) {
  const { symmetricPoint, curPoint } = pointInfo
  const rotatedcurPositon = calculateRotatedPointCoordinate(curPositon, curPoint, -style.rotate)
  const rotatedBottomMiddlePoint = calculateRotatedPointCoordinate(
    {
      x: curPoint.x,
      y: rotatedcurPositon.y,
    },
    curPoint,
    style.rotate
  )

  const newHeight = Math.sqrt(
    (rotatedBottomMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedBottomMiddlePoint.y - symmetricPoint.y) ** 2
  )

  const newCenter = {
    x: rotatedBottomMiddlePoint.x - (rotatedBottomMiddlePoint.x - symmetricPoint.x) / 2,
    y: rotatedBottomMiddlePoint.y + (symmetricPoint.y - rotatedBottomMiddlePoint.y) / 2,
  }

  let width = style.width
  // 因为调整的是高度 所以只需根据锁定的比例调整宽度即可
  if (needLockProportion) {
    // 组件锁定情况
  }

  style.width = width
  style.height = Math.round(newHeight)
  style.top = Math.round(newCenter.y - newHeight / 2)
  style.left = Math.round(newCenter.x - style.width / 2)
}

function calculateLeft(style, curPositon, proportion, needLockProportion, pointInfo) {
  const { symmetricPoint, curPoint } = pointInfo
  const rotatedcurPositon = calculateRotatedPointCoordinate(curPositon, curPoint, -style.rotate)
  const rotatedLeftMiddlePoint = calculateRotatedPointCoordinate(
    {
      x: rotatedcurPositon.x,
      y: curPoint.y,
    },
    curPoint,
    style.rotate
  )

  const newWidth = Math.sqrt(
    (rotatedLeftMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedLeftMiddlePoint.y - symmetricPoint.y) ** 2
  )

  const newCenter = {
    x: rotatedLeftMiddlePoint.x - (rotatedLeftMiddlePoint.x - symmetricPoint.x) / 2,
    y: rotatedLeftMiddlePoint.y + (symmetricPoint.y - rotatedLeftMiddlePoint.y) / 2,
  }

  let height = style.height
  if (needLockProportion) {
    // 组件锁定情况处理
  }

  style.height = height
  style.width = Math.round(newWidth)
  style.top = Math.round(newCenter.y - style.height / 2)
  style.left = Math.round(newCenter.x - newWidth / 2)
}

export default function calculateComponentPostionAndSize(
  name,
  style,
  curPosition,
  proportion,
  needLockProportion = false,
  pointInfo
) {
  funcs[name](style, curPosition, proportion, needLockProportion, pointInfo)
}
