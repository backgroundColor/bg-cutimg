import EXIF from 'exif-js';
;(function (undefined) {
  var _global,
    DEFAULT_SCALE = 1;
  // merge obj
  function extend (o, n, override) {
    for (var key in n) {
      if (n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)) {
        o[key] = n[key];
      }
    }
    return o;
  };
  /*
   * 参数 object
   * targetId (必填， 为上传图片所使用的input控件id)
   * scale （选填， 为压缩比例，默认为1，不压缩，此压缩为等比压缩）
  */
  /*
   * 压缩 compress
   * success_cb (选填， 为上传图片压缩后的操作fn)
   * error_cb （选填， 为上传图片压缩错误的操作fn）
  */
  /*
   * 返回结果
   * success_cb (data)
   * 其中包括 file, targetFileH, targetW, compressFile, compressBase64
   * file: 为上传的初始文件详细
   * base64: 为上传的初始文件base64
   * targetFileH： 为上传的初始文件高度
   * targetFileW： 为上传的初始文件宽度
   * compressFile 为压缩后的图片blob 用于上传使用
   * compressBase64 为压缩后的图片base64 用于展示使用
  */
  // cut image
  function CutImg (opt) {
    this.opt = opt;
    this._init(opt);
  };

  CutImg.prototype = {
    constuctor: this,
    _init: function (opt) {
      var def = {
        scale: DEFAULT_SCALE,
        targetId: null
      };
      this.def = extend(def, opt, true);
      if (!this.opt.targetId) throw new Error('target id must not be empty!!');
      var target = document.getElementById(this.opt.targetId);
      if (!target) throw new Error('get dom width targetId is null!!');

      this.target = target;
      this.initInfos = {};
    },
    /*
     * 等比例压缩图片，保证图片不变形，压缩结束后输出结果中包含了blob流，方便上传使用
    */
    compress: function (success_cb, error_cb) {
      // if (!this.opt.targetId) throw new Error('target id must not be empty!!');
      var target = this.target;
      var reader = new FileReader();
      var resImg = new Image();
      var _this = this;
      this.file = target.files[0];
      reader.onload = function (e) {
        // 创建虚拟img，用来获取图片file初始尺寸
        var virtualImg = new Image();
        virtualImg.onload = function () {
          try {
            _this.initInfos.targetFileW = this.width;
            _this.initInfos.targetFileH = this.height;
            _this.initInfos.compressBase64 = _this.canvasCut(virtualImg);
            _this.initInfos.file = _this.file;
            _this.initInfos.base64 = e.target.result;
            success_cb && success_cb(_this.initInfos);
          } catch (err) {
            error_cb && error_cb(err);
          }
        }
        virtualImg.src = e.target.result;
        resImg.src = e.target.result;
      };

      reader.readAsDataURL(this.file);
      return this;
    },
    /*
     * 通过canvas 进行图片压缩处理
    */
    canvasCut: function (file, scale) {
      var scale = this.def.scale;
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      var scaleW = this.initInfos.targetFileW * scale;
      var scaleH = this.initInfos.targetFileH * scale;

      canvas.width = scaleW;
      canvas.height = scaleH;
      context.fillStyle = '#fff';
      context.fillRect(0, 0, scaleW, scaleH);
      context.drawImage(file, 0, 0, scaleW, scaleH);

      var base64Data = canvas.toDataURL('image/jpeg', scale);
      canvas = context = null;
      file = null;
      this.initInfos.compressFile = this.base64ToBlob(base64Data, 'image/jpeg');
      // console.log(this.base64ToBlob(base64Data, 'image/jpeg'));
      return base64Data;
    },
    /*
     * 将压缩后图片的base64 转blob流
    */
    base64ToBlob: function (b64data, contentType) {
      var contentType = contentType || '';
      var byteChartsets = atob(b64data.split(',')[1]);
      var buffer = [];

      var aBuffer = new ArrayBuffer(byteChartsets.length);
      var uBuffer = new Uint8Array(aBuffer);

      for (var i = 0, len = byteChartsets.length; i < len; i++) {
        uBuffer[i] = byteChartsets.charCodeAt(i);
      };

      buffer.push(uBuffer);
      var blob = new Blob(buffer, { type: contentType });
      return blob;
    },
    /*
     * 通过exif获取图片的详细信息，包括devices基本
    */
    detailInfo: function (cb) {
      if (!this.opt.imgDom) throw new Error('imgDom must not be empty!');
      var imgDom = this.opt.imgDom;
      imgDom.onload = function () {
        EXIF.getData(imgDom, function () {
          // console.log(EXIF.getAllTags(this));
          // alert(JSON.stringify(EXIF.getAllTags(this), null, 4))
          var imgData = EXIF.getAllTags(this);
          cb && cb(imgData);
        });
      };
    }
  }
  _global = (function () { return this || (0, eval)('this') }());
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CutImg;
  } else if (typeof define === 'function' && define.amd) {
    define(function () { return CutImg });
  } else {
    !('CutImg' in _global) && (_global.CutImg = CutImg);
  };
}());
