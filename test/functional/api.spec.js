'use strict';
var should = require('should');
var PaySimple = require('../../index');
var pay;
var credentials = require('../credentials.json');

describe('Functional', function () {
    this.timeout(10000);

    beforeEach(function () {
        pay = new PaySimple();
        pay.setDevmode();
        pay.setBasicAuth(credentials.apiLoginId, credentials.secureTransactionKey);
        pay.setAuthHeader(credentials.accountId);
    });

    describe('customers', function () {
        var customerToken = null;

        beforeEach(function (done) {
            pay.customers.create({
                account_id: credentials.accountId,
                location_id: credentials.locationId,

                first_name: "Emmett",
                last_name: "Brown",
                company_name: "Brown Associates"

            }, function (err, body) {
                should.not.exist(err);
                body.should.be.a.Object;
                body.customer_token.should.be.a.String.and.be.ok;
                customerToken = body.customer_token;
                done();
            });
        });
        afterEach(function (done) {
            pay.customers.remove({
                account_id: credentials.accountId,
                location_id: credentials.locationId,
                customer_token: customerToken
            }, function (err, body) {
                should.not.exist(err);
                done();
            });
        });

        it('lists all customers', function (done) {
            pay.customers.find({
                account_id: credentials.accountId,
                location_id: credentials.locationId
            }, function (err, body) {
                should.not.exist(err);
                body.should.be.an.Object;
                body.results.should.be.an.Array;
                done();
            });
        });
        it('gets one customer', function (done) {
            pay.customers.find({
                account_id: credentials.accountId,
                location_id: credentials.locationId,
                customer_token: customerToken
            }, function (err, body) {
                should.not.exist(err);
                body.should.be.an.Object.and.not.an.Array;
                body.customer_token.should.equal(customerToken);
                done();
            });
        });
        it('updates the customer', function (done) {
            pay.customers.update({
                account_id: credentials.accountId,
                location_id: credentials.locationId,
                customer_token: customerToken,
                first_name: 'Dude',
                company_name: 'Dude Associates'
            }, function (err, body) {
                should.not.exist(err);
                body.should.be.an.Object.and.not.an.Array;
                body.customer_token.should.equal(customerToken);
                body.first_name.should.equal('Dude');
                body.company_name.should.equal('Dude Associates');
                done();
            });
        });
    });

    describe('transactions', function () {
        var customerToken = null;

        beforeEach(function (done) {
            pay.customers.create({
                account_id: credentials.accountId,
                location_id: credentials.locationId,

                first_name: "Emmett",
                last_name: "Brown",
                company_name: "Brown Associates"

            }, function (err, body) {
                should.not.exist(err);
                body.should.be.a.Object;
                body.customer_token.should.be.a.String.and.be.ok;
                customerToken = body.customer_token;
                done();
            });
        });
        afterEach(function (done) {
            pay.customers.remove({
                account_id: credentials.accountId,
                location_id: credentials.locationId,
                customer_token: customerToken
            }, function (err, body) {
                should.not.exist(err);
                done();
            });
        });

        it('finds transactions', function (done) {
            pay.transactions.find({
                account_id: credentials.accountId,
                location_id: credentials.locationId,
                query: {
                    filter: 'customer_token+eq+' + customerToken
                }
            }, function (err, body) {
                should.not.exist(err);
                body.results.should.be.an.Array;
                done();
            });
        });

        it.only('creates an e-check transaction then finds it by customer_id', function (done) {
            this.timeout(60000);
            pay.transactions.create({
                account_id: credentials.accountId,
                location_id: credentials.locationId,
                customer_token: customerToken,

                action: "sale",
                authorization_amount: 1, // dollar
                paymethod:{
                    echeck:{
                        account_number: "1111111111111",
                        routing_number: "021000021"
                    }
                }
            }, function (err, body) {
                should.not.exist(err);
                body.should.be.an.Object;
                body.customer_token.should.equal(customerToken);
                body.transaction_id.should.be.a.String;
                body.authorization_amount.should.equal(1);

                var transId = body.transaction_id;

                // confirm the transaction
                pay.transactions.findByCustomer({
                    account_id: credentials.accountId,
                    location_id: credentials.locationId,
                    customer_token: customerToken
                }, function (err, body) {
                    should.not.exist(err);
                    body.should.be.an.Object;
                    body.results.should.be.an.Array;
                    body.results[0].transaction_id.should.equal(transId);
                    done();
                });

                done();
            });
        });

        it('updates a transaction', function (done) {

        });

    });
});
