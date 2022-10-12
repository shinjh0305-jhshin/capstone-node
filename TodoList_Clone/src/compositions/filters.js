import { inject } from 'vue'

export const useFilter = () => {
    //provide로 제공 된 값을 받는다. 'today'를 키로 갖는 value 찾는다.
    const today = inject('today');
    const fnSort = (a, b) => {
        const a_date = Date.parse(a.date);
        const b_date = Date.parse(b.date);

        return a_date > b_date ? 1 : (a_date < b_date ? 0 : a.id - b.id);
    }
    const getPendingTodos = (todos) => {
        return todos.value.filter((todo) => todo.date < today && !todo.completed)
            .slice()
            .sort(fnSort);
    }
    const getActiveTodayTodos = (todos) => {
        return todos.value.filter((todo) => todo.date == today && !todo.completed)
            .slice()
            .sort(fnSort);
    }
    const getCompletedTodayTodos = (todos) => {
        return todos.value.filter((todo) => todo.date == today && todo.completed)
            .slice()
            .sort(fnSort);
    }
    const getAllTodayTodos = (todos) => {
        return getActiveTodayTodos(todos)
            .concat(getCompletedTodayTodos(todos))
            .slice()
            .sort(fnSort);
    }
    const getAllTodos = (todos) => {
        return todos.value.slice().sort(fnSort);
    }

    return {
        getPendingTodos, getActiveTodayTodos, getCompletedTodayTodos, getAllTodayTodos, getAllTodos
    };
}