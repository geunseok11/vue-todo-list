<template>
    <div>
        <button @click="createTodo">추가</button>
        <input     
        :value="title"
        :placeholder="placeholder"
        type="text"
        @input="title = $event.target.value"
        @keypress.enter="createTodo">
    </div>
</template>

<script>
export default {
    data(){
        return{
            title:'',
            placeholder:'할일을 추가해주세요',
        }
    },
    methods:{
        createTodo(){
            console.log(this.title)
        }
    }
}
</script>
