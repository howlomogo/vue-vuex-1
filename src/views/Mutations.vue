<template>
    <div>
        <h1>Mutations</h1>
        <h2>$store.state.count2 = {{ $store.state.count2 }}</h2>

        <button class="mb-6" @click="increment2({ amount: 5})">
            Call Increment2 with 5 as arg
        </button>
        
        <!-- This wasn't working with mapMutations just passing in 5 -->
        <!-- Quite obvious looking at the code -->
        <!-- <button class="mb-6" @click="increment2(5)">
            Call Increment2 with 5 as arg
        </button> -->
        <br />
        <h2>$store.state.count = {{ $store.state.count }}</h2>
        <button @click="increment">
            Call Increment
        </button>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
    name: 'Mutations',
    methods: {
        ...mapMutations([
            'increment',
            'increment2' // called with increment2({ amount: 5})
        ])

        // !!!Look more into this!!!, but it does seem possible to do it as below, keep it simple for now
        // ...mapMutations({
        //     increment2: function(commit, payload) {
        //         commit('increment2', payload )
        //     },
        //     increment: 'increment'
        // })




        // We can do it this way however, Will likely always use mapMutations I'd have thought.
        // Potentially there is use for doign them like this
        // increment2: function(num) {
        //     // Object-Style Commit - Exactly the same funcionality as the one below
        //     this.$store.commit({
        //         type: 'increment2', // Type - (mutation name)
        //         amount: num
        //     })
            
        //     // 2nd Arg is payload - Exactly the same as above
        //     // this.$store.commit('increment2', {
        //     //     amount: num
        //     // })
        //     // store.commit('increment', 10) - without payload just passing 1 arg - No need to ever do this
        // },
        // increment: function() {
        //     this.$store.commit('increment')
        // }
    }
}
</script>

<style>

</style>