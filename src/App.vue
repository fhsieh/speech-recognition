<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <div v-if="Object.keys(sentence).length == 0" key="index">
        <settings
          :editing="editing"
          :recognition="recognition"
          :online="online"
          :autostart="autostart"
          :strict="strict"
          :input="input"
          :readonly="readonly"
          @update="update"
          @save="save">
        </settings>
        <index
          :editing="editing"
          :sentences="sentences"
          @select="select"
          @add="add"
          @update="update"
          @remove="remove">
        </index>
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
              <target
                :words="sentence.words">
              </target>
              <controls
                :online="online"
                :listening="listening"
                :correct="correct"
                :correctTween="correctTween"
                @toggle="toggle"
                @clear="clear">
              </controls>
            </div>
          </div>
        </div>

        <div class="fixed-bottom">
          <speech :class="{ 'speech-hide': !input }">
            <input
              id="input"
              class="form-control"
              type="text"
              slot="input"
              v-model="speech"
              :readonly="(online && readonly) || (!online && !listening)">
          </speech>
          <history
            :history="history"
            :processing="processing">
          </history>
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

const TWEEN = require('@tweenjs/tween.js');

let recognition = false;

export default {
  beforeCreate: function() {
    try {
      let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
    } catch(error) {
      console.error(error);
    }
  },
  beforeMount: function() {
    // load recognition instance
    if (recognition !== false) {
      let $this = this;

      this.recognition.onstart = function() {
        console.log('Speech recognition started');
      };
      this.recognition.onsoundstart = function() {
        $this.processing = true;
      };
      this.recognition.onresult = function(event) {
        let transcript = event.results[event.resultIndex][0].transcript;

        if(!(event.resultIndex == 1 && transcript == event.results[0][0].transcript)) { // mobile repeat bug handling
          $this.speech = transcript + ' '; // add space at end to trigger watcher
          console.log('Speech: "' + transcript + '"');
        }

        $this.processing = false;
      };
      this.recognition.onend = function() {
        console.log('Speech recognition stopped');
        $this.processing = false;
        if ($this.listening) {
          $this.recognition.start();
        }
      };
      this.recognition.onerror = function(event) {
        console.log(event.error);
        if(event.error == 'no-speech') {
          console.log('No speech detected, try again');
          $this.listening = false;
          $this.processing = false;
        }
      };
    }

    // load settings from local storage
    this.sentences = JSON.parse(this.$localStorage.get('sentences', '["Click the settings button to edit this sentence or add new sentences."]'));
    this.online = JSON.parse(this.$localStorage.get('online', false));
    this.autostart = JSON.parse(this.$localStorage.get('autostart', false));
    this.strict = JSON.parse(this.$localStorage.get('strict', false));
    this.input = JSON.parse(this.$localStorage.get('input', false));
    this.readonly = JSON.parse(this.$localStorage.get('readonly', false));
  },
  name: 'speaking',
  data: function() {
    return {
      recognition: recognition,
      sentence: {},
      speech: '',
      history: [],
      correctTween: 0,
      listening: false,
      processing: false,
      editing: false,
      // localstorage data
      sentences: [],
      online: false,
      autostart: false,
      strict: false,
      input: false,
      readonly: false
    };
  },
  components: {
    index: Index,
    settings: Settings,
    target: Target,
    controls: Controls,
    speech: Speech,
    history: History
  },
  computed: {
    correct: function() {
      if (Object.keys(this.sentence).length) {
        let $this = this;
        return Object.keys($this.sentence.words).reduce((total, i) => {
          return total + ($this.sentence.words[i].heard > -1 ? 1 : 0);
        }, 0);
      } else {
        return 0;
      }
    }
  },
  watch: {
    speech: function(words) {
      if (/\s+$/.test(words)) {
        let $this = this;

        words.replace(/\s+$/, '').split(' ').forEach((word) => {
          let index = $this.history.length;

          $this.history.push({
            display: word,
            match: word.toLowerCase(),
            heard: function(index) {
              return $this.sentence.words.findIndex(w => w.heard === index) > -1 ? true : false;
            }
          });

          if ($this.strict) {
            // strict ordering: words in target sentence must be in the same order in the spoken sentence
            // check the next target sentence word where heard == -1 (initial value) against each spoken word
            let i = $this.sentence.words.findIndex(w => w.heard == -1);
            if (i > -1 && $this.history[index].match == $this.sentence.words[i].match) {
              $this.sentence.words[i].heard = index;
            }
          } else {
            // non-strict ordering: words in target sentence may be in any order in the spoken sentence
            // check all target sentence words where heard == -1 (initial value) against each spoken word
            $this.sentence.words.some((w, i) => {
              if (w.heard == -1 && $this.history[index].match == w.match) {
                $this.sentence.words[i].heard = index;
                return true; // match only once
              }
            });
          }
        });

        // reset, so we don't recheck old data each time
        this.speech = '';
      }
    },
    correct: function(after, before) {
      let $this = this;

      function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
      }

      let tweeningNumber = { number: before };
      new TWEEN.Tween(tweeningNumber)
        .easing(TWEEN.Easing.Quadratic.Out)
        .to({ number: after }, Math.abs(100 * (after - before)))
        .onUpdate(function() {
          $this.correctTween = tweeningNumber.number.toFixed(0);
        })
        .start();

      animate();

      // turn off mic once all words have been recognized
      if (this.online && this.listening && Object.keys(this.sentence).length && this.sentence.words.length == this.correct) {
        this.toggle();
      }
    },
    online: function(online) {
      if (!online) {
        this.readonly = false;
      }
    }
  },
  methods: {
    select: function(index) {
      this.sentence = {
        index: index,
        sentence: this.sentences[index],
        words: this.sentences[index].split(' ').map((word) => {
          return {
            display: word,
            match: word.replace(/[^\w\s]/g, '').toLowerCase(),
            heard: -1
          };
        })
      };
      this.clear();
      if (this.autostart) {
        this.toggle();
      }
    },
    toggle: function() {
      this.listening = !this.listening;

      if (this.online) {
        this.recognition.start();
      } else {
        this.recognition.stop();
      }
    },
    clear: function() {
      this.speech = '';
      this.history = [];
      this.sentence.words.forEach((word) => { word.heard = -1; });
    },
    close: function() {
      this.listening = false;
      this.recognition.stop();
      this.sentence = {};
    },
    add: function() {
      this.sentences.push('');
    },
    update: function(key, value) {
      function walk(o, k, v) {
        if (typeof k == 'string')
          return walk(o, k.split('.'), v);
        else if (k.length == 1 && v !== undefined)
          return o[k[0]] = v;
        else if (k.length == 0)
          return o;
        else
          return walk(o[k[0]], k.slice(1), v);
      }

      walk(this, key, value);
    },
    remove: function(index) {
      this.sentences.splice(index, 1);
    },
    save: function() {
      this.$localStorage.set('sentences', JSON.stringify(this.sentences));
      this.$localStorage.set('online', this.online);
      this.$localStorage.set('autostart', this.autostart);
      this.$localStorage.set('strict', this.strict);
      this.$localStorage.set('input', this.input);
      this.$localStorage.set('readonly', this.readonly);
    }
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
