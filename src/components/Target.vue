<template>
  <p id="target" class="display-4 text-center">
    <span
      :class="[ word.heard > -1 ? 'text-success': '' ]"
      v-for="(word, index) in words">
      {{ word.display }}
    </span>
  </p>
</template>

<script>
export default {
  computed: {
    words() {
      return this.$store.state.sentence.words;
    }
  },
  beforeMount() {
    this.$store.commit('clearHistory');
  },
  mounted() {
    if (this.$store.state.autostart) {
      this.$store.commit('toggleListening');
    }
  }
}
</script>

<style lang="scss">
#target {
  margin: 0 auto;
  max-width: 70vw;
  line-height: 1.6em;

  span {
    display: inline-block;
    font-weight: 300;
    letter-spacing: -0.025em;
    margin-left: 0.4em;
  }
}
</style>
