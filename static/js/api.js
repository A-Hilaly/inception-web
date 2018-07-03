var SetStats = function(id, classes, value) {
    document.querySelector('#p' + id).MaterialProgress.setProgress(value);
    document.getElementById('s' + id).innerHTML = value + '%';
    document.getElementById('n' + id).innerHTML = classes;
};

var runDemo = function(image) {
    var http = new XMLHttpRequest();
    var url = 'run_inference/' + image;
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            var obj = JSON.parse(http.responseText);
            if (obj.success == true) {
                console.log("success", obj.response[1])
                var i;
                for (i = 1; i < 6; i++) { 
                    SetStats(i, obj.response[i][0], Number((obj.response[i][1] * 100).toFixed(2)))
                }
            } else {
                console.log("no success")
            }
        }
    }
    http.send();
};

var refreshDemo = function(image) {
    runDemo(image);
};

var runDemoHTTP = function(image) {
    window.location.href = '/run_inference/' + image;
};

var deleteImage = function(image) {
    var http = new XMLHttpRequest();
    var url = 'delete_image/' + image;
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            var obj = JSON.parse(http.responseText);
            if (obj.success == true) {
                console.log("success");
                window.location.href = '/demo';
            } else {
                console.log("no success");
            }
        }
    }
    http.send();
};

