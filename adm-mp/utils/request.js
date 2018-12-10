import {  mixin } from "util.js";
var app = getApp();
console.log(app);
var token = wx.getStorageSync('jwt');

module.exports = request 