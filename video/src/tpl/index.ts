import React from "react";
import { Composition, registerRoot } from "remotion";
import { GALLERY_TOTAL, Gallery } from "./Gallery";

const Root: React.FC = () => React.createElement(Composition, { id: "TemplateGallery", component: Gallery, durationInFrames: GALLERY_TOTAL, fps: 30, width: 1920, height: 1080 });
registerRoot(Root);
