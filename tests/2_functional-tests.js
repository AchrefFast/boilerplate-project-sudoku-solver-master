const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
const correct_input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const false_input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37'
const invalid_char_input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37a'
const solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'

suite('Functional Tests', () => {

    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: correct_input })
            .end(function (err, res) {
                if (err) done(err);
                assert.isObject(res.body);
                assert.equal(res.body.solution, solution);
                done();
            });
    });

    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function (done) {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: '' })
            .end(function (err, res) {
                if (err) done(err);
                assert.isObject(res.body);
                assert.equal(res.body.error, 'Required field missing');
                done();
            });
    });

    test('Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: invalid_char_input })
            .end(function (err, res) {
                if (err) done(err);
                assert.isObject(res.body);
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            });
    });

    test('Solve a puzzle with incorrect length: POST request to /api/solve', function (done) {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: false_input })
            .end(function (err, res) {
                if (err) done(err);
                assert.isObject(res.body);
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            });
    });

    test('Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: '1.5..2.84..93.12.7.2..5.....9..1....8.2.3675.3.7.2..9.47...8..1..16....926916.37.' })
            .end(function (err, res) {
                if (err) done(err);
                assert.isObject(res.body);
                assert.equal(res.body.error, 'Puzzle cannot be solved');
                done();
            });
    });
    test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: correct_input, coordinate: 'a1', value: 1 })
            .end(function (err, res) {
                if (err) done(err);
                assert.isObject(res.body);
                assert.property(res.body, 'valid');
                assert.isTrue(res.body.valid);
                done();
            });
    });

    test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: correct_input, coordinate: 'a2', value: 8 })
            .end(function (err, res) {
                if (err) done(err);
                assert.isObject(res.body);
                assert.property(res.body, 'valid');
                assert.property(res.body, 'conflict');
                assert.isFalse(res.body.valid);
                assert.lengthOf(res.body.conflict, 1);
                done();
            });
    });
    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: correct_input, coordinate: 'a2', value: 6 })
            .end(function (err, res) {
                if (err) done(err);
                assert.isObject(res.body);
                assert.property(res.body, 'valid');
                assert.property(res.body, 'conflict');
                assert.isFalse(res.body.valid);
                assert.lengthOf(res.body.conflict, 2);
                assert.include(res.body.conflict, 'column');
                assert.include(res.body.conflict, 'region');
                done();
            });
    });
    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: correct_input, coordinate: 'a2', value: 2 })
            .end(function (err, res) {
                if (err) done(err);
                assert.isObject(res.body);
                assert.property(res.body, 'valid');
                assert.property(res.body, 'conflict');
                assert.isFalse(res.body.valid);
                assert.lengthOf(res.body.conflict, 3);
                assert.include(res.body.conflict, 'column');
                assert.include(res.body.conflict, 'row');
                assert.include(res.body.conflict, 'region');
                done();
            });
    });
    test('Check a puzzle placement with missing required fields: POST request to /api/check', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: '', coordinate: 'a2', value: 2 })
            .end(function (err, res) {
                if (err) done(err);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            });
    });
    test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: invalid_char_input, coordinate: 'a1', value: 1 })
            .end(function (err, res) {
                if (err) done(err);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            });
    });
    test('Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: false_input, coordinate: 'a1', value: 1 })
            .end(function (err, res) {
                if (err) done(err);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            });
    });
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: correct_input, coordinate: 'k1', value: 1 })
            .end(function (err, res) {
                if (err) done(err);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Invalid coordinate');
                done();
            });
    });
    test('Check a puzzle placement with invalid placement value: POST request to /api/check', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: correct_input, coordinate: 'a1', value: 456 })
            .end(function (err, res) {
                if (err) done(err);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Invalid value');
                done();
            });
    });
});

