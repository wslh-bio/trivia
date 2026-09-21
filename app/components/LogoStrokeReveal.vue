<script setup lang="ts">
import { createTimeline, stagger, svg } from 'animejs'
import logoSource from '~/assets/wslh_logo_white.svg?raw'

const props = withDefaults(defineProps<{
  /** Delay in ms, from mount, before the reveal timer starts the animation. */
  startDelay?: number
  /** Duration in ms of each path's stroke draw. */
  drawDuration?: number
}>(), {
  startDelay: 400,
  drawDuration: 1600
})

const frameRef = ref<HTMLDivElement | null>(null)
let startTimer: ReturnType<typeof setTimeout> | undefined
let timeline: ReturnType<typeof createTimeline> | undefined

interface LogoPath {
  d: string
  fill: string
}

function parseLogoPaths(svgMarkup: string): LogoPath[] {
  const matches = svgMarkup.matchAll(/<path[^>]*\sd="([^"]*)"[^>]*\sfill="([^"]*)"[^>]*\/>/g)
  return [...matches].map(([, d, fill]) => ({ d, fill }))
}

function buildMarkup(paths: LogoPath[]): string {
  const maskShapes = paths.map(p => `<path d="${p.d}" fill="#fff" />`).join('')
  const baseShapes = paths.map(p => `<path d="${p.d}" fill="${p.fill}" />`).join('')
  const outlineShapes = paths.map(p => `<path class="logo-outline" d="${p.d}" fill="none" />`).join('')

  return `
    <svg viewBox="0 0 1201 751" preserveAspectRatio="xMidYMid meet">
      <defs>
        <mask id="logo-reveal-mask">${maskShapes}</mask>
      </defs>
      <g class="logo-base">${baseShapes}</g>
      <g class="logo-cut">
        <rect class="logo-cut-rect" width="100%" height="100%" mask="url(#logo-reveal-mask)" />
        <g class="logo-outline-group">${outlineShapes}</g>
      </g>
    </svg>
  `
}

onMounted(() => {
  const frame = frameRef.value
  if (!frame) return

  const paths = parseLogoPaths(logoSource)
  frame.innerHTML = buildMarkup(paths)

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    frame.querySelector('.logo-cut')?.remove()
    return
  }

  const outlines = frame.querySelectorAll<SVGPathElement>('.logo-outline')
  const drawables = svg.createDrawable(outlines)
  const cut = frame.querySelector('.logo-cut')

  timeline = createTimeline({ autoplay: false })
    .add(drawables, {
      draw: ['0 0', '0 1'],
      duration: props.drawDuration,
      delay: stagger(150),
      ease: 'inOutSine'
    })
    .add(cut, {
      opacity: 0,
      duration: 600,
      ease: 'outSine'
    }, '-=300')

  // Reveal is driven by a timer rather than scroll position.
  startTimer = setTimeout(() => timeline?.play(), props.startDelay)
})

onBeforeUnmount(() => {
  clearTimeout(startTimer)
  timeline?.pause()
})
</script>

<template>
  <div ref="frameRef" class="logo-reveal" />
</template>

<style scoped>
.logo-reveal {
  width: 100%;
  max-width: 12rem;
  margin: 0 auto;
}

.logo-reveal :deep(svg) {
  width: 100%;
  height: auto;
  overflow: visible;
}

.logo-reveal :deep(.logo-cut-rect) {
  fill: var(--logo-reveal-bg, #fff);
}

.logo-reveal :deep(.logo-outline) {
  stroke: var(--logo-reveal-stroke, var(--uw-black));
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
