//These values need to be updated with the specific tenant and its policies.
//var currentUserSetting = {};

var signInPolicyName = "B2C_1_SigninSignup";
var signInSignUpPolicyName = "B2C_1_Signup";
var inviteUserPolicy = "B2C_1_UserRegistration";
var editProfilePolicyName = "B2C_1_b2c_1_reset";

//No need to modify the below values
var dtoolb2cJsSignPolicy = "adB2CSignIn";
var dtoolb2cJsSignInSignUpPolicy = "adB2CSignInSignUp";
var dtoolb2cJsEditProfilePolicy = "adB2CEditProfile";
var dtoolb2cJsInviteUserPolicy = "adB2CInviteUserPolicy";
var dtools = JSON.parse(localStorage.getItem('dtoolb2c'));
var url = window.location.href;
var redirectURI = dtools ? config.urls.web + '/Views/Home/Index.html' : url.search('generatetoken') != -1 ? config.urls.web + '/generatetoken.html' : config.urls.redirect;
/*
 * B2C Sign In Policy Configuration
 */
(function (dtoolb2c) {
    "use strict";
    dtoolb2c.init({
        adB2CSignIn: {
            name: "Azure Active Directory B2C",
            oauth: {
                version: 2,
                auth: "https://login.microsoftonline.com/tfp/" + config.tenantName + "/" + signInPolicyName + "/oauth2/v2.0/authorize",
                grant: "https://login.microsoftonline.com/tfp/" + config.tenantName + "/" + signInPolicyName + "/oauth2/v2.0/token"
            },
            refresh: true,
            scope_delim: ' ',
            logout: function (p) {
                //debugger;
                //get id_token from auth response
                var id_token = dtoolb2c(dtoolb2cJsSignPolicy).getAuthResponse().id_token;
                //clearing local storage session
                dtoolb2c.utils.store(dtoolb2cJsSignPolicy, null);
                //redirecting to Azure B2C logout URI
                window.location = "https://login.microsoftonline.com/" + config.tenantName + "/oauth2/v2.0/logout?p=" + signInPolicyName + "&id_token_hint=" +
                    id_token + "&post_logout_redirect_uri=" + redirectURI;
            },
            xhr: function (p) {
                if (p.method === 'post' || p.method === 'put') {
                    //toJSON(p);
                    if (typeof (p.data) === 'object') {
                        // Convert the POST into a javascript object
                        try {
                            p.data = JSON.stringify(p.data);
                            p.headers['content-type'] = 'application/json';
                        } catch (e) { }
                    }
                } else if (p.method === 'patch') {
                    dtoolb2c.utils.extend(p.query, p.data);
                    p.data = null;
                }
                return true;
            },
            // Don't even try submitting via form.
            // This means no POST operations in <=IE9
            form: false
        }
    });

})(dtoolb2c);

/*
 * B2C Sign-In and Sign-Up Policy Configuration
 */
(function (dtoolb2c) {
    "use strict";
    dtoolb2c.init({
        adB2CSignInSignUp: {
            name: 'Azure Active Directory B2C',
            oauth: {
                version: 2,
                auth: "https://login.microsoftonline.com/tfp/" + config.tenantName + "/" + signInSignUpPolicyName + "/oauth2/v2.0/authorize",
                grant: "https://login.microsoftonline.com/tfp/" + config.tenantName + "/" + signInSignUpPolicyName + "/oauth2/v2.0/token"
            },
            refresh: true,
            scope_delim: ' ',
            logout: function () {
                //debugger;
                //get id_token from auth response
                var id_token = dtoolb2c(dtoolb2cJsSignInSignUpPolicy).getAuthResponse().id_token;
                //clearing local storage session
                dtoolb2c.utils.store(dtoolb2cJsSignInSignUpPolicy, null);

                //redirecting to Azure B2C logout URI
                window.location = "https://login.microsoftonline.com/" + config.tenantName + "/oauth2/v2.0/logout?p=" + signInSignUpPolicyName + "&id_token_hint=" +
                    id_token + "&post_logout_redirect_uri=" + redirectURI;
            },
            xhr: function (p) {
                if (p.method === 'post' || p.method === 'put') {
                    //toJSON(p);
                    if (typeof (p.data) === 'object') {
                        // Convert the POST into a javascript object
                        try {
                            p.data = JSON.stringify(p.data);
                            p.headers['content-type'] = 'application/json';
                        } catch (e) { }
                    }
                } else if (p.method === 'patch') {
                    dtoolb2c.utils.extend(p.query, p.data);
                    p.data = null;
                }
                return true;
            },
            // Don't even try submitting via form.
            // This means no POST operations in <=IE9
            form: false
        }
    });
})(dtoolb2c);

