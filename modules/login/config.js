//Demo
//var baseApiUrl = 'https://dtoolsapigateway.azure-api.net';

var environments = {
    production: 1,
    staging: 2,
    development: 3,
    local:4
};

var hostingEnvironment = environments.local;
var applicationId;
var tenantName;
var baseApiUrl;
var webUrl;
var urls = {};

if (hostingEnvironment == environments.production) {
    applicationId = '4231b1e2-8aed-45c6-a698-2a0b3ea98763'; //applicaionID created in AD B2C portal
    tenantName = "DTCloudAD.onmicrosoft.com"; //AD B2C portal
    baseApiUrl = 'https://dtregistrationapi.azurewebsites.net/';
    webUrl = 'https://d-tools.cloud/';
    urls = {
        catalogApiUrl: "https://dtcatalogapi.azurewebsites.net/api/v1",
        transactionApiUrl: "https://dttransactionapi.azurewebsites.net/api/v1",
        messageApiUrl: "https://dtcloudmessageapi.azurewebsites.net/api/v1/activities",
        accountingApiUrl: "https://dtcloudaccountingapi.azurewebsites.net/api/v1",
        orderingApiUrl: "https://dtorderAPI.azurewebsites.net/api/v1",
        searchApiUrl: "https://dtoolscatalogsearchapi.azurewebsites.net/internal/api/v1",
        registrationApiUrl: "https://dtregistrationapi.azurewebsites.net/api/v1",
    }
}
else if (hostingEnvironment == environments.staging) {
     applicationId = '4231b1e2-8aed-45c6-a698-2a0b3ea98763'; //applicaionID created in AD B2C portal
     tenantName = "DTCloudAD.onmicrosoft.com"; //AD B2C portal
     baseApiUrl = 'https://dtcloudregistrationapi.azurewebsites.net';
     webUrl = 'https://dtcloudapp.azurewebsites.net';
     urls = {
         catalogApiUrl: "https://dtcloudcatalogapi.azurewebsites.net/api/v1",
        transactionApiUrl: "https://dtcloudtransactionapi.azurewebsites.net/api/v1",
        messageApiUrl: "https://dtcloudmessageapi.azurewebsites.net/api/v1/activities",
        accountingApiUrl: "https://dtcloudaccountingapi.azurewebsites.net/api/v1",
        orderingApiUrl: "https://dtcloudorderingapi.azurewebsites.net/api/v1",
        searchApiUrl: "https://dtoolscatalogsearchapi.azurewebsites.net/internal/api/v1",
        registrationApiUrl: "https://dtcloudregistrationapi.azurewebsites.net/api/v1",
    }
}
else if (hostingEnvironment == environments.development) {
     applicationId = '8d9cc925-e07c-4bd9-9a99-ea871d4836b3'; //AD B2C portal
     tenantName = "DTCloudDevAD.onmicrosoft.com"; //AD B2C portal
     baseApiUrl = 'https://dtclouddevregistrationapi.azurewebsites.net';
     webUrl = 'https://dtclouddevapp.azurewebsites.net';
     urls = {
        catalogApiUrl: "https://dtclouddevcatalogapi.azurewebsites.net/api/v1",
        transactionApiUrl: "https://dtclouddevtransactionapi.azurewebsites.net/api/v1",
        messageApiUrl: "https://dtclouddevmessageapi.azurewebsites.net/api/v1/activities",
        accountingApiUrl: "https://dtclouddevaccountingapi.azurewebsites.net/api/v1",
        orderingApiUrl: "https://dtclouddevorderingapi.azurewebsites.net/api/v1",
        searchApiUrl: "https://dtoolscatalogsearchapi.azurewebsites.net/internal/api/v1",
        registrationApiUrl: "https://dtclouddevregistrationapi.azurewebsites.net/api/v1",
    }
}
else if (hostingEnvironment == environments.local) {
    applicationId = '706345ba-653d-4950-999a-11a33d6f883f'; //AD B2C portal
     tenantName = "dtoolssandbox.onmicrosoft.com"; //AD B2C portal
     baseApiUrl = 'http://localhost:53906/';
     webUrl = 'http://localhost:54475';
     urls = {
        catalogApiUrl: "http://localhost:54692/api/v1",
        transactionApiUrl: "http://localhost:53249/api/v1",
        messageApiUrl: "http://localhost:54692/api/v1/activities", 
        accountingApiUrl: "http://localhost:54006/api/v1",
        orderingApiUrl: "http://localhost:58079/api/v1",
        searchApiUrl: "https://dtoolstenantsearchapi.azurewebsites.net/internal/api/v1",
        registrationApiUrl: "http://localhost:53906/api/v1",
    }
}

//custom config settings
var accountRegister = baseApiUrl + '/api/v1/Accounts';
var redirect_uri = webUrl + "/home.html";
var b2cResetPassword = 'https://login.microsoftonline.com/' + tenantName + '/oauth2/v2.0/authorize?p=B2C_1_b2c_1_reset&client_id=' + applicationId + '&nonce=defaultNonce&redirect_uri=' + redirect_uri +'&scope=openid&response_type=id_token&prompt=login';

var b2cLogin = 'https://login.microsoftonline.com/' + tenantName + '/oauth2/authorize?client_id=' + applicationId + '&response_type=code&redirect_uri=' + redirect_uri +'&response_mode=query';


var config = {
    b2cLogin: b2cLogin,
    baseApiUrl: baseApiUrl,
    webUrl: webUrl,
    applicationId: applicationId,
    tenantName: tenantName,
    redirect_uri: redirect_uri,
    accountRegister: accountRegister,
    b2cResetPassword: b2cResetPassword,
    accountId: null,
    hostingEnvironment: hostingEnvironment,
    environments: environments,
    urls: urls
};

var myapp = angular.module("configKeys", []);
myapp.value("config", config);