var assert = chai.assert;
describe('order_candidates()', function () {
    it('should not crash, and should return an array with the only candidate if there\'s only one candidate and one grade', function () {

        let choices = [
            {
                "name": "a",
                "votes": {
                    "1": {
                        "value": "Excellent",
                        "order": 60,
                        "count": 0,
                    }
                }
            }
        ]

        assert.deepEqual(order_candidates(choices), ["a"]);

    });

    describe('Perfect equality', function () {

        it('should return array with the candidates in the original order', function () {

            let choices = [
                {
                    "name": "b",
                    "votes": {
                        "1": {
                            "value": "Excellent",
                            "order": 60,
                            "count": 0,
                        }
                    }
                },
                {
                    "name": "a",
                    "votes": {
                        "1": {
                            "value": "Excellent",
                            "order": 60,
                            "count": 0,
                        }
                    }
                }
            ]

            assert.deepEqual(order_candidates(choices), ["b", "a"]);

            choices = [
                {
                    "name": "b",
                    "votes": {
                        "1": {
                            "value": "Excellent",
                            "order": 60,
                            "count": 0,
                        },
                        "2": {
                            "value": "Bad",
                            "order": 0,
                            "count": 0,
                        }
                    }
                },
                {
                    "name": "a",
                    "votes": {
                        "1": {
                            "value": "Excellent",
                            "order": 60,
                            "count": 0,
                        }
                    }
                }
            ]

            assert.deepEqual(order_candidates(choices), ["b", "a"]);

        });



        // it('should return array with the candidates in the original order', function () {

        //     let choices = [
        //         {
        //             "name": "b",
        //             "votes": {
        //                 "1": {
        //                     "value": "Excellent",
        //                     "order": 60,
        //                     "count": 0,
        //                 }
        //             }
        //         },
        //         {
        //             "name": "a",
        //             "votes": {
        //                 "1": {
        //                     "value": "Excellent",
        //                     "order": 60,
        //                     "count": 0,
        //                 }
        //             }
        //         }
        //     ]

        //     assert.deepEqual(order_candidates(choices), ["b", "a"]);

        // });



        // it('should return array with the candidates in the original order', function () {

        //     let choices = [
        //         {
        //             "name": "b",
        //             "votes": {
        //                 "1": {
        //                     "value": "Excellent",
        //                     "order": 60,
        //                     "count": 0,
        //                 }
        //             }
        //         },
        //         {
        //             "name": "a",
        //             "votes": {
        //                 "1": {
        //                     "value": "Excellent",
        //                     "order": 60,
        //                     "count": 0,
        //                 }
        //             }
        //         }
        //     ]

        //     assert.deepEqual(order_candidates(choices), ["b", "a"]);

        // });



        // it('should return array with the candidates in the original order', function () {

        //     let choices = [
        //         {
        //             "name": "b",
        //             "votes": {
        //                 "1": {
        //                     "value": "Excellent",
        //                     "order": 60,
        //                     "count": 0,
        //                 }
        //             }
        //         },
        //         {
        //             "name": "a",
        //             "votes": {
        //                 "1": {
        //                     "value": "Excellent",
        //                     "order": 60,
        //                     "count": 0,
        //                 }
        //             }
        //         }
        //     ]

        //     assert.deepEqual(order_candidates(choices), ["b", "a"]);

        // });



    });
});
