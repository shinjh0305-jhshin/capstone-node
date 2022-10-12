import { createApp } from 'vue'
import App from './App.vue'

//import './index.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.esm'

const app = createApp(App);
//root에서 provide하면 모든 descendant에서 사용할 수 있다.
app.provide('today', new Date().toISOString().split('T')[0]);
app.mount('#app');