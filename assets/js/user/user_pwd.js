$(function() {
    var layer = layui.layer
    var form = layui.form

    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samepwd: function(value) {
            if (value === $("#oldPwd").val()) {
                return '新密码与原密码不能相同'
            }
        },
        repwd: function(value) {
            if (value !== $("#newPwd").val()) {
                return '两次密码输入不一致'
            }
        }
    })

    // 请求实现重置密码
    $('#layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            url: '/my/updatepwd',
            type: 'post',
            data: $(this).serialize(),
            success: function(res) {

                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                $('#layui-form')[0].reset()
                localStorage.removeItem('token')
                top.window.location.href = '../login.html'
            }



        })
    })






})