<template>
    <div>
        <h1>Modules</h1>
        <p>Users Is: {{ users }}</p>
        <button class="mb-8" @click="getUsers(['Matt', 'Qing', 'Bob', 'Chris'])">Click to get Users</button>

        <h3>Sum of rootState.count + local state.count from module = <strong>{{ getRootstatePlusStateCount }}</strong></h3>

        <p>Dispatch module1/someOtherAction which in turn dispatches action for increment on root, and also commit increment2 mutation from root </p>
        <h3>root count = {{ $store.state.count }}</h3>
        <h3>root count2 = {{ $store.state.count2 }}</h3>
        <h3>module count = {{ $store.state.module1.count }}</h3>
        <button @click="someOtherAction">
            Call 'module1/someOtherAction'
        </button>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
    name: 'Modules',
    methods: {
        getUsers: function(users) { // Remember fat arrow functions don't have access to this
            this.$store.dispatch({
                type: 'module1/getUsers', // Namespaced DOES affect this
                users: users
            })
        },
        someOtherAction: function() {
            this.$store.dispatch('module1/someOtherAction')
        }
    },
    computed: {
        ...mapState({
            users: state => state.module1.users // namespaced doesn't affect this
        }),
        ...mapGetters({
            // Map this.getRootstatePlusStateCount to the modules getter
            getRootstatePlusStateCount: 'module1/getRootstatePlusStateCount' // module is namespaced other wise it would be 'getRootstatePlusStateCount'
        })
    }
}
</script>

<style>

</style>