/* Delete the tables if they already exist */
drop table if exists Entity;

drop table if exists Problem;
drop table if exists Bundle;
drop table if exists Course;
drop table if exists Challenge;
drop table if exists Tag;
drop table if exists Student;
drop table if exists Test;

drop table if exists BundleSchedule;
drop table if exists CourseSchedule;

drop table if exists ProblemTag;
drop table if exists BundleProblem;
drop table if exists CourseBundle;
drop table if exists CourseChallenge;
drop table if exists CourseStudent;
drop table if exists StudentProblem;

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
	solution TEXT
);

create table Bundle(
	id INT PRIMARY KEY,
	title VARCHAR(255) UNIQUE,
	image VARCHAR(1024),
	background VARCHAR(128),
	score INT
);

create table Course(
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

create table Student(
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

/* instances of entities - tables*/
create table BundleSchedule(
	bundle_schedule_id INT PRIMARY KEY,
	bundle_id INT,
	start_time DATE,
	end_time DATE
);

create table CourseSchedule(
	course_schedule_id INT PRIMARY KEY,
	course_id INT,
	start_time DATE,
	end_time DATE
);

/* relationship tables: one-to-many and many-to-many*/
create table ProblemTag(
	problem_id INT,
	tag_id INT,
	PRIMARY KEY (problem_id, tag_id)
);

create table BundleProblem(
	bundle_id INT,
	problem_id INT,
	PRIMARY KEY (bundle_id, problem_id)
);

create table CourseBundle(
	course_schedule_id INT,
	bundle_schedule_id INT,
	PRIMARY KEY (course_schedule_id,
			bundle_schedule_id)
);

create table CourseChallenge(
	course_schedule_id INT,
	challenge_id INT,
	PRIMARY KEY (course_schedule_id,
			challenge_id)
);

create table CourseStudent(
	course_schedule_id INT,
	student_id INT,
	PRIMARY KEY (course_schedule_id,
			student_id)
);

create table StudentProblem(
	student_id INT,
	bundle_schedule_id INT,
	problem_id INT,
	time_minutes FLOAT,
	problem_input VARCHAR(2048);
);
