//引入数据库
var mysql = require('mysql');
//创建数据库链接
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    port: '3306',
    database: 'test'
});
connection.connect();
console.log('Connecting to MySQL...');
//开始查询
connection.query('SELECT * FROM student', function selectCb(err, results, fields) {
    if (err) {
        throw err;
    }
    var data = '';
    for (var i = 0; i < results.length; i++) {
        var firstResult = results[i];
        data += 'sno: ' + firstResult['sno'] + 'sname: ' + firstResult['sname'];
    }
    console.log(data)
});
var post = {
    'userName': 'chenjun',
    'userPassWord': '123456',
}


//创建express服务
var app = require('express')();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
//配置请求头，允许请求跨域
app.all('*', function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "Content-Type,X-Requested-With");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.sendStatus(200);  //让options尝试请求快速结束
    else
        next();
});
//接口test
app.get('/a', function (req, res) {
    connection.query('SELECT * FROM student', function selectCb(err, results, fields) {
        if (err) {
            throw err;
        }
        var data = '';
        var questions = []
        for (var i = 0; i < results.length; i++) {
            var firstResult = results[i];
            questions.push({
                'sno': firstResult['sno'],
                'sname': firstResult['sname']
            })
        }
        res.json(questions)
        console.log(firstResult)
    });
});
//注册接口
app.post('/register', function (req, res) {
    var data = req.body
    let toData = {
        msg: '新增成功',
        code: 1,
    }
    connection.query('SELECT * FROM user where userName=' + data.userName + ' or userPlayName=' + data.userPlayName, function selectCb(err, results) {
        if (err) {
            throw err;
        }
        if (results.length > 0) {
            toData.msg = '已存在账号或昵称，请换一个试试'
            toData.code = 0
        } else {
            connection.query('INSERT INTO user(id,userName,userPassWord,userPlayName) VALUES(uuid(),' + data.userName + ',' + data.userPassWord + ',' + data.userPlayName + ')', function (error, res, data) {
                if (error) throw error;
                console.log(res)
                console.log(data)
            })
        }
        res.jsonp(toData)
    });
});
//登陆接口
app.post('/login', function (req, res) {
    var data = req.body
    let toData = {
        msg: '登陆成功',
        code: 1,
        data: null,
    }
    connection.query('SELECT * FROM user where userName=' + data.userName + ' && userPassWord=' + data.userPassWord, function selectCb(err, results) {
        if (err) {
            throw err;
        }
        if (results.length == 0) {
            toData.msg = '账号或密码错误'
            toData.code = 0
        } else {
            toData.data = results[0]
        }
        res.jsonp(toData)
    });
});
////////////////socekt逻辑
var http = require('http').Server(app);
//创建Scoket服务
var io = require('socket.io')(http);
//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;

