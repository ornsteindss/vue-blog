<template>
  <div>
    <article class="post-full">
      <h1>{{ post.title }}</h1>
      <div class="post-meta">By {{ post.authorName }} &mdash; {{ new Date(post.createdAt).toLocaleDateString('en-GB') }}</div>
      <div class="post-body">{{ post.body }}</div>
      <div v-if="isOwner" class="post-actions">
        <button @click="editMode = !editMode" class="btn btn-secondary">Edit</button>
        <button @click="deletePost" class="btn btn-danger" :disabled="deleting">
          {{ deleting ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
      <p v-if="postError" class="error" style="margin-top:.75rem">{{ postError }}</p>
      <div v-if="editMode" class="form-card" style="margin-top:1rem">
        <input v-model="editTitle" class="input" />
        <textarea v-model="editBody" class="input" rows="6"></textarea>
        <p v-if="editError" class="error">{{ editError }}</p>
        <button @click="saveEdit" class="btn" :disabled="saving">{{ saving ? 'Saving...' : 'Save' }}</button>
        <button @click="editMode = false" class="btn btn-secondary">Cancel</button>
      </div>
    </article>

    <section class="comments">
      <h2>Comments ({{ allComments.length }})</h2>
      <div v-for="(c, i) in allComments" :key="i" class="comment">
        <strong>{{ c.authorName }}</strong>
        <p>{{ c.body }}</p>
        <small>{{ new Date(c.createdAt).toLocaleDateString('en-GB') }}</small>
      </div>
      <div v-if="isLoggedIn" class="form-card">
        <textarea v-model="commentBody" placeholder="Add a comment..." class="input" rows="3"></textarea>
        <p v-if="commentError" class="error">{{ commentError }}</p>
        <button @click="addComment" class="btn" :disabled="commenting">
          {{ commenting ? 'Submitting...' : 'Submit' }}
        </button>
      </div>
      <p v-else><a href="/login">Login</a> to comment.</p>
    </section>
  </div>
</template>

<script>
module.exports = {
  props: {
    postData:     Object,
    commentsData: Array,
  },
  data() {
    return {
      post:         this.postData,
      allComments:  this.commentsData || [],
      isOwner:      false,
      commentBody:  '',
      editMode:     false,
      editTitle:    this.postData.title,
      editBody:     this.postData.body,
      saving:       false,
      deleting:     false,
      commenting:   false,
      postError:    '',
      editError:    '',
      commentError: '',
    };
  },
  computed: {
    isLoggedIn() { return !!window._auth.user; },
  },
  async mounted() {
    if (window._auth.user) {
      try {
        const res = await axios.get('/api/posts/' + this.post.slug);
        this.isOwner = res.data.isOwner;
      } catch {}
    }
  },
  methods: {
    async addComment() {
      this.commentError = '';
      this.commenting = true;
      try {
        const res = await axios.post('/api/comments', { body: this.commentBody, postSlug: this.post.slug });
        this.allComments.push(res.data);
        this.commentBody = '';
      } catch (e) {
        this.commentError = e.response && e.response.data.error || 'Failed to submit comment.';
      } finally {
        this.commenting = false;
      }
    },
    async saveEdit() {
      this.editError = '';
      this.saving = true;
      try {
        await axios.put('/api/posts/' + this.post.slug, { title: this.editTitle, body: this.editBody });
        this.post.title = this.editTitle;
        this.post.body  = this.editBody;
        this.editMode   = false;
      } catch (e) {
        this.editError = e.response && e.response.data.error || 'Failed to save changes.';
      } finally {
        this.saving = false;
      }
    },
    async deletePost() {
      this.postError = '';
      this.deleting = true;
      try {
        await axios.delete('/api/posts/' + this.post.slug);
        window.location.href = '/';
      } catch (e) {
        this.postError = e.response && e.response.data.error || 'Failed to delete post.';
        this.deleting = false;
      }
    },
  },
};
</script>
