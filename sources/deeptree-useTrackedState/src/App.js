import React from "react";
import { useTrackedState, useDispatch } from "react-redux";

import Slice from "./Slice";
import * as c from "./constants";
import { incrementRandomCounter } from "./counters";

let slicesNaiveCache;

const App = () => {
  const dispatch = useDispatch();
  const state = useTrackedState();
  if (!slicesNaiveCache) {
    slicesNaiveCache = Object.keys(state).map(key => Number(key));
    slicesNaiveCache.sort();
  }
  const slices = slicesNaiveCache;
  const updateRandomCounter = () => {
    dispatch(incrementRandomCounter());
  };
  return (
    <div>
      <button onClick={updateRandomCounter}>
        Update Random Counter
      </button>
      <div className="row">
        {slices.map((slice, idx) => {
          return (
            <div style={{ display: "inline-block", minWidth: 70 }} key={idx}>
              <Slice idx={slice} remainingDepth={c.TREE_DEPTH} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
App.displayName = "App";

export default App;
