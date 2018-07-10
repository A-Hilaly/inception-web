var SetStats = function(id, classes, value, time) {
    document.querySelector('#p' + id).MaterialProgress.setProgress(value);
    document.getElementById('s' + id).innerHTML = value + '%';
    document.getElementById('n' + id).innerHTML = classes;
    document.getElementById('tcalc').innerHTML = 'Estimated time  ' + time + '  s';
};

var LoadingStatus = function(status, id) {
    if (status == true) {
        document.getElementById(id).style.display = "block";
    } else {
        document.getElementById(id).style.display = "none";
    }
}

var diff = function(t1, t2) {
    var dif = t1.getTime() - t2.getTime();
    var Seconds_from_T1_to_T2 = dif / 1000;
    var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
    return Seconds_Between_Dates;
}

var runDemo = function(image) {
    var start = new Date();
    var http = new XMLHttpRequest();
    var url = 'run_inference/' + image;
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            var obj = JSON.parse(http.responseText);
            if (obj.success == true) {
                var end = new Date();
                console.log("success", obj.response[1])
                var i;
                for (i = 1; i < 6; i++) { 
                    SetStats(i, obj.response[i][0], Number((obj.response[i][1] * 100).toFixed(2)), diff(start, end));
                };
            } else {
                console.log("no success");
            };
            LoadingStatus(false, "load_" + image);
        };
    };
    LoadingStatus(true, "load_" + image);
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
                window.location.href = '/demo';
            };
        };
    };
    http.send();
};

