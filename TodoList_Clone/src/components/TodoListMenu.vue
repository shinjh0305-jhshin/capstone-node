<template>
    <div class="row">
        <div class="col">
            <span style="background-color: blue">&nbsp;</span>&nbsp;
            <strong>{{ state }}</strong>
        </div>
        <div class="col">
            <div class="btn-group float-end">
                <button
                    class="btn btn-sm dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                >
                리스트 필터  
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li v-for="key in Object.keys(filters)" :key="key">
                        <a class="dropdown-item" @click="filter = key">{{ filters[key].str }}</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch, computed, inject } from 'vue'


export default {
    name: 'TodoListMenu',
    //자식 component가 부모 component에게 이벤트를 전달한다
    emits: ['change-filter'],
    //props : reactive한 변수들이 저장됨
    //context : non-reactive한 변수들이 저장됨
    setup(props, context) {
        const filters = inject('filters');
        const filter = ref(0);
        //computed : 함수 실행 결과를 reactive 하게 만든다
        const state = computed(() => {
            return filters[filter.value].str;
        })
        //첫 번째 인자인 콜백 함수의 return 값이 변하는지를 보다가, 변하면 두 번째 콜백 함수를 실행한다
        watch(
            () => filter.value,
            (filter) => {
                //setup 내에서 emit 하기 위해서는 context.emit 사용한다.
                //filter을 인수로 전달한다.
                context.emit('change-filter', filter);
            }
        )

        return {
            state, filter, filters
        }
    }
}
</script>