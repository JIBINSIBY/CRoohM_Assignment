import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useTodoStore = create(
  persist(
    (set) => ({
      todos: [],
      addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
      removeTodo: (id) => set((state) => ({ todos: state.todos.filter(todo => todo.id !== id) })),
      toggleTodo: (id) => set((state) => ({
        todos: state.todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      })),
      updateTodo: (id, updatedTodo) => set((state) => ({
        todos: state.todos.map(todo =>
          todo.id === id ? { ...todo, ...updatedTodo } : todo
        )
      })),
      setTodos: (todos) => set({ todos }),
    }),
    {
      name: 'todo-storage',
    }
  )
)

export default useTodoStore 