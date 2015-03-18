'use strict';
var url = require('url');
var request = require('request');
var debug = require('debug')('pay');

var PaySimple = function PaySimpleClass() {

    var self = this;

    // TODO: once ready for production, add the base url endpoint here.
    self._base = "https://api.paysimple.com";
    self._authHeader = "";
    self._basicAuth = {
        username: '',
        password: ''
    };

    self.setDevmode = function setDevmode() {
        self._base = 'https://sandbox‐api.paysimple.com';
        return self;
    };

    self.setAuthHeader = function setAuthHeader(token) {
        self._authHeader = token;
        return self;
    };

    self.setBasicAuth = function setBasicAuth(username, password) {
        self._basicAuth.username = username;
        self._basicAuth.password = password;
        return self;
    };

    self._request = function _request(opts, callback) {
        opts = opts || { };
        if (opts.json === undefined) opts.json = true;
        if (!opts.body) opts.body = { };
        opts.uri = self._base + opts.uri;

        opts.headers = {
            'X-Forte-Auth-Account-Id': opts.body.account_id || self._authHeader
        };

        opts.auth = self._basicAuth;

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
