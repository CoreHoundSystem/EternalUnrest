uKey="14OqF8eIQh-4ExmIgYM3d2lXLbeEJ5yEdnkqkKqgMzo0";	uForm=["https://docs.google.com/forms/d/e/1FAIpQLSdwtWUfqBV0xN769E3chfgRZG11ZrsLlxtuc-RvmYShBHGZCw/viewform?usp=pp_url&entry.931564315=","&entry.2065049728="];
lKey="1UlNNYBWAvzD3n8uCbHya5P3J0If1sOBS8sgi7ZG_4Qc";
qKey="1UlNNYBWAvzD3n8uCbHya5P3J0If1sOBS8sgi7ZG_4Qc";
iKey="1UlNNYBWAvzD3n8uCbHya5P3J0If1sOBS8sgi7ZG_4Qc";

race=["angel","demon","fae","vampire","werewolf"];
energy=["faith","ego","chyma","vitae","gnosis"];
eColor=["#fff3c8","#80f","0a1","#700","#e6f8f8"];
subrace=["sphere","domain","house","bloodline","clan"];

tasks=["Story","Combat","Practice","Craft"];

questCategories=["Health","Weapon Skills","Influence"];
quests=[];

teleportLocations=[];

itemIDs=[];
items=[];
itemsLoaded=0;
tutorialMode=0;

function getUser(x,y) {
	$.getJSON("https://spreadsheets.google.com/feeds/list/" + x + "/" + y + "/public/values?alt=json-in-script&callback=?",
	function (data) {
		$.each(data.feed.entry, function(i,entry) {
			if(entry.gsx$user.$t===u) {
				window["user"]=JSON.parse(entry.gsx$data.$t);
			}
		});
		if(window["user"]==null) {
			window["user"]={"race":"Human","health":"10|10"};
			tutorialMode=1;
		}
		if(tutorialMode==0) {
			if('tasks' in user&&user.tasks.length>0) {
				cats=user.tasks;
				for(var i=0;i<cats.length;i++) {
					questCategories.push(cats[i]);
				}
			}
			if('items' in user) {
				itIDs=user.items;
				for(var i=0;i<itIDs.length;i++) {
					itemIDs.push(itIDs[i].itemID);
				}
			}
			feed(f);
		}
		buildTitle();
		buildInventory();
		buildTaskBar();
		getLocation(lKey,"2");
		getItems(iKey,"4");
	});
}

function feed(f) {
	if(jQuery.type(f)==="string") {
		f=Number(f);
	}
	food=[0,10];
	if('race' in user && user.race!='Human') {
		food=user[energy[race.indexOf(user.race.toLowerCase())]].split("|");
	}
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
	if(user.race!='Human') {
		$('#title').append('<div class="box"><h2 class="right">' + user.race + '</h2><h2 class="right">' + user[subrace[race.indexOf(user.race.toLowerCase())]] + '</h2><h2 class="right">' + user.talent + '</h2></div>');
	} else {
		$('#title').append('<div class="box"><h2 class="right">' + user.race + '</h2><h2 class="right"></h2><h2 class="right"></h2></div>');
	}
}

function buildInventory() {
	$('#inventory').append('<div class="region held"><h1>Weapons</h1>' + equippedItem("mainHand") + equippedItem("offHand") + '</div><div class="region worn"><h1>Armor</h1>' + equippedItem("chest") + '</div><div class="region carried"><h1>Trinkets</h1>' + equippedItem("primary") + equippedItem("secondary") + '</div><div class="region inventory"><h1>Bags</h1>' + equippedItem("bags") + '</div><div class="toolTip"></div>');
	$('.item.equipped').hover(function() {
		thisItem=JSON.parse($(this).attr('name').replace(/\|/g,'"'));
		console.log(thisItem);
		$(this).parent().parent().find('.toolTip').addClass('show');
		$(this).parent().parent().find('.toolTip').addClass(thisItem.grade);
		
		
		
		$(this).parent().parent().find('.toolTip').html('<div class="inner"></div>');
		$(this).parent().parent().find('.toolTip').find('.inner').append('<div class="itemHeader"><div style="background-image:url(' + thisItem.icon + ');"></div><h1 class="' + thisItem.grade + '">' + thisItem.name + '</h1><h2>' + thisItem.bound + '</h2><h2>' + thisItem.equip + '</h2><h2>' + thisItem.slot + '</h2></div>');
		stats='';
		for(var i=0;i<thisItem.stats.length;i++) {
			stats=stats+'<h2>' + thisItem.stats[i] + '</h2>';
		}
		$(this).parent().parent().find('.toolTip').find('.inner').append('<div class="itemStats">' + stats + '</div>');
		
		
		if('description' in thisItem) {
			$(this).parent().parent().find('.toolTip').append('<span>' + thisItem.description + '</span>');
		}
		
		
		
		
		
	})
	$('.item.equipped').on('mouseleave',function() {
		$(this).parent().parent().find('.toolTip').removeClass('show');
		$(this).parent().parent().find('.toolTip').removeClass('reward');
	})
}

