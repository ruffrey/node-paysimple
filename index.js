'use strict';
var url = require('url');
var request = require('request');
var crypto = require('crypto');
var debug = require('debug')('pay');

var PaySimple = function PaySimpleClass(params) {
    params = params || {};

    var self = this;

    self._base = "https://api.paysimple.com/v4";

    self.accessid = params.accessid || '';
    self.key = params.key || '';


    self.setDevmode = function setDevmode() {
        self._base = 'https://sandbox‐api.paysimple.com/v4';
        return self;
    };

    self._request = function _request(opts, callback) {
        opts = opts || { };
        if (opts.json === undefined) opts.json = true;
        if (!opts.body) opts.body = { };
        opts.uri = self._base + opts.uri;

        var hmac = crypto.createHmac('sha256', self.key).digest('base64');

        opts.headers = {
            // Authorization: PSSERVER accessid=APIUser1000; timestamp=2012-07-20T20:45:44.0973928Z; signature=WqV47Dddgc6XqBKnQASzZbNU/UZd1tzSrFJJFVv76dw=
            Authorization: 'accessid=' + self.accessid + '; '
                + 'timestamp=' + new Date().toISOString() + '; '
                + 'signature=' + hmac
        };

        if (opts.query) {
            opts.uri += url.format({ query: opts.query });
        }

        debug('REQUEST opts', JSON.stringify(opts, null, 2));
        request(opts, function onAfterRequest(err, res, body) {
            if (err || (res.statusCode < 200 || res.statusCode > 299)) {
                debug('response ERROR', res.statusCode, JSON.stringify(err || body, null, 2));
                return callback(err || body || "Error: status=" + res.statusCode);
            }
            debug('RESPONSE OK', res.statusCode, JSON.stringify(body, null, 2));
            callback(null, body);
        });
    };


    self.customers = {
        findOne: function (params, callback) {
            var uri = '/customer/' + params.id;
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        find: function (params, callback) {
            var uri = '/customer';
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        create: function (params, callback) {
            var uri = '/customer';
            self._request({
                uri: uri,
                method: 'POST',
                body: params
            }, callback);
        },
        update: function (params, callback) {
            var uri = '/customer';
            self._request({
                uri: uri,
                method: 'PUT',
                body: params
            }, callback);
        }
    };

    self.paymentAccounts = {
        addCreditCard: function (params, callback) {
            var uri = '/account/creditcard';
            self._request({
                uri: uri,
                method: 'POST',
                body: params
            }, callback);
        },
        addAch: function (params, callback) {
            var uri = '/account/ach';
            self._request({
                uri: uri,
                method: 'POST',
                body: params
            }, callback);
        },
        updateCreditCard: function (params, callback) {
            var uri = '/account/creditcard';
            self._request({
                uri: uri,
                method: 'PUT',
                body: params
            }, callback);
        },
        updateAch: function (params, callback) {
            var uri = '/account/ach';
            self._request({
                uri: uri,
                method: 'PUT',
                body: params
            }, callback);
        },
        setDefaultCreditCard: function (params, callback) {
            var uri = '/customer/' + params.CustomerId + '/' + params.AccountId;
            self._request({
                uri: uri,
                method: 'PUT',
                body: params
            }, callback);
        },
        setDefaultAch: function (params, callback) {
            var uri = '/customer/' + params.CustomerId + '/' + params.AccountId;
            self._request({
                uri: uri,
                method: 'PUT',
                body: params
            }, callback);
        },
        getDefaultCreditCard: function (params, callback) {
            var uri = '/customer/' + params.CustomerId + '/defaultcreditcard';
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        getDefaultAch: function (params, callback) {
            var uri = '/customer/' + params.CustomerId + '/defaultach';
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        list: function (params, callback) {
            var uri = '/customer/' + params.id + '/accounts';
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        listCreditCards: function (params, callback) {
            var uri = '/customer/' + params.id + '/creditcardaccounts';
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        listAchs: function (params, callback) {
            var uri = '/customer/' + params.id + '/achaccounts';
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        }
    };

    self.payments = {
        /**
         * Create a payment.
         *
         * ```
         * pay.payments.create({ AccountId: 324323, Amount: 3.49 }, callback);
         * ```
         * @param object params
         * @param number params.AccountId
         * @param number params.Amount
         */
        create: function (params, callback) {
            var uri = '/payment';
            self._request({
                uri: uri,
                method: 'POST',
                body: params
            }, callback);
        }
    };

    return self;
};


module.exports = PaySimple;