//当前用户
var players = []
//全局状态
let all = {
    allState: 0,
    nowRound: 1,
    nowUserIndex: 0,
}
var allPoke = [] //我的poke
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
            name, type: 4, num: i,
        }
        //红糖牌
        var onePoke2 = {
            name, type: 3, num: i,
        }
        //梅花牌
        var onePoke3 = {
            name, type: 2, num: i,
        }
        //方块牌
        var onePoke4 = {
            name, type: 1, num: i,
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
    var nowPoke = JSON.parse(JSON.stringify(allPoke));
    for (var j = 0; j < players.length; j++) {
        var playerPoke = []
        for (var i = 1; i < 4; i++) {
            var num = Math.floor(Math.random() * nowPoke.length);   //取剩下的长度
            playerPoke.push(nowPoke[num])
            nowPoke.splice(num, 1)
        }
        //大小排序
        playerPoke = playerPoke.sort(
            function () {
                return function (a, b) {
                    return b.num - a.num
                }
            }()
        )
        players[j].poke = playerPoke
    }
}
//判断每个玩家手牌是什么  （3张牌）
function whatPoke(lastPlayers, room) {
    var nowPlayersPoke = [] //当前玩家的手牌是什么类型的数组对象
    lastPlayers.forEach(function (i, ind) {
        var pokeArr = i.poke
        var nowPokeName = 0;    //当前牌的名字类型  //1：散牌 2：对子 3：顺子 4:同花  5：小飞机 6：大飞机
        var nowPokeNum = 0;     //当前牌的总数字合，用来判断同名字的大小
        var nowPokeType = 0;    //当前花色大小, 取最大的牌作为比较  4>3>2>1
        var nowPoint = 0;  //散牌 100分，对子1000分，顺子10000分，同花100000分，小飞机1000000，大飞机10000000分
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
        nowPlayersPoke[ind] = {
            nowPokeName,
            nowPokeNum,
            nowPokeType,
            nowPoint,
            user: i
        }
    })
    var lastPoke = nowPlayersPoke
    var nowPointLast = []
    lastPoke.forEach(function (i, index) {
        nowPointLast.push(i.nowPoint)
    })
    var maxPonit = Math.max.apply(null, nowPointLast)
    var nowWin = lastPoke[nowPointLast.indexOf(maxPonit)]
    // //向所有客户端广播谁获得了胜利
    players.forEach(function (i, index) {
        i.state = 0
    })
    // 找到当前房间的玩家
    var nowRoomPlayers = nowRoomUserFn(room)
    io.emit('win', { nowWin, players, all });
    // return nowPlayersPoke
}
//传入房间名字 返回当前房间的玩家
function nowRoomUserFn(roomName) {
    //玩家的连接id
    var nowRoomUsersId = io.sockets.adapter.rooms[roomName].sockets
    var nowRoomPlayers = []
    players.forEach((i) => {
        for (var o in nowRoomUsersId) {
            if (o == i.socketId) {
                nowRoomPlayers.push(i)
            }
        }
    })
    return nowRoomPlayers
}

