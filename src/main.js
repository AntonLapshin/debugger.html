// @flow

import React from "react";
import ReactDOM from "react-dom";

import { bootstrap, L10N, unmountRoot } from "devtools-launchpad";
import { isFirefoxPanel } from "devtools-config";

import { onConnect } from "./client";
import { teardownWorkers } from "./utils/bootstrap";

//
// if (process.env.NODE_ENV !== "production") {
//   const Perf = require("react-addons-perf");
//   window.Perf = Perf;
// }

if (isFirefoxPanel()) {
  module.exports = {
    bootstrap: ({
      threadClient,
      tabTarget,
      debuggerClient,
      sourceMaps
    }: any) => {
      return onConnect(
        {
          tab: { clientType: "firefox" },
          tabConnection: {
            tabTarget,
            threadClient,
            debuggerClient
          }
        },
        {
          sourceMaps
        }
      );
    },
    destroy: () => {
      unmountRoot(ReactDOM);
      teardownWorkers();
    }
  };
} else {
  window.L10N = L10N;
  // $FlowIgnore:
  window.L10N.setBundle(require("../assets/panel/debugger.properties"));

  bootstrap(React, ReactDOM).then(connection => {
    onConnect(connection, {
      sourceMaps: require("devtools-source-map")
    });
  });
}
