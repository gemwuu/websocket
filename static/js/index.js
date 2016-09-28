'use strict'
/**
 * @author: Ke Wu
 * @createdTime: 2016-09-21 15:39:35
 * @fileName: index.js
 * @description:
 **/

var socket = io('/');

socket.on('notification', function (data) {
  MSG_LIST.msgs.push(data)
});

socket.on('new user', function(data) {
  CONTACTS_LIST.contacts = data
})


var PROMPT_CONTAINER = new Vue({
  el: '#prompt-container',
  data: {
    bShow: true,
    nickname: ''
  },
  methods: {
    dismiss: function() {
      this.bShow = false
      INIT_DATA.nickname = this.nickname
      socket.emit('new user', INIT_DATA)
    }
  }
})

var PERSONAL_CONTAINER = new Vue({
  el: '#personal-container',
  data: {
    info: INIT_DATA
  },
  methods: {
    changeNickname: function() {
      PROMPT_CONTAINER.bShow = true
    }
  }
})

var CONTACTS_LIST = new Vue({
  el: '#contacts-list',
  data: {
    contacts: []
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
        var data = INIT_DATA
        data.msg = this.msg.trim()
        socket.emit('new msg', data)
        this.msg = ''
      } else {
      }
    }
  }
})
