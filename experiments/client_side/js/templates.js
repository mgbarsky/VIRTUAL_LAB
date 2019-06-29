Templates = function() {
  var login = `
    <div class="right">
        <div class="text">
            <h1>Marina B</h1>
            <h2>Logged in as instructor</h2>
        </div>
        <div>
            <span class="icon-font" id="user">&#59761 </span>
        </div>
    </div>
    `;

  var menu = `
    <div class="title-bar" data-bind="css: entity.color_code_style">
        <h1>All <span data-bind="text: entityID"></span></h1>
        <div class="right-icons">
            <span class="icon-font button title-bar-button" title="search">&#59782;</span>
            <span class="icon-font button title-bar-button" title="filter">&#59995;</span>
            <span class="icon-font button title-bar-button" title="sort">&#59980;</span>
            <span class="icon-font button title-bar-button" title="edit" data-bind="click: editListItem">&#59653;</span>
            <span class="icon-font button title-bar-button" title="delete" data-bind="click: deleteListItem">&#59820;</span>
            <div class="drop-down">
                <span class="icon-font button title-bar-button">&#58956;</span>
                <div class="drop-down-list-container" data-bind="css: entity.color_code_style">
                    <ul class="single-column no-scroll indent-items">
                        <li>Rename</li>
                        <li>Edit</li>
                        <li>Delete</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="container body-button-panel">
        <span class="new-group-btn" data-bind="css: entity.color_code_style, click: nextPage">New</span>
    </div>
  `;

  var board = {
    list: `
    <section class="square-button-group" data-bind="foreach: entitiesObservables">
      <div class="square-button-with-caption" data-bind="click: href">
        <div class="square-button " data-bind="css: color_code_style">
          <h1><span class="icon-font white" data-bind="html: icon_code"></span></h1>
        </div>
        <p data-bind="text: title"></p>
      </div>
    </section>
    `,

    boardHead: `
    <div class="left long">
        <h1 class="long"><span class="icon-pure_logo">A</span></h1>
    </div>
    `
  }



  var problems = {
    list: `
		<div class="container list-panel">
			<ul data-bind="foreach: problemsObservables">
				<li data-bind="click: () => {$parent.activeProblem(id)}" tabindex=-1>
					<span data-bind="text: title"></span>
				</li>
			</ul>
		</div>
    `,

    listHead: `
    <div class="left long">
        <h1 class="long" onclick="window.location.href='dashboard.html'"><span class="icon-pure_logo">A</span></h1>
        <div class="centered">
            <h1 onclick="window.location.href='dashboard.html'"><span class="icon-font">&#59968</span>Problems</h1>
        </div>
    </div>
    `,

    newHead: `
    <div class="left long">
        <h1 class="long" onclick="window.location.href='dashboard.html'"><span class="icon-pure_logo">A</span></h1>
        <div class="centered">
            <h1 data-bind="click: homePage"><span class="icon-font">&#59968</span>Problems / New Problem</h1>
        </div>
    </div>
    `,

    np1: `
    <div class="title-bar problems-obj">
        <h1 class="problem">New problem 1/4: general</h1>
    </div>

    <div class="large-container">
        <form>

            <div class="input-group">
                <label for="name">Name</label>
                <input type="text" placeholder="Name" id="name" class="long"
                data-bind="textInput: problem.title"/>
            </div>

            <div class="input-group">
                <label >Type</label>
                <select class="wide long" data-bind="value: problem.type">
                    <option>--Select Type--</option>
                    <option>One</option>
                    <option>Two</option>
                </select>
            </div>

            <div class="textinput-group">
                <label class="contents">Comments</label>
                <textarea data-bind="textInput: problem.comments"></textarea>
            </div>

            <div class="input-group">
                <label>Weight</label>
                <input type="text" placeholder="1" id="weight" class="long"
                data-bind="textInput: problem.weight">
            </div>
        </form>
    </div>
    `,

    np2: `
    <div class="title-bar problems-obj">
         <h1 class="problem">New problem 2/4: instructions</h1>
    </div>
    <div class="large-container">
        <form>
            <div class="textinput-group">
                <label>Instructions</label>
                <textarea data-bind="textInput: problem.instructions"></textarea>
            </div>

            <div class="textinput-group">
                <label >Starter Code</label>
                <textarea data-bind="textInput: problem.starter_code" id="smallbox"></textarea>
            </div>

            <div class="controls">
                <input type="button" class="btn-ok" value="&#8592;" data-bind="click: previousPage"/>
                <input type="button" class="btn-ok" value="&#8594;" data-bind="click: nextPage"/>
                <input type="button" class="btn-cancel" value="&#10006;" data-bind="click: quitCreate"/>
                <input type="button" class="btn-ok" value="&#10003;"/>
            </div>
        </form>
    </div>
    `,

    np3: `
    <div class="title-bar problems-obj">
        <h1 class="problem">New problem 3/4: solution</h1>
        </div>
    </div>

    <div class="large-container">
            <form>

            <textarea id="codebox"></textarea>
            <div class="output-div black smalloutput">
                <pre id="output">

                </pre>
            </div>

                    <div class="controls">
                    <input type="button" class="btn-ok" value="&#9658;" title="Run" onclick="run()">
                    <input type="button" class="btn-ok" value="&#8592;" data-bind="click: previousPage"/>
                    <input type="button" class="btn-ok" value="&#8594;" data-bind="click: nextPage"/>
                    <input type="button" class="btn-cancel" value="&#10006;" data-bind="click: quitCreate"/>
                    <input type="button" class="btn-ok" value="&#10003;"/>
                </div>
            </form>
    </div>
    `,

    np4: `
    <div class="title-bar problems-obj">
            <h1 class="problem">New problem 4/4: test cases</h1>
        </div>
            
        <div class="large-container">
            <form>
                <div class="input-group">
                    <label>Test Cases</label>
                    <input type="text" placeholder="" id="name" class="long wide"/>
                    <input type="button" value="+">  
                </div>
        
                <div class="container list-panel">	
                    <ul>
                        <li class="long" contenteditable="true">
                            <!--<span class="icon-stack white"> </span>-->
                            Test Case 1
                        </li>
                        <li contenteditable="true">
                            <!--<span class="icon-stack white"> </span>-->
                            Test Case 2
                        </li>
                    </ul>
                </div>

                <div class="controls">
                        <input type="button" class="btn-ok" value="&#8592;" data-bind="click: previousPage" />
                        <input type="button" class="btn-cancel" value="&#10006;" data-bind="click: quitCreate"/>
                        <input type="button" class="btn-ok" value="&#10003;" data-bind="click: nextPage"/>
                </div>
            </form>
        </div>
    `
  }

  var levels = {
    list: `
    <div class="container list-panel">
        <ul data-bind="foreach: levelsObservables">
            <li data-bind="click: () => {$parent.activeLevel(id)}" tabindex=-1>
                <span class="level-icons"><img data-bind="attr: {src: 'user_images/' + img}" class="level-icons"></span>
                <span data-bind="text: title"></span>
            </li>
        </ul>
    </div>
    `,

    listHead: `
    <div class="left long">
        <h1 class="long" onclick="window.location.href='dashboard.html'"><span class="icon-pure_logo">A</span></h1>
        <div class="centered">
            <h1 onclick="window.location.href='dashboard.html'"><span class="icon-font">&#59968</span>Levels</h1>
        </div>
    </div>
    `,

    newHead: `
    <div class="left long">
        <h1 class="long" onclick="window.location.href='dashboard.html'"><span class="icon-pure_logo">A</span></h1>
        <div class="centered">
            <h1 data-bind="click:homePage"><span class="icon-font">&#59968;</span>Levels / New Levels</h1>
        </div>
    </div>
    `,

    nl1: `
    <div class="title-bar levels-obj">
        <h1 class="problem">New level 1/2: general</h1>
    </div>

    <div class="large-container">
        <form>
            <div class="input-group">
                <label for="name">Name</label>
                <input type="text" class="long" data-bind="textInput: newLevel.title"/>
            </div>

            <div class="input-group">
                <label >Image</label>
                <input type="text" readonly class="long wide" data-bind="textInput: newLevel.img">
                <input type="button" value="...">
                <input type="file" data-bind="event:
                {change: () => uploadImage($element.files[0])}">
            </div>

            <div class="input-group">
                <label>Background</label>
                <input type="text" readonly class="long wide">
                <input type="color" value="#54813b" data-bind="event:
                {change: () => newLevel.color_code($element.value)}">
            </div>


            <div class="input-group">
                <label>Weight</label>
                <input type="text" value="30" class="long" data-bind="textInput: newLevel.weight"/>
            </div>

            <div class="controls">
                <input type="button" class="btn-ok" value="&#8594;" data-bind="click: nextPage" />
                <input type="button" class="btn-cancel" value="&#10006;" data-bind="click: quitCreate"/>
                <input type="button" class="btn-ok" value="&#10003;"/>
            </div>
        </form>
    </div>
    `,

    nl2: `
    <div class="title-bar levels-obj">
            <h1 class="problem">New level 2/2: problems</h1>
    </div>
    `
  }

  var tag = 
  `
  <div class="large-container">
      <form>
            <div class="input-group">
                <label>Tags</label>
                <!-- ko foreach: selectedTags -->
                <div class="tag-input-group">
                    <input type="text" class="long" disabled data-bind="value: $data.title"/>    
                    <button class="remove-tag" data-bind="click: $parent.removeTag">X</button>
                </div>
                <!-- /ko -->
            </div>
           
            <div class="input-group">
                <label></label>
                <select data-bind="options: tagOptions,optionsText: 'title',value: selectedTagValue, optionsCaption: 'Choose tags...', event: {change: onChangeOptions}" class="long wide"></select>
            </div>
            <div class="input-group"> 
                <label></label>   
                <input type="text" data-bind="value: newTagText" class="long wide">
                <input type="button" data-bind="click: addTagToOptions" value="+">
            </div>

            <div class="controls">
                <input type="button" class="btn-ok" value="&#8594;" data-bind="click: nextPage"/>
                <input type="button" class="btn-cancel" value="&#10006;" data-bind="click: quitCreate"/>
                <input type="button" class="btn-ok" value="&#10003;"/>
            </div>
      </form>
  </div>
  `;


  var newLevel2Problems = 
    `
    <div class="whole-container">
        <div class="problem-container">        
            <div class="title-bar problems-obj">
                <h1>All problems</h1>
                <div class="right-icons">
                    <span class="icon-font button title-bar-button" title="search">&#59782</span>
                    <span class="icon-font button title-bar-button" title="filter">&#59995</span>
                    <span class="icon-font button title-bar-button" title="sort">&#59980 </span>
                </div>
            </div>
            <div class="container list-panel">	
                <ul data-bind="foreach: levelProblemsObservables">
                    <li data-bind="click: $parent.problemListClick" tabindex=-1>
                        <span data-bind="text: $data.title"></span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="left-right-arrows">
            <h1><span class="icon-font left-arrow" data-bind="click: addSelectedProblem">E</span></h1>
            <h1><span class="icon-font right-arrow" data-bind="click: removeSelectedProblem">D</span></h1>
            <!--<p><span class="left-arrow">&#8592</span></p>
            <p><span class="right-arrow">&#8594</span></p>-->
        </div>
        <div class="large-container">
            <div class="title-bar">
                <h1 id="problem-text">Problems</h1>
            </div>
                <div class="container list-panel">	
                    <ul data-bind="foreach: selectedProblem">
                        <li data-bind="click: $parent.selectedProblemListClick" tabindex=-1>
                            <span data-bind="text: $data.title"></span>
                        </li>
                    </ul>
                </div>
            <div class="controls">
                <input type="button" class="btn-ok" value="&#8592;" onclick="window.location.href='new_level_1.html'"/>
                <input type="button" class="btn-cancel" value="&#10006;" onclick=""/>
                <input type="button" class="btn-ok" value="&#10003;" onclick="" /> 
            </div>
        </div>
    </div>
    `;

  var navbar = function(head) {
    return `
      <nav>
        ${head}
        ${login}
      </nav>
    `
  }

  return {
    board: board,
    problems: problems,
    levels: levels,
    menu: menu,
    navbar: navbar,
    tag: tag,
    newLevel2Problems: newLevel2Problems
  }
}();