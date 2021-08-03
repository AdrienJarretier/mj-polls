var assert = chai.assert;
describe('order_candidates()', function () {



    it('should throw error if number of votes is different per candidates', function () {

        let choices = [
            {
                "name": "last",
                "votes": {
                    "1": {
                        "value": "Excellent",
                        "order": 60,
                        "count": 0,
                    },
                    "2": {
                        "value": "Good",
                        "order": 40,
                        "count": 0,
                    }
                }
            },
            {
                "name": "best",
                "votes": {
                    "1": {
                        "value": "Excellent",
                        "order": 60,
                        "count": 9,
                    },
                    "2": {
                        "value": "Good",
                        "order": 40,
                        "count": 0,
                    }
                }
            },
            {
                "name": "middle",
                "votes": {
                    "1": {
                        "value": "Excellent",
                        "order": 60,
                        "count": 5,
                    },
                    "2": {
                        "value": "Good",
                        "order": 40,
                        "count": 4,
                    }
                }
            }
        ];

        assert.throws(function () {
            order_candidates(choices);
        }, "the number of votes by candidate is not the same");

    });




    describe('Only one candidate, one grade and 0 vote', function () {

        it('should return the only candidate', function () {

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
            ];

            assert.deepEqual(order_candidates(choices), ["a"]);

        });

    });

    describe('All candidates have a unique majority grade', function () {

        it('should return an array with the candidate sorted by their majority grade', function () {

            let choices = [
                {
                    "name": "last",
                    "votes": {
                        "1": {
                            "value": "Excellent",
                            "order": 60,
                            "count": 0,
                        },
                        "2": {
                            "value": "Good",
                            "order": 40,
                            "count": 0,
                        },
                        "3": {
                            "value": "Passble",
                            "order": 20,
                            "count": 0,
                        },
                        "4": {
                            "value": "Bad",
                            "order": 0,
                            "count": 10,
                        }
                    }
                },
                {
                    "name": "best",
                    "votes": {
                        "1": {
                            "value": "Excellent",
                            "order": 60,
                            "count": 10,
                        },
                        "2": {
                            "value": "Good",
                            "order": 40,
                            "count": 0,
                        },
                        "3": {
                            "value": "Passble",
                            "order": 20,
                            "count": 0,
                        },
                        "4": {
                            "value": "Bad",
                            "order": 0,
                            "count": 0,
                        }
                    }
                },
                {
                    "name": "middle",
                    "votes": {
                        "1": {
                            "value": "Excellent",
                            "order": 60,
                            "count": 0,
                        },
                        "2": {
                            "value": "Good",
                            "order": 40,
                            "count": 0,
                        },
                        "3": {
                            "value": "Passble",
                            "order": 20,
                            "count": 10,
                        },
                        "4": {
                            "value": "Bad",
                            "order": 0,
                            "count": 0,
                        }
                    }
                }
            ];

            assert.deepEqual(order_candidates(choices), ["best", "middle", "last"]);

        });

    });

    describe('first and middle have same majority grade but not perfectly equals', function () {

        it('should return an array with the candidate sorted by their majority grade, equalities should be handled', function () {

            let choices = [
                {
                    "name": "last",
                    "votes": {
                        "1": {
                            "value": "Excellent",
                            "order": 60,
                            "count": 0,
                        },
                        "2": {
                            "value": "Good",
                            "order": 40,
                            "count": 0,
                        },
                        "3": {
                            "value": "Passble",
                            "order": 20,
                            "count": 0,
                        },
                        "4": {
                            "value": "Bad",
                            "order": 0,
                            "count": 10,
                        }
                    }
                },
                {
                    "name": "best",
                    "votes": {
                        "1": {
                            "value": "Excellent",
                            "order": 60,
                            "count": 10,
                        },
                        "2": {
                            "value": "Good",
                            "order": 40,
                            "count": 0,
                        },
                        "3": {
                            "value": "Passble",
                            "order": 20,
                            "count": 0,
                        },
                        "4": {
                            "value": "Bad",
                            "order": 0,
                            "count": 0,
                        }
                    }
                },
                {
                    "name": "middle",
                    "votes": {
                        "1": {
                            "value": "Excellent",
                            "order": 60,
                            "count": 9,
                        },
                        "2": {
                            "value": "Good",
                            "order": 40,
                            "count": 0,
                        },
                        "3": {
                            "value": "Passble",
                            "order": 20,
                            "count": 1,
                        },
                        "4": {
                            "value": "Bad",
                            "order": 0,
                            "count": 0,
                        }
                    }
                }
            ];

            assert.deepEqual(order_candidates(choices), ["best", "middle", "last"]);

        });

    });

    describe('middle and last have same majority grade but not perfectly equals', function () {

        it('should return an array with the candidate sorted by their majority grade, equalities should be handled', function () {

            let choices = [
                {
                    "name": "last",
                    "votes": {
                        "1": {
                            "value": "Excellent",
                            "order": 60,
                            "count": 0,
                        },
                        "2": {
                            "value": "Good",
                            "order": 40,
                            "count": 0,
                        },
                        "3": {
                            "value": "Passble",
                            "order": 20,
                            "count": 0,
                        },
                        "4": {
                            "value": "Bad",
                            "order": 0,
                            "count": 10,
                        }
                    }
                },
                {
                    "name": "best",
                    "votes": {
                        "1": {
                            "value": "Excellent",
                            "order": 60,
                            "count": 10,
                        },
                        "2": {
                            "value": "Good",
                            "order": 40,
                            "count": 0,
                        },
                        "3": {
                            "value": "Passble",
                            "order": 20,
                            "count": 0,
                        },
                        "4": {
                            "value": "Bad",
                            "order": 0,
                            "count": 0,
                        }
                    }
                },
                {
                    "name": "middle",
                    "votes": {
                        "1": {
                            "value": "Excellent",
                            "order": 60,
                            "count": 1,
                        },
                        "2": {
                            "value": "Good",
                            "order": 40,
                            "count": 0,
                        },
                        "3": {
                            "value": "Passble",
                            "order": 20,
                            "count": 0,
                        },
                        "4": {
                            "value": "Bad",
                            "order": 0,
                            "count": 9,
                        }
                    }
                }
            ];

            assert.deepEqual(order_candidates(choices), ["best", "middle", "last"]);

        });

    });

    describe('Testing time to sort out equalities', function () {

        it('perfect equality, should return the candidates in the original order', function () {

            let choices = [
                {
                    "name": "last",
                    "votes": {
                        "1": {
                            "value": "Excellent",
                            "order": 60,
                            "count": 1000,
                        },
                        "2": {
                            "value": "Good",
                            "order": 40,
                            "count": 1000,
                        },
                        "3": {
                            "value": "Passble",
                            "order": 20,
                            "count": 1000,
                        },
                        "4": {
                            "value": "Bad",
                            "order": 0,
                            "count": 1000,
                        }
                    }
                },
                {
                    "name": "best",
                    "votes": {
                        "1": {
                            "value": "Excellent",
                            "order": 60,
                            "count": 1000,
                        },
                        "2": {
                            "value": "Good",
                            "order": 40,
                            "count": 1000,
                        },
                        "3": {
                            "value": "Passble",
                            "order": 20,
                            "count": 1000,
                        },
                        "4": {
                            "value": "Bad",
                            "order": 0,
                            "count": 1000,
                        }
                    }
                },
                {
                    "name": "middle",
                    "votes": {
                        "1": {
                            "value": "Excellent",
                            "order": 60,
                            "count": 1000,
                        },
                        "2": {
                            "value": "Good",
                            "order": 40,
                            "count": 1000,
                        },
                        "3": {
                            "value": "Passble",
                            "order": 20,
                            "count": 1000,
                        },
                        "4": {
                            "value": "Bad",
                            "order": 0,
                            "count": 1000,
                        }
                    }
                }
            ];

            assert.deepEqual(order_candidates(choices), ["best", "middle", "last"]);

        });

    });
});
