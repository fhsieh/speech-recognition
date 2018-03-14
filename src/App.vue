<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <div v-if="Object.keys(sentence).length == 0" key="index">
        <Settings />
        <Index />
      </div>

      <div v-else key="sentence">
        <div class="fixed-top text-right">
          <a class="text-muted top-right" @click="close">
            <i class="icon-close"></i>
          </a>
        </div>

        <div class="container-fluid">
          <div class="row fullscreen align-items-center">
            <div class="col">
              <Target />
              <Controls />
            </div>
          </div>
        </div>

        <div class="fixed-bottom">
          <Speech :class="{ 'speech-hide': !input }" />
          <History />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Index    from '@/components/Index';
import Settings from '@/components/Settings';
import Target   from '@/components/Target';
import Controls from '@/components/Controls';
import Speech   from '@/components/Speech';
import History  from '@/components/History';

let recognition = false;

export default {
  name: 'speaking',
  components: { Index, Settings, Target, Controls, Speech, History },
  computed: {
    input() {
      return this.$store.state.input;
    },
    sentence() {
      return this.$store.state.sentence;
    }
  },
  methods: {
    close() {
      this.$store.commit('closeSentence');
    }
  },
  beforeCreate() {
    // load SpeechRecognition instance
    try {
      let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
    } catch(error) {
      console.error(error);
    }
  },
  beforeMount() {
    // load settings from localStorage and SpeechRecognition object into state
    this.$store.commit('loadSettings', recognition);
  }
}
</script>

<style lang="scss">
@import 'assets/sass/fonts';
@import 'assets/sass/bootstrap';
@import 'assets/sass/fontello';

body {
  overflow-y: hidden;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: radial-gradient(circle, transparent 50%, $gray-500 200%);
    z-index: -1;
  }
}

a {
  cursor: pointer;
}

.fixed-top {
  padding: 0.25em 0.5em !important;
  .top-right {
    font-size: 1.5em;
    line-height: 1.5em;
    vertical-align: middle;
  }
}
.fullscreen {
  height: 100vh;
  padding-bottom: 10vh;
}
.fixed-bottom {
  padding-bottom: 10vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
