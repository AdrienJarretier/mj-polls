\c mjpollsdb;

INSERT INTO grades("value", "order") VALUES
('Excellent', 50),
('Very Good', 40),
('Good', 30),
('Acceptable', 20),
('Poor', 10),
('To Reject', 0);


INSERT INTO duplicate_vote_check_methods("name") VALUES
('browser'),
('ip'),
('account');
