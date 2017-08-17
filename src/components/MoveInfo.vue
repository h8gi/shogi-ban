<template>
  <div class="move-info">
    <div>
      {{index}}手目: {{move.toString()}}
    </div>
    <textarea id="" name=""              
              v-model.trim="move.comments"
              >
    </textarea>
  </div>
</template>

<script>
import syogi from '@/syogi-lib'
export default {
  name: 'move-info',
  components: {
  },
  props: {
    move: {
      type: syogi.Move
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../assets/scss/common.scss';
.move-info {
  padding-top: 0px;
  div {
  }
  textarea {
    resize: none;
    width: 400px;
    height: 200px;
  }
}
</style>
