<template>
    <div>
        <h1>Getters</h1>
        <!-- IF SETTING getDoneTodosCount / getDoneTodos in computed -->
        <!-- I'm really not sure why you would ever do this? over mapGetters-->
        <!-- <p>Done todos count: {{ getDoneTodosCount }}</p>
        <p>Done todos: {{ getDoneTodos }}</p> -->
        
        <!-- Using mapGetters -->
        <p>Done todos count: {{ doneTodosCount }}</p>
        <p>Done todos: {{ doneTodos }}</p>

        <!-- Pass arg to getter, also showing you can call directly here,
        not sure what the advantage of using computed is? -->
        <p>Todo by id: {{ $store.getters.todoById(2) }}</p>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Getters',
    computed: {
        // getDoneTodosCount: function() {
        //     return this.$store.getters.doneTodosCount // Again you could just put this.$store etc in the {{}}
        // },
        // getDoneTodos: function() {
        //     return this.$store.getters.doneTodos
        // }
        ...mapGetters([
            'doneTodosCount',
            'doneTodos'
        ])
        
        // If you want to map a getter to a different name, use an object:
        // ...mapGetters({
        // // map `this.doneCount` to `this.$store.getters.doneTodosCount`
        // doneCount: 'doneTodosCount'
        // })
    }
}
</script>

<style>

</style>