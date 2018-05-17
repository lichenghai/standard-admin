/**=========================================================
 * Module: UserController.js
 =========================================================*/

App.controller('UserController', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope) {
        $rootScope.RoleTypeList = [{
            key: 0,
            value: "全部"
        },
            {
                key: 1,
                value: "常委"
            },
            {
                key: 2,
                value: "主官"
            },
            {
                key: 3,
                value: "下属"
            }
        ];

        $rootScope.RoleTypeMapping = {
            0: "全部",
            1: "常委",
            2: "主官",
            3: "下属"
        };
        $scope.search = {
            role: 0,
            username: '',
            account: '',
            page: 1,
            size: 20
        };


        var
            buildParam = function () {

                var params = {
                    role: $scope.search.role,
                    page: $scope.search.page,
                    size: $scope.search.size,
                }
                if ($scope.search.username != "") params['username'] = $scope.search.username;
                if ($scope.search.account != "") params['account'] = $scope.search.account;

                var param = {
                    method: 'GET',
                    url: '/apis/remove-me/account-service/person/list',
                    params: params
                };
                return param;
            },
            loadData = function () {
                $http(buildParam())
                    .then(function (response) {
                        if (response.data.status === 200) {
                            $scope.items = response.data.data.list;
                            $scope.totalItems = response.data.data.total;
                        } else {
                            $.notify(response.data.message, 'danger');
                        }
                    }, function (x) {
                        $.notify('服务器出了点问题，我们正在处理', 'danger');
                    });
            };

        $scope.pageChanged = loadData;
        $rootScope.searchUserList = loadData;
        $scope.resetSearch = function () {
            $scope.totalItems = 0;
            $scope.search.account = '';
            $scope.search.username = '';
            $scope.search.role = 0;
            $scope.search.page = 1;
            loadData();
        };
        loadData();

        $(window).resize(function () {
            var d = $('#container');
            d.height($(window).height() - d.offset().top);
        });
        $(window).resize();
    }]);

App.controller('ModifyUserCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    var relation = {
        departmentId: 0,
        departmentName: '',
        personId: $scope.ngDialogData.id,
        level: '',
    };
    $scope.department = {
        id: 0,
        department_name: ''
    };
    $scope.level = '';
    //$scope.departmentName

    $http.get('/apis/remove-me/account-service/department/list')
        .then(function (response) {
            if (response.data.status === 200) {
                $scope.departmentList = response.data.data;
            } else {
                $.notify(response.data.message, 'danger');
            }
        }, function (x) {
            $.notify('服务器出了点问题，我们正在处理', 'danger');
        });

    var loadRelations = function () {
        $http.get('/apis/remove-me/account-service/relations/list?personId=' + $scope.ngDialogData.id)
            .then(function (response) {
                if (response.data.status === 200) {
                    $scope.relations = response.data.data;
                } else {
                    $.notify(response.data.message, 'danger');
                }
            }, function (x) {
                $.notify('服务器出了点问题，我们正在处理', 'danger');
            });
    }


    $scope.add = function () {
        var id = $scope.department.id;
        var dupFlag = false;
        $scope.relations.forEach(function (item) {
            if (id == item.departmentId) {
                alert("这货已经在这个部门了");
                dupFlag = true;
            }
        })
        if (dupFlag) return;
        relation.departmentId = id;
        relation.departmentName = $scope.department.departmentName;
        relation.level = $scope.level;
        var param = {
            method: 'POST',
            url: '/apis/remove-me/account-service/relations/add',
            data: JSON.stringify(relation),
        };
        $http(param)
            .then(function (response) {
                if (response.data.status === 200) {
                    $scope.relations.push(response.data.data);
                    $.notify("添加成功", 'success');
                } else {
                    $.notify(response.data.message, 'danger');
                }
            }, function (x) {
                $.notify('服务器出了点问题，我们正在处理', 'danger');
            });
    }
    $scope.delete = function (id) {
        var param = {
            method: 'GET',
            url: '/apis/remove-me/account-service/relations/delete?id=' + id,
        };
        $http(param).then(function (response) {
            if (response.data.status === 200) {
                $scope.relations.forEach(function (item, index, array) {
                    if (id == item.id) {
                        array.splice(index, 1);
                    }
                })
            } else {
                $.notify(response.data.message, 'danger');
            }
        }, function (x) {
            $.notify('服务器出了点问题，我们正在处理', 'danger');
        })
    };
    $scope.save = function () {
        var param= {};
        if($scope.ngDialogData.new){
            //delete $scope.ngDialogData.new;
            param = {
                method: 'POST',
                url: '/apis/remove-me/account-service/person/add',
                data: JSON.stringify($scope.ngDialogData),
            };
        }else
         param = {
            method: 'POST',
            url: '/apis/remove-me/account-service/person/edit',
            data: JSON.stringify($scope.ngDialogData),
        };
        $http(param)
            .then(function (response) {
                if (response.data.status === 200) {
                    $rootScope.searchUserList();
                    $.notify("修改成功", 'success');
                    $scope.closeThisDialog();
                } else {
                    $.notify(response.data.message, 'danger');
                }
            }, function (x) {
                $.notify('服务器出了点问题，我们正在处理', 'danger');
            });
    }
    if(!$scope.ngDialogData.new)loadRelations();
}]);
