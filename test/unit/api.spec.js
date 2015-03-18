'use strict';
var should = require('should');
var PaySimple = require('../../index');
var pay;

describe('Unit', function () {
    beforeEach(function () {
        pay = new PaySimple({ accessid: 'asdf', key: 'jkl'});
        pay.setDevmode();
    });

    it('has expected properties and methods', function () {
        pay._request.should.be.type('function');
        pay.setDevmode.should.be.type('function');
        pay._base.should.be.type('string');
        pay.accessid.should.be.type('string');
        pay.key.should.be.type('string');
    });

    it('supports multiple instances', function () {
        var a = new PaySimple({ accessid: 'user_a' });
        var b = new PaySimple({ accessid: 'user_b' });
        b.setDevmode();
        b.accessid.should.not.equal(a.accessid);
        a.accessid.should.equal('user_a');
        b.accessid.should.equal('user_b');
        b._base.should.not.equal(a._base);
    });

    it('supports chaining', function () {
        var p = new PaySimple()
                .setDevmode();
        p._base.should.be.type('string');
    });

});
