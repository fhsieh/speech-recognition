<template>
  <div id="history" class="row justify-content-center">
    <div class="col-8">
      <i class="icon-comment text-muted"></i>
      <span
        class="badge"
        :class="[ word.heard(index) ? 'badge-success' : 'badge-secondary']"
        v-for="(word, index) in history">
        {{ word.display }}
      </span>
      <transition name="fade">
        <i class="icon-spin animate-spin text-muted" v-if="processing"></i>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    processing() {
      return this.$store.state.processing;
    },
    history() {
      return this.$store.state.history;
    }
  }
}
</script>

<style lang="scss">
#history {
  font-size: 2em;

  .icon-comment {
    margin-left: -1.5em;
  }

  .badge {
    vertical-align: text-bottom;
    margin-right: 0.25em;
    padding-bottom: 0.3em;
    font-weight: 500;
  }

  .icon-spin {
    display: inline-block;
    width: 1.5em;
    height: 1.5em;
    padding: 0.25em;
    vertical-align: bottom;

    &:before {
      display: inline-block;
      margin: 0;
      vertical-align: top;
    }
  }
}
</style>
