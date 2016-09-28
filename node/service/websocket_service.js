'use strict'
/**
 * @author: Ke Wu
 * @createdTime: 2016-09-21 15:26:39
 * @fileName: websocket_service.js
 * @description:
 **/

module.exports = {
  removeClient: function(app, set, users) {
    let clients = app.io.engine.clients
    for (let client in clients) {
      if (!set.has(client)) {
        console.log(client)
      }
    }
  }
}
