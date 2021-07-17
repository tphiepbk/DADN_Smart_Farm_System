function calculateDuration(timestampA, timestampB) {
    var datetimeA = new Date(timestampA);
    var datetimeB = new Date(timestampB);

    var ms = moment.utc(datetimeB).diff(moment.utc(datetimeA));
    var d = moment.duration(ms);

    return d.asHours();
}

function trigger() {
    var start_time = document.getElementById('start_date').value;
    var end_time = document.getElementById('end_date').value;

    console.log(start_time);
    console.log(end_time);
    console.log(typeof start_time);
    console.log(typeof end_time);

    console.log("Calculating...");
    var result = calculateDuration(start_time, end_time);
    console.log(result);
    document.getElementById("result").innerHTML = result.toString();
}
