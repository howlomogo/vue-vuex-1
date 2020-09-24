<template>
  <div class="home">
    <h1>Mapstate</h1>
    <h5>localCount ({{ localCount }}) + countAlias ({{countAlias}}) =</h5>
    <h1>{{ countPlusLocalState }}</h1>
    <button class="mb-2 mr-2" @click="updateLocalCount">
      Increase LOCAL count
    </button>
    <button class="mb-2" @click="increment">
      Increase STATE count
    </button>
    <br />
    (You can update local data, without affecting state)
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Home',
  data: function() {
    return {
      localCount: 5
    }
  },
  computed: mapState({
    // Different ways to map the state to the component
    // You can map say this.countAlias to state count like either of these 2 ways
    // countAlias: state => state.count,    
    countAlias: 'count',
    
    // to access local state with `this`, a normal function must be used
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  }),
  methods: {
    updateLocalCount: function() {
      this.localCount++
    },
    increment() {
      this.$store.commit('increment')
    }
  },

}


// The computed example to map count can be done even easier if we want to use the same variable name
// Which probably 100% of the time we should be
// computed: mapState([
//   'count' // This is all we need to actually map count
// ]),

// We can also use local computed properties in combination with mapState
// By using the spread operator
// computed: {
//   localComputed () { /* ... */ },
//   // mix this into the outer object with the object spread operator
//   ...mapState({
//     // ...
//   })
// }

</script>