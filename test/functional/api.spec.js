'use strict';
var should = require('should');
var PaySimple = require('../../index');
var pay;
var credentials = require('../credentials.json');

describe('Functional', function () {
    this.timeout(10000);

    beforeEach(function () {
        pay = new PaySimple(credentials);
    });

    describe('customers', function () {

});
