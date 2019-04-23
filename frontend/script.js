function postreq() {
    $.post("http://192.168.178.96:5000/login", function (data) {
        console.log(data);
    });
}

function getreq() {
    $.get("http://192.168.178.96:5000/login", function (data) {
        console.log(data);
    });
}

const groupTemplate = ({name, members}) => `
<div class="card">
    <div class="card-header">
        <a class="card-link" data-toggle="collapse" href="#collapseOne">
            ${ name }
        </a>
    </div>
    <div id="collapseOne" class="collapse show" data-parent="#accordion">
        <div class="card-body">
            <button onclick="move('${ name }', '', 'up')" class="button" > Up </button>
            <button onclick="move('${ name }', '', 'down')" class="button" > Down </button>
        </div>
        <div class="card-body">
            ${ 
                (() => {
                    var str = '';
                    for(var i = 0; i < members.length; i++) {
                        var memberName = members[i].id;
                        str += `${ memberName }
                                <button onclick="move('${ name }', '${ memberName }', 'up')" class="button" > Up </button>
                                <button onclick="move('${ name }', '${ memberName }', 'down')" class="button" > Down </button>
                                <br>`;
                    }
                    return str;
                })()
			}
        </div>
    </div>
</div>
`

function move(group, name, direction) {
    var dollar = '$';
    if(name === "") {
        dollar = '';   
    }
    $.post("http://192.168.178.96:5000/control/" + group + dollar + name + "/" + direction);
    console.log(group + " " + name + " " + direction);
}

function getconfig() {
    $.getJSON("http://192.168.178.96:5000/config", function(data) {
        $('#accordion').html(data.groups.map(groupTemplate));
    });
    
}