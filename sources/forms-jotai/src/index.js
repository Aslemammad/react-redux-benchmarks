import React, { unstable_Profiler as Profiler } from "react";
import ReactDOM from "react-dom";
import { Provider as JotaiProvider } from "jotai";
import "./index.css";
import App from "./App";
import "fps-emit";

import { typeTextInRandomInput } from "./inputs";

const renderResults = [];
window.renderResults = renderResults;

function onAppRendered(
  id,
  phase,
  actualTime,
  baseTime,
  startTime,
  commitTime,
  interactions = []
) {
  if (!Array.isArray(interactions)) {
    interactions = [...interactions];
  }
  renderResults.push({
    id,
    phase,
    actualTime,
    baseTime,
    startTime,
    commitTime,
    interactions,
  });
}

ReactDOM.render(
  <Profiler id="appProfiler" onRender={onAppRendered}>
    <JotaiProvider>
      <App />
    </JotaiProvider>
  </Profiler>,
  document.getElementById("root")
);

async function infiniteBobRoss() {
  while (true) {
    await typeTextInRandomInput();
  }
}

setTimeout(infiniteBobRoss, 50);

setTimeout(infiniteBobRoss, 70);

setTimeout(infiniteBobRoss, 90);

setTimeout(infiniteBobRoss, 110);
