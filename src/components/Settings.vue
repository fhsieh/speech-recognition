<template>
  <div id="settings" class="fixed-top text-right">
    <transition-group name="fade" tag="div">
      <span v-if="editing" key="options">
        <a class="btn btn-pill"
          :class="[ recognition == false ? 'text-muted' : online ? 'btn-success' : 'btn-secondary' ]"
          @click="recognition !== false ? update('online', !online) : null">
          <i class="icon icon-mic"></i> Online recognition
        </a>
        <a class="btn btn-pill"
          :class="[ autostart ? 'btn-success' : 'btn-secondary' ]"
          @click="update('autostart', !autostart)">
          <i class="icon icon-play"></i> Auto-start mic
        </a>
        <a class="btn btn-pill"
          :class="[ strict ? 'btn-success' : 'btn-secondary' ]"
          @click="update('strict', !strict)">
          <i class="icon icon-shuffle"></i> Strict word order
        </a>
        <a class="btn btn-pill"
          :class="[ input ? 'btn-success' : 'btn-secondary' ]"
          @click="update('input', !input)">
          <i class="icon icon-keyboard"></i> Show text input
        </a>
        <a class="btn btn-pill"
          :class="[ !online || !input ? 'text-muted' : readonly ? 'btn-success' : 'btn-secondary' ]"
          @click="online && input ? update('readonly', !readonly) : null">
          <i class="icon icon-lock"></i> Read-only
        </a>
      </span>

      <a class="top-right"
        :class="[ editing ? 'text-danger animate-spin' : saving ? 'text-success' : 'text-muted' ]"
        @click="edit" key="settings">
        <i class="icon" :class="[ saving ? 'icon-check' : 'icon-gear']"></i>
      </a>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: ['editing', 'recognition', 'online', 'autostart', 'strict', 'input', 'readonly'],
  data: function() {
    return {
      saving: false
    }
  },
  methods: {
    edit: function() {
      this.saving = false;
      if (this.editing) {
        this.saving = true;
        this.$emit('save');
        let $this = this;
        setTimeout(function() {
          $this.saving = false;
        }, 2000)
      }
      this.update('editing', !this.editing);
    },
    update: function(key, value) {
      this.$emit('update', key, value);
    }
  }
}
</script>

<style lang="scss">
#settings {
  a.btn {
    font-size: 0.75em;
    font-weight: 300;
    line-height: 1.5rem;
    padding: 0 1em;
    color: #fff;
    border-radius: 10em;

    &.text-muted {
      cursor: default;
    }

    .icon:before {
      font-size: 1rem;
      line-height: 1.5rem !important;
      margin: 0 0.25em 0 0;
      vertical-align: middle;
    }

    .icon-mic:before,
    .icon-play:before,
    .icon-lock:before {
      margin-left: -0.25em;
    }
  }

  a .icon-check {
    animation-name: saving;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }

  @keyframes saving {
    0% { opacity: 0; }
    40%, 100% { opacity: 1; }
  }
}
</style>
