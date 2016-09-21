'use strict'
/**
* @author: ke.wu
* @create_time: 2016-06-24 11:07:13
* @file_name: http_service.js
* @description: HTTP 服务接口
 **/

const config = require('../config/config')
const request = require('../util/request')
const renderer = require('./renderer')
const querystring = require('querystring')


module.exports = {
  comment: function *() {
    let querydata = this.query
    let structureId = querydata.structure_id
    let propertyId = querydata.property_id
    let uri = config.host + '/comment?structure_id=' + structureId
    let body = this.request.body

    if (propertyId) {
      uri += '&property_id=' + propertyId
    }

    let postData = {
      uri: uri,
      method: 'POST',
      json: true,
      body: {
        comment: body.comment,
        title: body.title,
        phone: body.phone,
        estimated_time: body.estimatedTime
      }
    }

    let openid = this.cookies.get('openid')
    if (openid) {
      postData.body.openid = openid
    }

    this.body = yield request(postData)
  }
}

