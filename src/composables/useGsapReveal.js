// src/composables/useGsapReveal.js
import { onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

export function useGsapReveal() {
  let observers = []

  function reveal(selector, options = {}) {
    const {
      y = 40,
      opacity = 0,
      duration = 0.7,
      stagger = 0.1,
      delay = 0,
      ease = 'power3.out',
    } = options

    const elements = document.querySelectorAll(selector)
    if (!elements.length) return

    // Set initial state
    gsap.set(elements, { y, opacity })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(entry.target, {
              y: 0,
              opacity: 1,
              duration,
              delay,
              ease,
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    elements.forEach((el) => observer.observe(el))
    observers.push(observer)
  }

  function revealGroup(selector, options = {}) {
    const {
      y = 40,
      opacity = 0,
      duration = 0.6,
      stagger = 0.08,
      ease = 'power3.out',
    } = options

    const parent = document.querySelector(selector)
    if (!parent) return

    const children = Array.from(parent.children)
    gsap.set(children, { y, opacity })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(children, { y: 0, opacity: 1, duration, stagger, ease })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(parent)
    observers.push(observer)
  }

  onUnmounted(() => {
    observers.forEach((o) => o.disconnect())
    observers = []
  })

  return { reveal, revealGroup }
}
