export default {
	// 返回属性
	doneTodos: state => state.todos.filter(todo => todo.done),
	// 返回方法
	getTodoById: state => id => state.todos.find(todo => todo.id === id)
}