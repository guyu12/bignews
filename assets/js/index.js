$(function() {
        getUserInfo()
            // 退出登录
        var layer = layui.layer
        $('#btnLogout').on('click', function(e) {
            layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
                //do something
                localStorage.removeItem('token')
                location.href = './login.html'

                layer.close(index);
            });

        })
    })
    // window.getUserInfo = getUserInfo

// 获取用户信息
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        type: 'get',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            // 渲染用户名和选择头像
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            console.log(res);
            renderAvater(res)
        }

        // complete: function(res) {
        //     console.log(res);
        //     if (res.responseJSON.message === '身份认证失败！' && res.responseJSON.status === 1) {

        //         location.href = './login.html';
        //         localStorage.removeItem('token');
        //     }
        // }

    })
}


function renderAvater(user) {
    var name = user.data.nickname || user.data.username
    $('#welcome').html('欢迎&nbsp&nbsp' + name)
    if (user.data.user_pic === null) {
        $(".layui-nav-img").hide()
        $('.text-event').html(name[0].toUpperCase()).show()
    } else {
        $(".layui-nav-img").prop('src', user.data.user_pic).show()
        $('.text-event').hide()
    }
}