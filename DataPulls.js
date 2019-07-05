uKey="1UlNNYBWAvzD3n8uCbHya5P3J0If1sOBS8sgi7ZG_4Qc";
lKey="";
qKey="";

race=["angel","demon","fae","vampire","werewolf"];
energy=["faith","ego","chyma","vitae","gnosis"];	
eColor=["#fff3c8","#80f","0a1","#700","#e6f8f8"];
subrace=["sphere","domain","house","bloodline","clan"];

tasks=["Story","Combat","Practice","Craft"];
	
function getUser(x,y) {
	$.getJSON("https://spreadsheets.google.com/feeds/list/" + x + "/" + y + "/public/values?alt=json-in-script&callback=?",
	function (data) {
		$.each(data.feed.entry, function(i,entry) {
			if(entry.gsx$user.$t===u) {
				window["user"]=JSON.parse(entry.gsx$data.$t);
			}
		});
		if(jQuery.type(f)==="string") {
			f=Number(f);
			feed(f);
		}
		buildTitle();
		buildTaskBar();
	});
}

function feed(f) {
	food=user[energy[race.indexOf(user.race.toLowerCase())]].split("|");
	food[0]=Number(food[0]);
	food[1]=Number(food[1]);
	if((food[0]+f)>food[1]) {
		food[0]=food[1];
	} else {
		food[0]=food[0]+f;
	}
	user[energy[race.indexOf(user.race.toLowerCase())]]=food[0]+"|"+food[1];
	buildPools(energy[race.indexOf(user.race.toLowerCase())]);
}

function buildPools(x) {
	health=user.health.split("|");
	food=user[x].split("|");
	$('#pools').append('<div class="box"><h1>Health</h1><div style="background-image: linear-gradient(to right,#c00 ' + (health[0]/health[1])*100 + '%, transparent ' + (health[0]/health[1])*100 + '%)"><span>' + health[0] + "/" + health[1] + '</span></div></div>');
	$('#pools').append('<div class="box"><h1>' + x.substring(0,1).toUpperCase() + x.slice(1) + '</h1><div style="background-image: linear-gradient(to right,' + eColor[energy.indexOf(x)] + ' ' + (food[0]/food[1])*100 + '%, transparent ' + (food[0]/food[1])*100 + '%)"><span>' + food[0] + "/" + food[1] + '</span></div></div>');
}

function buildTitle() {
	$('#title').append('<div class="box centerd"><h1>Eternal</h1><h1>Unrest</h1></div>');
	$('#title').append('<div class="box"><h2 class="right">' + user.race + '</h2><h2 class="right">' + user[subrace[race.indexOf(user.race.toLowerCase())]] + '</h2><h2 class="right">' + user.talent + '</h2></div>');
}

function buildTaskBar() {
	$('#tasks').append('<div style="margin: auto;width: fit-content;"></div>');
	for(var i=0;i<tasks.length;i++) {
		$('#tasks').children('div').append('<button>' + tasks[i] + '</button>');
	}
}
