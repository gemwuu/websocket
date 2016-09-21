'use strict'
/**
 * @author: Ke Wu
 * @createdTime: 2016-09-21 15:39:35
 * @fileName: index.js
 * @description:
 **/

var socket = io('http://localhost:8000');

socket.emit('news', { test: 'cadscasd'})
socket.on('news', function (data) {
  console.log('in news')
  console.log(data);
});
