import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    // initialize properties for default state
    sentence:     {},
    history:      [],
    listening:    false,
    processing:   false,
    editing:      false
  },
  getters: {
    settings(state) {
      return {
        online:     state.online,
        autostart:  state.autostart,
        strict:     state.strict,
        input:      state.input,
        readonly:   state.readonly
      };
    },
    status(state) {
      return {
        editing:    state.editing,
        listening:  state.listening,
        processing: state.processing
      };
    },
    target(state) {
      return {
        sentence:   state.sentence,
        history:    state.history,
      };
    },
    correct(state) {
      if (Object.keys(state.sentence).length) {
        return Object.keys(state.sentence.words).reduce((total, i) => {
          return total + (state.sentence.words[i].heard > -1 ? 1 : 0);
        }, 0);
      } else {
        return 0;
      }
    }
  },
  mutations: {
    loadSettings(state, recognition) {
      // bind app behavior to SpeechRecognition methods
      if (recognition !== false) {
        recognition.onstart = function() {
          console.log('Speech recognition started');
        };
        recognition.onsoundstart = function() {
          state.processing = true;
        };
        recognition.onresult = function(event) {
          let transcript = event.results[event.resultIndex][0].transcript;

          // mobile repeat bug handling
          if (!(event.resultIndex == 1 && transcript == event.results[0][0].transcript)) {
            // pass transcript directly to processSpeech method
            store.commit('processSpeech', transcript);
            console.log('Speech: "' + transcript + '"');
          }

          state.processing = false;
        };
        recognition.onend = function() {
          console.log('Speech recognition stopped');
          state.processing = false;
          if (state.listening) {
            state.recognition.start();
          }
        };
        recognition.onerror = function(event) {
          console.log(event.error);
          if(event.error == 'no-speech') {
            console.log('No speech detected, try again');
            state.listening = false;
            state.processing = false;
          }
        };
      }

      // initialize SpeechRecognition object
      Vue.set(state, 'recognition', recognition);

      // load settings from localStorage or set defaults
      Vue.set(state, 'sentences', localStorage.getItem('sentences') ? JSON.parse(localStorage.getItem('sentences')) : ["Click the settings button to edit this sentence or add new sentences."]);
      Vue.set(state, 'online',    localStorage.getItem('online')    ? JSON.parse(localStorage.getItem('online'))    : false);
      Vue.set(state, 'autostart', localStorage.getItem('autostart') ? JSON.parse(localStorage.getItem('autostart')) : false);
      Vue.set(state, 'strict',    localStorage.getItem('strict')    ? JSON.parse(localStorage.getItem('strict'))    : false);
      Vue.set(state, 'input',     localStorage.getItem('input')     ? JSON.parse(localStorage.getItem('input'))     : false);
      Vue.set(state, 'readonly',  localStorage.getItem('readonly')  ? JSON.parse(localStorage.getItem('readonly'))  : false);
    },
    updateSetting(state, payload) {
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

      walk(state, payload.key, payload.value);
    },
    saveSettings(state) {
      // save settings to localStorage
      localStorage.setItem('sentences', JSON.stringify(state.sentences));
      localStorage.setItem('online',    state.online);
      localStorage.setItem('autostart', state.autostart);
      localStorage.setItem('strict',    state.strict);
      localStorage.setItem('input',     state.input);
      localStorage.setItem('readonly',  state.readonly);
    },
    addSentence(state) {
      state.sentences.push('');
    },
    removeSentence(state, index) {
      state.sentences.splice(index, 1);
    },
    selectSentence(state, index) {
      if (!state.editing) {
        state.sentence = {
          index: index,
          sentence: state.sentences[index],
          words: state.sentences[index].split(' ').map((word) => {
            return {
              display: word,
              match: word.replace(/[^\w\s]/g, '').toLowerCase(),
              heard: -1
            };
          })
        };
      }
    },
    closeSentence(state) {
      state.listening = false;
      state.recognition.stop();
      state.sentence = {};
    },
    processSpeech(state, transcript) {
      transcript.split(' ').forEach((word) => {
        let index = state.history.length;

        state.history.push({
          display: word,
          match: word.toLowerCase(),
          heard: function(index) {
            return state.sentence.words.findIndex(w => w.heard === index) > -1 ? true : false;
          }
        });

        if (state.strict) {
          // strict ordering: words in target sentence must be in the same order in the spoken sentence
          // check the next target sentence word where heard == -1 (initial value) against each spoken word
          let i = state.sentence.words.findIndex(w => w.heard == -1);
          if (i > -1 && state.history[index].match == state.sentence.words[i].match) {
            state.sentence.words[i].heard = index;
          }
        } else {
          // non-strict ordering: words in target sentence may be in any order in the spoken sentence
          // check all target sentence words where heard == -1 (initial value) against each spoken word
          state.sentence.words.some((w, i) => {
            if (w.heard == -1 && state.history[index].match == w.match) {
              state.sentence.words[i].heard = index;
              return true; // match only once
            }
          });
        }
      });

      // turn off listening if all words have been heard
      if (store.getters.correct === state.sentence.words.length) {
        setTimeout(() => {
          store.commit('toggleListening');
        }, 500);
      }
    },
    toggleListening(state) {
      state.listening = !state.listening;
      state.online ? state.recognition.start() : state.recognition.stop();
    },
    clearHistory(state) {
      state.speech = '';
      state.history = [];
      state.sentence.words.forEach((word) => { word.heard = -1; });
    }
  }
});
