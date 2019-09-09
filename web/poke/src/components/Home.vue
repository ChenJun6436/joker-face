<template>
  <div class="hello">
    <p>我是主页</p>
    <button @click="creatRoom">创建房间</button>
    <button @click="joinRoom">加入房间</button>
    <button @click="goFamily">亲友圈</button>
    <div>
      <div v-for="(i,index) in familyList" :key="index">
        <div> 
          <span>{{i.name}}</span>
          <button>进入</button>  
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      familyList:[
        {name:'xx',id:"123"}
      ]
    };
  },
  methods: {
    creatRoom(room){
      
    },
    joinRoom(){

    },
    goFamily(){
      this.$router.push({
        name: 'Family'
      })
    }
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
