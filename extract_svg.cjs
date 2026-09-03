const { FaAward, FaCamera } = require("react-icons/fa");
const { renderToString } = require("react-dom/server");
const React = require("react");

console.log("Award:", renderToString(React.createElement(FaAward)));
console.log("Camera:", renderToString(React.createElement(FaCamera)));
