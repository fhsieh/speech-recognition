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
      {{ tween }}
    </span>
    <a
      class="btn btn-muted"
      @click="clear">
      <i class="icon-close"></i>
    </a>
  </div>
</template>

<script>
const TWEEN = require('@tweenjs/tween.js');

export default {
  data() {
    return {
      tween: 0
    };
  },
  computed: {
    correct() {
      return this.$store.getters.correct;
    },
    listening() {
      return this.$store.state.listening;
    }
  },
  methods: {
    toggle() {
      this.$store.commit('toggleListening');
    },
    clear() {
      this.$store.commit('clearHistory');
    }
  },
  watch: {
    correct(after, before) {
      let $this = this;

      function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
      }

      let tweening = { number: before };
      new TWEEN.Tween(tweening)
        .easing(TWEEN.Easing.Quadratic.Out)
        .to({ number: after }, Math.abs(100 * (after - before)))
        .onUpdate(function() {
          $this.tween = tweening.number.toFixed(0);
        })
        .start();

      animate();
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
