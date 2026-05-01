<template>
  <div>
    <button v-if="isLoggedIn" @click="open" class="btn">+ New Post</button>

    <teleport-modal v-if="showModal" @close="close">
      <h2 class="modal-title">New Post</h2>
      <input v-model="form.title" placeholder="Title" class="input" />
      <textarea v-model="form.body" placeholder="Content" class="input" rows="8"></textarea>
      <p v-if="error" class="error">{{ error }}</p>
      <div class="modal-actions">
        <button @click="submit" class="btn" :disabled="submitting">
          {{ submitting ? 'Publishing...' : 'Publish' }}
        </button>
        <button @click="close" class="btn btn-secondary">Cancel</button>
      </div>
    </teleport-modal>
  </div>
</template>

<script>
var ModalOverlay = {
  template: '<div class="modal-overlay" @click.self="$emit(\'close\')">' +
              '<div class="modal-box">' +
                '<button class="modal-close" @click="$emit(\'close\')">&times;</button>' +
                '<slot />' +
              '</div>' +
            '</div>',
};

module.exports = {
  components: { 'teleport-modal': ModalOverlay },
  data() {
    return {
      isLoggedIn: !!window._auth.user,
      showModal:  false,
      submitting: false,
      error:      '',
      form:       { title: '', body: '' },
    };
  },
  methods: {
    open() {
      this.showModal = true;
      document.body.style.overflow = 'hidden';
    },
    close() {
      this.showModal = false;
      this.error = '';
      document.body.style.overflow = '';
    },
    async submit() {
      this.error = '';
      this.submitting = true;
      try {
        await axios.post('/api/posts', this.form);
        window.location.href = '/';
      } catch (e) {
        this.error = e.response && e.response.data.error || 'Failed to create post.';
        this.submitting = false;
      }
    },
  },
};
</script>
