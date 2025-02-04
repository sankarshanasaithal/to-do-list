'use client'

export default function TodoDetail({ params }: { params: { id: string } }) {
  const loadTodo = () => {
    if (typeof window !== 'undefined') {
      const todos = JSON.parse(localStorage.getItem('todos') || '[]')
      return todos.find((t: any) => t.id === params.id)
    }
    return null
  }

  const updateTodo = (text: string) => {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]')
    const updatedTodos = todos.map((t: any) =>
      t.id === params.id ? { ...t, text } : t
    )
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
    window.location.href = '/'
  }

  const toggleComplete = () => {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]')
    const updatedTodos = todos.map((t: any) =>
      t.id === params.id ? { ...t, completed: !t.completed } : t
    )
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
    window.location.reload()
  }

  const deleteTodo = () => {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]')
    const updatedTodos = todos.filter((t: any) => t.id !== params.id)
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
    window.location.href = '/'
  }

  if (typeof window === 'undefined') return null

  const todo = loadTodo()
  if (!todo) return <div>Todo not found</div>

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <a
              href="/"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ←
            </a>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Todo</h1>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Todo Text
              </label>
              <input
                type="text"
                defaultValue={todo.text}
                id="todo-text"
                className="w-full p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked={todo.completed}
                onChange={toggleComplete}
                className="h-5 w-5 rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-gray-700 dark:text-gray-300">Mark as completed</span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  const input = document.getElementById('todo-text') as HTMLInputElement
                  updateTodo(input.value)
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                onClick={deleteTodo}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete Todo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}