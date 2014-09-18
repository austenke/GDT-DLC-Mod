(function(){

	var askDLC = {
	    id: "F413351E-2234108-4967-A989-ADEED5",
	    isRandomEvent: false,
	    maxTriggers: 99999999999,
	    trigger: function (company) {
	    	a = GDT.getDataStore("DLC").data.rettts;
			if (a != 1 && company.isGameProgressBetween(.7, .9)) return true;
	    },
	    getNotification: function (company) {
	    	GDT.getDataStore("DLC").data.rettts = 1;
	        return new Notification({
            	sourceId: "F413351E-2234108-4967-A989-ADEED5",
            	header: "Release DLC",
            	text: "Your game is about to be released! Would you like to release DLC? It is a great way of making money, but it may piss off your fans if your game doesn't get good reviews".localize(),
            	options: ["Yes!", "No thanks"],
            	weeksUntilFired: 0
        	})
        },
	    complete: function (decision) {

	        if (decision === 0) {
	            Sound.click();
	            GameManager.resume(false);
	            var div = $("#DLCwindow");
	            div.scrollTop()
	            div.gdDialog({
	                popout: !0,
	                close: !0,
	                onClose: function () {
	                    GameManager.resume(true);
	                    return;
	                }
	            })
	            return;
	        }
	        if (decision === 1) {
	            return;
	        }
	    }
	};

	if (GDT.getDataStore("DLC").data.rettts === 1) var newStuff = true;

	var getCash = {
	    id: "F451E-2208-4967-AHDGTT989-ADEED5",
	    isRandomEvent: false,
	    maxTriggers: 99999999999,
	    trigger: function (company) {
	    	var a = GDT.getDataStore("DLC").data.rettts;
	    	var recentGame = GameManager.company.gameLog.last();
	    	var daWeek = GameManager.company.getDate(GameManager.company.currentWeek).month;
	    	var suWeek = GDT.getDataStore("DLC").data.daweek;
			if (daWeek == suWeek && !company.isGameProgressBetween(0, 1) && a == 1) return true;
	    },
	    getNotification: function (company) {
	    	var gName = GameManager.company.gameLog.last().title;
	    	var gScore = GameManager.company.gameLog.last().score;
	    	var uSold = GameManager.company.gameLog.last().unitsSold;
	    	var f = GDT.getDataStore("DLC").data.sellam;
	    	var moneyMade = f * uSold;
	    	GDT.getDataStore("DLC").data.rettts = 0;
	    	GameManager.company.adjustCash(moneyMade, "DLC Sales");
	    	var msg = "Your DLC has been released! ";
	    	if (gScore > 7) {
	    		msg = msg + gName + " got a good enough score and sold " + UI.getShortNumberString(uSold) + " copies, so you made $" + moneyMade + "!";
	    	} else {
	    		var currFans = GameManager.company.fans;
	    		var adjFans = Math.round(currFans / f);
	    		GameManager.company.adjustFans(-adjFans);
	    		msg = msg + "Your game didn't do so great, so releasing DLC just angered fans more. You made $" + moneyMade + " but lost "+ UI.getShortNumberString(adjFans) + " fans";
	    	}
	        return new Notification({
            	header: "Release DLC",
            	text: msg,
            	buttonText: "Sweet!",
            	weeksUntilFired: 0
        	})
	    }
	};

	GDT.addEvent(askDLC);
	GDT.addEvent(getCash);


//=============================================================================================================================================================
//=============================================================================================================================================================
//=============================================================================================================================================================
//=============================================================================================================================================================

         
    UI.SellShares = function (a) {
    	daWeek = GameManager.company.getDate(GameManager.company.currentWeek).month;
    	if (daWeek > 9) daWeek = 0;
    	GDT.getDataStore("DLC").data.daweek = daWeek + 3;
        Sound.click();
        switch (a.id) {
            case "dlc1":
            	GDT.getDataStore("DLC").data.sellam = 3;    	
                break;
            case "dlc2":
            	GDT.getDataStore("DLC").data.sellam = 5;
                break;
            case "dlc3":
            	GDT.getDataStore("DLC").data.sellam = 10;
                break;
            default:
                return;
        }
        div.dialog("close");
    };

    var div = $("body");
    div.append('<div id="DLCwindow" class="windowBorder wideWindow" style="overflow:auto;display:none;"> <div id="toDLC" class="windowTitle smallerWindowTitle">Release DLC</div>');
    div = $("#DLCwindow"); 
    div.append('<div style="text-align:center;margin-left:50px;width: 675px">What would you like to release as DLC? After your game is released, your DLC will sell based on how many people purchased the game. Watch out though, if your game doesn\'t do well or you release too much DLC, it could hurt your popularity.</div>');
    div.append('<div id="dlc1" class="selectorButton whiteButton" onclick="UI.SellShares(this)" style="margin-left:50px;width: 675px">Cool Character Textures | Sale Price: $3 | Risk: Low </div>');
    div.append('<div id="dlc2" class="selectorButton whiteButton" onclick="UI.SellShares(this)" style="margin-left:50px;width: 675px">New Items | Sale Price: $5 | Risk: Medium </div>');
    div.append('<div id="dlc3" class="selectorButton whiteButton" onclick="UI.SellShares(this)" style="margin-left:50px;width: 675px">New Maps and Levels | Sale Price: $10 | Risk: High </div>');

})();