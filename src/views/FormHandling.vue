<template>
    <div>
        <h1>Form Handling</h1>
        
        <!-- With vueX you CANT just bind v-model like this -->
        <!-- Because v-model is trying to mutate the message directly from our store, Will say has no setter -->
        <!-- <p>{{ message }} - ^ This will NOT work WITHOUT a setter</p>
        <input class="border" v-model="message"> -->


        <br />
        <!-- Two ways we can solve this -->
        <!-- 1. Call method to mutate state on input / change. Bind the input value and call an action on input or change, this is a bit verbose and lose some v-model features doing it like this  -->
        <p>{{ message }} - input using value and updateMessage which passes input value and commits mutation  </p>
        <input class="border mb-4" :value="message" @input="updateMessage" />

        <!--  2. Another way is to use v-model still with a two way computed property with a getter and a setter -->
        <h3>Getter and setter are set on 'message' computed works with v-model as below</h3>
        <p>{{ message }}</p>
        <input class="border" v-model="message">
    </div>
</template>

<script>
export default {
    name: 'FormHandling',
    computed: {
        // message () {
        //     return this.$store.state.message
        // }
        message: {
            get() {
                return this.$store.state.message
            },
            // Set 'message' a new value by commit this mutation
            set (value) {
                this.$store.commit('updateMessage', value)
            }
        }
    },
    methods: {
        updateMessage (e) {
            // Remember only need to dispatch actions for async
            this.$store.commit('updateMessage', e.target.value)
        }
    }
}
</script>

<style>

</style>