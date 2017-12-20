<template>
  <p id="target" class="display-4 text-center">
    <span
      :class="[ word.heard > -1 ? 'text-success': '' ]"
      v-for="(word, index) in words">
      {{ word.display }}
    </span>
  </p>
</template>

<script>
export default {
  props: ['words']
}
</script>

<style lang="scss">
#target {
  margin: 0 auto;
  max-width: 70vw;
  line-height: 1.6em;

  span {
    display: inline-block;
    font-weight: 300;
    letter-spacing: -0.025em;
    margin-left: 0.4em;
  }
}
</style>
