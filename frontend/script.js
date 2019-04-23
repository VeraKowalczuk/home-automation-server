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

const groupTemplate = ({groupName}) => `
<div class="card">
    <div class="card-header">
        <a class="card-link" data-toggle="collapse" href="#collapseOne">
            ${ groupName }
        </a>
    </div>
    <div id="collapseOne" class="collapse show" data-parent="#accordion">
        <div class="card-body">
            <button onclick="up()" class="button" > Up </button>
            <button onclick="down()" class="button" > Down </button>
        </div>
    </div>
</div>
`

function getconfig() {
    $('accordion').html(["test1", "test2"].map(groupTemplate).join(''));
    
    return;
    $.getJSON("http://192.168.178.96:5000/config", function(data) {
        var groups = data.groups;
        console.log(data.servers[0].host);
    });
}