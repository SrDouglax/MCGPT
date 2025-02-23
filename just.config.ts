import {
  bundleTask,
  BundleTaskParameters,
  cleanCollateralTask,
  cleanTask,
  copyTask,
  CopyTaskParameters,
  coreLint,
  DEFAULT_CLEAN_DIRECTORIES,
  getOrThrowFromProcess,
  mcaddonTask,
  setupEnvironment,
  STANDARD_CLEAN_PATHS,
  watchTask,
  ZipTaskParameters,
} from "@minecraft/core-build-tasks";
import { argv, parallel, series, task, tscTask } from "just-scripts";
import path from "path";

// Setup env variables
setupEnvironment(path.resolve(__dirname, ".env"));
const projectName = getOrThrowFromProcess("PROJECT_NAME");

const bundleTaskOptions: BundleTaskParameters = {
  entryPoint: path.join(__dirname, "./scripts/main.ts"),
  external: ["@minecraft/server", "@minecraft/server-ui", "@minecraft/server-net"],
  outfile: path.resolve(__dirname, "./dist/scripts/main.js"),
  minifyWhitespace: true,
  sourcemap: true,
  outputSourcemapPath: path.resolve(__dirname, "./dist/debug"),
};

const copyTaskOptions: CopyTaskParameters = {
  copyToBehaviorPacks: [`./behavior_packs/${projectName}`],
  copyToScripts: ["./dist/scripts"],
  // copyToResourcePacks: [`./resource_packs/${projectName}`],
};

const mcaddonTaskOptions: ZipTaskParameters = {
  ...copyTaskOptions,
  outputFile: `./dist/packages/${projectName}.mcaddon`,
};

// Lint
task("lint", coreLint(["scripts/**/*.ts"], argv().fix));

// Build
task("typescript", tscTask());
task("bundle", bundleTask(bundleTaskOptions));
task("build", series("typescript", "bundle"));

// Clean
task("clean-local", cleanTask(DEFAULT_CLEAN_DIRECTORIES));
task("clean-collateral", cleanCollateralTask(STANDARD_CLEAN_PATHS));
task("clean", parallel("clean-local", "clean-collateral"));

// Package
task("copyArtifacts", copyTask(copyTaskOptions));
task("package", series("clean-collateral", "copyArtifacts"));

// Local Deploy used for deploying local changes directly to output via the bundler. It does a full build and package first just in case.
task(
  "local-deploy",
  watchTask(
    ["scripts/**/*.ts", "behavior_packs/**/*.{json,lang,png}"],
    series("clean-local", "build", "package")
  )
);

// Mcaddon
task("createMcaddonFile", mcaddonTask(mcaddonTaskOptions));
task("mcaddon", series("clean-local", "build", "createMcaddonFile"));
