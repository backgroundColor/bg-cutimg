# cutimg
等比例压缩图片，并提供获取图片详细信息功能

## API

```
 // 安装
 npm i bg-cutimg

```

```
/*
 * compress 压缩图片 （需要回调函数）
 * detailInfo 获取图片详细信息 （需要回调函数）
 * 详细操作查看example里面的示例
*/

function getUploadFile () {
  var resImg = document.getElementById('resImg');
  var scaleImg = document.getElementById('scaleImg');
  var compressFn = new CutImg({
    targetId: 'upload_img',
    scale: 0.5,
    imgDom: resImg
  });
  compressFn.compress(function (data) {
    console.log(data)
    resImg.src = data.base64;
    scaleImg.src = data.compressBase64;
  }, function (err) {
    console.error(err);
  }).detailInfo(function (data) {
    console.log(data);
    alert(JSON.stringify(data, null, 4));
  });
}
   ```
