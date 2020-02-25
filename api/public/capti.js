//操作事件
$(function () {
    //连接websocket后端服务器
    var socket = io.connect('ws://192.168.10.185:3000/')
    //所有用户
    var allUsers = []
    //当前用户
    var nowUser = JSON.parse(localStorage.getItem('user'))
    //判断是不是自己
    function isMine(obj) {
        var isMy = false
        if (obj.username == nowUser.name) {
            isMy = true
        }
        return isMy
    }
    //判读当前有没有这个用户  返回—++ 其他用户
    function haveUser(obj, all) {
        console.log(obj, all)
        var have = false
        var otherArr = []
        all.forEach(function (i, ind) {
            if (obj.username == i.username) {
                have = true
            } 
            if (i.username != nowUser.name) {
                otherArr.push(i)
            } 
        })
        console.log(otherArr)
        return { have, otherArr }
    }
    //给自己添加座位
    function creatMySit(obj) {
        console.log(obj)
        $('.mySit').html('')
        var html = '<img src="./qq.png" alt="">' +
            '<div>' +
            '<button id="ready">ready</button>' +
            '<button style="' + (obj.role == "1" ? "" : "display: none") + '" id="sendPoke">send</button>' +
            '</div>' +
            '<div class="my-userName">' + obj.username + '</div>' +
            '<div class="user-pokeBox my-pokeBox">' +
            '<div class="user-pokeOneBox my-pokeOneBox">' +
            '<img class="user-pokeOne my-pokeOne" src="./3.png" alt="">' +
            '</div>' +
            '<div class="user-pokeOneBox my-pokeOneBox">' +
            '<img class="user-pokeOne my-pokeOne" src="./2.png" alt="">' +
            '</div>' +
            '<div class="user-pokeOneBox my-pokeOneBox">' +
            '<img class="user-pokeOne my-pokeOne" src="./2.png" alt="">' +
            '</div>' +
            '</div>';
        $('.mySit').append(html)
    }
    //给其他用户添加座位
    function otherSit(arr) {
        var players = arr
        $('.otherBox').html('')
        for (var j = 0; j < players.length; j++) {
            var html = '<div class="user">' +
                '<div class="my-userName">' + players[j].username + '</div>' +
                '<img class="user-head" src="./qq.png" alt="">' +
                '<div class="user-pokeBox">' +
                '<div class="user-pokeOneBox">' +
                '<img class="user-pokeOne" src="./2.png" alt="">' +
                '</div>' +
                '<div class="user-pokeOneBox">' +
                '<img class="user-pokeOne" src="./3.png" alt="">' +
                '</div>' +
                '<div class="user-pokeOneBox">' +
                '<img class="user-pokeOne" src="./3.png" alt="">' +
                '</div>' +
                '</div>' +
                '<img class="user-state user-nowState" src="./person.png" alt="">' +
                '<img class="user-state user-isRoom" src="./set.png" alt="">' +
                '</div>';
            $('.otherBox').append(html)
        }
    }

    //初始化前端socket服务
    init(nowUser)
    function init(nowUser) {
        //告诉服务器端有用户登录
        socket.emit('join', { userid: nowUser.ip, username: nowUser.name });
        //监听新用户登录
        socket.on('join', function (o) {
        console.log(o.user)

            var haveUserObj = haveUser(o.user, o.players)
            // 如果是自己不提示
            if (!isMine(o.user)) {
                //如果已经有这个用户
                if (haveUserObj.have) {
                    alert(o.user.username + '-----重新链接了')
                } else {
                    alert('欢迎新人加入----' + o.user.username)
                    var html = '<div class="user">' +
                        '<div class="my-userName">' + o.user.username + '</div>' +
                        '<img class="user-head" src="./qq.png" alt="">' +
                        '<div class="user-pokeBox">' +
                        '<div class="user-pokeOneBox">' +
                        '<img class="user-pokeOne" src="./2.png" alt="">' +
                        '</div>' +
                        '<div class="user-pokeOneBox">' +
                        '<img class="user-pokeOne" src="./3.png" alt="">' +
                        '</div>' +
                        '<div class="user-pokeOneBox">' +
                        '<img class="user-pokeOne" src="./3.png" alt="">' +
                        '</div>' +
                        '</div>' +
                        '<img class="user-state user-nowState" src="./person.png" alt="">' +
                        '<img class="user-state user-isRoom" src="./set.png" alt="">' +
                        '</div>';
                    $('.otherBox').append(html)
                }
            } else { //是自己就给自己添加座位
                creatMySit(o.user)
            }
            otherSit(haveUserObj.otherArr)
            allUsers = o.players
            // CHAT.updateSysMsg(o, 'login');
        });
        //监听用户准备
        socket.on('ready', function (o) {
            console.log(222222222222)
            alert(o.user.username + '----准备了')
            console.log(o)
            allUsers = o.players
            console.log(allUsers)
            // CHAT.updateSysMsg(o, 'login');
        });
        // //监听用户退出
        // this.socket.on('logout', function (o) {
        //     CHAT.updateSysMsg(o, 'logout');
        // });

        // //监听消息发送
        // this.socket.on('message', function (obj) {
        //     console.log(obj)
        //     var isme = (obj.userid == CHAT.userid) ? true : false;
        //     var contentDiv = '<div>' + obj.content + '</div>';
        //     var usernameDiv = '<span>' + obj.username + '' + JSON.stringify(obj.data) + '</span>';

        //     var section = d.createElement('section');
        //     if (isme) {
        //         section.className = 'user';
        //         section.innerHTML = contentDiv + usernameDiv;
        //     } else {
        //         section.className = 'service';
        //         section.innerHTML = usernameDiv + contentDiv;
        //     }
        //     CHAT.msgObj.appendChild(section);
        //     CHAT.scrollToBottom();
        // });
    }
    //准备按钮 state ---0未准备 1准备
    $('body').on('click', '#ready', function () {
        $('#ready').hide()
        socket.emit('ready', { userid: nowUser.ip, username: nowUser.name, state: 1 });
    })
    //发牌
    $('body').on('click', '#sendPoke', function () {
        var can = true
        allUsers.forEach(function (i, index) {
            i.poke = []
            if (!i.state || i.state != 1) {
                can = false
            }
        })
        if (can) {
            sendPoke(allUsers)
        } else {
            alert('还有人没有准备')
        }
    })
    function sendPoke(players) {

        //开始发牌
        var allPoke = []
        // //随机打乱顺序
        // if (!Array.prototype.derangedArray) {
        //     Array.prototype.derangedArray = function () {
        //         for (var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
        //         return this;
        //     };
        // }
        // //洗牌
        // function resetPoke() {
        //     allPoke.derangedArray()
        // }
        //创建一个poke
        function creatNewPoke() {
            for (var i = 2; i <= 14; i++) {
                var name = 0;
                switch (i) {
                    case 11:
                        name = 'J';
                        break;
                    case 12:
                        name = 'Q';
                        break;
                    case 13:
                        name = 'K';
                        break;
                    case 14:
                        name = 'A';
                        break;
                    default:
                        name = i.toString()
                }
                var x = 0;
                var y = 0;
                //黑桃牌
                var onePoke1 = {
                    name, icon: '♠', color: 'black', type: 4, num: i,
                }
                //红糖牌
                var onePoke2 = {
                    name, icon: '♥', color: 'red', type: 3, num: i,
                }
                //梅花牌
                var onePoke3 = {
                    name, icon: '♣', color: 'black', type: 2, num: i,
                }
                //方块牌
                var onePoke4 = {
                    name, icon: '♦', color: 'red', type: 1, num: i,
                }
                //牌面背景图
                if (i >= 2) {
                    onePoke1.x = -(110 * (i - 3))
                    onePoke1.y = 0
                    onePoke2.x = -(110 * (i - 3))
                    onePoke2.y = -153
                    onePoke3.x = -(110 * (i - 3))
                    onePoke3.y = -306
                    onePoke4.x = -(110 * (i - 3))
                    onePoke4.y = -459
                }
                allPoke.push(onePoke1)
                allPoke.push(onePoke2)
                allPoke.push(onePoke3)
                allPoke.push(onePoke4)
            }
            //大小王
            var jokers = [
                {
                    name, icon: 'joker', color: 'red', type: 2, num: 16, y: 912, x: 0
                },
                {
                    name, icon: 'joker', color: 'black', type: 1, num: 15, y: 912, x: -110
                },
            ]
            // allPoke = allPoke.concat(jokers)
            // allPoke.forEach(function (i, index) {
            //     var html = "<div class='poke' style='background-position-y:"+ i.y +"px;background-position-x:"+ i.x +"px'></div>"
            //     $('#container').append(html)
            // })
        }
        creatNewPoke()
        //发牌
        function givePoke() {
            var nowPoke = allPoke;
            for (var j = 0; j < players.length; j++) {
                var playerPoke = []
                for (var i = 1; i < 4; i++) {
                    var num = Math.floor(Math.random() * nowPoke.length);   //取剩下的长度
                    playerPoke.push(nowPoke[num])
                    nowPoke.splice(num, 1)
                }
                players[j].poke = playerPoke
            }
            showPoke(players)
            socket.emit('sendPoke', players);
        }
        givePoke()
        //将牌分配到对应div中
        function showPoke(obj) {
            for (var j = 0; j < $('.user').length; j++) {
                var html = '<div class="user-pokeBox">'
                obj[j].poke.forEach(function (i, index) {
                    html += '<div class="user-pokeOneBox">'
                    html += '<img class="user-pokeOne" src="./2.png" alt="">'
                    html += '</div>'
                })
                html += '</div>'
                $($('.user')[j]).find('.user-pokeBox').append(html)
            }
            whoWin()
        }
        //判断大小 （多个人）
        function whoWin() {
            var lastPoke = whatPoke()
            var nowPoint = []
            lastPoke.forEach(function (i, index) {
                nowPoint.push(i.nowPoint)
            })
            var maxPonit = Math.max.apply(null, nowPoint)
            var nowWin = lastPoke[nowPoint.indexOf(maxPonit)]
            var str = nowWin.poke[0].name + '' + nowWin.poke[0].icon + '--' + nowWin.poke[1].name + '' + nowWin.poke[1].icon + '--' + nowWin.poke[2].name + '' + nowWin.poke[2].icon + '--'
            alert('当前胜利人：' + nowWin.name + ';胜利牌：' + str)
        }
        //判断每个玩家手牌是什么  （3张牌）
        function whatPoke() {
            var nowPlayersPoke = [] //当前玩家的手牌是什么类型的数组对象
            players.forEach(function (i, ind) {
                var pokeArr = i.poke
                var nowPokeName = 0;    //当前牌的名字类型  //1：散牌 2：对子 3：顺子 4:同花  5：小飞机 6：大飞机
                var nowPokeNum = 0;     //当前牌的总数字合，用来判断同名字的大小
                var nowPokeType = 0;    //当前花色大小, 取最大的牌作为比较  4>3>2>1
                var nowPoint = 0;  //散牌 100分，对子1000分，顺子10000分，同花100000分，小飞机1000000，大飞机10000000分
                //大小排序
                pokeArr = pokeArr.sort(
                    function () {
                        return function (a, b) {
                            return b.num - a.num
                        }
                    }()
                )
                nowPokeNum = pokeArr[0].num + pokeArr[1].num + pokeArr[2].num
                nowPokeType = pokeArr[0].type
                //判断是否是飞机
                //当所有牌数字相等时  -大飞机 AAA
                if ((pokeArr[0].num == pokeArr[1].num) && (pokeArr[1].num == pokeArr[2].num)) {
                    nowPokeName = 6
                    nowPoint = nowPokeName * 1000000 + nowPokeNum
                    // console.log('大飞机')
                }
                //判断是否是对子
                //两张牌数字相等,且第三张不相同  -对子 AAx
                else if ((pokeArr[0].num == pokeArr[1].num) || (pokeArr[0].num == pokeArr[2].num) || (pokeArr[1].num == pokeArr[2].num)) {
                    // console.log('对子')
                    nowPokeName = 2
                    var nowPokeMaxPoint = 0
                    //判断是什么对子
                    if (pokeArr[0].num == pokeArr[1].num) {
                        nowPokeMaxPoint = (pokeArr[0].num * 1000) + pokeArr[2].num + pokeArr[2].type
                    } else if (pokeArr[0].num == pokeArr[2].num) {
                        nowPokeMaxPoint = (pokeArr[0].num * 1000) + pokeArr[1].num + pokeArr[1].type
                    } else if (pokeArr[1].num == pokeArr[2].num) {
                        nowPokeMaxPoint = (pokeArr[1].num * 1000) + pokeArr[0].num + pokeArr[0].type
                    }
                    nowPoint = nowPokeName * 1000 + nowPokeMaxPoint
                }
                //判断是否是小飞机
                //当所有牌type相等时，且123类型  --小飞机 同花顺
                //先判断类型相同 ， 再判断大小连续
                else if (((pokeArr[0].type == pokeArr[1].type) && (pokeArr[1].type == pokeArr[2].type)) && ((pokeArr[0].num - pokeArr[1].num == 1) && (pokeArr[1].num - pokeArr[2].num == 1))) {
                    // console.log('小飞机')
                    nowPokeName = 5
                    nowPoint = nowPokeName * 1000000 + nowPokeNum
                }
                //判断是否是同花
                //当所有牌type相等时  -同花
                else if ((pokeArr[0].type == pokeArr[1].type) && (pokeArr[1].type == pokeArr[2].type)) {
                    // console.log('同花')
                    nowPokeName = 4
                    //判断第一个数字大小，再判断花色
                    nowPoint = (nowPokeName * 100000) + (pokeArr[0].num * 1000) + (pokeArr[1].num * 10) + pokeArr[2].num + pokeArr[0].type
                }
                //判断是否是顺子
                //123类型的顺子
                else if ((pokeArr[0].num - pokeArr[1].num == 1) && (pokeArr[1].num - pokeArr[2].num == 1)) {
                    // console.log('顺子')
                    nowPokeName = 3
                    //判断第一个数字大小，再判断花色
                    nowPoint = (nowPokeName * 10000) + (pokeArr[0].num * 150) + pokeArr[0].type
                }
                //散牌
                else {
                    // console.log('散牌')
                    nowPokeName = 1
                    //判断第一个数字大小，再判断第二个数字大小，再判断第三个数字大小，再判断花色
                    nowPoint = (pokeArr[0].num * 30) + (pokeArr[1].num * 20) + (pokeArr[2].num * 10) + pokeArr[0].type
                }
                // console.log(nowPoint)
                nowPlayersPoke[ind] = {
                    nowPokeName,
                    nowPokeNum,
                    nowPokeType,
                    name: i.username,
                    nowPoint,
                    poke: i.poke
                }
            })
            return nowPlayersPoke
        }
    }
    //用户进入房间
    function join() {

    }

    // var d = document,
    //     w = window,
    //     p = parseInt,
    //     dd = d.documentElement,
    //     db = d.body,
    //     dc = d.compatMode == 'CSS1Compat',
    //     dx = dc ? dd : db,
    //     ec = encodeURIComponent;
    // w.CHAT = {
    //     msgObj: d.getElementById("message"),
    //     screenheight: w.innerHeight ? w.innerHeight : dx.clientHeight,
    //     username: null,
    //     userid: null,
    //     socket: null,
    //     //让浏览器滚动条保持在最低部
    //     scrollToBottom: function () {
    //         w.scrollTo(0, this.msgObj.clientHeight);
    //     },
    //     //退出，本例只是一个简单的刷新
    //     logout: function () {
    //         //this.socket.disconnect();
    //         location.reload();
    //     },
    //     //提交聊天消息内容
    //     submit: function () {
    //         var socketSelf = this.socket
    //         var content = d.getElementById("content").value;
    //         if (content != '') {
    //             var obj = {
    //                 userid: this.userid,
    //                 username: this.username,
    //                 content: content,
    //             };
    //             $.ajax({
    //                 type: "GET",
    //                 url: 'http://192.168.10.185:3000' + "/a",
    //                 dataType: 'json',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 beforeSend: function (data) {
    //                     console.log(data)
    //                 },
    //                 success: function (data) {
    //                     obj.data = data
    //                     console.log(obj)
    //                     socketSelf.emit('message', obj);
    //                     d.getElementById("content").value = '';
    //                 }
    //             })

    //         }
    //         return false;
    //     },
    //     genUid: function () {
    //         return new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100);
    //     },
    //     //更新系统消息，本例中在用户加入、退出的时候调用
    //     updateSysMsg: function (o, action) {
    //         //当前在线用户列表
    //         var onlineUsers = o.onlineUsers;
    //         //当前在线人数
    //         var onlineCount = o.onlineCount;
    //         //新加入用户的信息
    //         var user = o.user;

    //         //更新在线人数
    //         var userhtml = '';
    //         var separator = '';
    //         for (key in onlineUsers) {
    //             if (onlineUsers.hasOwnProperty(key)) {
    //                 userhtml += separator + onlineUsers[key];
    //                 separator = '、';
    //             }
    //         }
    //         d.getElementById("onlinecount").innerHTML = '当前共有 ' + onlineCount + ' 人在线，在线列表：' + userhtml;

    //         //添加系统消息
    //         var html = '';
    //         html += '<div class="msg-system">';
    //         html += user.username;
    //         html += (action == 'login') ? ' 加入了聊天室' : ' 退出了聊天室';
    //         html += '</div>';
    //         var section = d.createElement('section');
    //         section.className = 'system J-mjrlinkWrap J-cutMsg';
    //         section.innerHTML = html;
    //         this.msgObj.appendChild(section);
    //         this.scrollToBottom();
    //     },
    //     //第一个界面用户提交用户名
    //     usernameSubmit: function () {
    //         var username = d.getElementById("username").value;
    //         if (username != "") {
    //             d.getElementById("username").value = '';
    //             d.getElementById("loginbox").style.display = 'none';
    //             d.getElementById("chatbox").style.display = 'block';
    //             this.init(username);
    //         }
    //         return false;
    //     },
    //     init: function (username) {
    //         /*
    //         客户端根据时间和随机数生成uid,这样使得聊天室用户名称可以重复。
    //         实际项目中，如果是需要用户登录，那么直接采用用户的uid来做标识就可以
    //         */
    //         this.userid = this.genUid();
    //         this.username = username;

    //         d.getElementById("showusername").innerHTML = this.username;
    //         this.msgObj.style.minHeight = (this.screenheight - db.clientHeight + this.msgObj.clientHeight) + "px";
    //         this.scrollToBottom();

    //         //连接websocket后端服务器
    //         this.socket = io.connect('ws://192.168.10.185:3000/');

    //         //告诉服务器端有用户登录
    //         this.socket.emit('login', { userid: this.userid, username: this.username });

    //         //监听新用户登录
    //         this.socket.on('login', function (o) {
    //             CHAT.updateSysMsg(o, 'login');
    //         });

    //         //监听用户退出
    //         this.socket.on('logout', function (o) {
    //             CHAT.updateSysMsg(o, 'logout');
    //         });

    //         //监听消息发送
    //         this.socket.on('message', function (obj) {
    //             console.log(obj)
    //             var isme = (obj.userid == CHAT.userid) ? true : false;
    //             var contentDiv = '<div>' + obj.content + '</div>';
    //             var usernameDiv = '<span>' + obj.username + '' + JSON.stringify(obj.data) + '</span>';

    //             var section = d.createElement('section');
    //             if (isme) {
    //                 section.className = 'user';
    //                 section.innerHTML = contentDiv + usernameDiv;
    //             } else {
    //                 section.className = 'service';
    //                 section.innerHTML = usernameDiv + contentDiv;
    //             }
    //             CHAT.msgObj.appendChild(section);
    //             CHAT.scrollToBottom();
    //         });

    //     }
    // };
    // //通过“回车”提交用户名
    // d.getElementById("username").onkeydown = function (e) {
    //     e = e || event;
    //     if (e.keyCode === 13) {
    //         CHAT.usernameSubmit();
    //     }
    // };
    // //通过“回车”提交信息
    // d.getElementById("content").onkeydown = function (e) {
    //     e = e || event;
    //     if (e.keyCode === 13) {
    //         CHAT.submit();
    //     }
    // };
});

