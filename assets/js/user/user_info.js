$(function() {
    var layer = layui.layer
    var form = layui.form
    form.verify({
        // 校验昵称
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })

    initUserInfo()
        // 获取用户的基本信息
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            type: 'get',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置
    $('.layui-btn-primary').on('click', function(e) {
            e.preventDefault()
            initUserInfo()
        })
        // 发起请求更新用户的信息
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                window.parent.getUserInfo()
            }
        })
    })
})