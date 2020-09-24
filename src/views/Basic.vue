<template>
  <div class="home">
      Basic
    <h1>{{ count }}</h1>
    <button @click="increment">
      Click to increment count
    </button>
  </div>
</template>

<script>


export default {
  name: 'Basic',
  computed: {
    count () {
      return this.$store.state.count + 5
    }
  },
  methods: {
    increment() {
      this.$store.commit('increment')
    }
  }
}
</script>
