<template>
    <div>
        <h1>Actions</h1>
        <h1>{{ $store.state.count }}</h1>
        <p>Call (increment method) which disptches -> (increment action) which commits -> (increment method) -> Which updates count state </p>
        <button class="mb-6" @click="increment">
            Increment
        </button>
        <p>The below button calls increment1 with a fake settimeout on action, to simulate api call</p>
        <p class="font-bold">
            Notice in VueX chrome, the mutation is not done until after the settime is finished, this is the whole point of actions for asyncronus
        </p>
        <button class="mb-8" @click="increment1">
            Increment after fake timeout
        </button>

        <p>The below button calls increment1 with a fake settimeout on action, to simulate api call</p>
        <p class="font-bold">
            Notice in VueX chrome, the mutation is not done until after the settime is finished, this is the whole point of actions for asyncronus
        </p>

        <h1>Count2 = {{ $store.state.count2 }}</h1>
        <button class="mb-8" @click="incrementWithPayload">
            Call incrementWithPayload method with payload passed in
        </button>


        <p>You can map actions, call someMappedAction which has settimeout 2 secs</p>
        <button class="mr-4" @click="$store.dispatch('someMappedAction')">
            Call $store.dispatch.someMappedAction
        </button>

        <!-- Mapped as obj is called like -->
        <button @click="mappedActionAlias">
            Call mappedActionAlias
        </button>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    name: 'Action',
    methods: {
        increment: function() {
            // Actions are triggered with the store.dispatch method
            this.$store.dispatch('increment')
        },
        // Also you can just do this rather than function() <----
        increment1 () {
            // Actions are triggered with the store.dispatch method
            this.$store.dispatch('incrementAction1')
        },
        // You can pass with payloads as usual
        incrementWithPayload () { // One thing to note <-- this as oppose to below, passes type in the payload
            this.$store.dispatch({
                type: 'incrementWithPayload', // Action name
                amount: 7
            })
        },
        // And do it the other way also
        // incrementWithPayload () {
        //     this.$store.dispatch('incrementWithPayload', {
        //         amount: 10
        //     })
        // },
        ...mapActions([
            'someMappedAction'
        ]),
        ...mapActions({
            mappedActionAlias: 'someMappedAction' // map `this.add()` to `this.$store.dispatch('increment')`
        })
    }
}
</script>

<style>

</style>