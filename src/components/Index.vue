<template>
  <div id="index" class="container">
    <div class="row fullscreen justify-content-center align-items-center">
      <div class="col-10">
        <p class="text-muted">Choose a sentence:</p>
        <div class="list-group">
          <transition-group name="slide" tag="div" @enter="focus">
            <a
              class="list-group-item"
              :class="{ 'list-group-item-action': !editing }"
              :key="keys[index]"
              v-for="(sentence, index) in sentences"
              @click="select(index)">
              <span class="badge badge-secondary">{{ index + 1 }}</span>
              <transition name="fade">
                <a
                  class="remove text-danger"
                  v-if="editing"
                  @click="remove(index, $event.target)">
                  <i class="icon-remove"></i>
                </a>
              </transition>
              <span class="sentence" v-if="!editing">{{ sentence }}</span>
              <input
                v-else
                class="form-control"
                type="text"
                :value="sentence"
                @input="update('sentences.' + index, $event.target.value)">
            </a>
          </transition-group>
        </div>
        <transition name="fade">
          <a
            class="add text-success"
            v-if="editing"
            @click="add">
            <i class="icon-add"></i>
          </a>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keys: [],
      nextkey: 0
    };
  },
  computed: {
    editing() {
      return this.$store.state.editing;
    },
    sentences() {
      return this.$store.state.sentences;
    }
  },
  methods: {
    select(index) {
      this.$store.commit('selectSentence', index);
    },
    add() {
      this.keys.push(this.nextkey);
      this.nextkey++;
      this.$store.commit('addSentence');
    },
    remove(index) {
      this.keys.splice(index, 1);
      this.$store.commit('removeSentence', index);
    },
    update(key, value) {
      this.$store.commit('updateSetting', { key: key, value: value });
    },
    focus(element) {
      let inputs = element.getElementsByTagName('input');
      if (inputs.length) {
        inputs[0].focus();
      }
    }
  },
  beforeMount() {
    for (let i = 0; i < this.sentences.length; i++) {
      this.keys.push(this.nextkey);
      this.nextkey++;
    }
  }
}
</script>

<style lang="scss">
#index {
  p.text-muted {
    margin-bottom: 0.5em;
    font-weight: 300;
  }

  a.list-group-item {
    font-weight: 300;
    padding: 0.25em;
    overflow: hidden;

    &:not(.list-group-item-action) {
      cursor: default;
    }

    .badge {
      display: inline-block;
      position: absolute;
      top: 1em;
      left: 1em;
      width: 1.25rem;
      height: 1.25rem;
      padding: 0;
      line-height: 1.25rem;
      border-radius: 10em;
    }

    .sentence {
      display: inline-block;
      width: 100%;
      padding: 0.5rem 0.75rem 0.5rem 2.5rem;
      font-size: 1rem;
      line-height: 1.25;
      &:after {
        content: ' ';
        display: inline-block;
      }
    }

    input {
      width: 100%;
      padding-left: 2.5rem;
      border-width: 0;
      font-family: Roboto;
      font-weight: 300;
    }

    .remove {
      position: absolute;
      right: 0.25em;
      font-size: 1.5em;
    }
  }

  .add {
    position: absolute;
    right: 15px;
    margin-right: 0.25em;
    margin-top: 0.5rem;
    font-size: 1.5em;
    border-right: 1px solid transparent;
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.5s;
    z-index: -1;
  }
  .slide-enter,
  .slide-leave-to {
    margin-top: -2.875rem;
    opacity: 0;
    transform: scale(0.95) translateY(1.25rem);
  }
}
</style>
