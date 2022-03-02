'use strict';

import {get, post } from '/javascripts/utils.js';

const assert = chai.assert;
describe('api tests', function() {

    it('should get list of grades', async function() {

        const grades = await get('/polls/grades');

        const expected = [{
                "id": 6,
                "value": "To Reject",
                "order": 0
            },
            {
                "id": 5,
                "value": "Poor",
                "order": 10
            },
            {
                "id": 4,
                "value": "Acceptable",
                "order": 20
            },
            {
                "id": 3,
                "value": "Good",
                "order": 30
            },
            {
                "id": 2,
                "value": "Very Good",
                "order": 40
            },
            {
                "id": 1,
                "value": "Excellent",
                "order": 50
            }
        ]
        assert.deepEqual(grades, expected);

    });

    it('should get poll with identifier 00000000', async function() {

        const poll = await get('/polls/00000000');

        // INSERT INTO polls(
        //     identifier, 
        //     title,
        //     max_voters,
        //     max_datetime)
        // VALUES(00000000, 'title of poll 00000000', null, null)
        const expected = {
            'identifier': '00000000',
            'title': 'title of poll 00000000',
            'max_voters': null,
            'max_datetime': null,
        }

        assert.ownInclude(poll, expected);

    });

    it('should post poll and retrieve an identifier', async function() {

        const formData = {
            "title": "poll inserted from front end unit tests",
            "choices": ["a", "b", ""],
            "max_datetime": null
        }
        let pollIdentifier = await post('/polls', formData);

        console.log(pollIdentifier);

        const poll = await get('/polls/' + pollIdentifier);

        console.log(poll);

        let expected = pollIdentifier;
        expected['identifier'] = pollIdentifier;

        assert.ownInclude(poll, expected);

    });

});