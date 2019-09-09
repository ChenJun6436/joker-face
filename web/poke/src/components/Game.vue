<template>
  <div class="hello">
    <div class="head">

    </div>
    <div class="Family-Table">
      <div class="Family-userBox">
        <Userbox v-if="players[0]" :data='players[0]' :dataUser='ind' :allState='allState'/>
        <Userbox v-if="players[1]" :data='players[1]' :dataUser='ind' :allState='allState'/>
        <Userbox v-if="players[2]" :data='players[2]' :dataUser='ind' :allState='allState'/>
      </div>
      <div class="Family-userBox two">
        <Userbox v-if="players[3]" :data='players[3]' :dataUser='ind' :allState='allState'/>
        <Userbox v-if="players[4]" :data='players[4]' :dataUser='ind' :allState='allState'/>
      </div>
      <div class="Family-userBox two">
        <Userbox v-if="players[5]" :data='players[5]' :dataUser='ind' :allState='allState'/>
        <Userbox v-if="players[6]" :data='players[6]' :dataUser='ind' :allState='allState'/>
      </div>
      <div class="Family-userBox two">
        <Userbox v-if="players[7]" :data='players[7]' :dataUser='ind' :allState='allState'/>
        <Userbox v-if="players[8]" :data='players[8]' :dataUser='ind' :allState='allState'/>
        <Userbox v-if="players[9]" :data='players[9]' :dataUser='ind' :allState='allState'/>
      </div>
       <div class="Family-ButtonBox">
         <p>当前回合：{{nowRound}}; 当前玩家：{{nowIndex}}</p>
         <button v-if="(allState == 1 || allState == 0 )&& role == 1" @click="changeState('start')">{{'开始'}}</button>
         <button v-if="(allState == 0  && state == 0)|| allState == 3" @click="changeState(1)">{{'准备'}}</button>
         <button v-if="allState == 2 && nowIndex == ind && ( state == 1 || state == 2 )" @click="changeState(2)">{{'闷一手'}}</button>
         <button v-if="allState == 2 && nowIndex == ind && ( state == 1 || state == 2 )" @click="changeState(3)">{{'看牌'}}</button>
         <button v-if="allState == 2 && nowIndex == ind && ( state == 3 || state == 4 )" @click="changeState(4)">{{'逮一手'}}</button>
         <button v-if="allState == 2 && nowIndex == ind && ( state == 3 || state == 4 )" @click="changeState(5)">{{'弃牌'}}</button>
         <button v-if="allState == 2 && nowIndex == ind && ( state == 3 || state == 4 ) && lastPlayer.length == 2" @click="changeState(6)">{{'开牌'}}</button>
      </div>
    </div>

  </div>                                                                                                                                                 
</template>
<script>
import Userbox from "../baseCom/Userbox";
export default {
  name: "Family",
  data() {
    return {
      players: [],
      allState: 0, //全局状态
      role: 0, //我的角色   1是房主
      ind: 0, //我的index
      state: 0, //我的状态 0未准备，1准备，2闷，3看牌，4逮，5弃，6开
      nowIndex: 0, //现在是谁要操作
      nowRound: 0 //第几回合
    };
  },
  components: {
    Userbox
  },
  methods: {
    //根据本机对应的信息  在所有用户中查询
    findMine(all) {
      const user = JSON.parse(localStorage.getItem("appUser"));
      let mine = all.find(item => {
        return item.name == user.name;
      });
      if (mine) {
        localStorage.setItem("appUser", JSON.stringify(mine));
        this.state = mine.state;
        this.role = mine.role;
        this.ind = mine.index;
      }
      return mine;
    },
    //根据现在的index查找我的信息
    ready() {
      const user = JSON.parse(localStorage.getItem("appUser"));

      this.$socket.emit("ready", user);
    },
    changeState(state) {
      const user = JSON.parse(localStorage.getItem("appUser"));
      const obj = {
        user,
        state
      };
      if (state == "start") {
        console.log(this.players);
        let isAllReady = true;
        this.players.forEach(element => {
          if (element.state == 0) {
            isAllReady = false;
          }
        });
        if (this.players.length == 1) {
          alert("一个人无法开启");
          return;
        }
        if (!isAllReady) {
          alert("还有玩家未准备");
          return;
        }
      }
      this.$socket.emit("changeState", obj);
    }
  },
  created() {
    let user = JSON.parse(localStorage.getItem("appUser"));
    user.room = this.$route.params.room
    console.log(this.$route.params.room)
    console.log("creat");
    console.log(this.allState);
    console.log(user);
    console.log(this.nowIndex, this.ind);
    this.$socket.emit("join", user); //触发socket连接
  },
  //监听socekt---
  sockets: {
    //玩家加入
    join(obj) {
      console.log("join");
      console.log(obj);
      this.players = obj.players;
      this.allState = obj.all.allState;
      this.nowIndex = obj.all.nowUserIndex;
      this.findMine(obj.players);
      alert('新人进入'+obj.user.room +''+ obj.user.name)
    },
    changeState(obj) {
      console.log("changeState");
      console.log(obj);
      this.players = obj.players;
      this.allState = obj.all.allState;
      this.nowIndex = obj.all.nowUserIndex;
      this.nowRound = obj.all.nowRound;
      this.findMine(obj.players);
    },
    win(obj){
      console.log(obj)
      this.players = obj.players;
      this.allState = obj.all.allState;
      this.nowIndex = obj.all.nowUserIndex;
      this.findMine(obj.players);
      alert('当前胜利玩家：'+ obj.nowWin.user.name)
    }
  },
  computed: {
    lastPlayer: function() {
      //没有弃牌的人
      var state5 = this.players.filter(i => {
        return i.state != 5;
      });
      //还在闷的人
      var state2 = this.players.filter(i => {
        return i.state == 2 || i.state == 1;
      });
      var last = [];
      //当前剩余没有 弃牌 加上 闷
      if (state5 && state2) {
        last = state5.concat(state2);
      } else if (state5 && !state2) {
        last = state5;
      } else if (state2 && !state5) {
        last = state2;
      }
      console.log(last.length, "----");
      return last;
    }
  },
  watch: {}
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.head {
  height: 2rem;
  width: 100%;
  background: #000;
}
.Family-Table {
  position: relative;
}
.Family-userBox {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.two {
  margin-top: 0.5rem;
}
.Family-userBoxOne {
  width: 1.8rem;
}
.Family-ButtonBox {
  position: absolute;
  top: 3rem;
  left: 2.5rem;
  height: 4.5rem;
  width: 2rem;
  background: red;
}
.Family-ButtonBox button {
  display: block;
}
</style>
