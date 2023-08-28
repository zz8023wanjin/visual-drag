import { divide, multiply } from 'mathjs'

/**
 * @description 角度转弧度
 * @param {*} angle 角度制
 * @returns 弧度制
 */
function angleToRadian(angle) {
  return (angle * Math.PI) / 180
}

/**
 * @description 计算根据指定中心点坐标旋转后的点的坐标
 * @param {*} point 旋转前的点坐标
 * @param {*} center 指定旋转中心点坐标
 * @param {*} rotate 旋转角度
 * @returns 旋转后的点坐标
 */
export function calculateRotatedPointCoordinate(point, center, rotate) {
  /**
   * 点a(x, y)
   * 旋转中心c(x,y)
   * 旋转后点n(x,y)
   * 旋转角度θ
   * nx = cosθ * (ax - cx) - sinθ * (ay-cy) + cx
   * ny = sinθ * (ax - cx) + cosθ * (ay - cy) + cy
   * https://www.zhihu.com/question/67425734/answer/252724399 旋转矩阵公式
   */

  return {
    x:
      (point.x - center.x) * Math.cos(angleToRadian(rotate)) -
      (point.y - center.y) * Math.sin(angleToRadian(rotate)) +
      center.x,
    y:
      (point.x - center.x) * Math.sin(angleToRadian(rotate)) +
      (point.y - center.y) * Math.cos(angleToRadian(rotate)) +
      center.y,
  }
}

export function changeStyleWithScale(value, scale) {
  return multiply(value, divide(parseInt(scale), 100))
}

/**
 * @description 求两点之间的中间坐标
 */
export function getCenterPoint(p1, p2) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  }
}
