"use client";

import { useMemo } from "react";
import * as THREE from "three";

export const useCanvasTexture = (name: string, color: string) => {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "rgba(20, 20, 35, 0.85)";
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, 20);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.roundRect(4, 4, size - 8, size - 8, 18);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2 - 20, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px 'Geist', 'Inter', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const maxWidth = size - 40;
    let fontSize = 28;
    ctx.font = `bold ${fontSize}px 'Geist', 'Inter', system-ui, sans-serif`;
    while (ctx.measureText(name).width > maxWidth && fontSize > 14) {
      fontSize--;
      ctx.font = `bold ${fontSize}px 'Geist', 'Inter', system-ui, sans-serif`;
    }

    ctx.fillText(name, size / 2, size / 2 + 20);

    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(2, 2, size - 4, size - 4, 19);
    ctx.stroke();
    ctx.globalAlpha = 1;

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [name, color]);

  return texture;
};
