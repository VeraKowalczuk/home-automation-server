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

const groupTemplate = ({name, members, plugs}) => `
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
                                        <button onclick="move('${ name }', '${ memberName }', 'down')" type="button" class = "btn btn-outline-secondary"> Down </button>
                                    </div>
                                </div>
                            </div>
                            `;
                        }
                        return str;
                    })()
                }
            </div>
            <div class="row">
                ${ 
                    (() => {
                        var str1 = '';
                        for(var i = 0; i < plugs.length; i++) {
                            var host_name = plugs[i].host;
                            var device_type = "tplink"
                            str1 += `
                            <div class="col-md-6 col-lg-4 col-sm-12 pb-3">
                                <div class="card">
                                    <div class="card-header"> ${ plugs[i].id } </div>
                                    <div class="card-body">
                                        <div class="pb-3">
                                            <button onclick="tplink_switch('${ device_type }', '${ host_name }', 'on' )" type="button" class="btn btn-secondary">On</button>
                                            <button onclick="tplink_switch('${ device_type }', '${ host_name }', 'off' )" type="button" class="btn btn-secondary">Off</button>
                                        </div>
                                        <h6 class="card-subtitle mb-2">Turn off with a Timer:</h6> 
                                        <div class="row"> 
                                            <button onclick="tplink_timer(${ 30*60 }, '${ device_type }', '${ host_name }', 'off')" type="button" class="btn btn-outline-secondary col timerbutton">30 Minutes</button>
                                            <button onclick="tplink_timer(${ 60*60 }, '${ device_type }', '${ host_name }', 'off')" type="button" class="timerbutton btn btn-outline-secondary col">1 Hour</button>
                                            <div class="input-group pl-0 col-md-6 col-lg-4 col-sm-12 timerbutton">
                                                <input type="number" min="5" class="form-control" placeholder="Minutes" id="${ host_name }">
                                                <div class="input-group-append">
                                                    <button onclick="tplink_timer(${-1}, '${ device_type }', '${ host_name }', 'off')" class="btn btn-secondary" type="submit">Set Timer</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `;
                        }
                        return str1;
                    })()
                }

        </div>
    </div>
`

function move(group, name, direction) { // direction : [up | down]
    var dollar = '$';
    if(name === "") {
        dollar = '';   
    }
    $.post("http://" + window.location.hostname + ":5000/distribute/" + group + dollar + name + "/shutter/" + direction);
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

function tplink_switch(device_type, host_name, state) { // state : [on | off]
    $.post("http://" + window.location.hostname + ":4000/switch/" + device_type + "/" + host_name + "/" + state);
}

function tplink_timer(seconds, device_type, host_name, state) { 
    if (seconds === -1) {
        seconds = document.getElementById(host_name).value * 60;
        console.log("seconds" + typeof(seconds) + seconds);
        //console.log("val" + typeof(parseInt($("#" + host_name).val())) + parseInt($("#" + host_name).val()));
        console.log(document.getElementById(host_name))
    }
    $.post("http://" + window.location.hostname + ":4000/timer/" + seconds + "/" + device_type + "/" + host_name + "/" + state);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getconfig() {
    $.getJSON("http://" + window.location.hostname + ":5000/config", function(data) {
        $('#accordion').html(data.groups.map(groupTemplate));
        $('#collapse' + data.groups[0].name).addClass("show");
    })
    .fail(async function() {
        $('#accordion').html("Failed to load devices, retrying...");
        await sleep(5000);
        getconfig();
    })
    ;
    
}