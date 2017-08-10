<template>
  <ul :class="'hands color-'+color">
    <li v-for="(count, kind) in contents"
        v-if="count !== 0"
        :class="'hands-'+kind"
        @click="click(color, kind, $event)">
      {{kanji(kind) + " " + count}}
    </li>
  </ul>
</template>

<script>
import syogi from '@/syogi-lib'
export default {
  name: 'hands',
  components: {
  },
  props: {
    color: Number,
    contents: Object
  },
  data () {
    return {    
    }
  },
  computed: {
  },
  methods: {
    kanji (kind) {
      return syogi.Koma.kind2kanji(kind)
    },
    click (color, kind, e) {
      this.$emit('hands-clicked', new syogi.Koma(color, kind), e)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.hands {  
  border: 2px solid #666;
  color: #666;
  padding: 0;
  height: 240px;
  .reverse & {
    transform: rotate(180deg);
  }
}

li {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently */

  list-style: none;
  cursor: default;
  font-size: 1.2em;
  text-align: right;  
  &.selected {
    background: #eee;
    font-weight: bold;    
  }
  letter-spacing: 10px;
}


.color-0 {
  &:before {
    content: "先手▲:";
    padding: 3px 40px 3px 5px;
  }
}
.color-1 {
  &:before {
    content: "後手△:";
    padding: 3px 40px 3px 5px;
  }
}

.turn-0 .color-0, .turn-1 .color-1 {
  border: 2px solid #000;
  color: #000;
  li {
    cursor: pointer;
  }
}


</style>
