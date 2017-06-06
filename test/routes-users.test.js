var chai = require('chai');
var chaiHttp = require('chai-http');
//var user = require('../src/routes/users');
var express = require('express');
var app = express();
var db = require('../models/dbconnect');
var should = chai.should();
chai.use(chaiHttp);
var assert = require('assert');

describe('routes', function() {
    describe('start', function() {
        it('should load the start page', function(done) {
            chai.request(app).get('/').end((err, res) => {
                chai.should(res.status === 200);
                done();
            });
        });

        it('should load the Join page', function(done) {
            chai.request(app).get('/join').end((err, res) => {
                chai.should(res.status === 200);
                done();
            });
        });
        it('should load the Jobs page', function(done) {
            chai.request(app).get('/jobs').end((err, res) => {
                chai.should(res.status === 200);
                done();
            });
        });
        it('should load the Employers page', function(done) {
            chai.request(app).get('/jobs').end((err, res) => {
                chai.should(res.status === 200);
                done();
            });
        });
        it('should load the Reviews page', function(done) {
            chai.request(app).get('/reviews').end((err, res) => {
                chai.should(res.status === 200);
                done();
            });
        });
        it('should load the training page', function(done) {
            chai.request(app).get('/training').end((err, res) => {
                chai.should(res.status === 200);
                done();
            });
        });
        it('should load the forums page', function(done) {
            chai.request(app).get('/forums').end((err, res) => {
                chai.should(res.status === 200);
                done();
            });
        });
        it('should load a 404 page', function(done) {
            chai.request(app).get('/aasdfhjasdfdsaasfb').end((err, res) => {
                chai.should(res.status === 404);
                done();
            });
        });

    });
});
describe('routes - user', function() {
    it('should allow the user to Join', function(done) {
        chai.request(app)
            .post('/user/login')
            .send({ email: 'test@mail.com', passsword: '1234', passwordDup: '1234' })
            .end(function(err, res) {
                chai.should(res.status === 200);
                done();
            });
    });
    it('should allow the user to login', function(done) {
        chai.request(app)
            .post('/user/login')
            .send({ email: 'test@mail.com', passsword: '1234' })
            .end(function(err, res) {
                chai.should(res.status === 200);
                done();
            });
    });

});
