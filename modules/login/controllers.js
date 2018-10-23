'use strict';
var Regapp = angular.module("RegistrationApp", ['ngMaterial', 'ngAnimate', 'headerApp', 'ngCookies']);
Regapp.config(function ($mdThemingProvider) {
    $mdThemingProvider.definePalette('amazingPaletteName', {
        '50': "#f2b8b8",
        '100': "#e77777",
        '200': "#df4747",
        '300': "#bd2121",
        '400': "#a31d1d",
        '500': "#EF4130", //md-primary
        '600': "#6f1313",
        '700': "#550f0f",
        '800': "#3b0a0a",
        '900': "#210606",
        'A100': "#EEEEEE",
        'A200': "#EEEEEE",
        'A400': "#EEEEEE",
        'A700': "#EEEEEE",
        'contrastDefaultColor': "light",
        'contrastDarkColors': "50 100 A100 A200"
    });
    $mdThemingProvider.theme('default')
        .primaryPalette('amazingPaletteName')
});
//--------------------Compare password start-----------
var directiveId = 'ngMatch';
Regapp.directive(directiveId, ['$parse', function ($parse) {
    var directive = {
        link: link,
        restrict: 'A',
        require: '?ngModel'
    };
    return directive;
    function link(scope, elem, attrs, ctrl) {
        if (!ctrl) return;
        if (!attrs[directiveId]) return;
        var firstPassword = $parse(attrs[directiveId]);
        var validator = function (value) {
            var temp = firstPassword(scope),
                v = value == temp;
            ctrl.$setValidity('match', v);
            return value;
        }
        ctrl.$parsers.unshift(validator);
        ctrl.$formatters.push(validator);
        attrs.$observe(directiveId, function () {
            validator(ctrl.$viewValue);
        });
    }
}]);
//--------------------Compare password END-----------


//--------------------User Account start-----------

Regapp.directive('ngResourceImage', function ($timeout, $q) {
    return {
        restrict: 'A',
        link: function postLink(scope, element, attr) {
            var deferred = $q.defer();

            var image = new Image();
            image.onerror = function () {
                element[0].style.backgroundImage = "url('Assets/images/profile.jpg')";
            };
            image.onload = function () {
                element[0].style.backgroundImage = "url('" + attr.ngResourceImage + "')";
            };
            image.src = attr.ngResourceImage;
            attr.$observe('ngResourceImage', function (value) {
                element.css({
                    'background-image': 'url(' + value + ')'
                });
            });
        }
    };
});

