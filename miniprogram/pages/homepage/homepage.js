Page({
  data: {
    routes: [],
    spots: {} // 用于存储各条路线的景点信息
  },
  onLoad() {
    console.log('首页加载'); // 确认页面加载
    this.fetchRouteList();
    // 如果 API 没有返回数据，使用模拟数据进行测试
    setTimeout(() => {
      const mockRoutes = [
        { id: 1, name: '路线 1', description: '描述 1' },
        { id: 2, name: '路线 2', description: '描述 2' }
      ];
      this.setData({ routes: mockRoutes });
      mockRoutes.forEach(route => {
        this.setData({
          spots: {
            ...this.data.spots,
            [route.id]: [
              { id: 1, name: '景点 1', location: '位置 1' },
              { id: 2, name: '景点 2', location: '位置 2' }
            ]
          }
        });
      });
    }, 1000);
  },
  fetchRouteList() {
    console.log('Fetching route list');
    wx.cloud.callContainer({
      config: { env: 'prod-4gi3rhrv8abf0564' },
      path: '/api/spot/route?page=1&num_per_page=10',
      header: { "X-WX-SERVICE": "django-jk1n", "content-type": "application/json" },
      method: 'GET',
      success: res => {
        console.log('API response:', res.data);
        if (res.data && res.data.routes) {
          this.setData({ routes: res.data.routes });
          // Fetch spot list for each route
          res.data.routes.forEach(route => {
            this.fetchSpotList(route.id);
          });
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
  fetchSpotList(routeId) {
    console.log('Fetching spot list for route', routeId);
    wx.cloud.callContainer({
      config: { env: 'prod-4gi3rhrv8abf0564' },
      path: `/api/spot/info?page=1&num_per_page=10&route_id=${routeId}`,
      header: { "X-WX-SERVICE": "django-jk1n", "content-type": "application/json" },
      method: 'GET',
      success: res => {
        console.log('API response for spots:', res.data);
        if (res.data && res.data.spots) {
          this.setData({ spots: { ...this.data.spots, [routeId]: res.data.spots } });
        }
      },
      fail: err => {
        console.error('Error fetching spot list:', err);
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
