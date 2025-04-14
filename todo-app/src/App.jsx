import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import TodoList from './components/TodoList'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/todos" element={<TodoList />} />
      </Routes>
    </Router>
  )
}

export default App
