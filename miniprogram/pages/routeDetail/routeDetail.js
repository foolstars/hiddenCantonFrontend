Page({
  data: {
    route: {},
    comments: [],
    newComment: ''
  },
  onLoad(options) {
    const { id } = options;
    this.fetchRouteDetail(id);
    this.fetchComments(id);
  },
  fetchRouteDetail(id) {
    wx.cloud.callContainer({
      config: { env: 'prod-4gi3rhrv8abf0564' },
      path: `/api/spot/route?id=${id}`,
      header: { "X-WX-SERVICE": "django-jk1n", "content-type": "application/json" },
      method: 'GET',
      success: res => {
        this.setData({ route: res.data.route });
      }
    });
  },
  fetchComments(routeId) {
    wx.cloud.callContainer({
      config: { env: 'prod-4gi3rhrv8abf0564' },
      path: `/api/msg/admin?page=1&num_per_page=10&route_id=${routeId}`,
      header: { "X-WX-SERVICE": "django-jk1n", "content-type": "application/json" },
      method: 'GET',
      success: res => {
        this.setData({ comments: res.data.messages });
      }
    });
  },
  onCommentInput(e) {
    this.setData({ newComment: e.detail.value });
  },
  submitComment() {
    const { newComment, route } = this.data;
    wx.cloud.callContainer({
      config: { env: 'prod-4gi3rhrv8abf0564' },
      path: '/api/msg/admin',
      header: { "X-WX-SERVICE": "django-jk1n", "content-type": "application/json" },
      method: 'PUT',
      data: {
        title: '评论',
        spots: [route.id],
        text: newComment,
        image: [],
        video: []
      },
      success: res => {
        wx.showToast({ title: '评论成功', icon: 'success' });
        this.fetchComments(route.id);
        this.setData({ newComment: '' });
      }
    });
  }
});
