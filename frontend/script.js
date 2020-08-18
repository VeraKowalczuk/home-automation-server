function postreq() {
    $.post("http://" + window.location.hostname + ":5000/login", function (data) {
        console.log(data);
    });
}

function getreq() {
    $.get("http://" + window.location.hostname + ":5000/login", function (data) {
        console.log(data);
    });
}

const groupTemplate = ({name, members}) => `
    <div class="card">
    <div class="card-header">
        <a class="card-link" data-toggle="collapse" href="#collapse${ name }">
        ${ name }
        </a>
    </div>
    <div id="collapse${ name }" class="collapse" data-parent="#accordion">
        <div class="card-body">
            <div class="pb-3">
                <button onclick="move('${ name }', '', 'up')" type="button" class = "btn btn-outline-secondary"> Up </button>
                <button onclick="move('${ name }', '', 'down')" type="button" class = "btn btn-outline-secondary" > Down </button>
                <button onclick="displaySchedules('${ name }', '')" class="btn btn-outline-secondary" type="button"> Display Schedules </button>
                <div id="schedule${ name }">
                    
                </div>
            </div>
            <div class="row">
                ${ 
                    (() => {
                        var str = '';
                        for(var i = 0; i < members.length; i++) {
                            var memberName = members[i].id;
                            str += `
                            <div class="col-md-6 col-lg-4 col-sm-12 pb-3">
                                <div class="card">
                                    <div class="card-header">${ memberName }</div>
                                    <div class="card-body">
                                        <button onclick="move('${ name }', '${ memberName }', 'up')" type="button" class = "btn btn-outline-secondary"> Up </button>
                                        <button onclick="move('${ name }', '${ memberName }', 'down')" type="button" class = "btn btn-outline-secondary" > Down </button>
                                        <button onclick="displaySchedules('${ name }', '${ memberName }')" class="btn btn-outline-secondary" type="button"> Display Schedules </button>
                                
                                        <div id="schedule${ name }${ memberName }">
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `;
                        }
                        return str;
                    })()
                }
            </div>
        </div>
    </div>
`

const scheduleTemplate = ({group, memberName, schedules}) => `
    <div class="card-body">
    <table class="table">
    <thead>
    <tr>
        <th scope="col">Day</th>
        <th scope="col">Time</th>
        <th scope="col">Direction</th>
        <th scope="col">Edit</th>
        <th scope="col">Delete</th>
    </tr>
    </thead>
    <tbody>
        ${ 
            (() => {
                var str = '';
                for(var i = 0; i < schedules.length; i++) {
                    var scheduleId = schedules[i].id;
                    var day = schedules[i].day;
                    var time = schedules[i].time;
                    var direction = schedules[i].direction;
                    str += `
                    <tr>
                        <td>${day}</td>
                        <td>${time}</td>
                        <td>${direction}</td>
                        <td><button onclick="editRow('${ group }', '${ memberName }', )" class="btn btn-outline-secondary">Edit</button></td>
                        <td><button onclick="deleteRow('${ group }', '${ memberName }', )" class="btn btn-outline-secondary">Delete</button></td>
                    </tr>
                    `;
                }
                return str;
            })()
        }
    </tbody>
    </table>
    </div>
`


function move(group, name, direction) { // direction : [up | down]
    var dollar = '$';
    if(name === "") {
        dollar = '';   
    }
    $.post("http://" + window.location.hostname + ":5000/distribute/" + group + dollar + name + "/shutter/move/" + direction);
}

function lightswitch(group, name, onoff) { // onoff : [on | off]
    var dollar = '$';
    if(name === "") {
        dollar = '';   
    }
    $.post("http://" + window.location.hostname + ":5000/distribute/" + group + dollar + name + "/light/switch/" + onoff);
}

function light_offtimer(group, name, seconds) { 
    var dollar = '$';
    if(name === "") {
        dollar = '';   
    }
    $.post("http://" + window.location.hostname + ":5000/distribute/" + group + dollar + name + "/light/offtimer/" + seconds);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getconfig() {
    $.getJSON("http://" + window.location.hostname + ":5000/config", function(data) {
        $('#accordion').html(data.groups.map(scheduleTemplate));
        $('#collapse' + data.groups[0].name).addClass("show");
    })
    .fail(async function() {
        $('#accordion').html("Failed to load devices, retrying...");
        await sleep(5000);
        getconfig();
    })
    ;
    
}

function displaySchedules(group, name) {
    var dollar = '$';
    if(name === "") {
        dollar = '';   
    }
    $.getJSON("http://" + window.location.hostname + ":5000/schedules/" + group + dollar + name, function(data) {
        $('#schedule' + group + name).html(data.groups.map(scheduleTemplate)); // wie sehen die daten aus???
    })
    .fail(async function() {
        $('#schedule' + group + name).html("Failed to load schedules, retrying...");
        await sleep(5000);
        displaySchedules(group, name);
    })
    ;
}

function editRow(group, name,  ) { // wie sehen die daten aus???
    // todo
    if(name === "") {
        dollar = '';   
    }
    $.post("http://" + window.location.hostname + ":5000/distribute/" + group + dollar + name + "/shutter/edittime/" + day);
}

function deleteRow(group, name,  ) { // wie sehen die daten aus???
    // todo
    if(name === "") {
        dollar = '';   
    }
    $.post("http://" + window.location.hostname + ":5000/distribute/" + group + dollar + name + "/shutter/deletetime/" + day);
}

function addSchedule(group, name) { // wie sehen die daten aus???
    var time = $(this).parent().siblings(".time-select").val();
    var day = $(this).parent().siblings(".day-select").val();
    var direction = $(this).parent().siblings(".direction-select").val();
    var dollar = '$';
    if(name === "") {
        dollar = '';   
    }
    $.post("http://" + window.location.hostname + ":5000/distribute/" + group + dollar + name + "/shutter/addtime/" + direction + "/" + day + "/" + time);
}

