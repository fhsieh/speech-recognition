<template>
  <div id="speech" class="row justify-content-center">
    <div class="col-8">
      <form>
        <div class="input-group input-group-lg">
          <input
            id="input"
            class="form-control"
            type="text"
            v-model="speech"
            :readonly="(online && readonly) || (!online && !listening)">
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      speech: ''
    };
  },
  computed: {
    online() {
      return this.$store.state.online;
    },
    readonly() {
      return this.$store.state.readonly;
    },
    listening() {
      return this.$store.state.listening;
    }
  },
  methods: {
    focus() {
      setTimeout(function() {
        document.getElementById('input').focus();
      }, 100);
    }
  },
  watch: {
    speech(words) {
      if (/\s+$/.test(words)) {
        // pass captured input to processSpeech method and reset
        this.$store.commit('processSpeech', words.replace(/\s+$/, ''));
        this.speech = '';
      }
    }
  },
  mounted() {
    document.getElementById('input').addEventListener('blur', this.focus);
    this.focus();
  },
  beforeDestroy() {
    document.getElementById('input').removeEventListener('blur', this.focus);
  }
}
</script>

<style lang="scss">
#speech {
  input {
    font-size: 1.5em;
    background-color: #fff;
    border-color: #5cb3fd;
    z-index: 5;
  }

  &.speech-hide {
    position: absolute;
    left: -9999px;
  }
}
</style>
