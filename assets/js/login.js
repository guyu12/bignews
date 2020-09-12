$(function() {
    // 点击切换注册登录页面
    $('.login_box').on('click', '#link_reg', function() {
        $('.login_box').hide()
        $(".reg_box").show()
    })

    $('.reg_box').on('click', '#link_login', function() {
        $('.reg_box').hide()
        $(".login_box").show()
    })

    // 表单验证规则
    var form = layui.form
    var layer = layui.layer
    form.verify({
        // 密码验证
        psw: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repsw: function(value) {
            if (value !== $('.password').val()) {
                return '两次密码输入不一致'
            }
        }
    })

    // 调用接口发起注册用户的请求
    $("#form_reg").on('submit', function(e) {

        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/reguser',
            type: 'post',
            data: $(this).serialize(),
            success: function(res) {

                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功')
                $("#link_login").click()
            }
        })
    })

    // 调用接口发送登陆请求
    $("#form_login").on('submit', function(e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            type: 'post',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登陆成功')
                localStorage.getItem('token', res.token)
                location.href = './index.html'
            }



        })




    })






})