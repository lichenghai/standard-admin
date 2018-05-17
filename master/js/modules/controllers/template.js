/**=========================================================
 * Module: TemplateController.js
 =========================================================*/

App.controller('TemplateController', ['$scope', '$http',
    function ($scope, $http) {
        $scope.upload = function () {
            var fd = new FormData();
            var file = document.querySelector('input[type=file]').files[0];
            fd.append('template', file);
            $http({
                method: 'POST',
                url: '/apis/remove-me/standard-service/detail/upload',
                data: fd,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            })
                .then(function (response) {
                    if (response.data.status === 200) {
                        $.notify("上传成功！",'success');
                    } else {
                        $.notify("上传失败："+response.data.message, 'danger');
                    }
                }, function (x) {
                    $.notify('服务器出了点问题，我们正在处理', 'danger');
                });

        }
        $(window).resize(function () {
            var d = $('#container');
            d.height($(window).height() - d.offset().top);
        });
        $(window).resize();
    }])
;
