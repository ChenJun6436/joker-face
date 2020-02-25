$(function () {
    //获取当前用户的定位
    getLocation();
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                locationSuccess,  //成功回调
                locationError, //失败的回调
                {
                    enableHighAcuracy: true,// 指示浏览器获取高精度的位置，默认为false  
                    timeout: 5000,// 指定获取地理位置的超时时间，默认不限时，单位为毫秒  
                    maximumAge: 3000
                    // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。  
                }
            );
        } else {
            locationByIp();
        }
    }
    function locationSuccess(position) {
        //将经纬度转换为坐标数组
        var gpsH = [position.coords.longitude, position.coords.latitude];
        map_click(position.coords.longitude, position.coords.latitude)
        alert(gpsH)
    }
    function locationError() {
        alert('定位失败，请确保定位已开启')
    }
    //根据经纬度获取当前地名 bmap
    function map_click(lng, lat) {
        var point = new BMap.Point(lng, lat);
        var geoc = new BMap.Geocoder();
        geoc.getLocation(point, function (rs) {
            var addComp = rs.addressComponents;
            alert(addComp.province + ', ' + addComp.city + ', ' + addComp.district + ', ' + addComp.street + ', ' + addComp.streetNumber);
        });
    }
    //获取当前的用户的ip 
    getUserIp()
    function getUserIp(){
        $.ajax({
            type: "GET",
            url: 'http://192.168.10.185:3000' + "/b",
            dataType:'json',
            headers:{
              'Content-Type': 'application/json',
            },
            beforeSend: function () {
            },
            success: function (data) {
                sessionStorage.setItem('ip',data.ip)
            }
        })
    }
    //使用用户名登陆
    $('#go').on('click',function(){
        if(!$('#name').val()) return
        var user = {
            name : $('#name').val(),
            ip: sessionStorage.getItem('ip')
        }
        localStorage.setItem('user',JSON.stringify(user))
        window.location.href= 'index.html'
    })
})