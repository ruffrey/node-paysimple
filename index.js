'use strict';
var url = require('url');
var request = require('request');
var crypto = require('crypto');
var debug = require('debug')('pay');

var PaySimple = function PaySimpleClass(params) {
    params = params || {};

    var self = this;

    self._base = "https://api.paysimple.com";

    // Authorization: PSSERVER accessid=APIUser1000; timestamp=2012-07-20T20:45:44.0973928Z; signature=WqV47Dddgc6XqBKnQASzZbNU/UZd1tzSrFJJFVv76dw=
    self.accessid = params.accessid || '';
    self.key = params.key || '';


    self.setDevmode = function setDevmode() {
        self._base = 'https://sandbox‐api.paysimple.com';
        return self;
    };

    self._request = function _request(opts, callback) {
        opts = opts || { };
        if (opts.json === undefined) opts.json = true;
        if (!opts.body) opts.body = { };
        opts.uri = self._base + opts.uri;

        var hmac = crypto.createHmac('sha256', self.key).digest('base64');

        opts.headers = {
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
        find: function find(params, callback) {
            var uri = '/accounts/' + params.account_id + '/locations/' +
                params.location_id + '/customers/' +
                (params.customer_token || '');
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        create: function create(params, callback) {
            var uri = '/accounts/' + params.account_id + '/customers';
            self._request({
                uri: uri,
                method: 'POST',
                body: params
            }, callback);
        },
        update: function update(params, callback) {
            var uri = '/accounts/' + params.account_id + '/locations/' +
                params.location_id + '/customers/' +
                params.customer_token;
            self._request({
                uri: uri,
                method: 'PUT',
                body: params
            }, callback);
        },
        remove: function remove(params, callback) {
            var uri = '/accounts/' + params.account_id + '/locations/' +
                params.location_id + '/customers/' +
                params.customer_token;
            self._request({
                uri: uri,
                method: 'DELETE'
            }, callback);
        }
    };


    self.transactions = {
        find: function find(params, callback) {
            var uri = '/accounts/' + params.account_id + '/locations/' +
                params.location_id + '/transactions/' +
                (params.transaction_id || '');
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        findByCustomer: function find(params, callback) {
            var uri = '/accounts/' + params.account_id + '/locations/' +
                params.location_id + '/customers/' +
                params.customer_token + '/transactions';
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        create: function create(params, callback) {
            var uri = '/accounts/' + params.account_id + '/transactions';
            self._request({
                uri: uri,
                method: 'POST',
                body: params
            }, callback);
        },
        update: function update(params, callback) {
            var uri = '/accounts/' + params.account_id + '/locations/' +
                params.location_id + '/transactions/' +
                params.transaction_id;
            self._request({
                uri: uri,
                method: 'PUT',
                body: params
            }, callback);
        }
    };


    return self;
};


module.exports = PaySimple;
