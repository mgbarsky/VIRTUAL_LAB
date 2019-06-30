var db = {
	"entities":[
		{"id":"problems", "title":"Problems","color_code_style":"problems-obj", "icon_code":"C","url":"problems.html"},
		{"id":"levels", "title":"Levels","color_code_style":"levels-obj", "icon_code":"B","url":"levels.html"},
		{"id":"games", "title":"Games","color_code_style":"games-obj", "icon_code":"&#59669","url":"problems.html"},
		{"id":"challenges", "title":"Challenges","color_code_style":"challenges-obj", "icon_code":"&#59827","url":"problems.html"},
		{"id":"analytics", "title":"Analytics","color_code_style":"analytics-obj", "icon_code":"&#58966","url":"problems.html"}
	],

	"problems": [
		{"id":1, "title":"Hello", "type":"code",
			"comments":"", "weight":"1", "tags":["entry level", "variables", "functions"],
			"instructions":"Implement the function that takes the name as a parameter, and returns string 'Hello, name!'",
			"starter_code":"def hello(name):\\n",
			"solution":"def hello(name):\\n\\t return 'Hello'+name",
			"test_cases":[
				{"test":"hello('Ann')", "output":"Hello, Ann!"},
				{"test":"hello('Bob')", "output":"Hello, Bob!"}
			]
		},
		{"id":2, "title":"Swap", "type":"code",
			"comments":"", "weight":"1", "tags":["entry level", "variables"],
			"instructions":"Write a program with 2 variables a and b. a originally contains value 4, and b contains value 7. Write a code which swaps values in these 2 variables.",
			"starter_code":"a=4:\\n b=7",
			"solution":"c=a\\n a=b\\n b=c",
			"test_cases":[
				{"test":"print(a)", "output":"7"},
				{"test":"print(b)", "output":"4"}
			]
		},
		{"id":3, "title":"Convert to centimeters", "type":"code",
			"comments":"", "weight":"2", "tags":["entry level", "types", "functions"],
			"instructions":"Implement the function that takes as a parameter length in inches, and returns length in centimeters.",
			"starter_code":"def convert(inches):\\n",
			"solution":"def convert(inches):\\n\\t return 2.54*inches",
			"test_cases":[
				{"test":"convert(2)", "output":5.08},
				{"test":"convert(10)", "output":25.4}
			]
		}		
	],

	"levels": [
		{"id":1, "title": "Variables", "img":"variable.jpg", "color_code":"green",
		"weight":5, "problems":[1,2]},
		{"id":2, "title": "Functions", "img":"function.jpg", "color_code":"darkred",
		"weight":5, "problems":[1,3]}
	]
};