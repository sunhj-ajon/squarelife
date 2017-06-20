/**
 * Created by admin on 2015/7/7.
 */
var indexapp = angular.module("indexapp", ["ngRoute"]);

indexapp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when("/index", {templateUrl: 'doshborad.html'})
        .when("/friend", {templateUrl: 'admin/friendManager.html'})
        .when("/shops", {templateUrl: 'admin/shopsManager.html'})
        .when("/shopedit", {templateUrl: 'admin/shopsEdit.html'})
        .when("/goods", {templateUrl: 'admin/goodsManager.html'})
        .when("/goodsedit", {templateUrl: 'admin/goodsEdit.html'})
        .when("/demand", {templateUrl: 'admin/demandManager.html'})
        .when("/grad", {templateUrl: 'admin/gradManager.html'})
        .when("/banner", {templateUrl: 'admin/banner.html'})
        .when("/applywithdrawals", {templateUrl: 'admin/applywithdrawalsManager.html'})
        .when("/withdrawcash", {templateUrl: 'admin/withdrawcashManager.html'})
        .when("/suggest", {templateUrl: 'admin/suggestManager.html'})
        .when("/user", {templateUrl: 'admin/userManager.html'})
        .when("/useredit", {templateUrl: 'admin/userEdit.html'})

        .otherwise({templateUrl: 'doshborad.html'});
}]);