Regapp.controller("registrationCtrl", function ($location, $scope, $window, $http, $cookies, $mdToast, $timeout) {
    $scope.dataLoading = false;
    $scope.Account = {};
    $scope.AddOrEdit = false;

    var access_token = "";
    var token_type = "";
    var url = window.location.href;
    $scope.param = url.search('token') != -1 ? '&token=true' : '';

    var dtools = JSON.parse(localStorage.getItem('dtoolb2c'));
    if (dtools != null && dtools != undefined && dtools.adB2CSignIn != null && dtools.adB2CSignIn != undefined && dtools.adB2CSignIn.access_token != "") {
        access_token = dtools.adB2CSignIn.access_token;
        token_type = dtools.adB2CSignIn.token_type;
    }

    if (localStorage.getItem('currentUserSession') == "null" || localStorage.getItem('currentUserSession') == null || localStorage.getItem('currentUserSession') == undefined) {
        localStorage.setItem('isLogin', true);
        localStorage.setItem('isLogout', false);
        window.location.href = config.urls.web + '/Views/Home/Index.html?' + (new Date().getTime()) + $scope.param;
    }
    else {
        var accountRegister = config.urls.api.registration + "/Accounts";
        var currentUserSession = JSON.parse(localStorage.getItem('currentUserSession'));
        $scope.Accounts = null;
        if ($location.search()["email"] == undefined) {
            if (currentUserSession.Accounts.length > 0) {
                $scope.Accounts = currentUserSession.Accounts;

                $scope.activeAccounts = [];
                $scope.pendingAccounts = [];

                angular.forEach($scope.Accounts, function (acc) {
                    if (acc.invited) {
                        $scope.pendingAccounts.push(acc);
                    } else {
                        $scope.activeAccounts.push(acc);
                    }
                });
            }
        }
        else {
            $http({
                url: accountRegister + "?GetAccounts?userId=" + currentUserSession.id,
                method: 'GET',
                headers: {
                    "Ocp-Apim-Subscription-Key": config.ocpApimSubscriptionKey,
                    "content-type": 'application/x-www-form-urlencoded',
                    "Authorization": token_type + ' ' + access_token
                },
                async: false,
            })
                .then(function (response) {
                    $scope.dataLoading = false;
                    $scope.errorMsg = false;
                    //debugger;
                    if (response.status == 200) {
                        $scope.Accounts = response.data;
                        $scope.activeAccounts = [];
                        $scope.pendingAccounts = [];

                        angular.forEach($scope.Accounts, function (acc) {
                            if (acc.signedOn == null) {
                                $scope.pendingAccounts.push(acc);
                            } else {
                                $scope.activeAccounts.push(acc);
                            }
                        });
                    }
                },
                function (response) {
                    //debugger;
                    $scope.dataLoading = false;
                    if (response.status != 201 || response.status != 200) {
                        $scope.showSimpleToast(response.data.Error);
                    }
                });
        }
    }

    $scope.setAvatarText = function (name) {
        var splitName = name.split(' ');
        var fName;
        var lName;
        if (splitName.length > 1) {
            fName = splitName[0];
            lName = splitName[1];
        } else {
            fName = splitName[0];
        }

        if (fName && lName) {
            return fName.charAt(0).toUpperCase() + lName.charAt(0).toUpperCase();
        } else if (fName || lName) {
            if (fName != null) {
                return fName.substring(0, 2).toUpperCase();
            } else {
                return lName.substring(0, 2).toUpperCase();
            }
        }
    };

    $scope.btnDoubleClick = function (value) {
    }

    $scope.btnForward = function (account) {
        config.accountId = account ? account.id : null;
        localStorage.accountId = account ? account.id : null;
        localStorage.accountName = account ? account.name : null;
        localStorage.account = JSON.stringify(account);
        var url = config.urls.web + "/Views/Home/Index.html?" + (new Date().getTime()) + $scope.param;
        window.location.href = url;
    }

    $scope.btnAddOrEdit = function (value) {
        $scope.AddOrEdit = value;
    }
    $scope.AddAccount = function (Account) {
        $scope.dataLoading = true;
        var userjson = JSON.parse(localStorage.getItem('currentUserSession'));
        if (userjson != null && userjson != undefined && userjson.UserEmail != null && userjson.UserEmail != '') {
            $scope.userEmail = userjson.UserEmail;
            $http({
                url: accountRegister + "?userEmail=" + userjson.UserEmail,// + "&Subscription-Key=5d65da72a706407cac8127021ca2055e",
                method: 'POST',
                data: $.param(Account),
                headers: {
                    "Ocp-Apim-Subscription-Key": config.ocpApimSubscriptionKey,
                    "content-type": 'application/x-www-form-urlencoded',
                    "Authorization": token_type + ' ' + access_token
                }
            })
                .then(function (response) {
                    $scope.dataLoading = false;
                    $scope.errorMsg = false;
                    //debugger;
                    $scope.showSimpleToast("Account created");
                    $timeout(function () {
                        //debugger;
                        if (response.status == "201") {
                            //debugger;
                            userjson.AccountID = response.data.ResponseMessage.AccountID;
                            userjson.AccountName = $scope.Account.AccountName;
                            localStorage.setItem('AccountID', response.data.ResponseMessage.AccountID);
                            localStorage.setItem('TokenId', response.data.ResponseMessage.TokenId);
                            localStorage.setItem('AccountName', $scope.Account.AccountName);

                            localStorage.setItem('currentUserSession', JSON.stringify(userjson));



                            localStorage.setItem('isLogin', true);
                            localStorage.setItem('isLogout', false);
                            var url = config.urls.web + "/Views/Home/Index.html?" + (new Date().getTime()) + "&newaccountCreated=1";
                            window.location.href = url;

                        }
                    }, 3000);
                },
                function (response) {
                    //debugger;
                    $scope.dataLoading = false;
                    if (response.status != 201 || response.status != 200) {
                        $scope.showSimpleToast(response.data.Error);
                    }

                });

        }
    }

    $scope.acceptAccountInvitation = function (account) {
        $http({
            url: accountRegister + "/AcceptAccountInvitation?id=" + account.id,
            method: 'POST',
            headers: {
                "Ocp-Apim-Subscription-Key": config.ocpApimSubscriptionKey,
                "content-type": 'application/x-www-form-urlencoded',
                "Authorization": token_type + ' ' + access_token
            }
        }).then(function (response) {
            if (response.status == 200) {
                config.accountId = response.data ? response.data.id : null;
                localStorage.accountId = response.data ? response.data.id : null;
                localStorage.accountName = response.data ? response.data.name : null;
                localStorage.account = JSON.stringify(response.data);
                var url = config.urls.web + "/Views/Home/Index.html?" + (new Date().getTime()) + "&isNewUser=true" + $scope.param;
                window.location.href = url;
            }
            else {
                $scope.showSimpleToast(response.errorMsg);
            }
        },
            function (error) {
                $scope.showSimpleToast(error.data.message);
            });
    };

    $scope.declineAccountInvitations = function (account) {
        var ids = [account.id];
        $http({
            url: accountRegister + "/DeclineAccountInvitations?ids=" + ids,
            method: 'DELETE',
            headers: {
                "Ocp-Apim-Subscription-Key": config.ocpApimSubscriptionKey,
                "content-type": 'application/x-www-form-urlencoded',
                "Authorization": token_type + ' ' + access_token
            }
        }).then(function (response) {
            if (response.status == 200) {
                $scope.showSimpleToast(response.data);
                angular.forEach($scope.pendingAccounts, function (account2, key) {
                    if (account.id == account2.id) {
                        $scope.pendingAccounts.splice(key, 1);
                    }
                });
                if ($scope.pendingAccounts.length == 0 && $scope.activeAccounts.length == 0) {
                    var currentUserSession = $.parseJSON(localStorage.currentUserSession);
                    currentUserSession.Accounts = null;
                    config.accountId = null;
                    localStorage.accountId = null;
                    localStorage.dtToken = null;
                    localStorage.accountName = null;
                    localStorage.setItem('currentUserSession', JSON.stringify(currentUserSession));
                    localStorage.setItem('isLogin', true);
                    localStorage.setItem('isLogout', false);
                    window.location.href = config.urls.web + "/Views/Home/Index.html?" + (new Date().getTime()) + "&isNewUser=true" + $scope.param;
                }
            }
            else {
                $scope.showSimpleToast(response.errorMsg);
            }
        },
            function (error) {
                $scope.showSimpleToast(error.data.message);
            });
    };

    $scope.showSimpleToast = function (txt) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(txt)
                .position("bottom")
                .hideDelay(3000)
        );
    };
});

