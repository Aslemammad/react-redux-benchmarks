import React, { unstable_Profiler as Profiler } from "react";
import ReactDOM from "react-dom";
import { Provider } from "reactive-react-redux";
import "./index.css";
import App from "./App";
import "fps-emit";

import * as c from "./constants";

import { initialize, typeTextInRandomInput } from "./inputs";

import configureStore from "./configureStore";

console.log(React);
const store = configureStore();

store.dispatch(initialize({ numberOfInputs: c.NUMBER_OF_INPUTS }));

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
  console.log(id, phase, actualTime, baseTime, commitTime, interactions);
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
    <Provider store={store}>
      <App />
    </Provider>
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
