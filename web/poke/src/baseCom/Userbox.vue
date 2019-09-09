<template>
  <div class="userBox">
    <div class="uerHead">
      <img class="uerHeadImg" src="../assets/header.jpeg" alt=""/>
    </div>
    <div class="userName">{{data.name +'('+data.index}}</div>
    <div class="userPokeBox">
      <div v-if="allState == 2 || allState == 3">
        <img class="poke poke1" :src="url1" alt="">
        <img class="poke poke2" :src="url2" alt="">
        <img class="poke poke3" :src="url3" alt="">
      </div>
      <!-- 判断哪个是自己 -->
      <div v-if="dataUser == data.index">xxxx</div>  
    </div>
  </div>
</template>
<script>
export default {
  name: "Userbox",
  data() {
    return {
      url1: "",
      url2: "",
      url3: ""
    };
  },
  props: ["data", "dataUser", "allState"],
  methods: {
    play() {
      this.$router.push({
        name: "Family"
      });
    }
  },
  created() {
    this.url1 =
      ((this.data.state == 3 || this.data.state == 4 || this.data.state == 6)&&this.dataUser == this.data.index )|| this.allState == 3
        ? require("../assets/poke/" +
            this.data.poke[0].type +
            "" +
            this.data.poke[0].num +
            ".png")
        : require("../assets/poke/pokeBg.png");
    this.url2 =
      ((this.data.state == 3 || this.data.state == 4 || this.data.state == 6)&&this.dataUser == this.data.index )|| this.allState == 3
        ? require("../assets/poke/" +
            this.data.poke[1].type +
            "" +
            this.data.poke[1].num +
            ".png")
        : require("../assets/poke/pokeBg.png");
    this.url3 =
      ((this.data.state == 3 || this.data.state == 4 || this.data.state == 6)&&this.dataUser == this.data.index )|| this.allState == 3
        ? require("../assets/poke/" +
            this.data.poke[2].type +
            "" +
            this.data.poke[2].num +
            ".png")
        : require("../assets/poke/pokeBg.png");
  },
  watch: {
    data:function(newData){
      this.url1 =
      ((newData.state == 3 || newData.state == 4 || newData.state == 6) && this.dataUser == newData.index) || this.allState == 3
        ? require("../assets/poke/" +
            newData.poke[0].type +
            "" +
            newData.poke[0].num +
            ".png")
        : require("../assets/poke/pokeBg.png");
    this.url2 =
      ((newData.state == 3 || newData.state == 4 || newData.state == 6) && this.dataUser == newData.index) || this.allState == 3
        ? require("../assets/poke/" +
            newData.poke[1].type +
            "" +
            newData.poke[1].num +
            ".png")
        : require("../assets/poke/pokeBg.png");
    this.url3 =
      ((newData.state == 3 || newData.state == 4 || newData.state == 6) && this.dataUser == newData.index) || this.allState == 3
        ? require("../assets/poke/" +
            newData.poke[2].type +
            "" +
            newData.poke[2].num +
            ".png")
        : require("../assets/poke/pokeBg.png");
    }
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.userBox {
  position: relative;
}
.uerHead {
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid sienna;
}
.userName {
  position: absolute;
  top: 0;
}
.uerHeadImg {
  width: 1.5rem;
  height: 1.5rem;
}
.userPokeBox {
  width: 1.5rem;
  height: 0.7rem;
  border: 1px solid sienna;
  position: relative;
}
.poke {
  width: 0.5rem;
  height: 0.7rem;
  border: 1px solid #e3e3ee;
  border-radius: 0.1rem;
  position: absolute;
  left: 0;
}
.poke1 {
  z-index: 2;
}
.poke2 {
  z-index: 3;
  left: 0.3rem;
}
.poke3 {
  z-index: 4;
  left: 0.6rem;
}
</style>
