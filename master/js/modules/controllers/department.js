/**=========================================================
 * Module: DepartmentController.js
 =========================================================*/

App.controller('DepartmentController', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope) {
        var
            buildParam = function () {

                var param = {
                    method: 'GET',
                    url: '/apis/remove-me/account-service/department/list',
                };
                return param;
            },
            loadData = function () {
                $http(buildParam())
                    .then(function (response) {
                        if (response.data.status === 200) {
                            $scope.items = response.data.data;
                        } else {
                            $.notify(response.data.message, 'danger');
                        }
                    }, function (x) {
                        $.notify('服务器出了点问题，我们正在处理', 'danger');
                    });
            };

        $rootScope.searchDepartmentList = loadData;
        loadData();

        $(window).resize(function () {
            var d = $('#container');
            d.height($(window).height() - d.offset().top);
        });
        $(window).resize();
    }]);

App.controller('ModifyDepartmentCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    $scope.save = function () {
        var param= {};
        if($scope.ngDialogData.new){
            param = {
                method: 'POST',
                url: '/apis/remove-me/account-service/department/add',
                data: JSON.stringify($scope.ngDialogData),
            };
        }else
         param = {
            method: 'POST',
            url: '/apis/remove-me/account-service/department/edit',
            data: JSON.stringify($scope.ngDialogData),
        };
        $http(param)
            .then(function (response) {
                if (response.data.status === 200) {
                    $rootScope.searchDepartmentList();
                    $.notify("修改成功", 'success');
                    $scope.closeThisDialog();
                } else {
                    $.notify(response.data.message, 'danger');
                }
            }, function (x) {
                $.notify('服务器出了点问题，我们正在处理', 'danger');
            });
    }
}]);
