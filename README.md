# Ranked Choice Voting
(What is ranked choice voting? [Read more here](http://www.fairvote.org/rcv#rcvbenefits))

App meant to allow client to create a ranked choice election, cast ranked ballots, and get results for election

### Setup
- Get Python dependencies: `pip install -r requirements.txt`
- Set up postgres db locally called "vote"
- Create `keys.py` in server dictory that looks something like this:

```
SECRET_KEY = 'yoursecretstringhere'
DB_URI = 'postgresql://username:password@localhost/vote'
DB_URI_TESTS = "postgresql://username:password@localhost/vote_tests"
```

- Get front-end dependencies with `npm install`
- Run server locally with `python run.py` which will run on `localhost:8000`
- If you want to run gulp (with browersync and sass compiling), run `app.py` then do `gulp serve` which will run on `localhost:8001`