//--------------------User Registration END-----------

//--------------------Reset Password START ---------------------------
var ResetPwdApp = angular.module("ResetPwdApp", ['headerApp', 'ngCookies']);
ResetPwdApp.controller("resetpwdCtrl", function ($location, $scope, $window, $http, $cookies) {

});
//--------------------Reset Password END ---------------------------

//--------------------Dashboard START ---------------------------
var DashboardApp = angular.module("DashboardApp", ['headerApp', 'ngCookies']);
DashboardApp.controller("dashboardCtrl", function ($location, $scope, $window, $http, $cookies) {
    console.log(getParameterByName('code', $location.absUrl()));
    var userjson = JSON.parse(localStorage.getItem('currentUserSession'));
    if (userjson == null || userjson == "null" || userjson == "") {
        var url = "https://" + $window.location.host + "/home.html"
        $window.location.href = url
    }
});
//--------------------Dashboard END ---------------------------

// --------------------------- Header START ---------------------
var headerApp = angular.module("headerApp", ['ngCookies']);
headerApp.controller("headerCtrl", function ($location, $scope, $window, $anchorScroll, $http, $cookies) {
    var userjson = JSON.parse(localStorage.getItem('currentUserSession'));
    if (userjson != null && userjson != undefined && userjson.UserEmail != null && userjson.UserEmail != '') {
        $scope.isLogin = true;
        $scope.userEmail = userjson.UserEmail;
    }
    else {
        $scope.isLogin = false;
    }

    $scope.Logout = function () {
        //$cookies.remove('currentUser');
        //$window.location.href = b2cLogin;
    }
});
// --------------------------- Header END ---------------------

// --------------------------- Home START ---------------------
var homeApp = angular.module("HomeApp", ['headerApp', 'ngCookies']);
homeApp.controller("homeCtrl", function ($location, $scope, $window, $anchorScroll, $http, $cookies) {

});

// --------------------------- Home END ---------------------

//--------- Utilities Methods START-------------------------------------
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
//--------- Utilities Methods END-------------------------------------

//Get GetAuthorizationToken start---------------
function GetAuthorizationToken() {
    var dtools = JSON.parse(localStorage.getItem('dtoolb2c'));
    if (dtools != null && dtools != undefined && dtools.adB2CSignIn != null && dtools.adB2CSignIn != undefined && dtools.adB2CSignIn.access_token != "") {
        return dtools.adB2CSignIn.token_type + ' ' + dtools.adB2CSignIn.access_token
    }
}

//Get GetAuthorizationToken start---------------