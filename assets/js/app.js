(function () {
  var output = document.getElementById("time");
  function time() {
    var date = new Date();
    var hours = date.getHours()
    var minuites = date.getMinutes();
    var seconds = date.getSeconds();
    var timeFormat = 'AM';
    if (hours > 11) {
      timeFormat = 'PM';
    } else {
      timeFormat = 'AM';
    }
    if (hours > 12) {
      hours = hours - 12;
    } else {
      if (!hours) {
        hours = 12;
      }
      hours = hours;
    }
    if (hours > 9) {
      hours = hours;
    } else {
      hours = "0" + hours;
    }
    if (minuites > 9) {
      minuites = minuites;
    } else {
      minuites = "0" + minuites;
    }
    if (seconds > 9) {
      seconds = seconds;
    } else {
      seconds = "0" + seconds;
    }
    output.innerHTML = hours + ":" + minuites + ":" + seconds + ' ' + timeFormat;
  }
  time();
  setInterval(time, 1000);
}());