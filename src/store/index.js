import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  mutations: {
    increment (state) {
      state.count++
    }
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
