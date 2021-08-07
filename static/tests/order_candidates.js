var assert = chai.assert;
describe('Tests on get_ranking_and_outcome()', function () {



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
            get_ranking_and_outcome(choices);
        }, "the number of votes by candidate is not the same");

    });




    describe('Only one candidate, one grade and 0 vote', function () {

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

        it('Ranking should be the only candidate', function () {

            assert.deepEqual(get_ranking_and_outcome(choices).ranking, ["a"]);

        });

        it('Outcome should be no winner', function () {

            assert.deepEqual(get_ranking_and_outcome(choices).outcome, "No winner. There is no vote on this poll");

        });

    });



    describe('Only one candidate, one grade and 10 votes', function () {

        let choices = [
            {
                "name": "a",
                "votes": {
                    "1": {
                        "value": "Excellent",
                        "order": 60,
                        "count": 10,
                    }
                }
            }
        ];

        it('Ranking should be the only candidate', function () {

            assert.deepEqual(get_ranking_and_outcome(choices).ranking, ["a"]);

        });

        it('Outcome should be that a is the winner, it was the only running candidate', function () {

            assert.deepEqual(get_ranking_and_outcome(choices).outcome, "The winner is a. It was the only running candidate.");

        });

    });

    describe('All candidates have a unique majority grade', function () {

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

        it('Ranking should return an array with the candidates sorted by their majority grade', function () {

            assert.deepEqual(get_ranking_and_outcome(choices).ranking, ["best", "middle", "last"]);

        });

        it('Outcome should be a is the easy winner', function () {

            assert.deepEqual(get_ranking_and_outcome(choices).outcome, "The winner is best. All other candidates had lesser majority grades.");

        });

    });

    describe('first and middle have same majority grade but not perfectly equals', function () {

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

        it('Ranking should be an array with the candidate sorted by their majority grade, equalities should be handled', function () {

            assert.deepEqual(get_ranking_and_outcome(choices).ranking, ["best", "middle", "last"]);

        });

        it('Outcome should say that best was separated from middle', function () {

            assert.deepEqual(get_ranking_and_outcome(choices).outcome, "The winner is best. It was separated from middle that had the same majority grade.");

        });

    });

    describe('middle and last have same majority grade but not perfectly equals', function () {

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

        it('Ranking should be an array with the candidate sorted by their majority grade, equalities should be handled', function () {

            assert.deepEqual(get_ranking_and_outcome(choices).ranking, ["best", "middle", "last"]);

        });

        it('should return an array with the candidate sorted by their majority grade, equalities should be handled', function () {

            assert.deepEqual(get_ranking_and_outcome(choices).outcome, "The winner is best. All other candidates had lesser majority grades.");

        });



    });

    describe('Testing time to sort out equalities on a 4000 votes poll', function () {


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

        it('perfect equality, should return the candidates in the original order', function () {

            assert.deepEqual(get_ranking_and_outcome(choices).ranking, ["last", "best", "middle"]);

        });

        it('outcome should detect perfect equality', function () {

            assert.deepEqual(get_ranking_and_outcome(choices).outcome, "No winner. All candidates are perfectly equal");

        });

    });



    describe('Winning ties do not get beaten by third lower MM candidate after MM removal', function () {

        let choices = [{ "id": 8, "poll_id": 4, "name": "a", "votes": { "1": { "id": 1, "value": "Excellent", "order": 60, "count": 3 }, "2": { "id": 2, "value": "Very good", "order": 50, "count": 2 }, "3": { "id": 3, "value": "Good", "order": 40, "count": 3 }, "4": { "id": 4, "value": "Passable", "order": 30, "count": 0 }, "5": { "id": 5, "value": "Inadequate", "order": 20, "count": 3 }, "6": { "id": 6, "value": "Mediocre", "order": 10, "count": 2 }, "7": { "id": 7, "value": "Bad", "order": 0, "count": 0 } } }, { "id": 9, "poll_id": 4, "name": "b", "votes": { "1": { "id": 1, "value": "Excellent", "order": 60, "count": 0 }, "2": { "id": 2, "value": "Very good", "order": 50, "count": 1 }, "3": { "id": 3, "value": "Good", "order": 40, "count": 7 }, "4": { "id": 4, "value": "Passable", "order": 30, "count": 0 }, "5": { "id": 5, "value": "Inadequate", "order": 20, "count": 0 }, "6": { "id": 6, "value": "Mediocre", "order": 10, "count": 5 }, "7": { "id": 7, "value": "Bad", "order": 0, "count": 0 } } }, { "id": 10, "poll_id": 4, "name": "c", "votes": { "1": { "id": 1, "value": "Excellent", "order": 60, "count": 5 }, "2": { "id": 2, "value": "Very good", "order": 50, "count": 1 }, "3": { "id": 3, "value": "Good", "order": 40, "count": 0 }, "4": { "id": 4, "value": "Passable", "order": 30, "count": 1 }, "5": { "id": 5, "value": "Inadequate", "order": 20, "count": 0 }, "6": { "id": 6, "value": "Mediocre", "order": 10, "count": 1 }, "7": { "id": 7, "value": "Bad", "order": 0, "count": 5 } } }];

        it('should return the candidates in the order a, b, c', function () {

            assert.deepEqual(get_ranking_and_outcome(choices).ranking, ["a", "b", "c"]);

        });

        it('should say that a was separated from b', function () {

            assert.deepEqual(get_ranking_and_outcome(choices).outcome, "The winner is a. It was separated from b that had the same majority grade.");

        });

    });


    describe('Candidates with same MM as the winner are not mistaken for ties if they are not perfectly equals.', function () {

        let choices = [{ "id": 22, "name": "a", "votes": { "1": { "id": 1, "value": "Excellent", "order": 60, "count": 2 }, "2": { "id": 2, "value": "Very good", "order": 50, "count": 0 }, "3": { "id": 3, "value": "Good", "order": 40, "count": 0 }, "4": { "id": 4, "value": "Passable", "order": 30, "count": 0 }, "5": { "id": 5, "value": "Inadequate", "order": 20, "count": 0 }, "6": { "id": 6, "value": "Mediocre", "order": 10, "count": 0 }, "7": { "id": 7, "value": "Bad", "order": 0, "count": 2 } } }, { "id": 23, "name": "b", "votes": { "1": { "id": 1, "value": "Excellent", "order": 60, "count": 1 }, "2": { "id": 2, "value": "Very good", "order": 50, "count": 0 }, "3": { "id": 3, "value": "Good", "order": 40, "count": 0 }, "4": { "id": 4, "value": "Passable", "order": 30, "count": 0 }, "5": { "id": 5, "value": "Inadequate", "order": 20, "count": 0 }, "6": { "id": 6, "value": "Mediocre", "order": 10, "count": 0 }, "7": { "id": 7, "value": "Bad", "order": 0, "count": 3 } } }, { "id": 24, "name": "c", "votes": { "1": { "id": 1, "value": "Excellent", "order": 60, "count": 1 }, "2": { "id": 2, "value": "Very good", "order": 50, "count": 0 }, "3": { "id": 3, "value": "Good", "order": 40, "count": 0 }, "4": { "id": 4, "value": "Passable", "order": 30, "count": 0 }, "5": { "id": 5, "value": "Inadequate", "order": 20, "count": 0 }, "6": { "id": 6, "value": "Mediocre", "order": 10, "count": 0 }, "7": { "id": 7, "value": "Bad", "order": 0, "count": 3 } } }];

        it('should return the candidates in the order a, b, c', function () {

            assert.deepEqual(get_ranking_and_outcome(choices).ranking, ["a", "b", "c"]);

        });

        it('should say that a was separated from b and c', function () {

            assert.deepEqual(get_ranking_and_outcome(choices).outcome, "The winner is a. It was separated from b and c that had the same majority grade.");

        });

    });
});