io.on('connection', function (socket) {
    //监听用户加入房间
    socket.on('join', function (obj) {
        let user = obj
        socket.join(user.room)
        console.log('join')
        console.log(obj)
        user.socketId = socket.id
        //判断是否是新用户 , 添加到所有用户中
        var isNew = true
        if (players.length != 0) {
            players.forEach(function (i, index) {
                if (i.name == user.name) {
                    isNew = false
                }
            })
        }
        if (isNew) {
            user.state = 0
            //判断是否是房主-- 第一个进入  1房主
            if (players.length == 0) {
                user.role = 1
                user.state = 1
            } else {
                user.role = 0
            }
            user.index = players.length
            //将用户添加到players
            players.push(user)
        }
        // 找到当前房间的玩家
        var nowRoomPlayers = nowRoomUserFn(user.room)
        // socket.broadcast.in(user.room).emit('join', { user: obj, players, all });
        //给当前房间的所有人广播 是谁进入了， 返回当前房间的玩家
        io.to(user.room).emit('join', { user: obj, players: nowRoomPlayers, all });
        // io.emit('join', { user: obj, players, all });
    })
    //监听用户操作按钮
    socket.on('changeState', function (obj) {
        console.log('changeState')
        console.log(obj)
        //我的状态 0未准备，1准备，2闷，3看牌，4逮，5弃，6开
        let isAllReady = true //0-1   是否已经全部准备
        let nowName = null // 当前操作玩家
        let nowIndex = 0
        if (obj.state == 'start') {
            givePoke()
            all.allState = 2
            obj.state = 1
        } else {
            players.forEach(function (i, index) {
                if (i.name == obj.user.name) {
                    i.state = obj.state
                    nowIndex = index
                    nowName = i.name
                }
                if (i.state == 0) {
                    isAllReady = false
                }
            })
        }
        if (all.allState != 2 && isAllReady) {
            all.allState = 1
        }
        all.nowName = nowName

        switch (obj.state) {
            case 'start':
                all.nowUserIndex = 0
                break
            case 1:
                all.nowUserIndex = 0
                break
            case 2:
                all.nowUserIndex = nowIndex + 1
                break
            case 3:
                all.nowUserIndex = nowIndex
                break
            case 4:
                all.nowUserIndex = nowIndex + 1
                break
            case 5:
                all.nowUserIndex = nowIndex + 1
                break
            case 6:
                all.nowUserIndex = 0
                all.allState = 3 //开牌
                console.log('开牌000000000000000000')
                /////////////////比大小///////////////
                let lastPlayers = players.filter((last) => {
                    return last.state != 5
                })
                whatPoke(lastPlayers, obj.user.room)
                break
        }
        //判断是否只有一个没弃牌
        let yuUser = players.filter((i) => {
            return i.state != 5
        })
        console.log(yuUser, 'yuuer----------------')
        if (yuUser && yuUser.length == 1) {
            console.log('开牌11111111111111111111')
            all.allState = 3 //开牌
            whatPoke(yuUser, obj.user.room)
            /////////////////比大小///////////////
        } else {
            //如果下一位玩家已经弃牌，自动跳到再下一位 1 2 5
            var check = function () {
                for (var i = all.nowUserIndex; i < players.length; i++) {
                    var now = i
                    var next = i + 1
                    if (now == players.length - 1) {
                        next = 0
                    }
                    if (players[now].state == 5 && players[next].state != 5) {
                        console.log(now);
                        all.nowUserIndex += (i + 1)
                        break
                    } else if (players[now].state != 5) {
                        break
                    }
                }
            };
            check()
        }
        console.log(all.nowUserIndex, '---------------')
        //走完一轮
        if (all.nowUserIndex >= players.length) {
            all.nowUserIndex = 0
            all.nowRound++
        }
        console.log(all)
        console.log(players)
        // 找到当前房间的玩家
        var nowRoomPlayers = nowRoomUserFn(obj.user.room)
        // //向所有客户端广播用户加入, 返回！新用户---所有用户
        io.emit('changeState', { user: obj, players: nowRoomPlayers, all });
    })


    //监听用户准备
    socket.on('ready', function (obj) {
        console.log('ready')
        console.log(obj)
        //判断是否是新用户 , 添加到所有用户中
        players.forEach(function (i, index) {
            if (i.username == obj.username) {
                players[index].state = 1
            }
        })
        //向所有客户端广播用户加入, 返回！新用户---所有用户
        io.emit('ready', { user: obj, players, });
    })
    //监听房主发牌
    socket.on('sendPoke', function (obj) {
        console.log(obj)
        var ind = null
        obj.forEach(function (i, index) {

        })
        // io.emit('ready', { user: obj , players , });
    })

    console.log('a user connected');

    //监听新用户加入
    socket.on('login', function (obj) {
        //将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
        socket.name = obj.userid;
        //检查在线列表，如果不在里面就加入
        if (!onlineUsers.hasOwnProperty(obj.userid)) {
            onlineUsers[obj.userid] = obj.username;
            //在线人数+1
            onlineCount++;
        }
        //向所有客户端广播用户加入
        io.emit('login', { onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj });
        console.log(obj.username + '加入了聊天室');
    });

    //监听用户退出
    socket.on('disconnect', function () {
        //将退出的用户从在线列表中删除
        if (onlineUsers.hasOwnProperty(socket.name)) {
            //退出用户的信息
            var obj = { userid: socket.name, username: onlineUsers[socket.name] };
            //删除
            delete onlineUsers[socket.name];
            //在线人数-1
            onlineCount--;
            //向所有客户端广播用户退出
            io.emit('logout', { onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj });
            console.log(obj.username + '退出了聊天室');
        }
    });
    //监听用户发布聊天内容
    socket.on('message', function (obj) {
        //向所有客户端广播发布的消息
        io.emit('message', obj);
    });
});

//监听3000端口
http.listen(3000, function () {
    console.log('listening on *:3000');
})
