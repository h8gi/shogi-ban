<template>
  <div :class="'hands color-'+color">
    <span id="teban" :class="color === turn ? 'visible' : 'hidden'">
      &lt;手番&gt;
    </span>
    <ul @click.self="handsClick(color)">
      <li v-for="(count, kind) in contents"
          v-if="count !== 0"
          :class="'hands-'+kind"
          @click="click(color, kind, $event)"> 
        {{kanji(kind) + " " + count}}
      </li>
    </ul>
  </div>
</template>

<script>
import syogi from '@/syogi-lib'
export default {
  name: 'hands',
  components: {
  },
  mixins: [],
  props: {
    color: Number,
    turn: Number,
    contents: Object,
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
      this.$emit('hands-koma-clicked', new syogi.Koma(color, kind), e)
    },
    handsClick (color) {
      this.$emit('hands-clicked', color)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../assets/scss/common.scss';
.hands {  
  margin-top: 22px;
  margin-bottom: 0px;

  ul {
    border: 3px solid #666;
    color: #666;
    width: 70px;
    height: 240px;
    padding: 0;
    margin: 0;
  }
  .reverse & {
    transform: rotate(180deg);
    margin-top: 0px;
    margin-bottom: 22px;
  }

  #teban {
    font-weight: bold;
    &.visible {
      visibility: visible;
    }
    &.hidden {
      visibility: hidden;
    }    
  }
}

li {
  @include no-select;
  list-style: none;
  cursor: default;
  font-size: 1em;
  text-align: left;
  padding-left: 11px;
  padding: 2px 0 0 11px;
  letter-spacing: 4px;
}


ul:before {
  padding: 2px 0;
  .color-0 & {
    content: "先手☗";
    display: inline-block;
    width: 100%;
    border-bottom: 2px solid #000;
    .turn-1 & {
      border-bottom: 2px solid #666;
    }
  }

  .color-1 & {
    content: "後手☖";
    display: inline-block;
    width: 100%;
    border-bottom: 2px solid #000;
    .turn-0 & {
      border-bottom: 2px solid #666;
    }
  }
}

.play .turn-0 .color-0, .play .turn-1 .color-1 {
  ul {
    border: 3px solid #000;
    color: #000;
  }  
  li {
    cursor: pointer;
    &.selected {
      background: #eee;
      font-weight: bold;
    }
  }
  
}
.edit {
  ul {
    border: 3px solid #000;
    color: #000;
  }
  li {
    cursor: pointer;
    &.selected {
      background: #eee;
      font-weight: bold;
    }
  }
}


</style>
