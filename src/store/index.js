import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    count2: 0,
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  mutations: {
    increment (state) {
      state.count++
    },
    increment2 (state, payload) {
      console.log(payload)
      state.count2 += payload.amount
    }
    // You can pass in one argument as below but I would always pass as a payload object, no reason to do it like below.
    // increment2 (state, n) {
    //   state.count2 += n
    // }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    // Return done todos without manipulating the state, getters good if being used in multiple components
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    },
    // Example of using getters as 2nd argument (Have access to all of them)
    doneTodosCount: (state, getters) => {
      return getters.doneTodos.length
    },
    todoById: (state) => (id) => {
      return state.todos.find(todo => todo.id ===id)
    }
  }
})