function equippedItem(x) {
	thisItem='';
	equipped='';
	grade='';
	itemID='';
	if('items' in user) {
		for(var i=0;i<user.items.length;i++) {
			if(user.items[i].equipped==x) {
				equipped=" equipped";
				itemID=user.items[i].itemID;
			}
		}
		if(itemsLoaded==0) {
			thisItem='<div class="item ' + x + equipped + grade + '" name="' + itemID + '"></div>';
		} else {
			found=0;
			for(var i=0;i<items.length&&found==0;i++) {
				if(items[i].itemID==x) {
					thisItem='<div class="item equipped ' + x + ' ' + items[i].grade + '" name="' + JSON.stringify(items[i]).replace(/\"/g,'|') + '" style="background-image:url(' + items[i].icon + ');"></div>';
					found=1;
				}
			}
		}
	} else {
		thisItem='<div class="item" name=""></div>';
	}
	return thisItem
}

function buildTaskBar() {
	$('#tasks').append('<div style="margin: auto;width: fit-content;"></div>');
	for(var i=0;i<tasks.length;i++) {
		$('#tasks').children('div').append('<button>' + tasks[i] + '</button>');
	}
	$('#tasks button').click(function() {
		buildModal($(this).text());
	})
}

function buildModal(x) {
	$('#modal').empty();
	if($('#modal').hasClass('open')) {
		$('#modal').removeClass();
	} else {
		$('#modal').addClass('open');
		$('#modal').addClass(x);
		$('#modal').append('<div class="modalHeader"><div class="modalCollapse"><div><div></div><div></div></div></div><h1>' + x + '</h1></div>');
		$('#modal').append('<div class="modalBody"></div>');
		for(var i=0;i<quests.length;i++) {
			if(quests[i].category==x&&'quests' in user) {
				myQuest={"level":"0","progress":"0"};
				for(var j=0;j<user.quests.length;j++) {
					if(user.quests[j].qID == quests[i].qID) {
						myQuest=user.quests[j];
					}
				}				
				$('.modalBody').append('<div class="questBox" style="background-image: url(' + quests[i].background + ')"><div class="questThings"><div><h2>' + quests[i].name + '</h2><h3>Level ' + myQuest.level + ' - ' + myQuest.progress + '%</h3><div class="cost">' + eval(quests[i].cost) + ' ' + (energy[race.indexOf(user.race.toLowerCase())].substring(0,1).toUpperCase() + energy[race.indexOf(user.race.toLowerCase())].substring(1)) + '</div><div class="time">' + eval(quests[i].time) + ' Minutes</div><div class="things">' + getRequirements(quests[i]) + '</div><div class="toolTip"></div></div><div class="midline"><div style="background-image: linear-gradient(to right,' + eColor[race.indexOf(user.race.toLowerCase())] + ' ' + myQuest.progress + '%,transparent ' + myQuest.progress + '%)"><span></span></div></div></div></div>');
			}
		}
		$('#modal .modalCollapse').click(function() {
			buildModal(x);
		})
		$('.things .item').hover(function() {
			thisItem=JSON.parse($(this).attr('name').replace(/\|/g,'"'));
			$(this).parent().parent().find('.toolTip').addClass('show');
			if($(this).hasClass('reward')) {
				$(this).parent().parent().find('.toolTip').addClass('reward');
			}
			$(this).parent().parent().find('.toolTip').html('<div style="background-image:url(' + thisItem.icon + ');"></div><span>' + thisItem.name + '</span>');
			if('description' in thisItem) {
				$(this).parent().parent().find('.toolTip').append('<span>' + thisItem.description + '</span>');
			}
		})
		$('.things .item').on('mouseleave',function() {
			$(this).parent().parent().find('.toolTip').removeClass('show');
			$(this).parent().parent().find('.toolTip').removeClass('reward');
		})
	}
}

function getRequirements(q) {
	its = "";
	if("required" in q) {
		reqs=q.required.split(";");
		for(var i=0;i<reqs.length;i++) {
			id=reqs[i].split("|");
			thisItem=JSON.parse('{"itemID":"' + id[0] + '","icon":"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Icon-round-Question_mark.svg/1024px-Icon-round-Question_mark.svg.png"}');
			for(var j=0;j<items.length;j++) {
				if(items[j].itemID==id[0]) {
					thisItem=items[j];
					its=its+'<div class="item" name="' + JSON.stringify(thisItem).replace(/\"/g,'|') + '" style="background-image:url(' + thisItem.icon + ');"></div>'
					if(Number(id[1])>0) {
						its=its+'<span>x' + id[1] + '</span>';
					}
				}
			}
		}
	}
	return its
}

function getRewards(q) {
	its = "";
	if("rewarded" in q) {
		rews=q.rewarded.split(";");
		for(var i=0;i<rews.length;i++) {
			id=rews[i].split("|");
			thisItem=items[items.indexOf(id[0])]
			its=its+'<div class="item" name="' + thisItem.itemID + '" style="background-image:url(' + thisItem.icon + ');"></div>'
			if(Number(id[1])>0) {
				its=its+'<span>x' + id[1] + '</span>';
			}
		}
	}
	return its
}

function getLocation(x,y) {
	window["loc"]=""
	$.getJSON("https://spreadsheets.google.com/feeds/list/" + x + "/" + y + "/public/values?alt=json-in-script&callback=?",
	function (data) {
		$.each(data.feed.entry, function(i,entry) {
			teleportLocations.push(JSON.parse(entry.gsx$data.$t));
			if(entry.gsx$loc.$t===l) {
				loc=JSON.parse(entry.gsx$data.$t);
			}
		});
		if(jQuery.type(loc.name)==="string") {
			cats=loc.questChains.split("|")
			for(var i=0;i<cats.length;i++) {
				questCategories.push(cats[i]);
			}
		}
		buildTravel();
		getQuests(qKey,"3");
	});
}

function buildTravel() {
	if(jQuery.type(loc.name)==="string") {
		$('#travel').prepend('<h1>' + loc.name + '</h1>');
	} else {
		$('#travel').prepend('<h1>No Man\'s Land</h1>');
	}
}

function getQuests(x,y) {
	$.getJSON("https://spreadsheets.google.com/feeds/list/" + x + "/" + y + "/public/values?alt=json-in-script&callback=?",
	function (data) {
		$.each(data.feed.entry, function(i,entry) {
			if(questCategories.indexOf(entry.gsx$category.$t)!=-1) {
				quests.push(JSON.parse(entry.gsx$data.$t));
			}
		});
		if(quests.length>0) {
			for(var i=0;i<quests.length;i++) {
				if('required' in quests[i]) {
					reqs=quests[i].required.split(";");
					for(var j=0;j<reqs.length;j++) {
						req=reqs[j].split("|");
						if(itemIDs.indexOf(req)==-1) {
							itemIDs.push(req[0]);
						}
					}
				}
				if('rewarded' in quests[i]) {
					rews=quests[i].rewarded.split(";");
					for(var j=0;j<rews.length;j++) {
						rew=rews[j].split("|");
						if(itemIDs.indexOf(rew)==-1) {
							itemIDs.push(rew[0]);
						}
					}
				}
			}
		}
	});
}

function getItems(x,y) {
	$.getJSON("https://spreadsheets.google.com/feeds/list/" + x + "/" + y + "/public/values?alt=json-in-script&callback=?",
	function (data) {
		$.each(data.feed.entry, function(i,entry) {
			items.push(JSON.parse(entry.gsx$data.$t));
		});
		itemsLoaded=1;
		scanItems();
		if(tutorialMode==1) {
			startTutorial();
		}
	});
}

function scanItems() {
	$('.item').each(function() {
		if($(this).attr('name').substring(0,1)!="{"&&$(this).attr('name').length!=0) {
			thisID=$(this).attr('name');
			thisObject='';
			found=0;
			for(var i=0;i<items.length&&found==0;i++) {
				if(items[i].itemID==thisID) {
					thisObject=items[i];
					found=1;
				}
			}
			$(this).attr('style','background-image:url(' + thisObject.icon + ')');
			$(this).attr('name',JSON.stringify(thisObject).replace(/\"/g,'|'));
			$(this).addClass(thisObject.grade);
		}
	})
}
