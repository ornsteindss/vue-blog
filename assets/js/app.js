window._auth = {
  get user() { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } },
  set(user) { localStorage.setItem('user', JSON.stringify(user)); },
  clear() { localStorage.removeItem('user'); },
};

axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      window._auth.clear();
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

(function updateNav() {
  const nav = document.getElementById('nav-auth');
  if (!nav) return;
  if (window._auth.user) {
    nav.innerHTML = '<span class="nav-user">Hello, ' + window._auth.user.name + '</span><a href="#" id="logout-btn">Logout</a>';
    document.getElementById('logout-btn').addEventListener('click', async function (e) {
      e.preventDefault();
      await axios.post('/auth/logout').catch(() => {});
      window._auth.clear();
      window.location.href = '/';
    });
  }
})();

function mountPage(elId, vuePath, propsData) {
  var el = document.getElementById(elId);
  if (!el) return;
  new Vue({
    el: el,
    components: { PageComponent: httpVueLoader(vuePath) },
    data: function() { return { pageProps: propsData || {} }; },
    template: '<PageComponent v-bind="pageProps" />',
  });
}

mountPage('new-post-app',      '/js/pages/NewPost.vue');
mountPage('login-app',         '/js/pages/Login.vue');
mountPage('register-app',      '/js/pages/Register.vue');
mountPage('reset-app',         '/js/pages/ResetPassword.vue');
mountPage('confirm-reset-app', '/js/pages/ConfirmReset.vue');

if (document.getElementById('post-app')) {
  mountPage('post-app', '/js/pages/Post.vue', {
    postData:     window.__POST__,
    commentsData: window.__COMMENTS__,
  });
}

if (document.getElementById('home-app') && typeof window.__INITIAL_TOTAL__ !== 'undefined') {
  mountPage('home-app', '/js/pages/Home.vue', {
    initialTotal: window.__INITIAL_TOTAL__,
    initialCount: window.__INITIAL_COUNT__,
  });
}
