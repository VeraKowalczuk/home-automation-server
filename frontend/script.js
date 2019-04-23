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
            <button onclick="up()" class="button" > Up </button>
            <button onclick="down()" class="button" > Down </button>
        </div>
        <div class="card-body">
            ${ 
                (() => {
                    var str = '';
                    for(var i = 0; i < members.length; i++) {
                        str += members[i].id;
                    }
                    return str;
                })()
			}
        </div>
    </div>
</div>
`

function getconfig() {
    $.getJSON("http://192.168.178.96:5000/config", function(data) {
        $('#accordion').html(data.groups.map(groupTemplate).join(''));
    });
    
}