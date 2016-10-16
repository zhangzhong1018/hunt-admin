role_tool = {
    //初始化页面+加载数据
    init_main_view: function () {
        $("#role_grid").datagrid({
            url: "/role/select",
            method: 'get',
            idField: "id",
            treeField: 'name',
            fitColumns: true,
            toolbar: '#role-tool-bar',
            rownumbers: true,
            animate: true,
            singleSelect: true,
            fit: true,
            border: false,
            pagination: false,
            striped: true,
            pagePosition: "bottom",
            pageNumber: 1,
            pageSize: 15,
            pageList: [15, 30, 45, 60],
            columns: [[
                {title: "选择", field: "ck", checkbox: true},
                {title: "名称", field: "name", width: 300},
                {title: "说明", field: "description", width: 400},
                {
                    title: "是否可修改", field: "isFinal", formatter: function (value, row, index) {
                    if (value == 1) {
                        return "是";
                    }
                    if (value == 2) {
                        return "否";
                    }
                }, width: 60
                },
                {
                    title: "创建时间", field: "createTime", formatter: function (value, row, index) {
                    date = new Date(value);
                    timeStr = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay() + " " + date.getHours() + ":" + date.getMinutes();
                    return timeStr;
                }, width: 100
                },
                {
                    title: "更新时间", field: "updateTime", formatter: function (value, row, index) {
                    date = new Date(value);
                    timeStr = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay() + " " + date.getHours() + ":" + date.getMinutes();
                    return timeStr;
                }, width: 100
                },
            ]],
        });
    },
    delete: function () {
        if ($("#role_grid").datagrid("getChecked").length == 0) {
            common_tool.messager_show("请选择一条记录");
        }
        var roleId = $("#role_grid").datagrid("getChecked")[0].id;
        $.ajax({
            data: {
                id: roleId,
            },
            traditional: true,
            method: 'post',
            url: '/role/delete',
            async: false,
            dataType: 'json',
            success: function (result) {
                if (result.code == 10000) {
                    role_tool.init_main_view();
                    common_tool.messager_show(result.msg);
                    return false;
                }
                else {
                    common_tool.messager_show(result.msg);
                }
            },
        });
    },
    save: function () {
        if (!$("#name").validatebox('isValid')) {
            common_tool.messager_show("请输入角色名称");
        } else if (!$("#description").validatebox('isValid')) {
            common_tool.messager_show("请输入角色描述");
        } else if ($("#permissions").datagrid("getChecked").length == 0) {
            common_tool.messager_show("请为该角色选择权限");
        } else {
            var name = $("#name").val();
            var description = $("#description").val();
            var permission_array = $("#permissions").datagrid("getChecked");
            var permission_ids = new Array();
            for (var i = 0; i < permission_array.length; i++) {
                permission_ids[i] = permission_array[i].id;
            }
            console.log(permission_ids)
            $.ajax({
                data: {
                    name: name,
                    description: description,
                    permissionIds: permission_ids.toString(),
                },
                traditional: true,
                method: 'post',
                url: '/role/insert',
                async: false,
                dataType: 'json',
                success: function (result) {
                    if (result.code == 10000) {
                        $("#role_edit_dialog").dialog("close");
                        $("#role_edit_form").form('reset');
                        role_tool.init_main_view();
                        common_tool.messager_show(result.msg);
                        return false;
                    }
                    else {
                        common_tool.messager_show(result.msg);
                    }
                },
            });
        }
    },
    update: function () {
        if (!$("#name").validatebox('isValid')) {
            common_tool.messager_show("请输入角色名称");
        } else if (!$("#description").validatebox('isValid')) {
            common_tool.messager_show("请输入角色描述");
        } else if ($("#permissions").datagrid("getChecked").length == 0) {
            common_tool.messager_show("请为该角色选择权限");
        } else {
            var id = $("#id").val();
            var name = $("#name").val();
            var description = $("#description").val();
            var permission_array = $("#permissions").datagrid("getChecked");
            var permission_ids = new Array();
            for (var i = 0; i < permission_array.length; i++) {
                permission_ids[i] = permission_array[i].id;
            }
            console.log(permission_ids)
            $.ajax({
                data: {
                    id: id,
                    name: name,
                    description: description,
                    permissionIds: permission_ids.toString(),
                },
                traditional: true,
                method: 'post',
                url: '/role/update',
                async: false,
                dataType: 'json',
                success: function (result) {
                    if (result.code == 10000) {
                        $("#role_edit_dialog").dialog("close");
                        $("#role_edit_form").form('clear');
                        role_tool.init_main_view();
                        common_tool.messager_show(result.msg);
                        return false;
                    }
                    else {
                        common_tool.messager_show(result.msg);
                    }
                },
            });
        }
    },
    init_edit_view: function (type) {
        $("#role_edit_dialog").dialog({
            title: '新增角色',
            iconCls: 'icon-save',
            closable: true,
            width: 900,
            height: 400,
            cache: false,
            modal: true,
            resizable: false,
            'onOpen': function () {
                console.log('load permissions data')
                if (type == 2) {
                    var role = $("#role_grid").datagrid("getChecked")[0];
                    for (var i = 0; i < role.sysPermissions.length; i++) {
                        $("#permissions").datagrid("selectRecord", role.sysPermissions[i].id);
                    }
                }
            },
            buttons: [
                {
                    text: '保存',
                    width: 100,
                    iconCls: 'icon-save',
                    handler: function () {
                        if (type == 1) {
                            role_tool.save();
                        }
                        if (type == 2) {
                            role_tool.update();
                        }
                    }
                },
                {
                    text: '清除',
                    width: 100,
                    iconCls: 'icon-reload',
                    handler: function () {
                        $("#role_edit_form").form('clear');
                    }
                },
                {
                    text: '取消',
                    width: 100,
                    iconCls: 'icon-add',
                    handler: function () {
                        $("#role_edit_dialog").dialog('close');
                        $("#role_edit_form").form('clear');
                    }
                }
            ],
        });
    }
};
$(document).ready(function () {
    role_tool.init_main_view();
    $("#role-select-btn").click(function () {
        role_tool.init_main_view();
    });

    $("#role-save-btn").click(function () {
        role_tool.init_edit_view(1);
    });

    $("#role-update-btn").click(function () {
        if ($("#role_grid").datagrid("getChecked").length == 0) {
            common_tool.messager_show("请选择一条记录");
            return false;
        }

        role_tool.init_edit_view(2);
        var role = $("#role_grid").datagrid("getChecked")[0];
        $("#role_edit_form").form('load', {
            id: role.id,
            name: role.name,
            description: role.description,
        })
    });
    $("#role-delete-btn").click(function () {
        $.messager.confirm('确认对话框', "您确认删除该条记录吗?", function (r) {
            if (r) {
                role_tool.delete();
            }
        });

    });
    $("#role-select-btn ").click(function () {
        role_tool.init_main_view();
    });
})