var duplicateSearch = {
  init: function () {
    //this.mainCss()
    this.mainJS();
    this.goals();
  },
  mainCss: function () {
    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    document.head.appendChild(s).textContent = ""
  },

  mainJS: function () {
    //For JS
    console.log('Main js is Running....');
    var searchFieldContainer = document.querySelector('.nav-overlay__wrap--search')
    var dupSearch = searchFieldContainer.cloneNode(true);
    var searcRes = document.querySelectorAll('.content-wrap')

    var noResFound = Array.from(searcRes).filter((elm) => {

      if (elm.querySelector('p') && elm.querySelector('p').innerHTML === 'No results found') {
        return elm.querySelector('p').innerHTML
      }
    })

    dupSearch.classList.add('duplicate-search');
    if (noResFound.length > 0) {
      noResFound[0].innerHTML = '';
      noResFound[0].appendChild(dupSearch);
    }
    var dupInput = dupSearch.getElementsByTagName('input')[0];

    //check input

    dupInput.addEventListener('input', function (evt) {

      var searchKey = this.value
      if (searchKey.length > 3) {
        duplicateSearch.getSearchRes(searchKey)
      }
    });

  },
  getSearchRes: function (q) {

    fetch('/search-suggestions', {
        method: "POST",
        body: q
      })
      .then(function (response) {
        // The API call was successful!
        return response.text();
      }).then(function (html) {
        // This is the HTML from our response as a text string
        //console.log(html);
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html').querySelector('ul');
        var duplicateSearchDropdown = document.querySelectorAll('.search-results')[1];
        duplicateSearchDropdown.appendChild(doc);
        duplicateSearchDropdown.classList.add('block')
        duplicateSearch.dropdownCloser(duplicateSearchDropdown)
      }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
      });

  },
  dropdownCloser: function (dropdownSelector) {

    document.addEventListener('mouseup', function (e) {

      if (!dropdownSelector.contains(e.target)) {
        dropdownSelector.classList.add('hidden');
      }
    });


  },
  goals: function () {
    // For Goal/Metric JS
  },
};

(function pollForLoadDuplicateSearchV1() {
  if (document.readyState === 'complete') {
    duplicateSearch.init();
    console.log('Variation- A: 01');
  } else {
    setTimeout(pollForLoadDuplicateSearchV1, 25);
  }
})();

/***********************donot copy to after this line******************************/

export default duplicateSearch;
