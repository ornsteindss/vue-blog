<template>
  <div class="auth-card">
    <h1>Login</h1>
    <p v-if="error" class="error">{{ error }}</p>
    <input v-model="email" type="email" placeholder="Email" class="input" />
    <input v-model="password" type="password" placeholder="Password" class="input" @keyup.enter="submit" />
    <button @click="submit" class="btn" :disabled="loading">{{ loading ? 'Logging in...' : 'Login' }}</button>
    <p><a href="/register">Create account</a> &nbsp;|&nbsp; <a href="/reset-password">Forgot password?</a></p>
  </div>
</template>

<script>
module.exports = {
  data() { return { email: '', password: '', error: '', loading: false }; },
  methods: {
    async submit() {
      this.error = '';
      this.loading = true;
      try {
        const res = await axios.post('/auth/login', { email: this.email, password: this.password });
        window._auth.set(res.data.user);
        window.location.href = '/';
      } catch (e) {
        this.error = e.response && e.response.data.error || 'Login failed';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
