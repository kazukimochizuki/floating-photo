'use strict';

var redis = require('./redis');

module.exports = function (io) {
  var cache;
  io.on('connection', function (socket) {
    alert("ok!");
    // 接続された時にredisに保存されたデータをcacheに入れる
    redis.get('photoCache', function(err, result) {
      if (err) {
        return err;
      }
      if (result) {
console.log('>>>>', result);
        cache = JSON.parse(result);
      } else {
        cache = [];
      }
    });
    console.log('connected!!');

    //最初に接続されたときにキャッシュされたデータを受け取っている
    socket.emit('init', cache);

    // canvasに描画されたときに送られてくるデータ
    socket.on('publish', function (data) {
      socket.broadcast.emit('publish', data);
      cache.push(data);
      // objectをJSON.stringifyしないといけない
      redis.set('photoCache', JSON.stringify(cache));
    });

    // // drawごとにredisに書き込んでいると負荷が大きいのでマウスを話した時のイベントに設定する
    // socket.on('drawEnd', function () {
    //   // objectをJSON.stringifyしないといけない
    //   redis.set('photoCache', JSON.stringify(cache));
    // });

    // CLEARボタンを押されたらcacheをクリアしてredisのデータを消す
    socket.on('clear', function () {
      socket.broadcast.emit('clear');
      cache = [];
      redis.del('photoCache');
    });
  });
};
