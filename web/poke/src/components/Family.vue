<template>
  <div class="hello">
    <p>亲友圈</p>
    <button @click="play('room1')">进入房间(1)</button>
    <button @click="play('room2')">进入房间(2)</button>
  </div>
</template>
<script>
export default {
  name: "HelloWorld",
  data() {
    return {};
  },
  methods: {
    play(room){
      this.$router.push({
        name: 'Family',params:{room}
      })
    }
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
