<template>
  <div class="post-card">
    <h2><a :href="'/post/' + post.slug">{{ post.title }}</a></h2>
    <p class="excerpt">{{ excerpt }}</p>
    <div class="post-meta">
      <span>{{ post.authorName }} &middot; {{ date }}</span>
      <button v-if="post.isOwner" @click="$emit('delete', post.slug)" class="btn btn-danger btn-sm">Delete</button>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: { post: Object },
  computed: {
    excerpt() { return this.post.body.length > 200 ? this.post.body.substring(0, 200) + '...' : this.post.body; },
    date()    { return new Date(this.post.createdAt).toLocaleDateString('en-GB'); },
  },
};
</script>
