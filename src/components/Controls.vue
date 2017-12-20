<template>
  <div id="controls" class="display-1 text-center">
    <a
      class="btn"
      :class="[ listening ? 'btn-danger' : 'btn-muted']"
      @click="toggle">
      <i :class="[ listening ? 'icon-mic' : 'icon-mic-off']"></i>
    </a>
    <span
      id="correct"
      class="badge badge-pill"
      :class="[ correct > 0 ? 'badge-success' : 'badge-muted']">
      {{ correctTween }}
    </span>
    <a
      class="btn btn-muted"
      @click="clear">
      <i class="icon-close"></i>
    </a>
  </div>
</template>

<script>
export default {
  props: ['online', 'listening', 'correct', 'correctTween'],
  methods: {
    toggle: function() {
      this.$emit('toggle');
    },
    clear: function() {
      this.$emit('clear');
    }
  }
}
</script>

<style lang="scss">
#controls {
  margin-top: 5vh;

  a.btn,
  span {
    display: inline-block;
    width: 1.5em;
    height: 1.5em;
    margin: 0;
    padding: 0.25em 0 0 0;
    border-radius: 10rem;
    color: #fff;
    font-size: 4.5rem;
    line-height: 1;
    text-align: center;
    vertical-align: top;
  }

  #correct {
    font-family: 'Roboto Condensed';
    letter-spacing: -0.1em;
    padding-right: 0.1em;
  }
}
</style>
