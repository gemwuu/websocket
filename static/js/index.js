'use strict'
/**
 * @author: Ke Wu
 * @createdTime: 2016-09-21 15:39:35
 * @fileName: index.js
 * @description:
 **/

var socket = io('http://localhost:8000');

socket.on('notification', function (data) {
  console.log('notification')
  console.log(data)
  MSG_LIST.msgs.push(data)
});

socket.on('new user', function(data) {
  CONTACTS_LIST.contacts.push(data)
})

var NICKNAME = window.prompt('id: ' + ID + '\n请输入昵称') || '没有昵称'

var PERSONAL_CONTAINER = new Vue({
  el: '#personal-container',
  data: {
    info: {
      id: ID,
      nickname: NICKNAME
    }
  }
})

var CONTACTS_LIST = new Vue({
  el: '#contacts-list',
  data: {
    contacts: [
      { id: ID, nickname: NICKNAME }
    ]
  }
})

var MSG_LIST = new Vue({
  el: '#msg-list',
  data: {
    msgs: []
  }
})

var INPUT_CONTAINER = new Vue({
  el: '#input-container',
  data: {
    msg: ''
  },
  methods: {
    emit: function() {
      if (this.msg !== '\n') {
        console.log('typed msg is: %s', this.msg)
        socket.emit('new msg', {
          id: ID,
          nickname: NICKNAME,
          msg: this.msg.trim()
        })
        this.msg = ''
      } else {
      }
    }
  }
})
