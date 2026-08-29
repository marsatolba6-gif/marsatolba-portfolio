"use client";

import { useEffect, useRef } from "react";

type RenderTarget = {
  texture: WebGLTexture;
  framebuffer: WebGLFramebuffer;
  width: number;
  height: number;
};

type DoubleRenderTarget = {
  read: RenderTarget;
  write: RenderTarget;
  swap: () => void;
};

type FluidProgram = {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation>;
};

const SIM_RESOLUTION = 256;
const DYE_RESOLUTION = 512;
const VELOCITY_DISSIPATION = 0.962;
const DYE_DISSIPATION = 0.988;
const PRESSURE_ITERATIONS = 20;
const SPLAT_RADIUS = 0.00006;
const SPLAT_FORCE = 5900;
const REVEAL_SIZE = 3.9;
const EDGE_SOFTNESS = 0.5;
const EDGE_WIDTH = 0.01;

const VERTEX_SHADER = `#version 300 es
layout(location = 0) in vec2 aPosition;
out vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const SPLAT_SHADER = `#version 300 es
precision highp float;

uniform sampler2D uTarget;
uniform float uAspectRatio;
uniform vec2 uPoint;
uniform vec3 uColor;
uniform float uRadius;

in vec2 vUv;
out vec4 fragColor;

void main() {
  vec2 point = vUv - uPoint;
  point.x *= uAspectRatio;
  vec3 splat = exp(-dot(point, point) / uRadius) * uColor;
  vec3 base = texture(uTarget, vUv).xyz;
  fragColor = vec4(base + splat, 1.0);
}`;

const CURL_SHADER = `#version 300 es
precision highp float;

uniform sampler2D uVelocity;
uniform vec2 uTexelSize;

in vec2 vUv;
out vec4 fragColor;

void main() {
  float left = texture(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).y;
  float right = texture(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).y;
  float top = texture(uVelocity, vUv + vec2(0.0, uTexelSize.y)).x;
  float bottom = texture(uVelocity, vUv - vec2(0.0, uTexelSize.y)).x;
  fragColor = vec4(0.5 * (right - left - top + bottom), 0.0, 0.0, 1.0);
}`;

const VORTICITY_SHADER = `#version 300 es
precision highp float;

uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform vec2 uTexelSize;
uniform float uCurlStrength;
uniform float uDt;

in vec2 vUv;
out vec4 fragColor;

void main() {
  float left = texture(uCurl, vUv - vec2(uTexelSize.x, 0.0)).x;
  float right = texture(uCurl, vUv + vec2(uTexelSize.x, 0.0)).x;
  float top = texture(uCurl, vUv + vec2(0.0, uTexelSize.y)).x;
  float bottom = texture(uCurl, vUv - vec2(0.0, uTexelSize.y)).x;
  float center = texture(uCurl, vUv).x;

  vec2 force = 0.5 * vec2(abs(top) - abs(bottom), abs(right) - abs(left));
  force = force / (length(force) + 0.0001) * uCurlStrength * center;

  vec2 velocity = texture(uVelocity, vUv).xy;
  velocity += force * uDt;
  fragColor = vec4(velocity, 0.0, 1.0);
}`;

const ADVECTION_SHADER = `#version 300 es
precision highp float;

uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uTexelSize;
uniform float uDt;
uniform float uDissipation;

in vec2 vUv;
out vec4 fragColor;

void main() {
  vec2 coordinate = vUv - uDt * texture(uVelocity, vUv).xy * uTexelSize;
  fragColor = uDissipation * texture(uSource, coordinate);
}`;

const DIVERGENCE_SHADER = `#version 300 es
precision highp float;

uniform sampler2D uVelocity;
uniform vec2 uTexelSize;

in vec2 vUv;
out vec4 fragColor;

void main() {
  float left = texture(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).x;
  float right = texture(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).x;
  float top = texture(uVelocity, vUv + vec2(0.0, uTexelSize.y)).y;
  float bottom = texture(uVelocity, vUv - vec2(0.0, uTexelSize.y)).y;
  fragColor = vec4(0.5 * (right - left + top - bottom), 0.0, 0.0, 1.0);
}`;

const PRESSURE_SHADER = `#version 300 es
precision highp float;

uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexelSize;

in vec2 vUv;
out vec4 fragColor;

