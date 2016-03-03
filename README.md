# Ranked Choice Voting
(What is ranked choice voting? [Read more here](http://www.fairvote.org/rcv#rcvbenefits))

App meant to allow client to create a ranked choice election, cast ranked ballots, and get results for election

### Setup
- Get Python dependencies: `pip install -r requirements.txt`
- Set up postgres locally and create database called "vote"
- Create `config.py` in root that has this `SQLALCHEMY_DATABASE_URI = "postgresql://username:password@localhost/vote"` with info filled in
- Get front-end dependencies with `npm install`
- Run server locally with `python app.py` which will run on `localhost:8000`
