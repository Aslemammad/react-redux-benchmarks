/* eslint no-console: 0 */
"use strict";
const { join, normalize } = require("path");
const { readdirSync, copyFileSync, existsSync } = require("fs");
const puppeteer = require("puppeteer");
const Table = require("cli-table2");
const _ = require("lodash");

const serverUtils = require("./utils/server.js");

const filterKeywords = ["deeptree"];

let sources = readdirSync(join(__dirname, "sources"));

// filter deeptree-nested* for now
sources = sources.filter(
  (v, i) => !filterKeywords.some((keyword) => v.includes(keyword))
);

const benchmarks = [
  ...new Set(
    sources.map((s) => s.replace(/-(useSelector|useTrackedState)$/, ""))
  ),
];

const VERSIONS_FOLDER = join(__dirname, "react-redux-versions");

let versions = readdirSync(VERSIONS_FOLDER).map((version) =>
  version.replace("react-redux-", "").replace(".min.js", "")
);
// versions = [versions[0]];

const reduxVersions = process.env.REDUX
  ? process.env.REDUX.trim().split(":")
  : versions;
const reduxTypeVersions = reduxVersions.reduce((a, v) => {
  // if (v.startsWith("rrr-")) {
  // return a.concat([["useSelector", v], ["useTrackedState", v]]);
  return a.concat([["useSelector", v]]);
  // }
  // const [, major, minor] = /^(\d+)\.(\d+)\./.exec(v);
  // if (major >= 7 && minor >= 1) {
  //   return a.concat([["connect", v], ["useSelector", v]]);
  // }
  // return a.concat([["connect", v]]);
}, []);
const benchmarksToRun = process.env.BENCHMARKS
  ? process.env.BENCHMARKS.split(":")
  : benchmarks;
const length = process.env.SECONDS ? process.env.SECONDS : 30;
const trace = process.env.BENCHMARK_TRACE
  ? process.env.BENCHMARK_TRACE === "true"
  : true;

// Given an array of items such as ["a", "b", "c", "d"], return the pairwise entries
// in the form [ ["a","b"], ["b","c"], ["c","d"] ]
function pairwise(list) {
  // Create a new list offset by 1
  var allButFirst = _.rest(list);
  // Pair up entries at each index
  var zipped = _.zip(list, allButFirst);
  // Remove last entry, as there's a mismatch from the offset
  var pairwiseEntries = _.initial(zipped);
  return pairwiseEntries;
}

function printBenchmarkResults(benchmark, versionPerfEntries) {
  console.log(`\nResults for benchmark ${benchmark}:`);

  let traceCategories = [];

  if (trace) {
    traceCategories = ["Scripting", "Rendering", "Painting"];
  }

  const table = new Table({
    head: [
      "Type-Version",
      "Avg FPS",
      "Render\n(Mount, Avg)",
      ...traceCategories,
      "FPS Values",
    ],
  });

  Object.keys(versionPerfEntries)
    .sort()
    .forEach((version) => {
      const versionResults = versionPerfEntries[version];

      const { fps, profile, mountTime, averageUpdateTime } = versionResults;

      let traceResults = [];

      if (trace) {
        traceResults = [
          profile.categories.scripting.toFixed(2),
          profile.categories.rendering.toFixed(2),
          profile.categories.painting.toFixed(2),
        ];
      }

      const fpsNumbers = fps.values.map((entry) => entry.FPS);

      table.push([
        version,
        fps.weightedFPS.toFixed(2),
        `${mountTime.toFixed(1)}, ${averageUpdateTime.toFixed(1)}`,
        ...traceResults,
        fpsNumbers.toString(),
      ]);
    });

  console.log(table.toString());
}

function calculateBenchmarkStats(fpsRunResults, categories, traceRunResults) {
  const { fpsValues, start, end } = fpsRunResults;

  if (trace) {
    categories = traceRunResults.traceMetrics.profiling.categories;
  }

  // skip first value = it's usually way lower due to page startup
  const fpsValuesWithoutFirst = fpsValues.slice(1);
  const lastEntry = _.last(fpsValues);

  const averageFPS =
    fpsValuesWithoutFirst.reduce((sum, entry) => sum + entry.FPS, 0) /
      fpsValuesWithoutFirst.length || 1;

  const pairwiseEntries = pairwise(fpsValuesWithoutFirst);

  const fpsValuesWithDurations = pairwiseEntries.map((pair) => {
    const [first, second] = pair;
    const duration = second.timestamp - first.timestamp;
    const durationSeconds = duration / 1000.0;

    return { FPS: first.FPS, durationSeconds };
  });

  const sums = fpsValuesWithDurations.reduce(
    (prev, current) => {
      const weightedFPS = current.FPS * current.durationSeconds;

      return {
        weightedFPS: prev.weightedFPS + weightedFPS,
        durationSeconds: prev.durationSeconds + current.durationSeconds,
      };
    },
    { FPS: 0, weightedFPS: 0, durationSeconds: 0 }
  );

  const weightedFPS = sums.weightedFPS / sums.durationSeconds;

  const fps = { averageFPS, weightedFPS, values: fpsValuesWithoutFirst };

  const { reactTimingEntries } = fpsRunResults;

  const [mountEntry, ...updateEntries] = reactTimingEntries;

  debugger;
  const mountTime = mountEntry.actualTime;

  const averageUpdateTime =
    updateEntries.reduce((sum, entry) => sum + entry.actualTime, 0) /
      updateEntries.length || 1;

  return { fps, profile: { categories }, mountTime, averageUpdateTime };
}

async function runBenchmarks() {
  for (let j = 0; j < benchmarksToRun.length; j++) {
    const benchmark = benchmarksToRun[j];

    const versionPerfEntries = {};

    console.log(`Running benchmark ${benchmark}`);

    for (let i = 0; i < reduxTypeVersions.length; i++) {
      const [type, version] = reduxTypeVersions[i];
      const source = join(
        __dirname,
        "runs",
        benchmark.includes("jotai") ? `${benchmark}` : `${benchmark}-${type}`
      );
      const toRun = join(source, version);
      console.log(`  react-redux type-version: ${type}-${version}`);
      const browser = await puppeteer.launch({
        executablePath: "/usr/bin/chromium-browser",
        args: [
          "--disable-gpu",
          "--no-sandbox",
          "--lang=en-US",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
        ],
      });

      const URL = "http://localhost:9999";
      try {
        const sourceFilePath = join(
          VERSIONS_FOLDER,
          `react-redux-${version}.min.js`
        );
        const destFilePath = join(source, "react-redux.min.js");
        copyFileSync(sourceFilePath, destFilePath);

        const server = await serverUtils.runServer(9999, source);

        console.log(`    Checking max FPS... (${length} seconds)`);
        const fpsRunResults = await serverUtils.capturePageStats(
          browser,
          URL,
          null,
          length * 1000
        );

        let traceRunResults, categories;

        if (trace) {
          console.log(`    Running trace...    (${length} seconds)`);
          const traceFilename = join(
            __dirname,
            "runs",
            `trace-${benchmark}-${type}-${version}.json`
          );
          traceRunResults = await serverUtils.capturePageStats(
            browser,
            URL,
            traceFilename,
            length * 1000
          );
        }

        versionPerfEntries[`${type}-${version}`] = calculateBenchmarkStats(
          fpsRunResults,
          categories,
          traceRunResults
        );

        server.close();
      } catch (e) {
        console.error(e);
        process.exit(-1);
      } finally {
        await browser.close();
      }
    }

    printBenchmarkResults(benchmark, versionPerfEntries);
  }

  process.exit(0);
}

runBenchmarks();
