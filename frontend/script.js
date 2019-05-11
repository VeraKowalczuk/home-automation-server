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

function move(group, name, direction) { // direction : [up | down]
    var dollar = '$';
    if(name === "") {
        dollar = '';   
    }
    $.post("http://" + window.location.hostname + ":5000/" + group + dollar + name + "/shutter/" + direction);
}

function lightswitch(group, name, onoff) { // onoff : [on | off]
    var dollar = '$';
    if(name === "") {
        dollar = '';   
    }
    $.post("http://" + window.location.hostname + ":5000/" + group + dollar + name + "/light/switch/" + onoff);
}

function light_offtimer(group, name, seconds) { 
    var dollar = '$';
    if(name === "") {
        dollar = '';   
    }
    $.post("http://" + window.location.hostname + ":5000/" + group + dollar + name + "/light/offtimer/" + seconds);
}

function getconfig() {
    $.getJSON("http://" + window.location.hostname + ":5000/config", function(data) {
        $('#accordion').html(data.groups.map(groupTemplate));
        $('#collapse' + data.groups[0].name).addClass("show");
    });
    
}