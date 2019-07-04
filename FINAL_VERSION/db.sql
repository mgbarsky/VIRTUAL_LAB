/* Delete the tables if they already exist */
drop table if exists Entity;

drop table if exists Problem;
drop table if exists Level;
drop table if exists Game;
drop table if exists Challenge;
drop table if exists Tag;
drop table if exists Player;
drop table if exists Test;

drop table if exists ProblemTag;
drop table if exists LevelProblem;
drop table if exists GameLevel;
drop table if exists GameChallenge;
drop table if exists GamePlayer;
drop table if exists PlayerSolution;

create table Entity(
	id CHAR(128) PRIMARY KEY,
	title VARCHAR(255),
	color_code_style VARCHAR(128),
	icon_code VARCHAR(128),
	url VARCHAR(255)
);

BEGIN TRANSACTION;
/* Populate existing entities*/
INSERT INTO Entity VALUES ('problems', 'Problems', 'problems-obj',
							'C','problems.html');
INSERT INTO Entity VALUES ('levels', 'Levels', 'levels-obj',
							'B','levels.html');
INSERT INTO Entity VALUES ('games', 'Games', 'games-obj',
							'&#59669','games.html');
INSERT INTO Entity VALUES ('challenges', 'Challenges', 'challenges-obj',
							'&#59827','challenges.html');
INSERT INTO Entity VALUES ('analytics', 'Analytics', 'analytics-obj',
							'&#58966','analytics.html');
COMMIT;

/* Create the schema for entity tables */
create table Problem(
	id INT PRIMARY KEY,
	title VARCHAR(255) UNIQUE,
	comments TEXT,
	type VARCHAR(128),
	weight INT,
	instructions TEXT,
	starter_code TEXT,
	solution TEXT,
	start_time DATE,
	end_time DATE
);

create table Level(
	id INT PRIMARY KEY,
	title VARCHAR(255) UNIQUE,
	image VARCHAR(1024),
	background VARCHAR(128),
	score INT,
	start_time DATE,
	end_time DATE
);

create table Game(
	id INT PRIMARY KEY,
	title VARCHAR(255),
	language VARCHAR(128)
);

create table Tag(
	id INT PRIMARY KEY,
	title VARCHAR(255)
);

create table Challenge(
	challenge_id INT PRIMARY KEY,
	problem_id INT,
	start_time DATE,
	end_time DATE
);

create table Player(
	id INT PRIMARY KEY,
	email VARCHAR(128) UNIQUE,
	screen_name VARCHAR(255) UNIQUE,
	password VARCHAR(32),
	first_name VARCHAR(255),
	last_name VARCHAR(255),
	image VARCHAR(1024),
	dob DATE,
	background VARCHAR(1024)
);

create table Test(
	problem_id INT,
	test_id INT,
	test_code TEXT,
	test_output TEXT,
	PRIMARY KEY (problem_id, test_id)
);

/* relationship tables: one-to-many and many-to-many*/
create table ProblemTag(
	problem_id INT,
	tag_id INT,
	PRIMARY KEY (problem_id, tag_id)
);

create table LevelProblem(
	level_id INT,
	problem_id INT,
	PRIMARY KEY (level_id, problem_id)
);

create table GameLevel(
	game_id INT,
	level_id INT,
	PRIMARY KEY (game_id,level_id)
);

create table GameChallenge(
	game_id INT,
	challenge_id INT,
	PRIMARY KEY (game_id, challenge_id)
);

create table GamePlayer(
	game_id INT,
	player_id INT,
	PRIMARY KEY (game_id, player_id)
);

create table PlayerSolution(
	player_id INT,
	game_id INT,
	level_id INT,
	problem_id INT,
	start_time DATE,
	end_time DATE,
	solution TEXT,
	score FLOAT,
	PRIMARY KEY (player_id, problem_id, end_time)
);
