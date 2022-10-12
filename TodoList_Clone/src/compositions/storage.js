import { reactive, toRefs } from "vue";

export const useStorage= () => {
    const KEY = 'my-todo-list';
    //ref와는 달리 deep하게 object 내에 있는 모든 변수가 반응형이 된다.
    const storage_obj = reactive({ storage_id: 0 }); 
    const loadTodos = (initTodos) => { //initTodos : TodoListContainer.vue에서 provide된 setter
        //ls에서 데이터 가져온다
        let temp_todos = JSON.parse(localStorage.getItem(KEY) || '[]');
        //indexing
        temp_todos.forEach((todo, idx) => {
            todo.id = idx;
        });
        storage_obj.storage_id = temp_todos.length;
        initTodos(temp_todos);
    }

    const saveTodos = (todos) => {
        localStorage.setItem(KEY, JSON.stringify(todos.value));
    }

    //toRefs : storage_obj가 반응성을 잃지 않고 복제되게 해주며, 디스트럭처링을 할 때 유용하다.
    return {...toRefs(storage_obj), loadTodos, saveTodos};
}