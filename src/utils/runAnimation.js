export default async function runAnimation($el, animations = []) {
  const play = (animation) =>
    new Promise((resolve) => {
      const { animationTime, value = '', isLoop } = animation

      $el.style.setProperty('--timed', animationTime + 's')
      $el.classList.add(value, 'animated', utilsHandle(isLoop))

      const removeAnimation = () => {
        $el.classList.remove(value, 'animated', utilsHandle(isLoop))
        $el.style.removeProperty('--timed')
        $el.removeEventListener('animationend', removeAnimation)
        $el.removeEventListener('animationcancel', removeAnimation)
        resolve()
      }

      $el.addEventListener('animationend', removeAnimation)
      $el.addEventListener('animationcancel', removeAnimation)
    })

  for (let i = 0; i < animations.length; i++) {
    await play(animations[i])
  }
}

function utilsHandle(isLoop) {
  return isLoop ? 'infinite' : 'no-infinite'
}
