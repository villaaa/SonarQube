var Regapp = angular.module("RegistrationApp", []);
Regapp.controller("registrationCtrl", function ($location, $scope, $window) {

    $scope.Account = {};
    $scope.Account.UserName = "MName1";
    $scope.Account.Password = 'CName';
    $scope.Account.ConfirmPWD = 'CName';
    $scope.Account.Address = 'Maddress';
    $scope.Account.City = 'MCity';
    $scope.Account.TelephoneNumber = 1234567895;
    $scope.Account.Email = 'Merchant@gmail.com';
    $scope.AddAccount = function (Account) {
        //debugger;
        // $http.post('/someUrl', Account, config).then(successCallback, errorCallback);
        var url = "http://" + $window.location.host + "/Activation.html";
         $window.location.href = url;
        //$window.location.href = 'http://www.google.com';
        alert("successfully added");

    }
});

var Regapp = angular.module("ActivationApp", []);
Regapp.controller("activationCtrl", function ($scope) {

    $scope.Activation = {};
    $scope.Activate = function (Activation) {
       // debugger;
        //$http.post('/someUrl', Account, config).then(successCallback, errorCallback);

        alert("successfully activated");

    }
});