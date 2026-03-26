"use client";

import { useMemo } from "react";
import * as THREE from "three";

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 100, g: 100, b: 200 };
};

export const useCanvasTexture = (name: string, color: string) => {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    const rgb = hexToRgb(color);

    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`);
    gradient.addColorStop(1, `rgba(${Math.floor(rgb.r * 0.4)}, ${Math.floor(rgb.g * 0.4)}, ${Math.floor(rgb.b * 0.4)}, 0.5)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`;
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, size - 4, size - 4);

    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;
    ctx.lineWidth = 1;
    ctx.strokeRect(12, 12, size - 24, size - 24);

    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2 - 25, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const maxWidth = size - 40;
    let fontSize = 30;
    ctx.font = `bold ${fontSize}px 'Geist', 'Inter', system-ui, sans-serif`;
    while (ctx.measureText(name).width > maxWidth && fontSize > 14) {
      fontSize--;
      ctx.font = `bold ${fontSize}px 'Geist', 'Inter', system-ui, sans-serif`;
    }

    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 4;
    ctx.fillText(name, size / 2, size / 2 + 20);
    ctx.shadowBlur = 0;

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [name, color]);

  return texture;
};
