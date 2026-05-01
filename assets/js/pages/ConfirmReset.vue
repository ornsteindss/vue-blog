<template>
  <div class="auth-card">
    <h1>Set New Password</h1>
    <p v-if="message" :class="isError ? 'error' : 'success'">{{ message }}</p>
    <template v-if="!done">
      <input v-model="password" type="password" placeholder="New password" class="input" />
      <input v-model="confirm" type="password" placeholder="Confirm password" class="input" />
      <button @click="submit" class="btn" :disabled="loading">
        {{ loading ? 'Updating...' : 'Update Password' }}
      </button>
    </template>
  </div>
</template>

<script>
module.exports = {
  data() { return { password: '', confirm: '', message: '', isError: false, loading: false, done: false }; },
  methods: {
    async submit() {
      if (this.password !== this.confirm) {
        this.message = 'Passwords do not match';
        this.isError = true;
        return;
      }
      this.loading = true;
      try {
        await axios.post('/auth/reset/' + window.__RESET_TOKEN__, { password: this.password });
        this.done = true;
        this.isError = false;
        this.message = 'Password updated. Redirecting to login...';
        setTimeout(() => { window.location.href = '/login'; }, 2000);
      } catch (e) {
        this.message = e.response && e.response.data.error || 'Something went wrong.';
        this.isError = true;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