void main() {
  float left = texture(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
  float right = texture(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
  float top = texture(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
  float bottom = texture(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
  float divergence = texture(uDivergence, vUv).x;
  fragColor = vec4((left + right + bottom + top - divergence) * 0.25, 0.0, 0.0, 1.0);
}`;

const GRADIENT_SHADER = `#version 300 es
precision highp float;

uniform sampler2D uPressure;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;

in vec2 vUv;
out vec4 fragColor;

void main() {
  float left = texture(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
  float right = texture(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
  float top = texture(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
  float bottom = texture(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;

  vec2 velocity = texture(uVelocity, vUv).xy;
  velocity -= 0.5 * vec2(right - left, top - bottom);
  fragColor = vec4(velocity, 0.0, 1.0);
}`;

const DISPLAY_SHADER = `#version 300 es
precision highp float;

uniform sampler2D uDye;
uniform float uRevealSize;
uniform float uEdgeSoftness;
uniform float uEdgeWidth;

in vec2 vUv;
out vec4 fragColor;

void main() {
  float dye = texture(uDye, vUv).r;
  float rawMask = dye * uRevealSize;
  float mask = smoothstep(uEdgeSoftness, uEdgeSoftness + uEdgeWidth, rawMask);
  fragColor = vec4(1.0, 1.0, 1.0, clamp(mask, 0.0, 1.0));
}`;

export default function HeroFluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement as HTMLElement | null;
    if (!canvas || !hero) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      canvas.style.display = "none";
      return;
    }

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });

    if (!gl || !gl.getExtension("EXT_color_buffer_float")) {
      canvas.style.display = "none";
      return;
    }

    try {
      gl.disable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST);
      gl.clearColor(0, 0, 0, 0);

      const compileShader = (type: number, source: string) => {
        const shader = gl.createShader(type);
        if (!shader) throw new Error("Unable to create fluid shader");
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          const message = gl.getShaderInfoLog(shader) || "Fluid shader compilation failed";
          gl.deleteShader(shader);
          throw new Error(message);
        }
        return shader;
      };

      const createProgram = (fragmentSource: string, uniformNames: string[]): FluidProgram => {
        const vertex = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
        const fragment = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
        const program = gl.createProgram();
        if (!program) throw new Error("Unable to create fluid program");
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          const message = gl.getProgramInfoLog(program) || "Fluid program linking failed";
          gl.deleteProgram(program);
          throw new Error(message);
        }

        const uniforms: Record<string, WebGLUniformLocation> = {};
        for (const name of uniformNames) {
          const location = gl.getUniformLocation(program, name);
          if (location) uniforms[name] = location;
        }
        return { program, uniforms };
      };

      const splatProgram = createProgram(SPLAT_SHADER, ["uTarget", "uAspectRatio", "uPoint", "uColor", "uRadius"]);
      const curlProgram = createProgram(CURL_SHADER, ["uVelocity", "uTexelSize"]);
      const vorticityProgram = createProgram(VORTICITY_SHADER, ["uVelocity", "uCurl", "uTexelSize", "uCurlStrength", "uDt"]);
      const advectionProgram = createProgram(ADVECTION_SHADER, ["uVelocity", "uSource", "uTexelSize", "uDt", "uDissipation"]);
      const divergenceProgram = createProgram(DIVERGENCE_SHADER, ["uVelocity", "uTexelSize"]);
      const pressureProgram = createProgram(PRESSURE_SHADER, ["uPressure", "uDivergence", "uTexelSize"]);
      const gradientProgram = createProgram(GRADIENT_SHADER, ["uPressure", "uVelocity", "uTexelSize"]);
      const displayProgram = createProgram(DISPLAY_SHADER, ["uDye", "uRevealSize", "uEdgeSoftness", "uEdgeWidth"]);
      const programs = [splatProgram, curlProgram, vorticityProgram, advectionProgram, divergenceProgram, pressureProgram, gradientProgram, displayProgram];

      const vertexArray = gl.createVertexArray();
      const vertexBuffer = gl.createBuffer();
      if (!vertexArray || !vertexBuffer) throw new Error("Unable to create fluid geometry");
      gl.bindVertexArray(vertexArray);
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1,
      ]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

      const floatFilter = gl.getExtension("OES_texture_float_linear") ? gl.LINEAR : gl.NEAREST;

      const createTarget = (
        width: number,
        height: number,
        internalFormat: number,
        format: number,
        type: number,
        filter: number,
      ): RenderTarget => {
        const texture = gl.createTexture();
        const framebuffer = gl.createFramebuffer();
        if (!texture || !framebuffer) throw new Error("Unable to create fluid target");

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, null);

        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
          throw new Error("Fluid render target is incomplete");
        }
        gl.viewport(0, 0, width, height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        return { texture, framebuffer, width, height };
      };

      const createDoubleTarget = (
        width: number,
        height: number,
        internalFormat: number,
        format: number,
        type: number,
        filter: number,
      ): DoubleRenderTarget => {
        const target: DoubleRenderTarget = {
          read: createTarget(width, height, internalFormat, format, type, filter),
          write: createTarget(width, height, internalFormat, format, type, filter),
          swap: () => {
            [target.read, target.write] = [target.write, target.read];
          },
        };
        return target;
      };

      const velocity = createDoubleTarget(SIM_RESOLUTION, SIM_RESOLUTION, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT, floatFilter);
      const pressure = createDoubleTarget(SIM_RESOLUTION, SIM_RESOLUTION, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT, gl.NEAREST);
      const dye = createDoubleTarget(DYE_RESOLUTION, DYE_RESOLUTION, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, gl.LINEAR);
      const curl = createTarget(SIM_RESOLUTION, SIM_RESOLUTION, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT, gl.NEAREST);
      const divergence = createTarget(SIM_RESOLUTION, SIM_RESOLUTION, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT, gl.NEAREST);
      const targets = [velocity.read, velocity.write, pressure.read, pressure.write, dye.read, dye.write, curl, divergence];

      const bindTexture = (target: RenderTarget, unit: number, location: WebGLUniformLocation) => {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, target.texture);
        gl.uniform1i(location, unit);
      };

      const draw = (program: FluidProgram, target: RenderTarget | null, setup: () => void) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target?.framebuffer || null);
        gl.viewport(0, 0, target?.width || canvas.width, target?.height || canvas.height);
        gl.useProgram(program.program);
        setup();
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      };

      const clearTarget = (target: RenderTarget | null) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target?.framebuffer || null);
        gl.viewport(0, 0, target?.width || canvas.width, target?.height || canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
      };

      const clearFluid = () => {
        for (const target of targets) clearTarget(target);
        clearTarget(null);
      };

      const simTexelX = 1 / SIM_RESOLUTION;
      const simTexelY = 1 / SIM_RESOLUTION;
      const dyeTexelX = 1 / DYE_RESOLUTION;
      const dyeTexelY = 1 / DYE_RESOLUTION;
      let width = 1;
      let height = 1;
      let aspectRatio = 1;
      let frame = 0;
      let mouse = { x: 0.5, y: 0.5 };
      let previousMouse = { x: 0.5, y: 0.5 };
      let mouseHasMoved = false;
      let pointerReady = false;
      let maskCleaned = true;

      const resize = () => {
        const rect = hero.getBoundingClientRect();
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
        aspectRatio = width / height;
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const nextWidth = Math.max(1, Math.round(width * pixelRatio));
        const nextHeight = Math.max(1, Math.round(height * pixelRatio));
        if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
          canvas.width = nextWidth;
          canvas.height = nextHeight;
        }
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        pointerReady = false;
      };

      const splat = (target: DoubleRenderTarget, pointX: number, pointY: number, red: number, green: number, blue: number) => {
        draw(splatProgram, target.write, () => {
          bindTexture(target.read, 0, splatProgram.uniforms.uTarget);
          gl.uniform1f(splatProgram.uniforms.uAspectRatio, aspectRatio);
          gl.uniform2f(splatProgram.uniforms.uPoint, pointX, pointY);
          gl.uniform3f(splatProgram.uniforms.uColor, red, green, blue);
          gl.uniform1f(splatProgram.uniforms.uRadius, SPLAT_RADIUS);
        });
        target.swap();
      };

      const step = () => {
        if (mouseHasMoved) {
          const deltaX = mouse.x - previousMouse.x;
          const deltaY = mouse.y - previousMouse.y;
          if (Math.hypot(deltaX, deltaY) > 0) {
            splat(velocity, mouse.x, mouse.y, deltaX * SPLAT_FORCE, deltaY * SPLAT_FORCE, 0);
            splat(dye, mouse.x, mouse.y, 1, 1, 1);
          }
          previousMouse = { ...mouse };
          mouseHasMoved = false;
        }

        draw(curlProgram, curl, () => {
          bindTexture(velocity.read, 0, curlProgram.uniforms.uVelocity);
          gl.uniform2f(curlProgram.uniforms.uTexelSize, simTexelX, simTexelY);
        });

        draw(vorticityProgram, velocity.write, () => {
          bindTexture(velocity.read, 0, vorticityProgram.uniforms.uVelocity);
          bindTexture(curl, 1, vorticityProgram.uniforms.uCurl);
          gl.uniform2f(vorticityProgram.uniforms.uTexelSize, simTexelX, simTexelY);
          gl.uniform1f(vorticityProgram.uniforms.uCurlStrength, 0);
          gl.uniform1f(vorticityProgram.uniforms.uDt, 0.016);
        });
        velocity.swap();

        draw(advectionProgram, velocity.write, () => {
          bindTexture(velocity.read, 0, advectionProgram.uniforms.uVelocity);
          bindTexture(velocity.read, 1, advectionProgram.uniforms.uSource);
          gl.uniform2f(advectionProgram.uniforms.uTexelSize, simTexelX, simTexelY);
          gl.uniform1f(advectionProgram.uniforms.uDt, 1);
          gl.uniform1f(advectionProgram.uniforms.uDissipation, VELOCITY_DISSIPATION);
        });
        velocity.swap();

        draw(advectionProgram, dye.write, () => {
          bindTexture(velocity.read, 0, advectionProgram.uniforms.uVelocity);
          bindTexture(dye.read, 1, advectionProgram.uniforms.uSource);
          gl.uniform2f(advectionProgram.uniforms.uTexelSize, dyeTexelX, dyeTexelY);
          gl.uniform1f(advectionProgram.uniforms.uDt, 1);
          gl.uniform1f(advectionProgram.uniforms.uDissipation, DYE_DISSIPATION);
        });
        dye.swap();

        draw(divergenceProgram, divergence, () => {
          bindTexture(velocity.read, 0, divergenceProgram.uniforms.uVelocity);
          gl.uniform2f(divergenceProgram.uniforms.uTexelSize, simTexelX, simTexelY);
        });

        clearTarget(pressure.read);
        for (let iteration = 0; iteration < PRESSURE_ITERATIONS; iteration += 1) {
          draw(pressureProgram, pressure.write, () => {
            bindTexture(pressure.read, 0, pressureProgram.uniforms.uPressure);
            bindTexture(divergence, 1, pressureProgram.uniforms.uDivergence);
            gl.uniform2f(pressureProgram.uniforms.uTexelSize, simTexelX, simTexelY);
          });
          pressure.swap();
        }

        draw(gradientProgram, velocity.write, () => {
          bindTexture(pressure.read, 0, gradientProgram.uniforms.uPressure);
          bindTexture(velocity.read, 1, gradientProgram.uniforms.uVelocity);
          gl.uniform2f(gradientProgram.uniforms.uTexelSize, simTexelX, simTexelY);
        });
        velocity.swap();

        draw(displayProgram, null, () => {
          bindTexture(dye.read, 0, displayProgram.uniforms.uDye);
          gl.uniform1f(displayProgram.uniforms.uRevealSize, REVEAL_SIZE);
          gl.uniform1f(displayProgram.uniforms.uEdgeSoftness, EDGE_SOFTNESS);
          gl.uniform1f(displayProgram.uniforms.uEdgeWidth, EDGE_WIDTH);
        });
      };

      const render = () => {
        const rect = hero.getBoundingClientRect();
        const heroIsVisible = rect.bottom > 0 && rect.top < window.innerHeight;
        if (heroIsVisible) {
          if (maskCleaned) {
            previousMouse = { ...mouse };
            mouseHasMoved = false;
            maskCleaned = false;
          }
          step();
        } else if (!maskCleaned) {
          clearFluid();
          maskCleaned = true;
          pointerReady = false;
        }
        frame = window.requestAnimationFrame(render);
      };

      const pointerMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" && event.pressure === 0) return;
        const rect = hero.getBoundingClientRect();
        const pointX = (event.clientX - rect.left) / rect.width;
        const pointY = 1 - (event.clientY - rect.top) / rect.height;
        if (pointX < 0 || pointY < 0 || pointX > 1 || pointY > 1) {
          pointerReady = false;
          return;
        }

        mouse = { x: pointX, y: pointY };
        if (!pointerReady) {
          previousMouse = { ...mouse };
          pointerReady = true;
          return;
        }
        mouseHasMoved = true;
      };

      const pointerLeave = () => {
        pointerReady = false;
        mouseHasMoved = false;
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(hero);
      resize();
      clearFluid();
      frame = window.requestAnimationFrame(render);
      hero.addEventListener("pointermove", pointerMove, { passive: true });
      hero.addEventListener("pointerleave", pointerLeave, { passive: true });

      return () => {
        window.cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        hero.removeEventListener("pointermove", pointerMove);
        hero.removeEventListener("pointerleave", pointerLeave);
        for (const target of targets) {
          gl.deleteTexture(target.texture);
          gl.deleteFramebuffer(target.framebuffer);
        }
        for (const fluidProgram of programs) gl.deleteProgram(fluidProgram.program);
        gl.deleteBuffer(vertexBuffer);
        gl.deleteVertexArray(vertexArray);
      };
    } catch {
      canvas.style.display = "none";
    }
  }, []);

  return <canvas ref={canvasRef} className="brush-canvas" aria-hidden="true" />;
}
