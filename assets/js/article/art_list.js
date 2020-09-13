$(function() {

    // 美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = (dt.getMonth() + 1).toString().padStart(2, 0)
        var d = dt.getDate().toString().padStart(2, 0)

        var hh = dt.getHours().toString().padStart(2, 0)
        var mm = dt.getMinutes().toString().padStart(2, 0)
        var ss = dt.getSeconds().toString().padStart(2, 0)

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss

    }

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义一个查询的参数将来请求数据的时候需要将请求对象提交到服务器
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '', //文章的状态，可选值有：已发布、草稿

    }

    initTable()
    initCate()

    // 获取文章列表数据并渲染页面
    function initTable() {
        $('tbody').html('')
        $.ajax({
            url: '/my/article/list',
            type: 'get',
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').append(htmlStr)
                rederPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {

        $.ajax({
            url: '/my/article/cates',
            type: 'get',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-cate', res)

                $('#cate_id').append(htmlStr)

                // 通知layui重新渲染表单区域的UI结构
                form.render()
            }
        })
    }


    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
        var cate_id = $('#cate_id').val()
        var state = $('#state').val()

        // 重新给p赋值
        q.cate_id = cate_id
        q.state = state
        initTable()

    })

    // 定义渲染分页的方法
    function rederPage(total) {
        // 渲染分页结构
        laypage.render({
            elem: 'pageBox', //存放分页的容器
            count: total, //数据的总数
            limit: q.pagesize, //每页显示的条数
            curr: q.pagenum, //起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // jump回调的触发有两个
            // 1.点击页码时会调用
            // 2.只要调用laypage.render(方法就会调用)
            jump: function(obj, first) {
                // console.log(obj.curr);
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                    // 直接调用会实现死循环
                    // initTable()
                    // 判断first是否为true
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 点击删除删除当前行
    $('body').on('click', '.btnDelete', function() {
        var len = $('.btnDelete').length
            // console.log(len);

        var id = $(this).attr('data-id')
            // console.log(id);

        layer.confirm('确认删除?', function(index) {
            //do something
            $.ajax({
                url: '/my/article/delete/' + id,
                type: 'get',
                success: function(res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)

                    // 当数据删除完成后，需要判断当前页面是否还有数据，如果没有数据，页码值需要减一，再重新调用initTable()

                    // 当len等于1时，删除之后则当前页面没有数据了
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });




    })
})