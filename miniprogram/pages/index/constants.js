Page({
  data: {
    routes: []
  },
  onLoad() {
    this.fetchRoutes();
  },
  fetchRoutes() {
    wx.cloud.callContainer({
      config: { env: 'prod-4gi3rhrv8abf0564' },
      path: '/api/spot/route?page=1&num_per_page=10',
      header: { "X-WX-SERVICE": "django-jk1n", "content-type": "application/json" },
      method: 'GET',
      success: res => {
        this.setData({ routes: res.data.routes });
      }
    });
  },
  navigateToRouteDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/routeDetail/routeDetail?id=${id}`
    });
  }
});
