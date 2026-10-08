"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var app_1 = require("./app");
dotenv_1.default.config();
var PORT = process.env.PORT || 5000;
app_1.default.listen(PORT, function () {
    console.log("[BeautyPilot Backend] Server running on port ".concat(PORT));
});