//扑克牌事件
(function () {
    var allPoke = []
    var players = [
        { name: 'aaa', poke: [] },
        { name: 'bbb', poke: [] },
        { name: 'ccc', poke: [] },
        { name: 'ddd', poke: [] },
        { name: 'eee', poke: [] },
        { name: 'fff', poke: [] },
        { name: 'ggg', poke: [] },
        { name: 'hhh', poke: [] },
        { name: 'iii', poke: [] },
        { name: 'jjj', poke: [] },
    ]
    // //随机打乱顺序
    // if (!Array.prototype.derangedArray) {
    //     Array.prototype.derangedArray = function () {
    //         for (var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
    //         return this;
    //     };
    // }
    // //洗牌
    // function resetPoke() {
    //     allPoke.derangedArray()
    // }
    //创建一个poke
    function creatNewPoke() {
        for (var i = 2; i <= 14; i++) {
            var name = 0;
            switch (i) {
                case 11:
                    name = 'J';
                    break;
                case 12:
                    name = 'Q';
                    break;
                case 13:
                    name = 'K';
                    break;
                case 14:
                    name = 'A';
                    break;
                default:
                    name = i.toString()
            }
            var x = 0;
            var y = 0;
            //黑桃牌
            var onePoke1 = {
                name, icon: '♠', color: 'black', type: 4, num: i,
            }
            //红糖牌
            var onePoke2 = {
                name, icon: '♥', color: 'red', type: 3, num: i,
            }
            //梅花牌
            var onePoke3 = {
                name, icon: '♣', color: 'black', type: 2, num: i,
            }
            //方块牌
            var onePoke4 = {
                name, icon: '♦', color: 'red', type: 1, num: i,
            }
            //牌面背景图
            if (i >= 2) {
                onePoke1.x = -(110 * (i - 3))
                onePoke1.y = 0
                onePoke2.x = -(110 * (i - 3))
                onePoke2.y = -153
                onePoke3.x = -(110 * (i - 3))
                onePoke3.y = -306
                onePoke4.x = -(110 * (i - 3))
                onePoke4.y = -459
            }
            allPoke.push(onePoke1)
            allPoke.push(onePoke2)
            allPoke.push(onePoke3)
            allPoke.push(onePoke4)
        }
        //大小王
        var jokers = [
            {
                name, icon: 'joker', color: 'red', type: 2, num: 16, y: 912, x: 0
            },
            {
                name, icon: 'joker', color: 'black', type: 1, num: 15, y: 912, x: -110
            },
        ]
        // allPoke = allPoke.concat(jokers)
        // allPoke.forEach(function (i, index) {
        //     var html = "<div class='poke' style='background-position-y:"+ i.y +"px;background-position-x:"+ i.x +"px'></div>"
        //     $('#container').append(html)
        // })
    }
    creatNewPoke()
    //创建座位 发牌
    function givePoke() {
        var nowPoke = allPoke;
        for (var j = 0; j < players.length; j++) {
            var html = '<div class="user">' +
                '<img class="user-head" src="./qq.png" alt="">' +
                '<div class="user-pokeBox">' +
                '<div class="user-pokeOneBox">' +
                '<img class="user-pokeOne" src="./2.png" alt="">' +
                '</div>' +
                '<div class="user-pokeOneBox">' +
                '<img class="user-pokeOne" src="./2.png" alt="">' +
                '</div>' +
                '<div class="user-pokeOneBox">' +
                '<img class="user-pokeOne" src="./2.png" alt="">' +
                '</div>' +
                '</div>' +
                '<img class="user-state user-nowState" src="./person.png" alt="">' +
                '<img class="user-state user-isRoom" src="./set.png" alt="">' +
                '</div>';
            $('.otherBox').append(html)
            var playerPoke = []
            for (var i = 1; i < 4; i++) {
                var num = Math.floor(Math.random() * nowPoke.length);   //取剩下的长度
                playerPoke.push(nowPoke[num])
                nowPoke.splice(num, 1)
            }
            players[j].poke = playerPoke
        }
        showPoke(players)
    }
    givePoke()
    //将牌分配到对应div中
    function showPoke(obj) {
        for (var j = 0; j < $('.user').length; j++) {
            var html = '<div class="user-pokeBox">'
            obj[j].poke.forEach(function (i, index) {
                html += '<div class="user-pokeOneBox">'
                html += "<div class='poke user-pokeOne' style='background-position-y:" + i.y + "px;background-position-x:" + i.x + "px'></div>"
                html += '</div>'
            })
            html += '</div>'
            $($('.user')[j]).append(html)
        }
        whoWin()
    }
    //判断大小 （多个人）
    function whoWin() {
        console.log(whatPoke())
    }
    //判断每个玩家手牌是什么  （3张牌）
    function whatPoke() {
        var nowPlayersPoke = [] //当前玩家的手牌是什么类型的数组对象
        players.forEach(function (i, ind) {
            var pokeArr = i.poke
            var nowPokeName = 0;    //当前牌的名字类型  //1：散牌 2：对子 3：顺子 4:同花  5：小飞机 6：大飞机
            var nowPokeNum = 0;     //当前牌的总数字合，用来判断同名字的大小
            var nowPokeType = 0;    //当前花色大小, 取最大的牌作为比较  4>3>2>1
            var nowPoint = 0;  //散牌 100分，对子1000分，顺子10000分，同花100000分，小飞机1000000，大飞机10000000分
            //大小排序
            pokeArr = pokeArr.sort(
                function () {
                    return function (a, b) {
                        return b.num - a.num
                    }
                }()
            )
            nowPokeNum = pokeArr[0].num + pokeArr[1].num + pokeArr[2].num
            nowPokeType = pokeArr[0].type
            //判断是否是飞机
            //当所有牌数字相等时  -大飞机 AAA
            if ((pokeArr[0].num == pokeArr[1].num) && (pokeArr[1].num == pokeArr[2].num)) {
                nowPokeName = 6
                nowPoint = nowPokeName * 1000000 + nowPokeNum
                // console.log('大飞机')
            }
            //判断是否是对子
            //两张牌数字相等,且第三张不相同  -对子 AAx
            else if ((pokeArr[0].num == pokeArr[1].num) || (pokeArr[0].num == pokeArr[2].num) || (pokeArr[1].num == pokeArr[2].num)) {
                // console.log('对子')
                nowPokeName = 2
                var nowPokeMaxPoint = 0
                //判断是什么对子
                if (pokeArr[0].num == pokeArr[1].num) {
                    nowPokeMaxPoint = (pokeArr[0].num * 1000) + pokeArr[2].num + pokeArr[2].type
                } else if (pokeArr[0].num == pokeArr[2].num) {
                    nowPokeMaxPoint = (pokeArr[0].num * 1000) + pokeArr[1].num + pokeArr[1].type
                } else if (pokeArr[1].num == pokeArr[2].num) {
                    nowPokeMaxPoint = (pokeArr[1].num * 1000) + pokeArr[0].num + pokeArr[0].type
                }
                nowPoint = nowPokeName * 1000 + nowPokeMaxPoint
            }
            //判断是否是小飞机
            //当所有牌type相等时，且123类型  --小飞机 同花顺
            //先判断类型相同 ， 再判断大小连续
            else if (((pokeArr[0].type == pokeArr[1].type) && (pokeArr[1].type == pokeArr[2].type)) && ((pokeArr[0].num - pokeArr[1].num == 1) && (pokeArr[1].num - pokeArr[2].num == 1))) {
                // console.log('小飞机')
                nowPokeName = 5
                nowPoint = nowPokeName * 1000000 + nowPokeNum
            }
            //判断是否是同花
            //当所有牌type相等时  -同花
            else if ((pokeArr[0].type == pokeArr[1].type) && (pokeArr[1].type == pokeArr[2].type)) {
                // console.log('同花')
                nowPokeName = 4
                //判断第一个数字大小，再判断花色
                nowPoint = (nowPokeName * 100000) + (pokeArr[0].num * 1000) + (pokeArr[1].num * 10) + pokeArr[2].num + pokeArr[0].type
            }
            //判断是否是顺子
            //123类型的顺子
            else if ((pokeArr[0].num - pokeArr[1].num == 1) && (pokeArr[1].num - pokeArr[2].num == 1)) {
                // console.log('顺子')
                nowPokeName = 3
                //判断第一个数字大小，再判断花色
                nowPoint = (nowPokeName * 10000) + (pokeArr[0].num * 150) + pokeArr[0].type
            }
            //散牌
            else {
                // console.log('散牌')
                nowPokeName = 1
                //判断第一个数字大小，再判断第二个数字大小，再判断第三个数字大小，再判断花色
                nowPoint = (pokeArr[0].num * 30) + (pokeArr[1].num * 20) + (pokeArr[2].num * 10) + pokeArr[0].type
            }
            // console.log(nowPoint)
            nowPlayersPoke[ind] = {
                nowPokeName,
                nowPokeNum,
                nowPokeType,
                name: i.name,
                nowPoint
            }
        })
        return nowPlayersPoke
    }

})
