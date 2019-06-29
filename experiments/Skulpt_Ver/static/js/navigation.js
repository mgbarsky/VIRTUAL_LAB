// Shared navigation file to prevent code reuse
DIRECTION = Object.freeze({PREVIOUS: 0, NEXT: 1});

var Navigation = Navigation || {
  // Setup shared navigation components
  setup: function(self, PAGE_STATE) {
    // Manage which state the page is on
    self.pageState = ko.observable(PAGE_STATE.LIST);

    self.homePage = () => {
      self.pageState(PAGE_STATE.LIST);
      self.resetInput();      
    }
    self.updatePage = function(direction) {
      var ps = self.pageState();
      if(direction === DIRECTION.NEXT && (ps === PAGE_STATE.NP4 || ps === PAGE_STATE.EP4)) {
        ps = PAGE_STATE.LIST;
      }
      else {
        ps = (ps + ((direction === DIRECTION.NEXT) ? 1 : -1));
      }
      self.pageState(ps);
    };

    self.previousPage = () => self.updatePage(DIRECTION.PREVIOUS);
    self.nextPage = () => {
      self.updateData();
      self.updatePage(DIRECTION.NEXT)
    };
    self.quitCreate = () => {
      self.resetInput();
      self.homePage();
    };
  },
};