"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health Check Endpoint
app.get('/api/health', function (req, res) {
    res.status(200).json({ status: 'ok' });
});
exports.default = app;
