import React from "react";
import { createRoot } from "react-dom/client";
import HeroShader from "./HeroShader.jsx";

const mountPoint = document.getElementById("shaderHeroRoot");

if (mountPoint) {
  createRoot(mountPoint).render(<HeroShader />);
}
