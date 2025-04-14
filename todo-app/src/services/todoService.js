import axios from 'axios'

const API_URL = 'https://dummyjson.com/todos'

export const todoService = {
  async getAllTodos() {
    try {
      const response = await axios.get(API_URL)
      return response.data.todos
    } catch (error) {
      console.error('Error fetching todos:', error)
      return []
    }
  },

  async addTodo(todo) {
    try {
      const response = await axios.post(`${API_URL}/add`, todo)
      return response.data
    } catch (error) {
      console.error('Error adding todo:', error)
      return null
    }
  },

  async updateTodo(id, todo) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, todo)
      return response.data
    } catch (error) {
      console.error('Error updating todo:', error)
      return null
    }
  },

  async deleteTodo(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting todo:', error)
      return null
    }
  }
} 