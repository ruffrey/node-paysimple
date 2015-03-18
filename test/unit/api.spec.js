'use strict';
var should = require('should');
var PaySimple = require('../../index');
var pay;

describe('Unit', function () {
    beforeEach(function () {
        pay = new PaySimple();
        pay.setDevmode();
        pay.setAuthHeader('asdf');
        pay.setBasicAuth('username', 'password');
    });

    it('has expected properties and methods', function () {
        pay._request.should.be.type('function');
        pay.setDevmode.should.be.type('function');
        pay.setAuthHeader.should.be.type('function');
        pay.setBasicAuth.should.be.type('function');
        pay._base.should.be.type('string');
        pay._authHeader.should.be.type('string');
    });

    it('supports multiple instances', function () {
        var a = new PaySimple();
        a.setBasicAuth('user_a', 'pass_b');
        var b = new PaySimple();
        b.setBasicAuth('user_b', 'pass_b');
        b.setDevmode();
        b._basicAuth.should.not.equal(a._basicAuth);
        a._basicAuth.username.should.equal('user_a');
        b._basicAuth.username.should.equal('user_b');
        b._base.should.not.equal(a._base);
    });

    it('supports chaining', function () {
        var p = new PaySimple()
                .setDevmode()
                .setAuthHeader('hh')
                .setBasicAuth('usr', 'pwd');
        p._base.should.equal('https://sandbox.pay.net/api/v1');
        p._authHeader.should.equal('hh');
        p._basicAuth.should.eql({
            username: 'usr',
            password: 'pwd'
        });
    });

    describe('setAuthHeader', function () {
        it('should work', function () {
            pay.setAuthHeader('asdfjkl');
            pay._authHeader.should.equal('asdfjkl');
        });
    });

    describe('setBasicAuth', function () {
        it('should work', function () {
            pay.setBasicAuth('username', 'password');
            pay._basicAuth.should.be.type('object');
            pay._basicAuth.username.should.equal('username');
            pay._basicAuth.password.should.equal('password');
        });
    });

});
