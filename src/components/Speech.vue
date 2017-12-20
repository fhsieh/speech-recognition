<template>
  <div id="speech" class="row justify-content-center">
    <div class="col-8">
      <form>
        <div class="input-group input-group-lg">
          <slot name="input"></slot>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    focus: function() {
      setTimeout(function() {
        document.getElementById('input').focus();
      }, 100);
    }
  },
  mounted: function() {
    document.getElementById('input').addEventListener('blur', this.focus);
    document.getElementById('input').focus();
  },
  beforeDestroy: function() {
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
