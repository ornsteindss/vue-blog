<template>
  <div class="auth-card">
    <h1>Register</h1>
    <p v-if="error" class="error">{{ error }}</p>
    <input v-model="name" placeholder="Name" class="input" />
    <input v-model="email" type="email" placeholder="Email" class="input" />
    <input v-model="password" type="password" placeholder="Password" class="input" @keyup.enter="submit" />
    <button @click="submit" class="btn" :disabled="loading">{{ loading ? 'Creating...' : 'Create Account' }}</button>
    <p><a href="/login">Already have an account?</a></p>
  </div>
</template>

<script>
module.exports = {
  data() { return { name: '', email: '', password: '', error: '', loading: false }; },
  methods: {
    async submit() {
      this.error = '';
      this.loading = true;
      try {
        const res = await axios.post('/auth/signup', { name: this.name, email: this.email, password: this.password });
        window._auth.set(res.data.user);
        window.location.href = '/';
      } catch (e) {
        this.error = e.response && e.response.data.error || 'Registration failed';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
