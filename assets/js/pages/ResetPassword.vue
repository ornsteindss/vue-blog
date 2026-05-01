<template>
  <div class="auth-card">
    <h1>Reset Password</h1>
    <p v-if="message" :class="isError ? 'error' : 'success'">{{ message }}</p>
    <input v-model="email" type="email" placeholder="Your email" class="input" />
    <button @click="submit" class="btn" :disabled="loading">
      {{ loading ? 'Sending...' : 'Send Reset Link' }}
    </button>
    <p><a href="/login">Back to login</a></p>
  </div>
</template>

<script>
module.exports = {
  data() { return { email: '', message: '', isError: false, loading: false }; },
  methods: {
    async submit() {
      this.message = '';
      this.loading = true;
      try {
        const res = await axios.post('/auth/reset', { email: this.email });
        this.message = res.data.message;
        this.isError = false;
      } catch (e) {
        this.message = e.response && e.response.data.error || 'Something went wrong. Please try again.';
        this.isError = true;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
