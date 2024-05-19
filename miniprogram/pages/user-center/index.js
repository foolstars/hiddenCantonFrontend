const { envList } = require('../../envList');

// pages/me/index.js
Page({
  data: {
    openId: '',
    showUploadTip: false,
    userList: [], // 用户列表
    haveGetOpenId: false,
    spots: [], // 景点列表
    routes: [], // 路线列表
    messages: [], // 消息列表
    page: 1,
    numPerPage: 10,
    newSpot: {
      name: '',
      location: '',
      info: {
        text: '',
        quote: '',
        image: [],
        video: [],
        audio: []
      }
    },
    newRoute: {
      name: '',
      spots: []
    },
    newMessage: {
      title: '',
      spots: [],
      text: '',
      image: [],
      video: []
    }
  },

  onLoad() {
    const user = wx.getStorageSync('user');
    if (user) {
      this.setData({
        openId: user.openid,
        haveGetOpenId: true
      });
    }
  },

  getOpenId() {
    wx.showLoading({ title: '' });
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: { type: 'getOpenId' },
    })
    .then((resp) => {
      const openId = resp.result.openid;
      wx.setStorageSync('user', { openid: openId });
      this.setData({ haveGetOpenId: true, openId: openId });
      wx.hideLoading();
    })
    .catch((e) => {
      this.setData({ showUploadTip: true });
      wx.hideLoading();
    });
  },

  fetchUserList() {
    console.log('fetchUserList called');
    wx.cloud.callContainer({
      config: { env: 'prod-4gi3rhrv8abf0564' },
      path: `/api/user/list?page=${this.data.page}&num_per_page=${this.data.numPerPage}`,
      header: { "X-WX-SERVICE": "django-jk1n", "content-type": "application/json" },
      method: 'GET',
      success: res => {
        console.log('User list fetched:', res.data.users);
        if (res.data && res.data.users) {
          this.setData({ userList: res.data.users });
        } else {
          this.setData({ userList: [] });
        }
      },
      fail: err => {
        console.error('Error fetching user list:', err);
        this.setData({ userList: [] });
      }
    });
  },

  modifyUserRole(e) {
    const openid = e.currentTarget.dataset.openid;
    const newIdentity = e.currentTarget.dataset.newidentity;
    wx.cloud.callContainer({
      config: { env: 'prod-4gi3rhrv8abf0564' },
      path: '/api/user/id',
      header: { "X-WX-SERVICE": "django-jk1n", "content-type": "application/json" },
      method: 'POST',
      data: { openid: openid, identity: newIdentity },
      success: res => {
        wx.showToast({ title: '修改成功', icon: 'success' });
        this.fetchUserList();
      },
      fail: err => {
        console.error('Error modifying user role:', err);
      }
    });
  },

  fetchSpotList() {
    wx.cloud.callContainer({
      config: { env: 'prod-4gi3rhrv8abf0564' },
      path: `/api/spot/info?page=${this.data.page}&num_per_page=${this.data.numPerPage}`,
      header: { "X-WX-SERVICE": "django-jk1n", "content-type": "application/json" },
      method: 'GET',
      success: res => {
        if (res.data && res.data.spots) {
          this.setData({ spots: res.data.spots });
        } else {
          this.setData({ spots: [] });
        }
      },
      fail: err => {
        console.error('Error fetching spot list:', err);
        this.setData({ spots: [] });
      }
    });
  },

  createSpot() {
    wx.cloud.callContainer({
      config: { env: 'prod-4gi3rhrv8abf0564' },
      path: '/api/spot/info',
      header: { "X-WX-SERVICE": "django-jk1n", "content-type": "application/json" },
      method: 'PUT',
      data: this.data.newSpot,
      success: res => {
        wx.showToast({ title: '创建成功', icon: 'success' });
        this.fetchSpotList();
      },
      fail: err => {
        console.error('Error creating spot:', err);
      }
    });
  },

  deleteSpot(e) {
    const id = e.currentTarget.dataset.id;
    wx.cloud.callContainer({
      config: { env: 'prod-4gi3rhrv8abf0564' },
      path: '/api/spot/info',
      header: { "X-WX-SERVICE": "django-jk1n", "content-type": "application/json" },
      method: 'DELETE',
      data: { id },
      success: res => {
        wx.showToast({ title: '删除成功', icon: 'success' });
        this.fetchSpotList();
      },
      fail: err => {
        console.error('Error deleting spot:', err);
      }
    });
  },

  updateSpot() {
    wx.cloud.callContainer({
      config: { env: 'prod-4gi3rhrv8abf0564' },
      path: '/api/spot/info',
      header: { "X-WX-SERVICE": "django-jk1n", "content-type": "application/json" },
      method: 'POST',
      data: this.data.newSpot,
      success: res => {
        wx.showToast({ title: '修改成功', icon: 'success' });
        this.fetchSpotList();
      },
      fail: err => {
        console.error('Error updating spot:', err);
      }
    });
  },

  fetchRouteList() {
    wx.cloud.callContainer({
      config: { env: 'prod-4gi3rhrv8abf0564' },
      path: `/api/spot/route?page=${this.data.page}&num_per_page=${this.data.numPerPage}`,
      header: { "X-WX-SERVICE": "django-jk1n", "content-type": "application/json" },
      method: 'GET',
      success: res => {
        if (res.data && res.data.routes) {
          this.setData({ routes: res.data.routes });
        } else {
          this.setData({ routes: [] });
        }
      },
      fail: err => {
        console.error('Error fetching route list:', err);
        this.setData({ routes: [] });
      }
    });
  },

  createRoute() {
    wx.cloud.callContainer({
      config: { env: 'prod-4gi3rhrv8abf0564' },
      path: '/api/spot/route',
      header: { "X-WX-SERVICE": "django-jk1n", "content-type": "application/json" },
      method: 'PUT',
      data: this.data.newRoute,
      success: res => {
        wx.showToast({ title: '创建成功', icon: 'success' });
        this.fetchRouteList();
      },
      fail: err => {
        console.error('Error creating route:', err);
      }
    });
  },

  deleteRoute(e) {
    const id = e.currentTarget.dataset.id;
    wx.cloud.callContainer({
      config: { env: 'prod-4gi3rhrv8abf0564' },
      path: '/api/spot/route',
      header: { "X-WX-SERVICE": "django-jk1n", "content-type": "application/json" },
      method: 'DELETE',
      data: { id },
      success: res => {
        wx.showToast({ title: '删除成功', icon: 'success' });
        this.fetchRouteList();
      },
      fail: err => {
        console.error('Error deleting route:', err);
      }
    });
  },

  updateRoute() {
    wx.cloud.callContainer({
      config: { env: 'prod-4gi3rhrv8abf0564' },
      path: '/api/spot/route',
      header: { "X-WX-SERVICE": "django-jk1n", "content-type": "application/json" },
      method: 'POST',
      data: this.data.newRoute,
      success: res => {
        wx.showToast({ title: '修改成功', icon: 'success' });
        this.fetchRouteList();
      },
      fail: err => {
        console.error('Error updating route:', err);
      }
    });
  },

  fetchMessageList() {
    wx.cloud.callContainer({
      config: { env: 'prod-4gi3rhrv8abf0564' },
      path: `/api/msg/admin?page=${this.data.page}&num_per_page=${this.data.numPerPage}`,
      header: { "X-WX-SERVICE": "django-jk1n", "content-type": "application/json" },
      method: 'GET',
      success: res => {
        if (res.data && res.data.messages) {
          this.setData({ messages: res.data.messages });
        } else {
          this.setData({ messages: [] });
        }
      },
      fail: err => {
        console.error('Error fetching message list:', err);
        this.setData({ messages: [] });
      }
    });
  },

  createMessage() {
    wx.cloud.callContainer({
      config: { env: 'prod-4gi3rhrv8abf0564' },
      path: '/api/msg/admin',
      header: { "X-WX-SERVICE": "django-jk1n", "content-type": "application/json" },
      method: 'PUT',
      data: this.data.newMessage,
      success: res => {
        wx.showToast({ title: '发布成功', icon: 'success' });
        this.fetchMessageList();
      },
      fail: err => {
        console.error('Error creating message:', err);
      }
    });
  },

  deleteMessage(e) {
    const id = e.currentTarget.dataset.id;
    wx.cloud.callContainer({
      config: { env: 'prod-4gi3rhrv8abf0564' },
      path: '/api/msg/admin',
      header: { "X-WX-SERVICE": "django-jk1n", "content-type": "application/json" },
      method: 'DELETE',
      data: { id },
      success: res => {
        wx.showToast({ title: '删除成功', icon: 'success' });
        this.fetchMessageList();
      },
      fail: err => {
        console.error('Error deleting message:', err);
      }
    });
  },

  searchMessages() {
    wx.cloud.callContainer({
      config: { env: 'prod-4gi3rhrv8abf0564' },
      path: '/api/msg/admin',
      header: { "X-WX-SERVICE": "django-jk1n", "content-type": "application/json" },
      method: 'POST',
      data: {
        page: this.data.page,
        num_per_page: this.data.numPerPage,
        user: this.data.openId
      },
      success: res => {
        if (res.data && res.data.messages) {
          this.setData({ messages: res.data.messages });
        } else {
          this.setData({ messages: [] });
        }
      },
      fail: err => {
        console.error('Error searching messages:', err);
        this.setData({ messages: [] });
      }
    });
  },

  gotoWxCodePage() {
    wx.navigateTo({
      url: `/pages/exampleDetail/index?envId=${envList?.[0]?.envId}&type=getMiniProgramCode`,
    });
  },
});
