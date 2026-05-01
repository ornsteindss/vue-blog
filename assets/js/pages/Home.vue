<template>
  <div>
    <p v-if="error" class="error" style="margin-bottom:1rem">{{ error }}</p>
    <div v-if="clientPosts.length" class="posts-grid" style="margin-top:1rem">
      <post-card
        v-for="post in clientPosts"
        :key="post.slug"
        :post="post"
        @delete="deletePost"
      />
    </div>
    <div class="load-more" v-if="hasMore">
      <button @click="loadMore" class="btn" :disabled="loading">
        {{ loading ? 'Loading...' : 'Load More' }}
      </button>
    </div>
  </div>
</template>

<script>
module.exports = {
  components: { 'post-card': httpVueLoader('/js/components/PostCard.vue') },
  props: {
    initialTotal: Number,
    initialCount: Number,
  },
  data() {
    return {
      clientPosts: [],
      page:        2,
      loading:     false,
      total:       this.initialTotal,
      error:       '',
    };
  },
  computed: {
    hasMore() { return this.initialCount + this.clientPosts.length < this.total; },
  },
  methods: {
    async loadMore() {
      this.loading = true;
      this.error = '';
      try {
        const res = await axios.get('/api/posts?page=' + this.page + '&limit=10');
        this.clientPosts = this.clientPosts.concat(res.data.posts);
        this.page++;
      } catch (e) {
        this.error = e.response && e.response.data.error || 'Failed to load posts. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    async deletePost(slug) {
      this.error = '';
      try {
        await axios.delete('/api/posts/' + slug);
        this.clientPosts = this.clientPosts.filter(p => p.slug !== slug);
        this.total--;
      } catch (e) {
        this.error = e.response && e.response.data.error || 'Failed to delete post.';
      }
    },
  },
};
</script>