/*
 * B2C Edit Profile Policy Configuration
 */
(function (dtoolb2c) {
    "use strict";
    dtoolb2c.init({
        adB2CEditProfile: {
            name: 'Azure Active Directory B2C',
            oauth: {
                version: 2,
                auth: "https://login.microsoftonline.com/tfp/" + config.tenantName + "/" + editProfilePolicyName + "/oauth2/v2.0/authorize",
                grant: "https://login.microsoftonline.com/tfp/" + config.tenantName + "/" + editProfilePolicyName + "/oauth2/v2.0/token"
            },
            refresh: true,
            scope_delim: ' ',
            logout: function (p) {
                //get id_token from auth response
                var id_token = dtoolb2c(dtoolb2cJsEditProfilePolicy).getAuthResponse().id_token;
                //clearing local storage session
                dtoolb2c.utils.store(dtoolb2cJsEditProfilePolicy, null);

                //redirecting to Azure B2C logout URI
                window.location = "https://login.microsoftonline.com/" + config.tenantName + "/oauth2/v2.0/logout?p=" + editProfilePolicyName + "&id_token_hint=" +
                    id_token + "&post_logout_redirect_uri=" + redirectURI;
            },
            xhr: function (p) {
                if (p.method === 'post' || p.method === 'put') {
                    //toJSON(p);
                    if (typeof (p.data) === 'object') {
                        // Convert the POST into a javascript object
                        try {
                            p.data = JSON.stringify(p.data);
                            p.headers['content-type'] = 'application/json';
                        } catch (e) { }
                    }
                } else if (p.method === 'patch') {
                    dtoolb2c.utils.extend(p.query, p.data);
                    p.data = null;
                }
                return true;
            },
            // Don't even try submitting via form.
            // This means no POST operations in <=IE9
            form: false
        }
    });
})(dtoolb2c);


/*
 * B2C Invite User Policy Configuration
 */
(function (dtoolb2c) {
    "use strict";
    dtoolb2c.init({
        adB2CInviteUserPolicy: {
            name: 'Azure Active Directory B2C',
            oauth: {
                version: 2,
                auth: "https://login.microsoftonline.com/tfp/" + config.tenantName + "/" + inviteUserPolicy + "/oauth2/v2.0/authorize",
                grant: "https://login.microsoftonline.com/tfp/" + config.tenantName + "/" + inviteUserPolicy + "/oauth2/v2.0/token"
            },
            refresh: true,
            scope_delim: ' ',
            logout: function () {
                //debugger;
                //get id_token from auth response
                var id_token = dtoolb2c(dtoolb2cJsInviteUserPolicy).getAuthResponse().id_token;
                //clearing local storage session
                dtoolb2c.utils.store(dtoolb2cJsInviteUserPolicy, null);

                //redirecting to Azure B2C logout URI
                window.location = "https://login.microsoftonline.com/" + config.tenantName + "/oauth2/v2.0/logout?p=" + inviteUserPolicy + "&id_token_hint=" +
                    id_token + "&post_logout_redirect_uri=" + redirectURI;
            },
            xhr: function (p) {
                if (p.method === 'post' || p.method === 'put') {
                    //toJSON(p);
                    if (typeof (p.data) === 'object') {
                        // Convert the POST into a javascript object
                        try {
                            p.data = JSON.stringify(p.data);
                            p.headers['content-type'] = 'application/json';
                        } catch (e) { }
                    }
                } else if (p.method === 'patch') {
                    dtoolb2c.utils.extend(p.query, p.data);
                    p.data = null;
                }
                return true;
            },
            // Don't even try submitting via form.
            // This means no POST operations in <=IE9
            form: false
        }
    });
})(dtoolb2c);