var studentTemplates = function() {
  var levelsBoard = `
  <div data-bind="foreach: levelsObservables">
    <div class="rect-button-with-caption" data-bind="click: () => $parent.activeLevel(id)">
      <div class="rect-button problems-obj">
        <div>5/10</div>
        <img data-bind="attr: {src: 'user_images/' + img}">
        <div>
            <progress value="50" max="100"/>
        </div>
        <p data-bind="text: title"></p>
      </div>
    </div>
  </div>
  `;

  var problemList = `
  <ul data-bind="foreach: problemsObservables">
    <li>
      <span class="icon-font green">F</span>
      <span data-bind="text: title"></span>
    </li>
  </ul>
  `

  return {
    levelsBoard: levelsBoard,
    problemList: problemList
  }
}();