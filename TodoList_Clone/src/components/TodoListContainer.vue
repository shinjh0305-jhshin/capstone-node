<template>
    <todo-list-new />
    <section class="container">
        <div class="row justify-content-center m-2">
            <todo-list-main />
        </div>
    </section>
</template>

<script>
    import { ref, readonly, provide } from 'vue';
    import { useStorage } from '../compositions/storage'
    import TodoListNew from './TodoListNew.vue'
    import TodoListMain from './TodoListMain.vue'

    export default {
        name: 'TodoListContainer', //name of the component
        setup() { //Reactivity API를 사용해서 만든 반응형 데이터를 template에게 전해줄 때 사용
            const todos = ref([]); //데이터 1개를 반응형으로 만들기 위해서 사용한다
            const { loadTodos, saveTodos, storage_id } = useStorage();

            //pinia(vuex)와 같이 상태 공유를 담당해주는 provide.
            //Vue3부터는 provide를 사용해서 부모-자식-자손에게 상태를 전달해줄수 있다.
            //반응형은 전달 안 되는것이 맞고, readonly와 getter/setter을 만들어서 provide 한다.
            provide('todos', readonly(todos));
            const initTodos = (init_todos) => {
                todos.value = init_todos;
            }

            const addTodo = (job, date) => {
                todos.value.push({
                    id: storage_id.value++,
                    job: job,
                    date: date,
                    completed: false
                });
                saveTodos(todos);
            };

            const removeTodo = (id) => {
                todos.value.splice(id, 1);
                todos.value.forEach((todo, idx) => {
                    todo.id = idx;
                })
                saveTodos(todos);
            };

            const completeTodo = (id) => {
                todos.value.find((todo) => todo.id == id).completed = true;
                saveTodos(todos);
            };
            
            provide('addTodo', addTodo);
            provide('removeTodo', removeTodo);
            provide('completeTodo', completeTodo);
            provide('todos', readonly(todos));

            //직접 수정하면 안 되기에, setter을 준다.
            loadTodos(initTodos);
        },
        components: {
            TodoListMain, TodoListNew
        }
    }
</script>

