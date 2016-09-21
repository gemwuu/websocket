'use strict'
/**
 * @author: puju
 * @createdTime: 2016-08-31 15:31:49
 * @fileName: datetime.js
 * @description:
 **/

module.exports = () => {
  let date = new Date()
  return date.getFullYear() + '年' + (date.getMonth()+1) + '月' + date.getDate() + '日'
}
