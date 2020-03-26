Page({
  data: {
    imgSrc:
      "https://756d-umbrella-1301163558.tcb.qcloud.la/qrcodeabu.png?sign=7d622f2f18bbbbf690665942ec0e9b2d&t=1585120144"
  },

  popupConfirm: function() {
    this.saveTap();
  },
  popupCancel: function() {
    wx.showToast({
      title: "保存失败",
      icon: "none",
      duration: 2000
    });
  },

  saveTap: function() {
    var self = this;
    wx.getSetting({
      success(res) {
        //判断是否已授权
        if (!res.authSetting["scope.writePhotosAlbum"]) {
          wx.authorize({
            scope: "scope.writePhotosAlbum",
            success() {
              //授权成功
              self.savePhoto();
            },
            fail: function() {
              //未授权
              self.imageErrorAuth();
            }
          });
        } else {
          //已授权直接保存图片
          self.savePhoto();
        }
      }
    });
  },
  imageErrorAuth() {
    //打开设置必须在按钮点击事件中所以搞一个modal
    wx.showModal({
      title: "提示",
      content: "需要您授权保存至相册",
      showCancel: false,
      success: modalSuccess => {
        wx.openSetting({
          success(settingData) {
            if (settingData.authSetting["scope.writePhotosAlbum"]) {
              wx.showModal({
                title: "提示",
                content: "获取权限成功,再次保存图片即可",
                showCancel: false
              });
            } else {
              wx.showModal({
                title: "提示",
                content: "获取权限失败，将无法保存到相册",
                showCancel: false
              });
            }
          },
          fail(failData) {},
          complete(finishData) {
            console.log("finishData", finishData);
          }
        });
      }
    });
  },
  savePhoto: function() {
    // var imgSrc = app.globalData.httpHeader+'qr_code.png'
    let imgSrc = this.data.imgSrc;
    let self = this;
    wx.downloadFile({
      url: imgSrc,
      success: function(res) {
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(data) {
            console.log("保存成功");
            wx.showToast({
              title: "保存成功",
              icon: "success",
              duration: 2000
            });
            self.setData({
              flag: false
            });
          },
          fail: function(err) {
            if (err.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
              //在这种逻辑下这种错误不会出现
              console.log("未授权");
            } else if (err.errMsg == "saveImageToPhotosAlbum:fail cancel") {
              //用户点击了取消
              wx.showToast({
                title: "保存照片失败",
                icon: "none"
              });
            }
          },
          complete(res) {
            //结束回调
          }
        });
      }
    });
  }
});
