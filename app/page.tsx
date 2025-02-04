'use client'

class TodoManager {
  todos: Todo[]

  constructor() {
    this.todos = this.loadTodos()
  }

  loadTodos() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('todos')
      return saved ? JSON.parse(saved) : []
    }
    return []
  }

  saveTodos() {
    localStorage.setItem('todos', JSON.stringify(this.todos))
  }

  addTodo(text: string) {
    this.todos.push({
      id: crypto.randomUUID(),
      text,
      completed: false
    })
    this.saveTodos()
    this.renderTodos()
  }

  toggleTodo(id: string) {
    const todo = this.todos.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
      this.saveTodos()
      this.renderTodos()
    }
  }

  deleteTodo(id: string) {
    this.todos = this.todos.filter(t => t.id !== id)
    this.saveTodos()
    this.renderTodos()
  }

  clearCompleted() {
    this.todos = this.todos.filter(t => !t.completed)
    this.saveTodos()
    this.renderTodos()
  }

  renderTodos(filter: string = 'all') {
    const todoList = document.getElementById('todo-list')
    if (!todoList) return

    todoList.innerHTML = ''

    const filteredTodos = this.todos.filter(todo => {
      if (filter === 'active') return !todo.completed
      if (filter === 'completed') return todo.completed
      return true
    })

    filteredTodos.forEach(todo => {
      const li = document.createElement('li')
      li.className = 'flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700'

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.checked = todo.completed
      checkbox.className = 'h-5 w-5 rounded'
      checkbox.onchange = () => this.toggleTodo(todo.id)

      const text = document.createElement('span')
      text.textContent = todo.text
      text.className = todo.completed ?
        'flex-1 line-through text-gray-400' :
        'flex-1 text-gray-800 dark:text-white'

      const viewBtn = document.createElement('a')
      viewBtn.href = `/todo/${todo.id}`
      viewBtn.textContent = 'View'
      viewBtn.className = 'px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600'

      const deleteBtn = document.createElement('button')
      deleteBtn.textContent = '×'
      deleteBtn.className = 'text-gray-400 hover:text-red-500 text-xl font-bold'
      deleteBtn.onclick = () => this.deleteTodo(todo.id)

      li.appendChild(checkbox)
      li.appendChild(text)
      li.appendChild(viewBtn)
      li.appendChild(deleteBtn)
      todoList.appendChild(li)
    })

    // Update counter
    const counter = document.getElementById('todo-counter')
    if (counter) {
      const activeCount = this.todos.filter(t => !t.completed).length
      counter.textContent = `${activeCount} items left`
    }
  }
}

interface Todo {
  id: string
  text: string
  completed: boolean
}

// Initialize on page load
if (typeof window !== 'undefined') {
  window.onload = () => {
    const todoManager = new TodoManager()

    // Set up form submission
    const form = document.getElementById('todo-form') as HTMLFormElement
    form?.addEventListener('submit', (e) => {
      e.preventDefault()
      const input = form.querySelector('input') as HTMLInputElement
      if (input.value.trim()) {
        todoManager.addTodo(input.value.trim())
        input.value = ''
      }
    })

    // Set up filter buttons
    document.querySelectorAll('[data-filter]').forEach(button => {
      button.addEventListener('click', (e) => {
        const filter = (e.target as HTMLElement).dataset.filter || 'all'
        todoManager.renderTodos(filter)

        // Update active filter
        document.querySelectorAll('[data-filter]').forEach(btn =>
          btn.classList.remove('text-blue-500'))
        button.classList.add('text-blue-500')
      })
    })

    // Set up clear completed button
    const clearBtn = document.getElementById('clear-completed')
    clearBtn?.addEventListener('click', () => todoManager.clearCompleted())

    // Initial render
    todoManager.renderTodos()
  }
}

export default function TodoApp() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">TODO</h1>

        <form id="todo-form" className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Create a new todo..."
              className="flex-1 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white"
            />
            <button
              type="submit"
              className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </form>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <ul id="todo-list"></ul>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <span id="todo-counter">0 items left</span>

            <div className="flex gap-4">
              <button data-filter="all" className="hover:text-gray-800 dark:hover:text-white text-blue-500">
                All
              </button>
              <button data-filter="active" className="hover:text-gray-800 dark:hover:text-white">
                Active
              </button>
              <button data-filter="completed" className="hover:text-gray-800 dark:hover:text-white">
                Completed
              </button>
            </div>

            <button id="clear-completed" className="hover:text-gray-800 dark:hover:text-white">
              Clear Completed
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}