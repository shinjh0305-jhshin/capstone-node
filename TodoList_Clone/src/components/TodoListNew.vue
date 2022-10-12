<template>
    <section class="mb-5">
        <div class="container">
            <div class="row justify-content-center m-2">
                <div class="col border border-primary rounded">
                    <input
                        type="text"
                        id="todo_input"
                        class="form-control my-2"
                        v-model="job"
                        placeholder="Your todo"
                    />
                    <div class="row my-2">
                        <div class="col-6">
                            <input type="date" v-model="date" :min="today" />
                        </div>
                        <div class="col-6">
                            <button
                                type="button"
                                class="btn btn-primary btn-sm float-end"
                                @click="onAddTodo"
                            >
                            작업추가
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: 'TodoListNew',
    }
</script>

<script setup>
    import { inject, reactive, toRefs } from 'vue';
    const today = inject('today')
    const addTodo = inject('addTodo')
    const val_obj = reactive({
        job: '',
        date: today,
    })

    const onAddTodo = () => {
        if (val_obj.job.length > 0) {
            const newjob = val_obj.job;
            const newDate = val_obj.date;

            val_obj.job = '';
            val_obj.date = today;
            addTodo(newjob, newDate);
        }
    }

    //디스트럭처링이 불가능하다.
    const { job, date } = toRefs(val_obj);
</script>