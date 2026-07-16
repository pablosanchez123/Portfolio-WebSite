import React, { useEffect, useState } from "react";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

function useLandingIsLight() {
  const [isLight, setIsLight] = useState(
    () => document.getElementById("landing")?.dataset.theme === "light"
  );

  useEffect(() => {
    const landing = document.getElementById("landing");
    if (!landing) return undefined;

    const observer = new MutationObserver(() => {
      setIsLight(landing.dataset.theme === "light");
    });
    observer.observe(landing, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return isLight;
}

const NEBULA_MASK =
  "radial-gradient(ellipse 85% 95% at 74% 30%, black 0%, black 48%, transparent 88%)";

export default function HeroShader() {
  const isLight = useLandingIsLight();

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        opacity: isLight ? 0 : 1,
        transition: "opacity 500ms ease",
        pointerEvents: "none",
        WebkitMaskImage: NEBULA_MASK,
        maskImage: NEBULA_MASK,
      }}
    >
      <ShaderGradientCanvas
        style={{ position: "absolute", inset: 0 }}
        pixelDensity={1}
        fov={45}
        pointerEvents="none"
      >
        <ShaderGradient
          type="plane"
          animate="on"
          shader="defaults"
          lightType="env"
          envPreset="lobby"
          grain="off"
          color1="#0b0613"
          color2="#5a1aa8"
          color3="#b366ff"
          uFrequency={2.8}
          uSpeed={0.15}
          uStrength={2.8}
          cDistance={3.8}
          cPolarAngle={90}
        />
      </ShaderGradientCanvas>
    </div>
  );
}
