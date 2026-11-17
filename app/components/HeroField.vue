<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<script setup lang="ts">
// A field of tests: spheres on a floor seen in perspective. A wave of light turns them green; one
// sphere near the front turns red, a ring closes around it ("caught"), and it turns green. One
// cycle lasts PERIOD seconds and ends as it began, so the loop has no seam. The drawing stops
// while the field is off screen or the tab is hidden; with reduced motion it is one still frame.
const props = defineProps<{ label: string }>();

const canvas = ref<HTMLCanvasElement>();

const PERIOD = 8;
const ROWS = 24;
const COLUMNS = 40;
const SPACING = 0.32;
const caught = { row: 4, column: 22 };
const DIM = [70, 110, 150];
const GREEN = [70, 230, 160];
const RED = [255, 64, 40];

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp = (t: number) => Math.min(1, Math.max(0, t));
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => v + ((b[i] ?? v) - v) * t);
const rgba = (c: number[], alpha: number) => `rgba(${c.map(Math.round).join(",")},${alpha})`;

function draw(context: CanvasRenderingContext2D, width: number, height: number, t: number) {
  context.fillStyle = "#070b1f";
  context.fillRect(0, 0, width, height);
  const glow = context.createRadialGradient(width * 0.82, 0, 0, width * 0.82, 0, width * 0.75);
  glow.addColorStop(0, "rgba(120, 70, 220, 0.32)");
  glow.addColorStop(1, "rgba(120, 70, 220, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);

  // The wave crosses during the first 70% of the cycle; the last 20% fades the field back to dim.
  const wave = t < 0.7 ? smooth(t / 0.7) * 1.3 : 1.3;
  const fade = t < 0.8 ? 1 : 1 - smooth((t - 0.8) / 0.2);
  const drift = Math.sin(t * Math.PI * 2) * 0.3;
  // The field is as wide as the screen needs: a phone sees its middle, a wide screen all of it.
  const focal = Math.max(height * 1.05, width * 0.42);
  const horizon = height * 0.12;

  for (let row = ROWS - 1; row >= 0; row--) {
    const depth = row * SPACING + 1.6;
    const scale = focal / depth;
    const y = horizon + (height * 1.25) / depth;
    for (let column = 0; column < COLUMNS; column++) {
      const x = width / 2 + ((column - COLUMNS / 2) * SPACING - drift) * scale;
      const radius = Math.max(0.8, scale * 0.05);
      if (x < -radius * 3 || x > width + radius * 3 || y > height + radius * 3) continue;
      const reached = clamp((wave - column / COLUMNS) * 6);
      let color = mix(DIM, GREEN, reached * fade);
      let ring = 0;
      if (row === caught.row && column === caught.column) {
        if (t > 0.22 && t < 0.56) color = RED;
        if (t > 0.3 && t < 0.62) {
          const close = smooth(clamp((t - 0.3) / 0.16));
          const out = t < 0.54 ? 1 : 1 - smooth((t - 0.54) / 0.08);
          ring = close * out;
        }
      }
      const light = context.createRadialGradient(
        x - radius * 0.35,
        y - radius * 0.35,
        radius * 0.1,
        x,
        y,
        radius * 2.2,
      );
      light.addColorStop(0, rgba(color, 1));
      light.addColorStop(0.42, rgba(color, 0.92));
      light.addColorStop(0.5, rgba(color, 0.35));
      light.addColorStop(1, rgba(color, 0));
      context.fillStyle = light;
      context.beginPath();
      context.arc(x, y, radius * 2.2, 0, Math.PI * 2);
      context.fill();
      if (ring > 0) {
        context.strokeStyle = `rgba(255, 236, 228, ${0.9 * ring})`;
        context.lineWidth = Math.max(2, radius * 0.32);
        context.beginPath();
        context.arc(x, y, radius * (9 - 6 * ring), 0, Math.PI * 2);
        context.stroke();
      }
    }
  }
}

onMounted(() => {
  const element = canvas.value;
  const context = element?.getContext("2d");
  if (!element || !context) return;
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  let visible = true;

  const size = () => {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    element.width = Math.round(element.clientWidth * ratio);
    element.height = Math.round(element.clientHeight * ratio);
  };
  const render = (now: number) => {
    const t = still.matches ? 0.42 : (now / 1000 / PERIOD) % 1;
    draw(context, element.width, element.height, t);
    frame = still.matches || !visible || document.hidden ? 0 : requestAnimationFrame(render);
  };
  const start = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };

  const resize = new ResizeObserver(() => {
    size();
    start();
  });
  resize.observe(element);
  const seen = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true;
    if (visible) start();
  });
  seen.observe(element);
  const wake = () => {
    if (!document.hidden) start();
  };
  document.addEventListener("visibilitychange", wake);
  still.addEventListener("change", start);

  onBeforeUnmount(() => {
    cancelAnimationFrame(frame);
    resize.disconnect();
    seen.disconnect();
    document.removeEventListener("visibilitychange", wake);
    still.removeEventListener("change", start);
  });
});
</script>

<template>
  <div class="field">
    <canvas ref="canvas" role="img" :aria-label="props.label" />
  </div>
</template>

<style scoped>
.field {
  overflow: hidden;
  border-radius: var(--radius);
  background: #070b1f;
}

canvas {
  display: block;
  width: 100%;
  height: clamp(300px, 42vw, 560px);
}

@media (width <= 640px) {
  .field {
    border-radius: 22px;
  }

  canvas {
    height: 340px;
  }
}
</style>
