$(function() {
    var layer = layui.layer
    var form = layui.form
    initArtCatelist()

    // 调用函数获取文章分类列表
    function initArtCatelist() {
        $('tbody').html('')
        $.ajax({
            url: '/my/article/cates',
            type: 'get',
            success: function(res) {
                var tr = template('tpl-table', res)
                $('tbody').append(tr)
            }
        })
    }

    var index = null
    var index1 = null
        // 点击添加按钮，弹出弹出层
    $('#btnAddCate').on('click', function() {
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    //通过代理的方法为为表单添加提交事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            url: '/my/article/addcates',
            type: 'post',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCatelist()
                layer.msg(res.message)
                layer.close(index)
            }
        })
    })

    // 使用代理的方法给btn-edit添加点击事件，弹出编辑框
    $('tbody').on('click', '.btn-edit', function() {
        index1 = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id')
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data)
            }

        })
    })

    //通过代理的方法为为表单添加修改事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            url: '/my/article/updatecate',
            type: 'post',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                layer.close(index1)
                initArtCatelist()
            }
        })
    })

    // 使用代理的方法给btn-delete添加点击事件，弹出编辑框
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')

        // 提示用户是否要删除
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                url: '/my/article/deletecate/' + id,
                type: 'get',
                success: function(res) {

                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    initArtCatelist()
                    layer.close(index);
                }
            })

        });


    })





})