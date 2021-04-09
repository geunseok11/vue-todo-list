import Vue from 'vue'
import Lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string'
import _cloneDeep from 'lodash/cloneDeep'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _findIdex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'

export default {
    namespaced: true,
    state: () => ({
        db: null,
        todos: [],
        filter: 'all'
    }),
    getters: {
        filteredTodos(state) {
            switch (state.filter) {
                case 'all':
                default:
                    return state.todos
                case 'active': // 해야할 항목
                    return state.todos.filter(todo => !todo.done)
                case 'completed': // 완료된 항목
                    return state.todos.filter(todo => todo.done)
            }
        },
        total(state) {
            return state.todos.length
        },
        activeCount(state) {
            return state.todos.filter(todo => !todo.done).length
        },
        completedCount(state, getters) {
            return getters.total - getters.activeCount
        }
    },
    mutations: {
        assignDB(state, db) {
            state.db = db
        },

        createDB(state, newTodo) {
            state.db
                .get('todos') // lodash
                .push(newTodo) // lodash
                .write() // lowdb
        },
        updateDB(state, { todo, value }) {
            state.db
                .get('todos')
                .find({ id: todo.id })
                .assign(value)
                .write()
        },
        deleteDB(state, todo) {
            state.db
                .get('todos')
                .remove({ id: todo.id })
                .write()
        },
        assignTodos(state, todos) {
            state.todos = todos
        },
        pushTodo(state, newTodo) {
            state.todos.push(newTodo)
        },
        assignTodo(state, { foundTodo, value }) {
            _assign(foundTodo, value)
        },
        deleteTodo(state, foundIdex) {
            Vue.delete(state.todos, foundIdex)
        },
        updateTodo(state, { todo, key, value }) {
            todo[key] = value
        },
        updateFilter(state, filter) {
            state.filter = filter
        }
    },
    actions: {
        initDB({ state, commit }) {
            const adapter = new LocalStorage('todo-app')
            // state.db = lowdb(adapter)
            commit('assignDB', Lowdb(adapter))

            // localDB 초기화
            console.log(state.db)

            const hasTodos = state.db.has('todos').value()

            if (hasTodos) {
                // state.todos = _cloneDeep(state.db.getState().todos)
                commit('assignTodos', _cloneDeep(state.db.getState().todos))
            } else {
                state.db
                    .defaults({
                        todos: [] // collection
                    }).write()
            }
        },
        createTodo({ state, commit }, title) {
            const newTodo = {
                id: cryptoRandomString({ length: 10 }),
                title,
                createdAt: new Date(),
                updatedAt: new Date(),
                done: false
            }
            // create db
            commit('createDB', newTodo)
            // create clinet
            commit('pushTodo', newTodo)
        },
        updateTodo({ state, commit }, { todo, value }) {
            // updateDB
            commit('updateDB', { todo, value })
            const foundTodo = _find(state.todos, { id: todo.id })
            commit('assignTodo', { foundTodo, value })
        },
        deleteTodo({ state, commit }, todo) {
            commit('deleteDB', todo)

            const foundIdex = _findIdex(state.todos, { id: todo.id })
            commit('deleteTodo', foundIdex)
        },
        completeAll({ state, commit }, checked) {
            // db commit
            const newTodos = state.db
                .get('todos')
                .forEach(todo => {
                    commit('updateTodo', {
                        todo,
                        key: 'done',
                        value: checked
                    })
                })
                .write()

            // local
            // this.todos.forEach(todo => {
            //   todo.done = checked
            // })
            //   this.todos = _cloneDeep(newTodos)
            commit('assignTodos', _cloneDeep(newTodos))
        },
        clearCompleted({ state, dispatch }) {
            // this.todos.forEach(todo => {
            //   if(todo.done){
            //     this.deleteTodo(todo)
            //   }
            // })

            // this.todos
            //   .reduce((list, todo, index) => {
            //     if(todo.done){
            //       list.push(index)
            //     }
            //     return list
            //   }, [])
            //   .reverse()
            //   .forEach(index => {
            //     this.deleteTodo(this.todos[index])
            //   })

            _forEachRight(state.todos, todo => {
                if (todo.done) {
                    // this.deleteTodo(todo)
                    dispatch('deleteTodo', todo)
                }
            })
        }
    }
}
