// src/composables/useTilt.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useTilt(options = {}) {
  const {
    max = 12,        // max tilt degrees
    scale = 1.04,    // scale on hover
    speed = 400,     // transition speed ms
    glare = true,    // show glare effect
  } = options

  const el = ref(null)
  const glareEl = ref(null)

  function onMouseMove(e) {
    if (!el.value) return
    const rect = el.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -max
    const rotateY = ((x - centerX) / centerX) * max

    el.value.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`
    el.value.style.transition = `transform 0.1s ease`

    if (glare && glareEl.value) {
      const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI)
      const glareOpacity = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) / Math.sqrt(centerX ** 2 + centerY ** 2) * 0.3
      glareEl.value.style.transform = `rotate(${angle}deg)`
      glareEl.value.style.opacity = glareOpacity
    }
  }

  function onMouseLeave() {
    if (!el.value) return
    el.value.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`
    el.value.style.transition = `transform ${speed}ms cubic-bezier(0.23, 1, 0.32, 1)`
    if (glare && glareEl.value) {
      glareEl.value.style.opacity = 0
    }
  }

  onMounted(() => {
    if (!el.value) return
    el.value.addEventListener('mousemove', onMouseMove)
    el.value.addEventListener('mouseleave', onMouseLeave)
    el.value.style.transformStyle = 'preserve-3d'
    el.value.style.willChange = 'transform'
  })

  onUnmounted(() => {
    if (!el.value) return
    el.value.removeEventListener('mousemove', onMouseMove)
    el.value.removeEventListener('mouseleave', onMouseLeave)
  })

  return { el, glareEl }
}
