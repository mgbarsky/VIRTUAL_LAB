db = checkLocalStorageKeyExists() || db;

function checkLocalStorageKeyExists() {
    if (localStorage.getItem("db") === null) { // if key called 'db' not exist in local storage, create one
        localStorage.setItem("db",JSON.stringify(db));
        return null;
    }
    else {
        var JSONObj = JSON.parse(localStorage.getItem("db"));
        console.log(JSONObj);
        return JSONObj;
    }
}


function updateDataInLocalStorage(JSONObj) {
    localStorage.setItem("db",JSON.stringify(JSONObj));
}
