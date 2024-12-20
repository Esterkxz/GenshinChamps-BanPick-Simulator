/*

MIT License

Copyright (c) 2023 Ester1 (에스터1z)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

     

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

//page established(loaded unique value)
let established = Date.now();

//end of array alias
let eoa = "reserved";
//end of object alias
let eoo = "reserved";


//key states
var onShift = false;
var onCtrl = false;
var onAlt = false;


//current locale selected
var loca = null;
var lang = null;

//state variables
var gameId = -1;
var step = -1;
var stepLast = 0;
var stepHistory = [];
//var stepHistoryPrev = null;
var redName = "";
var blueName = "";
// var redNamePrev = null;
// var blueNamePrev = null;

function buildStepHistory(seqReference, id = null, extra = buildStepHistoryExtra()) {
    return {
        stepReference: seqReference,
        picked: id == null ? null : (seqReference.pick.indexOf("weapon") > -1 ? weaponsInfo.list.find(item => item.id == id) : charactersInfo.list[charactersInfo[id]]),
        c_constellations: extra.c_constellations,
        additionalCost: extra.addCost,
        withBanCard: extra.banCard,
        isBanCardBan: extra.usingBanCard,
        isPassed: function() { return this.picked == null }
    };
}

function buildStepHistoryExtra(contell = 0, add = 0, usingBanCard = false, banCard) {
    return { c_constellations: contell, addCost: add, usingBanCard: usingBanCard, banCard: banCard };
}

function buildStepHistoryExtraForBanCard(banCard, usingBanCard = false) {
    return buildStepHistoryExtra(0, 0, usingBanCard, banCard);
}

function buildStepHistoryExtraForUsingBanCard() {
    return buildStepHistoryExtraForBanCard(null, true);
}

function saveLatestState() {
    if (step > 0) settingsMaster.putGlobalString(settingsMaster.TOTAL_STATE_LATEST, JSON.stringify(packTotalStateForStore()));
}

function packTotalStateForStore() {
    let store = {
        gId: gameId,
        league: parseInt(rulesMaster.ruleAlter.val()),
        stepHis: stepHistory,
        redInfo: packSideInfo("red"),
        blueInfo: packSideInfo("blue"),
        // previous: settingsMaster.getGlobalString(settingsMaster.TOTAL_STATE_PREVIOUS), //exceed storage
    }
    return store;
}

function packSideInfo(side) {
    let sm = sideMaster;
    let sideInfo = {
        name: null,
        uid: null,
        ap: null,
        code: sm.sideAccCode[side],
        constells: [],
        playerInfo: packPlayerInfo(side),
        record: [],
    }

    var inputs;
    var ir;
    switch (side) {
        case "red":
            sideInfo.name = redName;
            sideInfo.uid = sm.redPlayerUidInput.val();
            sideInfo.ap = sm.redAccountPointInput.val();
            inputs = sm.redEntries.find(sm.entry_constell);
            ir = sm.redInputRemains;
            break;

        case "blue":
            sideInfo.name = blueName;
            sideInfo.uid = sm.bluePlayerUidInput.val();
            sideInfo.ap = sm.blueAccountPointInput.val();
            inputs = sm.blueEntries.find(sm.entry_constell);
            ir = sm.blueInputRemains;
            break;
    }
    for (var i=0; i<inputs.length; i++) sideInfo.constells[i] = inputs[i].value;

    let vtr = sm.vsTimeRemains[side];
    for (var i=0; i<3; i++) {
        let j = i + 1;
        let min = ir.filter(".stage" + j + ".min").val();
        let sec = ir.filter(".stage" + j + ".sec").val();
        sideInfo.record[i] = { "min": min, "sec": sec, "tr": vtr[j] };
    }
    
    return sideInfo;
}

function packPlayerInfo(side) {
    let pim = playerInfoMaster;
    var code;
    let adds = {
        apc: "",
        ahw: "",
        apr: "",
        adr: "",
        ama: "",
    }
    switch (side) {
        case "red":
            code = pim.redInfoCode.val();
            adds.apc = pim.redAddPerConstell.val();
            adds.ahw = pim.redAddByHadWeapon.val();
            adds.apr = pim.redAddPerRefine.val();
            adds.adr = pim.redAddDisadvRatio.val();
            adds.ama = pim.redAddMasterAdjust.val();
            break;

        case "blue":
            code = pim.blueInfoCode.val();
            adds.apc = pim.blueAddPerConstell.val();
            adds.ahw = pim.blueAddByHadWeapon.val();
            adds.apr = pim.blueAddPerRefine.val();
            adds.adr = pim.blueAddDisadvRatio.val();
            adds.ama = pim.blueAddMasterAdjust.val();
            break;
    }

    let constells = [];
    let weapons = [];
    let refines = [];

    let cons = pim.charConstells[side];
    for (var i=0; i<cons.length; i++) constells[i] = cons[i].value;
    let weps = pim.weaponNames[side];
    for (var i=0; i<weps.length; i++) weapons[i] = weps[i].value;
    let refs = pim.weaponRefines[side];
    for (var i=0; i<cons.length; i++) refines[i] = refs[i].value;

    return { code: code, data: pim.playerAccInfo[side], constells: constells, weapons: weapons, refines: refines, adds: adds };
}

//common static values
let tpGif = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
let urlTpGif = "url('" + tpGif + "')";

//common functions
function setAutoLink(text) {
    var regURL = new RegExp("(http://|https://|ftp://|telnet://|news://|irc://|www.)([-/.a-zA-Z0-9_~@#%$?&=:;200-377()]+)","gi");
    var regEmail = new RegExp("([xA1-xFEa-z0-9_-]+@[xA1-xFEa-z0-9-]+\.[a-z0-9-][.a-z0-9-]+)","gi");

    return text.replace(regEmail,'<a href="mailto:$1">$1</a>').replace(regURL,'<a href="$1$2" target="_blank" rel="noopener noreferrer">$1$2</a>');
}


//external sourced
function checkInView(container, element, partial) {

    //Get container properties
    let cTop = container.scrollTop;
    let cBottom = cTop + container.clientHeight;

    //Get element properties
    let eTop = element.offsetTop;
    let eBottom = eTop + element.clientHeight;

    //Check if in view    
    let isTotal = (eTop >= cTop && eBottom <= cBottom);
    let isPartial = partial && (
      (eTop < cTop && eBottom > cTop) ||
      (eBottom > cBottom && eTop < cBottom)
    );

    //Return outcome
    return  (isTotal  || isPartial);
}


//---
//section objects//
//--


//center top sequence indicator section
let sequenceMaster = {

    hide: "data-hide",
    shift: "data-shift",

    side: "data-side",
    target: "data-target",
    pick: "data-pick",
    amount: "data-amount",
    current: "data-current",

    sequence_block: "div#sequence_block",
    sequence_milestone: "div#sequence_milestone",
    sequence_steps: "ul#sequence_steps",
    sequence_item: "li.sequence_item",


    sequence_title: "div#sequence_title",


    main_action: "button#main_action",


    sequenceBlock: null,
    sequenceMilestone: null,
    stepHolder: null,

    sequenceTitleHolder: null,
    sequenceTitle: null,


    mainButton: null,


    checkRes: null,

    rollingRandomPicks: null,

    lastPickedTime: null,


    cardyBans: { side: null, aban: 0, jban: 0 },


    pickingPlayerProfile: { "red": false, "blue": false },
    pickedPlayerProfile: { "red": null, "blue": null },
    selectedPlayerProfile: { "red": null, "blue": null },

    init: function() {
        console.log("init sequenceMaster");

        //set element
        this.sequenceBlock = $(this.sequence_block);
        this.sequenceMilestone = this.sequenceBlock.find(this.sequence_milestone);
        this.stepHolder = this.sequenceMilestone.find(this.sequence_steps);

        this.sequenceTitleHolder = $(this.sequence_title);
        this.sequenceTitle = this.sequenceTitleHolder.find("span");

        this.mainButton = $(this.main_action);

        //initialize
        this.initStepSequences();

        this.setSequenceTitle("Intializing");
    },

    initStepSequences: function() {
        let self = sequenceMaster;
        this.stepHolder.empty()
        stepLast = 0;
        rules.sequence.forEach(info => {
            if (info == eoa) {
                rules.sequence.pop();
                return;
            }
            let item = self.buildStepItem(info);
            self.stepHolder.append(item);
            stepLast += info.amount;
        });
    },

    buildStepItem: function(info) {
        let item = document.createElement("li");
        let isStarted = step > -1;
        let isAdditBan = info.pick == "aban";
        let isJokerBan = info.pick == "jban";
        let isCardyBan = isAdditBan || isJokerBan;
        let isOnSideCardyRule = this.cardyBans.side != null;
        let side = isCardyBan && isOnSideCardyRule ? this.cardyBans.side : info.side;

        item.setAttribute("class", "sequence_item");
        item.setAttribute(this.side, side != null ? (side == "red" ? "R" : "B") : side);
        item.setAttribute(this.target, info.pick.indexOf("weapon") > -1 ? "W" : "C");
        item.setAttribute(this.pick, info.pick.indexOf("preban") > -1 ? "PreB" : (isAdditBan ? "AB" : (isJokerBan ? "JB" : (info.pick.indexOf("ban") > -1 ? "B" : (info.pick.indexOf("entry") > -1 ? "E" : "P")))));
        item.setAttribute(this.amount, isAdditBan ? this.cardyBans.aban : (isJokerBan ? this.cardyBans.jban : info.amount));
        item.setAttribute(this.current, "");
        item.appendChild(document.createElement("hr"));
        item.appendChild(document.createElement("span"));

        return item;
    },

    resetSequenceIndicator: function() {
        this.stepHolder.find(this.sequence_item).each(function (i, item) {
            sequenceMaster.setIndicatorItem(item);
        });
    },

    updateSequenceIndicators: function(si) {
        this.stepHolder.find(this.sequence_item).each(function(i, item) {
            sequenceMaster.setIndicatorItem(item, i < si ? "2" : (i > si ? "" : "1"));
        });
    },

    setIndicatorItem: function(item, current = "") {
        item = $(item);
        item.attr(this.current, current);
    },

    setSequenceTitle: function(content, timeout) {
        if (content == this.sequenceTitle.html()) return; 
        this.replaceSequenceTitle(content);
        if (timeout != null) setTimeout(function() { sequenceMaster.setSequenceTitleByCurrent(); }, timeout);
    },

    setSequenceTitleHtml: function(content, timeout) {
        if (content == this.sequenceTitle.html()) return; 
        this.replaceSequenceTitle(content, true);
        if (timeout != null) setTimeout(function() { sequenceMaster.setSequenceTitleByCurrent(); }, timeout);
    },

    replaceSequenceTitle: function(content, isHtml = false) {
        this.sequenceTitleHolder.fadeOut(300, function() {
            let title = sequenceMaster.sequenceTitle;

            if (isHtml) title.html(content);
            else title.text(content);

            sequenceMaster.sequenceTitleHolder.fadeIn(700);
        });
    },

    setSequenceTitleByCurrent: function(newStep = step) {
        let text = lang.text;
        if (newStep == -2) {
            this.setSequenceTitle("Edit global ban entries");
        } else {
            let seq = rules.sequence[newStep];
            let checkRes = this.getCheckRes();
            let isBanCardUsingPhase = checkRes != null ? (checkRes.banCardRem > 0) : false;
            let isBanCardLeftsNotUsed = isBanCardUsingPhase && checkRes.rem < 1;

            var message = "";

            if (newStep < 0) {
                message = text.titleReady;
            } else if (newStep == rules.sequence.length) {
                message = text.titlePicked;
            } else if (newStep > rules.sequence.length) {
                message = text.titleVersus;
            } else {
                let side = seq.side == null ? this.cardyBans.side : (seq.side == "red" ? "red" : (seq.side == "blue" ? "blue" : "?"))
                let eClass = side == "red" ? "textRed" : "textBlue";
                let tSide = side == "red" ? redName : blueName;
                var tType = "?";
                if (isBanCardLeftsNotUsed) tType = text.pickUseBanCard;
                else switch (seq.pick) {
                    case "preban":
                        tType = text.pickPreban;
                        break;
                    case "aban":
                        tType = text.pickAdditionalBan;
                        break;
                    case "jban":
                        tType = text.pickJokerBan;
                        break;
                    case "ban":
                        tType = text.pickBan;
                        break;
                    case "entry":
                        tType = text.pickEntry;
                        break;
                    case "proffer":
                        tType = text.pickProffer;
                        break;
                    case "ban weapon":
                        tType = text.pickBanWeapon;
                        break;
                }
                var tAmount = "?";
                switch (seq.pick) {
                    case "preban":
                    case "ban":
                    case "entry":
                    case "proffer":
                        if (isBanCardLeftsNotUsed) tAmount = text.amountPickCharacter.replace("#AMOUNT", "" + checkRes.res[seq.side == "red" ?  "bccstr" : "bccstb"]);
                        else if (seq.amount < 1) tAmount = text.amountFillCharacter
                        else tAmount = text.amountPickCharacter.replace("#AMOUNT", seq.amount)
                        break;
                    case "aban":
                        tAmount = text.amountPickCharacter.replace("#AMOUNT", this.cardyBans.aban);
                        break;
                    case "jban":
                        tAmount = text.amountPickCharacter.replace("#AMOUNT", this.cardyBans.jban);
                        break;
                    case "ban weapon":
                        tAmount = text.amountPick.replace("#AMOUNT", seq.amount)
                        break;
                }
                message = text.stepTitle.replace("#CLASS", eClass).replace("#SIDE", tSide).replace("#TYPE", tType).replace("#AMOUNT", tAmount);
            }

            this.setSequenceTitleHtml(message);
        }
    },

    releaseStepStateDisplay: function() {
        let seq = rules.sequence[step];
        if (seq != null && ((seq.pick == "aban" && this.cardyBans.aban == 0) || (seq.pick == "jban" && this.cardyBans.jban == 0))) {
            this.shiftStep();
            this.releaseStepStateDisplay();
        } else if (seq != null && seq.amount == "0" && seq.pick == "entry" && this.checkUpdateCurrentStepComplition()) {
            this.releaseStepStateDisplay();
        } else {
            this.releaseActionStateByStep();
            this.updateSequenceIndicators(step);
            this.setSequenceTitleByCurrent(step);
            sideMaster.updatePickCursor(step);
            if (step >= rules.sequence.length && searchMaster.searchInput.is(":focus")) searchMaster.searchInput.blur();
        }
    },

    releaseActionStateByStep: function() {
        if (step > -1) {
            rulesMaster.blockAlterSelector();
            localeMaster.blockLanguageSelector();
            if (step >= rules.sequence.length) {
                controllerMaster.hideRandomButton();
            } else {
                controllerMaster.showRandomButton();
            }
            controllerMaster.globalBanPickerButton.hide();
        } else {
            rulesMaster.releaseAlterSelector();
            localeMaster.releaseLanguageSelector();
            controllerMaster.hideRandomButton();
            controllerMaster.globalBanPickerButton.show();
        }
        this.releaseMainButton(step);
        checkOnChangedSide();
    },

    startPick: function() {
        step = 0;

        //if (rules.rule_type == "cardy") this.calcCardyPreBans();
        
        redName = sideMaster.redNameplateInput.val();
        blueName = sideMaster.blueNameplateInput.val();

        playSound("힇");

        this.releaseStepStateDisplay();
        onChangedStep();
    },
    
    onPick: function(id, item, usingBanCard = false) {
        this.lastPickedTime = Date.now();

        if (this.pickingPlayerProfile.red) {
            let pcid = this.pickedPlayerProfile.red;
            this.selectedPlayerProfile.red = pcid;
            playerInfoMaster.finishPlayerProfile("red", pcid);
            if (pcid != null) this.pickingPlayerProfile.red = false;
            return;
        }
        if (this.pickingPlayerProfile.blue) {
            let pcid = this.pickedPlayerProfile.blue;
            this.selectedPlayerProfile.blue = pcid;
            playerInfoMaster.finishPlayerProfile("blue", pcid);
            if (pcid != null) this.pickingPlayerProfile.blue = false;
            return;
        }
        if (step == -2) {
            globalBanMaster.onPicked(id);
            return;
        } else if (step < 0) {
            this.setSequenceTitle(lang.text.readyForStart, 3000);
            return;
        } else if (step == rules.sequence.length) {
            this.setSequenceTitle(lang.text.readyForVersus, 3000);
            return;
        }
        let seq = rules.sequence[step];
        let isBan = seq.pick.indexOf("ban") > -1;
        let pickedSide = item.attr(poolMaster.pick_side);
        let pickedType = item.attr(poolMaster.pick_type);
        let profferBan = item.attr(poolMaster.proffer_ban);
        if (item != null &&
            item.attr(poolMaster.banned) != "" &&
            !(step > -1 && (isBan && pickedSide != seq.side) || ((pickedType != "ban" || pickedSide != "both") &&
            profferBan != "" &&
            seq.side != profferBan &&
            !isBan))) return;

        let isCharacterPick = seq.pick.indexOf("weapon") < 0;
        let isProfferPick = seq.pick == "proffer";
        let side = seq.side != null ? seq.side : this.cardyBans.side;
        let counterSide = side == "red" ? "blue" : "red";
        let pickingSide = isProfferPick ? counterSide : side;
        let pickingCounter = isProfferPick ? side : counterSide;
        let entryNo = sideMaster.entryPicked[pickingSide].length;
        let isTreveler = id == "treveler";
        var treveler = null;
        var banCard = false;

        if (isCharacterPick) {//캐릭터 픽
            //if (item.weapon == null) return;
            if (id.indexOf("_") > -1) return;

            if (rules.rule_type == "cardy" && !isBan) {
                let info = playerInfoMaster.playerAccInfo[side];
                if (info != null && info.selfbanned != null) {
                    if (info.selfbanned.indexOf(id) > -1) {
                        this.setSequenceTitle(lang.text.alertPlayerSelfBannedCharacter, 5000);
                        return;
                    }
                }
            }

            let isAlreadyPicked = item.attr(poolMaster.picked + "-" + pickingSide) == "1";
            let isBanPicked = pickedType == "ban";
            if (isBan) {
                if (isBanPicked && pickedSide != pickingCounter) return;
            } else {
                if (isBanPicked) {
                    if (pickedSide == "both" || profferBan == pickingSide) return;
                } else if (isAlreadyPicked) return;
            }

            treveler = item.attr(poolMaster.treveler);
            if (isTreveler && treveler == "1") id += "M";
            if (rules.rule_type == "ban card") banCard = rules.ban_card_accure[id];
        } else {//무기 픽
            //if (item.serise == null) return;
            if (id.indexOf("_") < 0) return;
        }

        playSound("픽", 0);

        let res = this.issueCheckRes();
        if (!usingBanCard && res.rem == 0 && res.banCardRem > 0) usingBanCard = true;

        var extra = buildStepHistoryExtra();

        //구현 - 현재 step에 따른 entry pick / ban pick 구분 처리
        var pickNote;
        switch(seq.pick) {
            case "preban":
            case "ban":
                sideMaster.onPickedBan(id);
                pickNote = lang.text.pickedBan;
                break;

            case "aban":
                sideMaster.onPickedCardyBan(id);
                pickNote = lang.text.pickedABan;
                break;
            case "jban":
                sideMaster.onPickedCardyBan(id);
                pickNote = lang.text.pickedJBan;
                break;
        
            case "entry":
            case "proffer":
                if (usingBanCard) {
                    extra = sideMaster.onPickedBanCardBan(id, pickingSide);
                    pickNote = "[" + lang.text.pickedBan + "]";
                } else {
                    extra = sideMaster.onPickedEntry(id, pickingSide);
                    pickNote = lang.text.pickedEntry;
                }
                break;

            case "ban weapon":
                sideMaster.onPickedBanWeapon(id);
                break;

        }
        

        //update pick pool
        if (isCharacterPick) {
            let pickedSide = item.attr(poolMaster.pick_side);
            if (isTreveler) item = poolMaster.eachCharacters.filter('[' + poolMaster.id + '="treveler"]');
            item.attr(poolMaster.pick_side, pickedSide != "" && pickedSide != pickingSide ? "both" : pickingSide);
            item.attr(poolMaster.picked, "1");
            if (seq.pick == "ban" || seq.pick == "aban" || seq.pick == "jban" || seq.pick == "preban" || usingBanCard) {
                item.attr(poolMaster.pick_type, "ban");
                if (seq.pick == "jban") item.attr(poolMaster.proffer_ban, counterSide);
                item.attr(poolMaster.banned, "1");
                item.attr(poolMaster.banned_by_card, usingBanCard ? "1" : "");
                item.attr(poolMaster.pick_note, pickNote);
            } else switch (pickingSide) {
                case "red":
                    item.attr(poolMaster.picked_red, "1");
                    break;
                    
                case "blue":
                    item.attr(poolMaster.picked_blue, "1");
                    break;
            }
            setTimeout(function() {
                item.attr(poolMaster.picked, "2");
            }, 600);
            
            if (isTreveler) item.filter('[' + poolMaster.treveler + '="' + (treveler == "1" ? "0" : "1") + '"]').attr(poolMaster.picked, "2");
        }
        
        //add step history
        stepHistory.push(buildStepHistory(seq, id, extra));

        //코스트 표시 업데이트
        if (isCharacterPick) sideMaster.updateCostUsed();

        //update pincking sequence
        this.checkUpdateCurrentStepComplition()
        this.releaseStepStateDisplay();

        //update player info char entry
        if (isCharacterPick) playerInfoMaster.releaseCharPick(pickingSide, entryNo);
    },

    passPick: function() {
        stepHistory.push(buildStepHistory(rules.sequence[step]))
        this.shiftStep();
        this.releaseStepStateDisplay();
    },

    undoPick: function() {
        let seq = rules.sequence[step];
        let last = stepHistory.pop();

        if (last == null) {
            this.shiftStep(false);
            this.releaseStepStateDisplay();
            return;
        }

        //process roll back
        if (last.isPassed()) {
            this.shiftStep(false);
        } else {
            let picked = last.picked;
            let ref = last.stepReference;
            let prev = stepHistory[stepHistory.length-1];
            let isCharacterPick = ref.pick.indexOf("weapon") < 0;
            let isProfferPick = ref.pick == "proffer";
            let side = ref.side != null ? ref.side : this.cardyBans.side;
            let counterSide = side == "red" ? "blue" : "red";
            let pickingSide = isProfferPick ? counterSide : side;
        
            if (ref != seq) this.shiftStep(false);


            //변경사항 출력 되돌리기 구현

            //픽/밴 엔트리 캐릭터 검색 복원 구현
            switch (ref.pick) {
                case "preban":
                case "ban":
                    sideMaster.onUndoPickBan(picked.id, pickingSide);
                    break;

                case "aban":
                case "jban":
                    sideMaster.onUndoPickCardyBan(picked.id, ref.pick, pickingSide);
                    break;

                case "entry":
                case "proffer":
                    if (last.isBanCardBan) sideMaster.onUndoBanCardBan(picked.id, pickingSide);
                    else sideMaster.onUndoPickEntry(picked.id, pickingSide);
                    break;
                    
                case "ban weapon":
                    sideMaster.onUndoPickBanWeapon(picked.id, pickingSide);
                    break;
            }

            //코스트 테이블 캐릭터 검색 복원
            if (isCharacterPick) {
                let item = poolMaster.eachCharacters.filter('[' + poolMaster.id  + '="' + picked.id + '"]');
                if (ref.pick == "ban" || ref.pick == "aban" || ref.pick == "jban" || ref.pick == "preban" || (last.isBanCardBan)) {
                    if (item.attr(poolMaster.pick_side) == "both") {
                        item.attr(poolMaster.pick_side, counterSide);
                        if (item.attr(poolMaster.proffer_ban) != "") item.attr(poolMaster.pick_note, lang.text.pickedJBan);
                    } else {
                        item.attr(poolMaster.banned, "");
                        item.attr(poolMaster.banned_by_card, "");
                        item.attr(poolMaster.pick_side, "");
                        item.attr(poolMaster.pick_type, "");
                        if (ref.pick == "jban") item.attr(poolMaster.proffer_ban, "");
                        item.attr(poolMaster.pick_note, null);
                    }
                } else switch (pickingSide) {
                    case "red":
                        item.attr(poolMaster.picked_red, "");
                        break;
                        
                    case "blue":
                        item.attr(poolMaster.picked_blue, "");
                        break;
                }
                if (item.attr(poolMaster.banned) == "" && item.attr(poolMaster.picked_red) == "" && item.attr(poolMaster.picked_blue) == "") {
                    item.attr(poolMaster.picked, "");
                }

                //update player info char entry
                let entryNo = sideMaster.entryPicked[pickingSide].length;
                playerInfoMaster.releaseCharPick(pickingSide, entryNo);
            }
        }

        //update cost used
        sideMaster.updateCostUsed();
        
        //update pincking sequence
        this.checkUpdateCurrentStepComplition()
        this.releaseStepStateDisplay();
    },

    finishPick: function() {
        this.shiftStep();
        this.setSequenceTitle(lang.text.titleVersus);
        this.releaseActionStateByStep();

        let nameRed = playerInfoMaster.redInfoName.val();
        if (nameRed != "") redName = nameRed;
        let nameBlue = playerInfoMaster.blueInfoName.val();
        if (nameBlue != "") blueName = nameBlue;

        //VERSUS 시퀀스 구현
        //playSound("훻");


        timerMaster.pauseTimer();
        playerInfoMaster.hidePlayerInfoLayer();
        versionDisplayShowFor();
        $("#league_title").attr("data-hide", "");

        if (controllerMaster.mainActionButton.is(":focus")) controllerMaster.mainActionButton.blur();

        $(":focus").blur();
        setTimeout(function() { hideCursorWholeScreen(); }, 800);

        this.sequenceTitleHolder.attr(this.shift, "2");
        this.sequenceBlock.attr(this.hide, "1");
        poolMaster.poolBlock.attr(this.hide, "1");
        poolMaster.unavailables.attr(this.hide, "1");
        controllerMaster.mainController.attr(this.hide, "1");
        sideMaster.cardyExtensionBehind.attr(this.hide, "1");
        sideMaster.eachPlayerBoard.attr(this.hide, "1");
        sideMaster.banPickBoard.attr(this.hide, "1");
        timerMaster.timerGauges.attr(this.hide, "1");
        timerMaster.timerHost.attr(this.hide, "1");
        timerMaster.timerRelay.attr(this.hide, "1");
        this.prefetchVersusEntries();
        $("div#bg_video_area").attr("data-show", "1");
        let curStep = step;
        let video = $("video#spiral_enterence")[0];
        setTimeout(function() {
            if (step == curStep) {
                if (video != null) video.play();
                setTimeout(function() {
                    if (step == curStep) {
                        $("div#bg_versus").attr("data-show", "1");
                        $("div#bg_video_area").attr("data-show", "2");
                        poolMaster.poolBlock.attr(sequenceMaster.hide, "2");
                        sideMaster.eachPlayerBoard.attr(sequenceMaster.hide, "2");

                        setTimeout(function() {
                            if (step == curStep) {
                                if (rules.show_side_area_on_versus === true) screenMaster.showSideArea();
                                let entrySide = $("div#versus_entry_area div.versus_entry_side");
                                let redEntries = entrySide.filter(".red").find("div.versus_entry");
                                let blueEntries = entrySide.filter(".blue").find("div.versus_entry");

                                for (var i=0; i <= redEntries.length; i++) {
                                    let prev = i - 1;
                                    let prevEntry = prev < 0 ? null : redEntries[prev];
                                    let entry = redEntries[i];
                                    if (entry != null || prevEntry != null) {
                                        setTimeout(function() {
                                            if (prevEntry != null) $(prevEntry).attr("data-show", "2");
                                            if (entry != null) $(entry).attr("data-show", "1");
                                        }, 200 * i);
                                    }
                                }
                                for (var i=0; i <= blueEntries.length; i++) {
                                    let prev = i - 1;
                                    let prevEntry = prev < 0 ? null : blueEntries[prev];
                                    let entry = blueEntries[i];
                                    if (entry != null || prevEntry != null) {
                                        setTimeout(function() {
                                            if (prevEntry != null) $(prevEntry).attr("data-show", "2");
                                            if (entry != null) $(entry).attr("data-show", "1");
                                        }, 200 * i);
                                    }
                                }

                                setTimeout(function() {
                                    if (step == curStep) {
                                        for (var i=redEntries.length-1; i > -1; i--) {
                                            let entry = redEntries[i];
                                            if (redEntries != null) {
                                                setTimeout(function() { $(entry).attr("data-show", "3"); }, 200 * i);
                                            }
                                        }
                                        for (var i=blueEntries.length-1; i > -1; i--) {
                                            let entry = blueEntries[i];
                                            if (redEntries != null) {
                                                setTimeout(function() { $(entry).attr("data-show", "3"); }, 200 * i);
                                            }
                                        }

                                        setTimeout(function() { if (step == curStep) sequenceMaster.beginGameRecord(); }, 3200);
                                    }
                                }, 2000);
                            }
                        }, 800);
                    }
                }, 3000);
            }
        }, 200);
    },

    undoFinishPick: function() {
        this.shiftStep(rules.sequence.length);
        this.setSequenceTitleByCurrent(step);
        this.releaseActionStateByStep();
        
        versionDisplayShowFor(false);
        $("#league_title").attr("data-hide", "1");

        timerMaster.resumeTimer();

        this.closeVersusSequenceShowing();
    },

    closeVersusSequenceShowing: function() {
        this.sequenceTitleHolder.attr(this.shift, "");
        this.sequenceBlock.attr(this.hide, "");
        poolMaster.poolBlock.attr(this.hide, "");
        poolMaster.unavailables.attr(this.hide, "");
        playerInfoMaster.checkBackShowingPlayerInfoLayer();
        controllerMaster.mainController.attr(this.hide, "");
        sideMaster.cardyExtensionBehind.attr(this.hide, "");
        sideMaster.eachPlayerBoard.attr(this.hide, "");
        sideMaster.banPickBoard.attr(this.hide, "");
        timerMaster.timerGauges.attr(this.hide, "");
        timerMaster.timerHost.attr(this.hide, "");
        timerMaster.timerRelay.attr(this.hide, "");
        $("div#bg_video_area").attr("data-show", "");
        $("div#bg_versus").attr("data-show", "");
        let video = $("video#spiral_enterence")[0];
        if (video != null) {
            video.pause();
            video.currentTime = 0;
        }
        let entrySide = $("div#versus_entry_area div.versus_entry_side");
        let redEntries = entrySide.filter(".red").find("div.versus_entry").attr("data-show", "0");
        let blueEntries = entrySide.filter(".blue").find("div.versus_entry").attr("data-show", "0");

        sideMaster.hideVersusRecordBoard();
    },

    prefetchVersusEntries: function() {
        let entrySide = $("div#versus_entry_area div.versus_entry_side");
        entrySide.empty();
        let redEntrySide = entrySide.filter(".red");
        let blueEntrySide = entrySide.filter(".blue");
        let reds = sideMaster.entryPicked["red"];
        let blues = sideMaster.entryPicked["blue"];
        for (var i=0; i < reds.length; i++) redEntrySide.append(this.buildVersusEntry(reds[i], "red"));
        for (var i=0; i < blues.length; i++) blueEntrySide.append(this.buildVersusEntry(blues[i], "blue"));

        // let redEntries = redEntrySide.find("div.versus_entry");
        // let blueEntries = blueEntrySide.find("div.versus_entry");
    },

    buildVersusEntry: function(info, side) {
        if (info == null) return;
        let entry = document.createElement("div");
        entry.setAttribute("class", "versus_entry");
        entry.setAttribute("data-show", "0");
        entry.setAttribute("data-rarity", info.rarity);
        var src = "--src: url('" + getPath("images", "character_back", info.res_back) + "'); --facial-center: " + info.res_back_meta_pos.facialCenter + "; ";
        entry.setAttribute("style", src);
        let bg = document.createElement("div");
        bg.setAttribute("class", "bg_disc");
        entry.append(bg);
        let char = document.createElement("div");
        char.setAttribute("class", "character");
        entry.append(char);
        let element = document.createElement("img");
        element.setAttribute("class", "element_icon");
        let charElement = commonInfo.element.res_icon[info.element];
        element.setAttribute("src", charElement == null ? tpGif : getPathR("images", "element_icon", charElement));
        entry.append(element);

        let pim = playerInfoMaster;
        let se = pim.selectionEntries[side];
        var sel = null;
        for (var i in se) if ($(se[i]).attr(pim.char) == info.id) {
            sel = $(se[i]);
            break;
        }

        if (sel != null) {
            let charId = sel.attr(pim.char);
            let weaponId = sel.attr(pim.weapon);
            let weapon = weaponsInfo.list.find((item) => item.id == weaponId);

            let charInfo = document.createElement("div");
            charInfo.setAttribute("class", "character_info");
            if (info.rarity != "5" || info.id == "treveler") charInfo.setAttribute("data-fourstars", "1");
            let charConstell = document.createElement("span");
            charConstell.setAttribute("class", "character_constell");
            charConstell.innerHTML = sel.find(pim.char_constell).val();
            charInfo.append(charConstell);
            entry.append(charInfo)

            let weaponAlloc = document.createElement("div");
            weaponAlloc.setAttribute("class", "weapon_allocated");
            weaponAlloc.setAttribute("style", "--src: url('" + (weaponId == null || weaponId == "" || weapon == null ? tpGif : getPath("images", "weapon_vcut", weapon.res_vcut) + "'); "));
            entry.append(weaponAlloc);

            let weaponInfo = document.createElement("div");
            weaponInfo.setAttribute("class", "weapon_info");
            let weaponName = document.createElement("span");
            weaponName.setAttribute("class", "weapon_name");
            weaponName.innerHTML = sel.find(pim.weapon_name).val();
            weaponInfo.append(weaponName);
            let weaponRefine = document.createElement("span");
            weaponRefine.setAttribute("class", "weapon_refine");
            let refine = sel.find(pim.weapon_refine).val();
            weaponRefine.innerHTML = refine == "" ? "&nbsp;" : refine;
            weaponInfo.append(weaponRefine);
            entry.append(weaponInfo);
        }

        return entry;
    },

    beginGameRecord: function() {
        let entries = $("div#versus_entry_area div.versus_entry_side div.versus_entry");
        entries.attr("data-show", "3");

        sideMaster.showVersusRecordBoard();
    },

    undoBeginGameRecord: function() {
        sideMaster.hideVersusRecordBoard();
        this.undoFinishPick();
    },

    shiftStep: function(alt = true) {
        if (alt == null || typeof alt == "string" || typeof alt == "object" || !(typeof alt == "boolean" || Number.isInteger(alt))) return;
        latestStep = step;
        if (alt === true) step++;
        else if (alt === false) step--;
        else step = alt;
        onChangedStep();
    },

    checkUpdateCurrentStepComplition: function() {
        if (step < 0 || step >= rules.sequence.length) return;
        let res = this.issueCheckRes();

        if (res.rem == 0 && res.banCardRem == 0) {
            this.shiftStep();
            return true;
        } else return false;
    },

    getCheckRes: function() {
        return this.checkRes == null || this.checkRes.step != step ? this.issueCheckRes() : this.checkRes;
    },

    issueCheckRes: function() {
        let res = this.checkCurrentStepComplition();
        this.checkRes = res;
        return res;
    },

    checkCurrentStepComplition: function() {
        if (step < 0 || step >= rules.sequence.length) return;
        let seq = rules.sequence[step];
        let side = seq.side == null ? this.cardyBans.side : seq.side;
        let res = this.checkHistoryProcessed();

        var rem;
        var banCardRem = 0;
        switch (side) {
            case "red":
                switch (seq.pick) {
                    case "preban":
                    case "ban":
                        rem = res.rbx;
                        for (var i in res.rb) {
                            if (res.rb[i].isPassed()) { if (settings.useEmptyPick) rem--; }
                            else rem--;
                        }
                        break;

                    case "aban":
                        rem = res.rabx;
                        for (var i in res.rab) {
                            if (res.rab[i].isPassed()) { if (settings.useEmptyPick) rem--; }
                            else rem--;
                        }
                        break;
                    case "jban":
                        rem = res.rjbx;
                        for (var i in res.rjb) {
                            if (res.rjb[i].isPassed()) { if (settings.useEmptyPick) rem--; }
                            else rem--;
                        }
                        break;

                    case "entry":
                        rem = res.rpx;
                        for (var i in res.rp) {
                            if (res.rp[i].isPassed()) { if (settings.useEmptyPick) rem--; }
                            else rem--;
                        }
                        banCardRem = res.bccstr - res.bccsur;
                        break;

                    case "proffer":
                        rem = res.bpx;
                        for (var i in res.bp) {
                            if (res.bp[i].isPassed()) { if (settings.useEmptyPick) rem--; }
                            else rem--;
                        }
                        break;
                        
                    case "ban weapon":
                        rem = res.rbwx;
                        for (var i in res.rbw) {
                            if (res.rbw[i].isPassed()) { if (settings.useEmptyPick) rem--; }
                            else rem--;
                        }
                        break;
                }
                break;

            case "blue":
                switch (seq.pick) {
                    case "preban":
                    case "ban":
                        rem = res.bbx;
                        for (var i in res.bb) {
                            if (res.bb[i].isPassed()) { if (settings.useEmptyPick) rem--; }
                            else rem--;
                        }
                        break;

                    case "aban":
                        rem = res.babx;
                        for (var i in res.bab) {
                            if (res.bab[i].isPassed()) { if (settings.useEmptyPick) rem--; }
                            else rem--;
                        }
                        break;
                    case "jban":
                        rem = res.bjbx;
                        for (var i in res.bjb) {
                            if (res.bjb[i].isPassed()) { if (settings.useEmptyPick) rem--; }
                            else rem--;
                        }
                        break;

                    case "entry":
                        rem = res.bpx;
                        for (var i in res.bp) {
                            if (res.bp[i].isPassed()) { if (settings.useEmptyPick) rem--; }
                            else rem--;
                        }
                        banCardRem = res.bccstb - res.bccsub;
                        break;

                    case "proffer":
                        rem = res.rpx;
                        for (var i in res.rp) {
                            if (res.rp[i].isPassed()) { if (settings.useEmptyPick) rem--; }
                            else rem--;
                        }
                        break;
                        
                    case "ban weapon":
                        rem = res.bbwx;
                        for (var i in res.bbw) {
                            if (res.bbw[i].isPassed()) { if (settings.useEmptyPick) rem--; }
                            else rem--;
                        }
                        break;
                }
                break;
        }

        return { step: step, res: res, rem: rem, banCardRem: banCardRem };
    },

    countEachPickAmountTotal: function(res = {
        rbx: 0,
        rabx: 0,
        rjbx: 0,
        rpx: 0,
        rbwx: 0,
        bbx: 0,
        babx: 0,
        bjbx: 0,
        bpx: 0,
        bbwx: 0
    }, eor = rules.sequence.length) {
        
        for (var i=0; i < eor; i++) {
            let s = rules.sequence[i];
            let side = s.side == null ? this.cardyBans.side : s.side;
            let amount = parseInt(s.amount);

            switch (side) {
                case "red":
                    switch (s.pick) {
                        case "preban":
                        case "ban":
                            res.rbx += amount;
                            break;

                        case "aban":
                            res.rabx += this.cardyBans.aban;
                            break;
                        case "jban":
                            res.rjbx += this.cardyBans.jban;
                            break;

                        case "entry":
                            res.rpx += amount;
                            break;

                        case "proffer":
                            res.bpx += amount;
                            break;

                        case "ban weapon":
                            res.rbwx += amount;
                            break;

                    }
                    break;

                case "blue":
                    switch (s.pick) {
                        case "preban":
                        case "ban":
                            res.bbx += amount;
                            break;

                        case "aban":
                            res.babx += this.cardyBans.aban;
                            break;
                        case "jban":
                            res.bjbx += this.cardyBans.jban;
                            break;

                        case "entry":
                            res.bpx += amount;
                            break;

                        case "proffer":
                            res.rpx += amount;
                            break;

                        case "ban weapon":
                            res.bbwx += amount;
                            break;
                    }
                    break;
            }
        }

        return res;
    },

    checkHistoryProcessed: function() {
        let res = this.countEachPickAmountTotal({
            rbx: 0,
            rabx: 0,
            rjbx: 0,
            rpx: 0,
            rbwx: 0,
            bbx: 0,
            babx: 0,
            bjbx: 0,
            bpx: 0,
            bbwx: 0,
            rb: [],
            rab: [],
            rjb: [],
            rp: [],
            rbw: [],
            bb: [],
            bab: [],
            bjb: [],
            bp: [],
            bbw: [],
            //ban card count
            bctr: 0,//hands width a ban card total red
            bctb: 0,//hands width a ban card total blue
            bcur: 0,//ban card used total red
            bcub: 0,//ban card used total blue
            bccstr: 0,//hands width a ban card current step red
            bccstb: 0,//hands width a ban card current step blue
            bccsur: 0,//ban card used current step red
            bccsub: 0,//ban card used current step blue
        }, Math.min(step + 1, rules.sequence.length));

        for (var i in stepHistory) {
            let cur = stepHistory[i];
            let ref = cur.stepReference;
            let side = ref.side == null ? this.cardyBans.side : ref.side;
            let seq = rules.sequence[step];
            let isCurrentStep = ref == seq;

            switch (side) {
                case "red":
                    switch (ref.pick) {
                        case "preban":
                        case "ban":
                            res.rb.push(cur);
                            break;

                        case "aban":
                            res.rab.push(cur);
                            break;
                        case "jban":
                            res.rjb.push(cur);
                            break;

                        case "entry":
                            if (cur.isBanCardBan) {
                                res.bcur++;
                                if (isCurrentStep) res.bccsur++;
                            } else {
                                res.rp.push(cur);
                                if (cur.withBanCard) {
                                    res.bctr++;
                                    if (isCurrentStep) res.bccstr++;
                                }
                            }
                            break;

                        case "proffer":
                            res.bp.push(cur);
                            if (cur.withBanCard) {
                                res.bctb++;
                                if (isCurrentStep) res.bccstb++;
                            }
                            // ** proffer 케이스에 대한 밴 카드 사용 처리 구현 보류 **
                            break;

                        case "ban weapon":
                            res.rbw.push(cur);
                            break;
                    }
                    break;

                case "blue":
                    switch (ref.pick) {
                        case "preban":
                        case "ban":
                            res.bb.push(cur);
                            break;

                        case "aban":
                            res.bab.push(cur);
                            break;
                        case "jban":
                            res.bjb.push(cur);
                            break;

                        case "entry":
                            if (cur.isBanCardBan) {
                                res.bcub++;
                                if (isCurrentStep) res.bccsub++;
                            } else {
                                res.bp.push(cur);
                                if (cur.withBanCard) {
                                    res.bctb++;
                                    if (isCurrentStep) res.bccstb++;
                                }
                            }
                            break;

                        case "proffer":
                            res.rp.push(cur);
                            if (cur.withBanCard) {
                                res.bctr++;
                                if (isCurrentStep) res.bccstr++;
                            }
                            // ** proffer 케이스에 대한 밴 카드 사용 처리 구현 보류 **
                            break;

                        case "ban weapon":
                            res.bbw.push(cur);
                            break;
                    }
                    break;
            }
            
        }

        return res;
    },

    initCalculatedCardyBan: function() {
        this.cardyBans = { side: null, aban: 0, jban: 0 };
    },

    calcCardyPreBans: function(init = false) {
        this.initCalculatedCardyBan();
        let limit = rules.cardy_rating.diff_limit;

        let red = playerInfoMaster.playerAccInfo.red;
        let blue = playerInfoMaster.playerAccInfo.blue;

        if (!init && red != null && blue != null) {
            let redSelfbanned = red.selfbanned != null ? red.selfbanned : [];
            let blueSelfbanned = blue.selfbanned != null ? blue.selfbanned : [];

            var redPoints = 0;
            var bluePoints = 0;
            var redDieted = 0;
            var blueDieted = 0;
            var totalDiff = 0; 
            var count = 0;          
            for (var info of charactersInfo.list) {
                let id = info.id;
                let redIsBanned = redSelfbanned.indexOf(id) > -1;
                let blueIsBanned = blueSelfbanned.indexOf(id) > -1;

                let points = rules.cardy_rating.point_table[id];
                if (points == null) continue;

                let redConst = red[id];
                let blueConst = blue[id];
                let redPoint = redConst != null && !redIsBanned ? points[redConst] : 0;
                let bluePoint = blueConst != null && !blueIsBanned ? points[blueConst] : 0;
                let diff = redPoint - bluePoint;
                let diffLimited = Math.max(Math.min(diff, limit), limit * -1);

                redPoints += redPoint;
                bluePoints += bluePoint;
                var redDiet = 0;
                var blueDiet = 0;
                if (redIsBanned && redConst != null) {
                    redDiet = points[redConst];
                    redDieted += redDiet;
                }
                if (blueIsBanned && blueConst != null) {
                    blueDiet = points[blueConst];
                    blueDieted += blueDiet;
                }
                totalDiff += diffLimited;
                count++;
                console.log("[" + count + "] " + charactersInfo.list[charactersInfo[id]].nameShort[loca] + ":\t" + (redDiet > 0 ? "(" + redDiet + ") " : "") + redPoint + "\t: " + (blueDiet > 0 ? "(" + blueDiet + ") " : "") + bluePoint + "\t/ " + (diff != diffLimited ? diff + " => ": "") + diffLimited + "\t+= " + totalDiff);
            }
            if (totalDiff != 0) {
                this.cardyBans.side = totalDiff < 0 ? "red" : "blue";
                totalDiff = Math.abs(totalDiff);

                for (var v of rules.cardy_rating.aban_pointer) {
                    if (v <= totalDiff) this.cardyBans.aban++;
                    else break;
                }
                for (var v of rules.cardy_rating.jban_pointer) {
                    if (v <= totalDiff) this.cardyBans.jban++;
                    else break;
                }
            }
            console.log(playerInfoMaster.redInfoName.val() + ": " + (redDieted > 0 ? (redPoints + redDieted) + " - " + redDieted + " = " : "") + redPoints + " / " + playerInfoMaster.blueInfoName.val() + ": " + (blueDieted > 0 ? (bluePoints + blueDieted) + " - " + blueDieted + " = " : "") + bluePoints + " / total diff: " + totalDiff);
        }
        $(document.body).attr("data-cardy-ban-for", this.cardyBans.side);
        this.initStepSequences();
        sideMaster.initCardyBanEntries();
    },

    releaseMainButton: function(newStep = step) {
        let text = lang.text;
        let lastStep = rules.sequence.length;
        if (step < 0) this.setMainButtonLabel(text.btnStart);
        else if (step == lastStep) this.setMainButtonLabel(text.btnVersus);
        else if (step > lastStep) this.setMainButtonLabel(text.btnUnstopable);
        else this.setMainButtonLabel(text.btnPass);
    },

    setMainButtonLabel: function(text = "???") {
        this.mainButton.text(text);
    },

    autoRandomPick: function(isContinue) {
        switch (this.rollingRandomPicks) {
            case null: //최초 시작
                if (isContinue === true) return;//기존 진행 중인 항목 중단
                this.rollingRandomPicks = true;
                controllerMaster.onRollingRandomPick();
                    break;
            
            case true: //랜덤 픽 진행중
                if (isContinue !== true) return;//추가 시작 요청 차단
                break;
            
            case false://중단 요청
                if (isContinue === true) {//기존 진행 중인 항목 중단
                    this.rollingRandomPicks = null;
                    controllerMaster.nonRollingRandomPick();
                    return;
                }
                break;
            
        }

        let seq = rules.sequence[step];

        if (seq == null) this.startPick();
        else this.randomPick();

        if (step < rules.sequence.length) {
            let isWeaponPick = rules.sequence[step].pick.indexOf("weapon") > -1;

            setTimeout(function() { sequenceMaster.autoRandomPick(true); }, isWeaponPick ? 1200 : 200);
        } else {
            this.rollingRandomPicks = null;
            controllerMaster.nonRollingRandomPick();
        }
    },

    randomPick: function() {
        let seq = rules.sequence[step];

        if (seq != null || step === -2) switch (step === -2 ? "entry" : seq.pick) {
            case "preban":
            case "ban":
            case "aban":
            case "jban":
            case "entry":
            case "proffer":
                let cursor = poolMaster.getCurrentCursor();

                var selection;
                if (cursor == null) {
                    let pool = poolMaster.pickPool.find("li.character").filter(function(i, item) { 
                        return !$(item).attr("data-picked");
                    });

                    let sel = Math.floor(Math.random() * pool.length);
                    selection = $(pool[sel]);
                } else selection = $(cursor);

                //this.onPick(selection.attr(poolMaster.id), selection);
                poolMaster.setPickCursorCharacter(selection);
                break;

            case "ban weapon":
                let counterSide = seq.side == "blue" ? "red" : "blue";
                let suggests = searchMaster.weaponSuggests[counterSide];

                var pick;
                var picked;
                var isExist;

                do {
                    pick = Math.floor(Math.random() * suggests.length);
                    picked = suggests[pick];

                    isExist = false;
                    for (var i in sideMaster.weaponBanPicked.red) {
                        if (sideMaster.weaponBanPicked.red[i] == picked) {
                            isExist = true;
                            break;
                        }
                    }
                    if (!isExist) for (var i in sideMaster.weaponBanPicked.blue) {
                        if (sideMaster.weaponBanPicked.blue[i] == picked) {
                            isExist = true;
                            break;
                        }
                    }
                } while (isExist);

                this.onPick(picked.id);
                break;
        }
    },

    eoo: eoo
}

let poolMaster = {

    side_selection_area: "div.side_selection_area",
    character_selection_view: "div.character_selection_view",
    character_selection_view_class: "character_selection_view",

    red: ".red",
    blue: ".blue",

    eachSideSelectionArea: null,
    redSideSelectionArea: null,
    blueSideSelectionArea: null,

    show: "data-show",
    shift: "data-shift",

    center_behind: "div#center_behind",

    side_behind_root: "div#side_behind",
    side_behind: "div.side_behind",
    character_name_display: "div.character_name_display",

    left: ".left",
    right: ".right",
    
    centerBehind: null,

    sideBehind: null,
    eachSideBehind: null,
    leftSideBehind: null,
    rightSideBehind: null,
    // eachCharacterNameDisplay: null,
    // redCharacterNameDisplay: null,
    // blueCharacterNameDisplay: null,

    elements: ["pyro", "hydro", "anemo", "electro", "dendro", "cryo", "geo"],
    rarities: { "5": null, "4": null },

    pool_block: "div#pool_block",
    pick_pool: "div.pick_pool",

    char_visual_res_type: "data-char-visual-res-type",

    each_pool_block: "each_pool_block",

    simple_ban_card_pool: "#simple_ban_card_pool",
    each_grade_pool: "each_grade_pool",

    ban_card_pool: "#ban_card_pool",
    bcp_base_grade: "div#base_grade",

    league: "data-league",

    global_banned: "global_banned",
    ban_card_grade_area: "ban_card_grade_area",
    middle_position_holder: "middle_position_holder",
    each_grade_rarity_area: "each_grade_rarity_area",
    each_grade_element_area: "each_grade_element_area",
    each_grade_element_pool: "each_grade_element_pool",

    ban_card_grade: "data-ban-card-grade",
    
    elements_pool: "#elements_pool",
    pool_element_area: "div.pool_element_area",
    each_element_pool_area: "div.each_element_pool_area",
    each_element_pool: "ul.each_element_pool",

    element: "data-element",

    cost_pool: "#cost_pool",
    pool_cost_area: "div.pool_cost_area",

    cost6: "#cost6",
    cost5: "#cost5",
    cost4: "#cost4",
    cost3: "#cost3",
    cost2: "#cost2",
    cost1: "#cost1",
    cost0: "#cost0",


    each_cost_pool_area: "div.each_cost_pool_area",
    global_banned_area: ".global_banned",
    each_cost_pool: "ul.each_cost_pool",
    character: "li.character",

    id: "data-id",
    class: "data-class",
    treveler: "data-treveler",
    rarity: "data-rarity",
    weapon: "data-weapon",
    name: "data-name",
    pick_side: "data-pick-side",
    pick_type: "data-pick-type",
    pick_note: "data-pick-note",
    proffer_ban: "data-proffer-ban",
    picked: "data-picked",
    picked_red: "data-picked-red",
    picked_blue: "data-picked-blue",
    banned: "data-banned",
    banned_by_card: "data-banned-by-card",
    ban_card: "data-ban-card",
    cost: "data-cost",
    view: "data-view",
    cursor: "data-cursor",
    except: "data-except",

    unallowed_pool: "ul#unallowed_pool",

    title: "data-title",

    poolBlock: null,
    pickPools: null,
    pickPool: null,

    simpleBanCardPool: null,
    eachGradeArea: null,
    eachGradePool: null,

    banCardPool: null,
    bcpBaseGrade: null,

    eachGradeRarityArea: null,//[{ "host": null, "5": { "host": null, "pyro": ... }, "4": null, "middle": { "host": null, "0": ...}, }, ...]
    eachGradeElementPool: null,

    elementsPool: null,
    eachElementArea: null,
    eachElementPoolArea: null,
    eachElementPool: null,
    elementPool: {
        "switchable": { "host": null, "0": null, "1": null },
        "pyro": { "host": null, "5": null, "4": null },
        "hydro": { "host": null, "5": null, "4": null },
        "anemo": { "host": null, "5": null, "4": null },
        "electro": { "host": null, "5": null, "4": null },
        "dendro": { "host": null, "5": null, "4": null },
        "cryo": { "host": null, "5": null, "4": null },
        "geo": { "host": null, "5": null, "4": null },
    },

    costPool: null,
    poolCostArea: null,
    pool6Area: null,
    pool5Area: null,
    pool4Area: null,
    pool3Area: null,
    pool2Area: null,
    pool1Area: null,
    pool0Area: null,
    eachPoolCostPoolArea: null,
    cost6Area: null,
    cost5Area: null,
    cost4Area: null,
    cost3Area: null,
    cost2Area: null,
    cost1Area: null,
    cost0Area: null,
    globalBannedArea: null,
    eachCostPool: null,
    cost6Pool: null,
    cost5Pool: null,
    cost4Pool: null,
    cost3Pool: null,
    cost2Pool: null,
    cost1Pool: null,
    cost0Pool: null,
    globalBannedPool: null,

    eachCharacters: null,


    underplacer: "div#underplacer",


    unavailables: "div#unavailables",
    
    unallowedPool: null,

    
    table: null,
    pool: null,


    charVisualResType: "vcut",//"icon" or "vcut"

    sideViewSeq: 0,
    charViews: [{}, {}, {}, {}],

    cursorRoller: null,

    init: function() {

        this.eachSideSelectionArea = $(this.side_selection_area);
        this.redSideSelectionArea = this.eachSideSelectionArea.filter(this.red);
        this.blueSideSelectionArea = this.eachSideSelectionArea.filter(this.blue);

        this.centerBehind = $(this.center_behind);
 
        this.sideBehind = $(this.side_behind_root);
        this.eachSideBehind = this.sideBehind.find(this.side_behind);
        this.leftSideBehind = this.eachSideBehind.filter(this.left);
        this.rightSideBehind = this.eachSideBehind.filter(this.right);
        // this.eachCharacterNameDisplay = this.sideBehind.find(this.character_name_display);
        // this.redCharacterNameDisplay = this.eachCharacterNameDisplay.filter(this.red);
        // this.blueCharacterNameDisplay = this.eachCharacterNameDisplay.filter(this.blue);

        this.poolBlock = $(this.pool_block);
        this.pickPools = this.poolBlock.find(this.pick_pool);

        this.simpleBanCardPool = this.pickPools.filter(this.simple_ban_card_pool);

        this.banCardPool = this.pickPools.filter(this.ban_card_pool);
        this.bcpBaseGrade = this.banCardPool.find(this.bcp_base_grade);


        this.elementsPool = this.pickPools.filter(this.elements_pool);
        this.eachElementArea = this.elementsPool.find(this.pool_element_area);
        this.eachElementPoolArea = this.eachElementArea.find(this.each_element_pool_area);
        this.eachElementPool = this.eachElementPoolArea.find(this.each_element_pool);

        var ce;
        var host;
        for (i in this.elements) {
            ce = this.elements[i];
            host = this.eachElementArea.filter('[' + this.element + '="' + ce + '"]');
            this.elementPool[ce]["host"] = host;
            this.elementPool[ce]["5"] = host.find(this.each_element_pool_area + '[' + this.rarity + '="5"]').find(this.each_element_pool);
            this.elementPool[ce]["4"] = host.find(this.each_element_pool_area + '[' + this.rarity + '="4"]').find(this.each_element_pool);
        }
        ce = "switchable";
        host = this.eachElementArea.filter('[' + this.element + '="' + ce + '"]');
        this.elementPool[ce]["host"] = host;
        this.elementPool[ce]["0"] = host.find(this.each_element_pool_area + '[' + this.treveler + '="0"]').find(this.each_element_pool);
        this.elementPool[ce]["1"] = host.find(this.each_element_pool_area + '[' + this.treveler + '="1"]').find(this.each_element_pool);

        this.costPool = this.pickPools.filter(this.cost_pool)
        this.poolCostArea = this.costPool.find(this.pool_cost_area);
        this.pool6Area = this.poolCostArea.filter(this.cost6);
        this.pool5Area = this.poolCostArea.filter(this.cost5);
        this.pool4Area = this.poolCostArea.filter(this.cost4);
        this.pool3Area = this.poolCostArea.filter(this.cost3);
        this.pool2Area = this.poolCostArea.filter(this.cost2);
        this.pool1Area = this.poolCostArea.filter(this.cost1);
        this.pool0Area = this.poolCostArea.filter(this.cost0);
        this.eachPoolCostPoolArea = this.costPool.find(this.each_cost_pool_area);
        this.cost6Area = this.pool6Area.find(this.each_cost_pool_area);
        this.cost5Area = this.pool5Area.find(this.each_cost_pool_area);
        this.cost4Area = this.pool4Area.find(this.each_cost_pool_area);
        this.cost3Area = this.pool3Area.find(this.each_cost_pool_area);
        this.cost2Area = this.pool2Area.find(this.each_cost_pool_area);
        this.cost1Area = this.pool1Area.find(this.each_cost_pool_area);
        this.cost0Area = this.pool0Area.find(this.each_cost_pool_area);
        this.globalBannedArea = this.eachPoolCostPoolArea.filter(this.global_banned_area);
        this.eachCostPool = this.eachPoolCostPoolArea.find(this.each_cost_pool);
        this.cost6Pool = this.cost6Area.find(this.each_cost_pool);
        this.cost5Pool = this.cost5Area.find(this.each_cost_pool);
        this.cost4Pool = this.cost4Area.find(this.each_cost_pool);
        this.cost3Pool = this.cost3Area.find(this.each_cost_pool);
        this.cost2Pool = this.cost2Area.find(this.each_cost_pool);
        this.cost1Pool = this.cost1Area.find(this.each_cost_pool);
        this.cost0Pool = this.cost0Area.find(this.each_cost_pool);
        this.globalBannedPool = this.globalBannedArea.find(this.each_cost_pool);

        this.underplacer = $(this.underplacer);

        this.unavailables = $(this.unavailables);
        this.unallowedPool = this.unavailables.find(this.unallowed_pool);

        this.eachSideBehind.empty();


        this.pickPools.attr(this.char_visual_res_type, this.charVisualResType);


        this.initSideSelectionArea();

        this.initUnavailables();

        this.initPickPool();

        this.costPool.contextmenu(this.onRightClickPickPool);
    },

    initSideSelectionArea: function() {
        this.eachSideSelectionArea.empty();
    },

    insertSideSelectionView: function(item, side) {
        if (item == null) return;
        if (side == null) return;

        let id = item.attr(this.id)
        let seq = this.sideViewSeq++;
        let viewId = id + "#" + seq + "@" + Date.now();

        let view = this.getSideSelectionView(id, viewId);

        var treveler = item.attr(this.treveler);

        let area = this.eachSideSelectionArea.filter("." + side);

        area.prepend(view);

        $(item).attr(this.view, viewId);
        if (treveler != null) $(view).attr(this.treveler, treveler).attr(this.shift, "");
        
        setTimeout(function() {
            area.find(poolMaster.character_selection_view + '[' + poolMaster.id + '="' + viewId + '"]').attr(poolMaster.show, "1");
        }, 10);
    },

    getSideSelectionView(charId, viewId) {
        var view;
        for (var i=0; i < this.charViews.length; i++) {
            view = this.charViews[i][charId];
            
            if (view == null) {
                view = document.createElement("div");
                view.setAttribute("class", this.character_selection_view_class);
                var src = "--src: url('" + getPath("images", "character_back", charactersInfo.list[charactersInfo[charId]].res_back) + "'); ";
                if (charId == "treveler") src += "--src1: url('" + getPath("images", "character_back", charactersInfo.list[charactersInfo[charId] + 1].res_back) + "'); ";
                view.setAttribute("style", src);
                this.charViews[i][charId] = view;

                break;
            } else if (view.getAttribute(this.id) == "") break;
        }

        view.setAttribute(this.show, "");
        view.setAttribute(this.id, viewId);
        
        return view;
    },

    removeSideSelectionView: function(item, pass = false) {
        if (item == null) return;

        item = $(item);
        let viewId = item.attr(this.view);

        if (viewId == null || viewId == "") return;

        let area = this.eachSideSelectionArea;
        let view = area.find(this.character_selection_view + '[' + this.id + '="' + viewId + '"]');
        view.attr(this.show, pass ? "2" : "");

        item.attr(this.view, null);

        setTimeout(function() {
            view.attr(poolMaster.id, "");
            view.remove();
        }, 1000);
    },

    shiftSideSelectionView: function(viewId, treveler) {
        let area = this.eachSideSelectionArea;
        let view = area.find(this.character_selection_view + '[' + this.id + '="' + viewId + '"]');

        view.attr(this.shift, "1");
        view.attr(poolMaster.treveler, treveler);
        setTimeout(function() { view.attr(poolMaster.shift, ""); }, 900);
    },

    initPickPool: function() {
        switch(rules.rule_type) {
            case "ban card":
                this.initSimpleBanCardTable();
                this.simpleBanCardPool.attr(this.league, rules.alterSelected);
                //this.initBanCardTable();
                this.banCardPool.attr(this.league, rules.alterSelected);
                break;

            case "preban":
            case "cost":
                this.initCostTable();
                break;

            default:
                this.initElementTable();
                break;
        }

        $(document.body).attr("data-rule-type", rules.rule_type);

        let items = this.eachCharacters;
        items.mouseenter(this.onCharacterItemMouseEnter);
        items.mouseleave(this.onCharacterItemMouseLeave);
        items.click(this.onCharacterItemClick);

        this.unavailables.attr(this.title, lang.text.pickUnallowed);
        if (this.unallowedPool.find(this.character).length < 1) {
            if (this.unavailables.attr("data-hide") != "1") {
                setTimeout(function() { poolMaster.unavailables.attr("data-hide", "1"); }, 2500);
            }
        }
    },

    initSimpleBanCardTable: function() {
        table = rules.ban_card_accure;
        this.table = table;

        this.simpleBanCardPool.empty();
        this.unallowedPool.empty();

        let alters = rules.rule_alter;
        let pool = this.simpleBanCardPool;
        let isOnGlobalBanned = rules.global_banned != null;// && Object.keys(rules.global_banned).length > 0;
        let areas = alters.length + (isOnGlobalBanned ? 1 : 0);
        for (var i=0; i <= areas; i++) {
            let alt = alters[i];

            let isGlobalBannedArea = isOnGlobalBanned && i == areas;
            let banCardGradeArea = document.createElement("div");
            banCardGradeArea.setAttribute("class", this.ban_card_grade_area + (isGlobalBannedArea ? " " + this.global_banned : ""));
            if (isGlobalBannedArea) banCardGradeArea.setAttribute("data-area-title", "GLOBAL BAN");
            banCardGradeArea.setAttribute(this.ban_card_grade, i);
            let eachGradePool = document.createElement("ul");
            eachGradePool.setAttribute("class", this.each_pool_block + " " + this.each_grade_pool);
            banCardGradeArea.append(eachGradePool);
            pool.prepend(banCardGradeArea);
        }
        this.eachGradeArea = pool.find("div." + this.ban_card_grade_area);

        let alterEx = alters.length + (isOnGlobalBanned ? 1 : 0);
        for (var i=0; i <= alterEx; i++) {
            let alt = alters[i];
            let acc = i == alters.length ? rules.ban_card_excepted : (i == alters.length + 1 ? rules.global_banned : alt.ban_card_accure);

            let set = [{}, {}];
            for (var id in acc) {
                let info = charactersInfo.list[charactersInfo[id]];
                if (info == null) continue;
                let rar = info.rarity == "5" ? "5" : "4";

                set[rar == "5" ? 0 : 1][id] = info;
            }

            for (var rar in set) {
                let list = set[rar];
                for (var id in list) {
                    let bancard = table[id];
                    let info = list[id];

                    var item;
                    if (id.indexOf("treveler") > -1) {
                        let isMale = id == "trevelerM";
                        item = this.buildCharacterItem(info, bancard, isMale ? "1" : "0");
                    } else {
                        item = this.buildCharacterItem(info, bancard);
                    }
                    let exist = this.eachGradeArea.find(this.character + "[" + this.id + "='" + id + "']");
                    if (exist.length > 0) exist.remove();
                    this.eachGradeArea.filter('[' + this.ban_card_grade + '="' + i + '"]').find("ul." + this.each_grade_pool).append(item);
                }
            }
        }

        charactersInfo.list.forEach((info, i) => {
            let id = info.id;
            if (id == eoa) return;

            let self = poolMaster;
            let bancard = table[id];

            if (bancard != null) return;

            if (id == "treveler") {
                let treveler = "" + i;
                self.unallowedPool.append(self.buildCharacterItem(info, bancard, treveler, "icon"));
            } else {
                let item = self.buildCharacterItem(info, bancard, null, "icon");
                self.unallowedPool.append(item);
            }
        });

        this.eachGradePool = this.eachGradeArea.find("ul." + this.each_grade_pool);
        this.eachCharacters = this.eachGradePool.find(this.character);
    },

    initBanCardTable: function() {
        table = rules.ban_card_accure;
        this.table = table;

        this.bcpBaseGrade.empty();
        this.unallowedPool.empty();

        this.eachGradeRarityArea = [];

        let alters = rules.rule_alter;
        var bcgArea = this.bcpBaseGrade;
        for (var i=0; i <= alters.length; i++) {
            let alt = alters[i];

            this.buildBanCardGrade(i, bcgArea);

            this.eachGradeRarityArea[i] = { "host": null, "5": null, "4": null, "middle": null };

            let gra = this.eachGradeRarityArea[i];

            gra["host"] = bcgArea;
            for (r in this.rarities) {
                gra[r] = { "host": null };
                gea = gra[r];
                gea["host"] = bcgArea.find('div.' + this.each_grade_rarity_area + '[' + this.rarity + '="' + r + '"]');
                //gea["switchable"] = null;
                for (n in this.elements) {
                    ele = this.elements[n];
                    gea[ele] = gea["host"].find('div.' + this.each_grade_element_area + '[' + this.element + '="' + ele + '"]');
                }
            }
            gra["middle"] = bcgArea.find("div." + this.middle_position_holder);

            bcgArea = gra["middle"].find("div." + this.ban_card_grade_area);
        }

        for (var i=0; i <= alters.length; i++) {
            let alt = alters[i];
            let acc = i == alters.length ? rules.ban_card_excepted : alt.ban_card_accure;

            for (id in acc) {
                let bancard = table[id];
                let info = charactersInfo.list[charactersInfo[id]];
                if (info == null) continue;
                let gra = this.eachGradeRarityArea[i];
                let rar = info.rarity == "5" ? "5" : "4";
                let ele = info.element;
                if (id.indexOf("treveler") > -1) {
                    let mid = gra["middle"];
                    let isMale = id == "trevelerM";
                    let item = this.buildTrevelerHolder(info, bancard, isMale ? "1" : "0");
                    if (isMale) mid.append(item);
                    else mid.prepend(item);
                } else {
                    let item = this.buildCharacterItem(info, bancard);
                    gra[rar][ele].find("ul." + this.each_grade_element_pool).append(item);
                }
            }
        }

        charactersInfo.list.forEach((info, i) => {
            let id = info.id;
            if (id == eoa) return;

            let self = poolMaster;
            let bancard = table[id];

            if (bancard != null) return;

            if (id == "treveler") {
                let treveler = "" + i;
                self.unallowedPool.append(self.buildCharacterItem(info, bancard, treveler, "icon"));
            } else {
                let item = self.buildCharacterItem(info, bancard, null, "icon");
                self.unallowedPool.append(item);
            }
        });

        this.eachGradeElementPool = this.bcpBaseGrade.find("ul." + this.each_grade_element_pool);
        this.eachCharacters = this.eachGradeElementPool.find(this.character);
    },

    buildBanCardGrade: function(grade, area) {
        if (grade == null, area == null) return;

        area.append(this.buildEachGradeRarityArea("5"));
        let middle = document.createElement("div");
        middle.setAttribute("class", this.middle_position_holder);
        if (grade < rules.rule_alter.length) {
            let bcgArea = document.createElement("div");
            bcgArea.setAttribute("class", this.ban_card_grade_area);
            bcgArea.setAttribute(this.ban_card_grade, "" + (grade + 1));
            middle.append(bcgArea);
        }
        area.append(middle);
        area.append(this.buildEachGradeRarityArea("4"));
    },

    buildEachGradeRarityArea: function(rar) {
        let gra = document.createElement("div");
        gra.setAttribute("class", this.each_grade_rarity_area);
        gra.setAttribute(this.rarity, rar);

        for (i in this.elements) {
            let ele = this.elements[i];
            let gea = document.createElement("div");
            gea.setAttribute("class", this.each_grade_element_area);
            gea.setAttribute(this.element, ele);
            let ul = document.createElement("ul");
            ul.setAttribute("class", this.each_pool_block + " " + this.each_grade_element_pool);
            gea.append(ul);
            gra.append(gea);
        }

        return gra;
    },

    buildTrevelerHolder: function(info, bancard, treveler) {
        let gea = document.createElement("div");
        gea.setAttribute("id", "bcTrevel" + info.alter);
        gea.setAttribute("class", this.each_grade_element_area);
        gea.setAttribute(this.treveler, treveler);
        gea.setAttribute(this.element, info.element);
        let ul = document.createElement("ul");
        ul.setAttribute("class", this.each_pool_block + " " + this.each_grade_element_pool);
        ul.append(this.buildCharacterItem(info, bancard, treveler));
        gea.append(ul);

        return gea;
    },

    initElementTable: function() {
        var table;
        switch (rules.rule_type) {
            case "cost":
                table = rules.cost_table;
                break;

            case "bancard":
                table = rules.ban_card_accure;
                break;

            case "cardy":
                table = rules.cardy_rating.point_table;
                break;
        }
        this.table = table;

        this.eachElementPool.empty();
        this.unallowedPool.empty();

        
        charactersInfo.list.forEach((info, i) => {
            let id = info.id;
            if (id == eoa) return;

            let self = poolMaster;
            let bancard = rules.rule_type == "bancard" ? table[id] : null;

            if (id == "treveler") {
                let treveler = "" + i;
                self.elementPool[info.element][treveler].append(self.buildCharacterItem(info, bancard, treveler));
            } else {
                let item = self.buildCharacterItem(info, bancard, null);//, bancard == null ? "icon" : null);
                if (rules.rule_type == "bancard" && bancard == null) self.unallowedPool.append(item);//사용불가 캐릭터
                else self.elementPool[info.element][info.rarity == "5" ? "5" : "4"].append(item);
            }
        });

        this.eachCharacters = this.eachElementPool.find(this.character);
    },

    initCostTable: function() {
        this.pool = {};
        charactersInfo.list.forEach(c => {
            if (c.id == eoa) return;
            poolMaster.pool[c.id] = false;
        });

        this.eachCostPool.empty();
        this.unallowedPool.empty();

        if (rules.cost_table != null) {
            this.table = rules.cost_table;
            
            charactersInfo.list.forEach((info, i) => {
                let id = info.id;
                if (id == eoa) return;
    
                let self = poolMaster;
                let pool = [self.cost0Pool, self.cost1Pool, self.cost2Pool, self.cost3Pool, self.cost4Pool, self.cost5Pool, self.cost6Pool];
                var cost = self.getCost(id);
                if (cost > 4) cost = 4;
    
                self.pool[id] = true;
                if (id == "treveler") {
                    pool[cost].append(self.buildCharacterItem(info, null, info.alter == "F" ? "0" : "1"));
                } else pool[cost].append(self.buildCharacterItem(info));
            });
        } else {
            this.table = costTable;

            //quintuple cost pool list
            table.tier1.forEach(id => {
                let self = poolMaster;
                if (id == eoa) return;
                self.pool[id] = true;
                self.cost5Pool.append(self.buildCharacterItem(self.getCharacterInfo(id)));
            });

            //quadrupple cost pool list
            table.tier2.forEach(id => {
                let self = poolMaster;
                if (id == eoa) return;
                self.pool[id] = true;
                self.cost4Pool.append(self.buildCharacterItem(self.getCharacterInfo(id)));
            });

            //tripple cost pool list
            table.tier3.forEach(id => {
                let self = poolMaster;
                if (id == eoa) return;
                self.pool[id] = true;
                self.cost3Pool.append(self.buildCharacterItem(self.getCharacterInfo(id)));
            });

            //double cost pool list
            table.tier4.forEach(id => {
                let self = poolMaster;
                if (id == eoa) return;
                self.pool[id] = true;
                self.cost2Pool.append(self.buildCharacterItem(self.getCharacterInfo(id)));
            });

            //excluded list
            table.exclude.forEach(id => {
                let self = poolMaster;
                if (id == eoa) return;
                self.pool[id] = true;
                self.unallowedPool.append(self.buildCharacterItem(self.getCharacterInfo(id), forceIcon = true));
            });

            //else case to single cost pool
            for (id in this.pool) {
                let self = poolMaster;
                if (self.pool[id]) continue;
                self.pool[id] = true;
                self.cost1Pool.append(self.buildCharacterItem(self.getCharacterInfo(id)));
            };

        }

        this.eachCharacters = this.eachCostPool.find(this.character);
    },

    getCost: function(id, cons = 0) {
        if (this.table != null) {
            if (typeof cons != "number") cons = 0;
            if (id.indexOf("treveler") > -1) id = "treveler";
            let costs = this.table[id];
            var cost;
            if (typeof costs == "number") cost = costs;
            else cost = costs != null ? costs[cons] : 0;
            return cost;
        } else return null;
    },

    releasePosessionBanCard: function() {
        table = rules.ban_card_accure;
        this.table = table;

        this.eachCharacters.each((i, item) => {
            item = $(item);
            let self = poolMaster;
            let id = item.attr(self.id);
            if (id == null || id == "") return;

            let bancard = table[id];
            let state = bancard ? "1" : "";

            if (item.attr(self.ban_card) != state) item.attr(self.ban_card, state);
        });
        this.simpleBanCardPool.attr(this.league, rules.alterSelected);
        this.banCardPool.attr(this.league, rules.alterSelected);
    },

    buildCharacterItem: function(info, bancard, treveler, resType) {
        let item = document.createElement("li");
        item.setAttribute("class", "character");
        let holder = document.createElement("div");
        holder.setAttribute("class", "character_holder");
        let img = this.buildCharacterIcon(info, resType);
        if (info != null) {
            item.setAttribute(this.id, info.id);
            item.setAttribute(this.class, info.class);
            item.setAttribute(this.rarity, info.rarity);
            item.setAttribute(this.element, info.element);
            item.setAttribute(this.weapon, info.weapon);
            item.setAttribute(this.cost, this.getCost(info.id));
            try {
                item.setAttribute(this.name, info.name[loca]);
                //item.setAttribute("title", info.name[loca]);
            } catch (e) {
                console.error("Error orrucrs in getting character name - character id: " + info.id);
                console.error(e.name, e.message);
            }
            item.setAttribute(this.pick_side, "");
            item.setAttribute(this.pick_type, "");
            item.setAttribute(this.picked, "");
            item.setAttribute(this.picked_red, "");
            item.setAttribute(this.picked_blue, "");
            item.setAttribute(this.proffer_ban, "");
            item.setAttribute(this.banned, "");
            item.setAttribute(this.banned_by_card, "");
            item.setAttribute(this.ban_card, bancard ? "1" : "");
            if (treveler != null) item.setAttribute(this.treveler, treveler);
        }
        holder.append(img);
        item.append(holder);
        if (info != null && treveler == null && info.id == "treveler") {
            item.setAttribute(this.treveler, "0");
            item.append(this.buildCharacterIcon(charactersInfo.list[charactersInfo.trevelerM], resType));
        }
        let element = document.createElement("img");
        element.setAttribute("class", "element_icon");
        if (info != null) {
            let charElement = commonInfo.element.res_icon[info.element];
            element.setAttribute("src", charElement == null ? tpGif : getPathR("images", "element_icon", charElement));
        }
        switch (this.charVisualResType) {
            default:
            case "icon":
                item.prepend(element);
                break;

            case "vcut":
                item.append(element);
                break;
        }
        let bgSheet = document.createElement("div");
        bgSheet.setAttribute("class", "character_back");
        item.prepend(bgSheet);
        let banCardHole = document.createElement("div");
        banCardHole.setAttribute("class", "ban_card_hole");
        item.append(banCardHole);
        let banCardHolder = document.createElement("div");
        banCardHolder.setAttribute("class", "ban_card_holder");
        let banCard = document.createElement("span");
        banCard.setAttribute("class", "ban_card");
        banCard.innerHTML = lang.text.banCardTitle;
        banCardHolder.append(banCard);
        item.append(banCardHolder);
        let pickCardRed = document.createElement("span");
        pickCardRed.setAttribute("class", "pick_card red");
        pickCardRed.innerHTML = lang.text.pickedEntryShort;
        item.append(pickCardRed);
        let pickCardBlue = document.createElement("span");
        pickCardBlue.setAttribute("class", "pick_card blue");
        pickCardBlue.innerHTML = lang.text.pickedEntryShort;
        item.append(pickCardBlue);
        let nametag = document.createElement("span");
        nametag.setAttribute("class", "name_tag");
        if (info != null) {
            try {
                let name = document.createElement("span");
                name.setAttribute("class", "name text_only");
                let nameShort = info.nameShort[loca];
                name.innerHTML = nameShort;
                nametag.append(name);
                
                if (loca == "ko-kr") {
                    let wid = 60.0 - 6.0;
                    let hovWid = 69.0 - 6.0;
                    let letterWid = 16.0;
                    let pad = 2.0;
                    let padHov = 1.0;
                    let over = 2.0;
                    let nameLen = nameShort.length;
                    let tag = $(nametag);
                    var scaleW = 1;
                    var scaleHW = 1;
                    if (nameLen > 3) {
                        scaleW = ((wid - pad) / (letterWid * nameLen)).toFixed(3);
                        if (nameLen > 4) scaleHW = ((hovWid - padHov) / (letterWid * nameLen)).toFixed(3);
                    }
                    tag.css("--scaleW", "" + scaleW);
                    tag.css("--scaleHW", "" + scaleHW);
                }
            } catch (e) {

            }
        }
        item.append(nametag);

        return item;
    },

    buildCharacterIcon: function(info, resType = null) {
        if (resType == null) resType = this.charVisualResType;
        switch(resType) {
            default:
            case "icon":
                let img = document.createElement("img")
                img.setAttribute("class", "character_" + resType);
                if (info != null) {
                    img.setAttribute("src", getPathR("images", "character_" + resType, info["res_" + resType]));
                }
                return img;

            case "vcut":
                var div = document.createElement("div")
                div.setAttribute("class", "character_" + resType);
                if (info != null) {
                    div.setAttribute("style", "--src: url('" + getPath("images", "character_" + resType, info["res_" + resType]) + "'); --pos-v-basic: " + info.res_vcut_meta_pos.vBasic + "; --pos-v-hover: " + info.res_vcut_meta_pos.vHover + ";");
                }
                return div;

            case "wide":
                var div = document.createElement("div")
                div.setAttribute("class", "character_" + resType);
                if (info != null) {
                    div.setAttribute("style", "--src: url('" + getPath("images", "character_" + resType, info["res_" + resType]) + "'); --scale: " + info.res_wide_meta_pos.scale + "; --ph: " + info.res_wide_meta_pos.h + "; --pv: " + info.res_wide_meta_pos.v + ";");
                }
                return div;
        }
    },

    getCharacterInfo: function(id) {
        var info = charactersInfo.list[charactersInfo[id]];
        return info != null ? info : charactersInfo.unknown;
    },

    initPickState: function() {
        let items = this.eachCharacters;
        items.attr(this.pick_side, "");
        items.attr(this.pick_type, "");
        items.attr(this.picked, "");
        items.attr(this.picked_red, "");
        items.attr(this.picked_blue, "");
        items.attr(this.banned, "");
        items.attr(this.banned_by_card, "");
        items.attr(this.pick_note, null);
        
        this.toggleTrevelerAlter(0);
    },

    onCharacterItemMouseEnter: function(e) {
        let item = $(this);
        let sm = sequenceMaster;
        let id = item.attr(poolMaster.id);
        let treveler = item.attr("data-treveler");
        if (sm.pickingPlayerProfile.red) {
            let res = playerInfoMaster.setPlayerProfile(id, "red", treveler);
            sm.pickedPlayerProfile.red = (res !== false ? id + (id == "treveler" ? (treveler == 0 ? "F" : "M") : "") : null);
            return;
        }
        if (sm.pickingPlayerProfile.blue) {
            let res = playerInfoMaster.setPlayerProfile(id, "blue", treveler);
            sm.pickedPlayerProfile.blue = (res !== false ? id + (id == "treveler" ? (treveler == 0 ? "F" : "M") : "") : null);
            return;
        }

        poolMaster.setCursorCharacter(this);
    },

    onCharacterItemMouseLeave: function(e) {
        let item = $(this);
        let sm = sequenceMaster;
        if (sm.pickingPlayerProfile.red) {
            let id = sm.pickedPlayerProfile.red;
            sm.pickedPlayerProfile.red = null;
            setTimeout(function() {
                if (sm.pickingPlayerProfile.red && sm.pickedPlayerProfile.red == null) {
                    playerInfoMaster.clearPlayerProfile("red");
                }
            }, 500);
            return;
        }
        if (sm.pickingPlayerProfile.blue) {
            let id = sm.pickedPlayerProfile.blue;
            sm.pickedPlayerProfile.blue = null;
            setTimeout(function() {
                if (sm.pickingPlayerProfile.blue && sm.pickedPlayerProfile.blue == null) {
                    playerInfoMaster.clearPlayerProfile("blue");
                }
            }, 500);
            return;
        }

        poolMaster.setCursorOutCharacter(this);
    },

    onCharacterItemClick: function(e) {
        poolMaster.setPickCursorCharacter(this);
    },

    setCursorCharacter: function(item) {
        if (item == null) return;
        this.clearCursorOnPool();

        let seq = rules.sequence[step];
        if (seq == null && step !== -2) return;

        var pick;
        var side;
        var picked;
        var isProfferPick;
        var isEntryPick;
        if (step === -2) {
            pick = "entry";
            side = "red";
            item = $(item);
            picked = item.attr(this.picked);
            isProfferPick = false;
            isEntryPick = true;
        } else {
            pick = seq.pick
            side = seq.side;
            item = $(item);
            isProfferPick = pick == "proffer";
            isEntryPick = pick == "entry" || isProfferPick;
            let counterSide = side == "red" ? "blue" : "red";
            let pickingSide = isProfferPick ? counterSide : seq.side
            picked = item.attr(this.picked + "-" + pickingSide);//item.attr(this.picked);
        }
        let isPicked = picked != null && picked != "";
        let isBanned = item.attr(this.banned);

        playSound(isEntryPick ? "떻" : "뚁");

        item.attr(this.cursor, "1");

        this.displayCharacterName(pick, side, item.attr(this.name));

        if (isEntryPick && !isBanned && !isPicked) this.insertSideSelectionView(item, isProfferPick ? counterSide : side);
    },

    setCursorOutCharacter: function(item) {
        item = $(item);
        item.attr(poolMaster.cursor, null);
        poolMaster.displayCharacterName();
        poolMaster.removeSideSelectionView(item, true);
    },

    setPickCursorCharacter: function(item) {
        item = $(item);
        sequenceMaster.onPick(item.attr(poolMaster.id), item);
        if (sequenceMaster.rollingRandomPicks !== true && this.cursorRoller != null) {
            setTimeout(function() {
                poolMaster.removeSideSelectionView(item);
            }, 600);
        } else poolMaster.removeSideSelectionView(item);
        playSound("휙");
    },

    getCurrentCursor: function() {
        return this.eachCharacters.filter('[' + this.cursor + '="1"]');
    },

    clearCursorOnPool: function() {
        let cursor = this.getCurrentCursor();
        if (cursor.length > 0) this.setCursorOutCharacter(cursor);
    },

    rollCursorRandom: function() {
        if (this.cursorRoller != null) return;

        this.cursorRoller = setInterval(this.randomCursorRoller, 100);
    },

    randomCursorRoller: function() {
        if (!sequenceMaster.rollingRandomPicks && sequenceMaster.lastPickedTime != null && Date.now() < sequenceMaster.lastPickedTime + 1000) return;
        //let seq = rules.sequence[step];
        //let side = seq.type == "proffer" ? (seq.side == "red" ? "blue" : "red") : seq.side;
        let items = poolMaster.eachCharacters.filter('[' + poolMaster.picked + '=""]:not([' + poolMaster.cursor + '="1"]):not([' + poolMaster.except + '="1"])');
        //let items = poolMaster.eachCharacters.filter('[' + poolMaster.banned + '=""][' + poolMaster.picked + '-' + side + '=""]:not([' + poolMaster.cursor + '="1"])');

        let next = Math.floor(Math.random() * items.length);

        poolMaster.setCursorCharacter(items[next]);
    },

    stopRollRandomCursor: function() {
        if (this.cursorRoller != null) {
            clearInterval(this.cursorRoller);
            this.cursorRoller = null;
            this.clearCursorOnPool();
        }
    },

    displayCharacterName: function(pick, side, name) {
        this.eachSideBehind.find(this.character_name_display).fadeOut(100, function() {
            $(this).remove();
        });

        if (pick == null || side == null || name == null) return;

        let display = this.buildCharacterNameDisplay(side, name);
        
        switch(side) {
            case "red":
                if (pick == "ban" || pick == "preban") this.leftSideBehind.append(display);
                else this.rightSideBehind.append(display);
                break;

            case "blue":
                if (pick == "ban" || pick == "preban") this.rightSideBehind.append(display);
                else this.leftSideBehind.append(display);
                break;
        }

        setTimeout(function() { $(display).attr(poolMaster.show, "1"); }, 10);
    },

    buildCharacterNameDisplay: function(side, name) {
        let display = document.createElement("div");
        display.setAttribute("class", "character_name_display " + side);

        let names = name.split(" ");
        for (var i in names) {
            let span = document.createElement("span");
            span.innerText = names[i];
            display.append(span);
        }

        return display;
    },

    toggleTrevelerAlter(forced) {
        if (rules.rule_type != "cost" && rules.rule_type != "preban") return;

        let item = this.eachCharacters.filter('[' + this.id + '="treveler"]');
        if (item.length < 1) return;

        let cur = item.attr(this.treveler);
        let to = forced != null && (forced === 0 || forced === 1) ? forced : (cur == "1" ? 0 : 1);

        item.attr(this.treveler, to);

        let viewId = item.attr(this.view);
        if (viewId != null && viewId != "") this.shiftSideSelectionView(viewId, to);
    },

    onRightClickPickPool: function(e) {
        e.preventDefault();

        poolMaster.toggleTrevelerAlter();

        return false;
    },

    onChangedSide: function(side) {
        var treveler = 0;
        let accInfo = sideMaster.sideAccInfo[side];
        if (accInfo != null) {
            let player = accInfo.player;
            if (player != null) treveler = player.treveler;
        }
        this.toggleTrevelerAlter(treveler);
    },

    //unavailabled characters

    initUnavailables: function() {
        this.unavailables.attr(this.title, lang.text.pickUnallowed);
    },

    eoo: eoo
}

//each side player info master
let sideMaster = {

    red: ".red",
    blue: ".blue",

    red_side: "red_side",
    blue_side: "blue_side",

    player_board: "div.player_board",

    player_uid: "div.player_uid",
    nameplate: "div.nameplate",
    account_point: "div.account_point",
    profile_character: "div.profile_character",
    character_profile: "div.character_profile",
    account_info: "div.account_info",
    input: "input",

    filled: "data-filled",
    mix: "data-mix",

    entry_slots_area: "div.entry_slots_area",
    entry_slots: "ul.entry_slots",
    entry: "li.entry",
    entry_icon: "div.entry_icon",
    entry_info: "div.entry_info",

    ban_card_holder: "div.ban_card_holder",
    ban_card: "div.ban_card",
    ban_entry_place: "div.ban_entry_place",
    
    entry_constell: "input.entry_constell",

    id: "data-id",
    rarity: "data-rarity",
    enter: "data-enter",
    unabailable: "data-unabailable",

    constell: "data-constell",

    cost_counter_holder: "div.cost_counter_holder",
    cost_stack: "ul.cost_stack",
    cost_remains: "span.cost_remains",
    cost_pool_total: "span.cost_pool_total",
    cost_used: "div.cost_used",
    text_party_cost: "span.text_party_cost",
    cost_used_count: "span.cost_used_count",

    count: "data-count",
    used: "data-used",
    step: "data-step",

    ban_pick_board: "div#ban_pick_board",
    ban_side: "div.ban_side",
    ban_pick_title: "div.ban_pick_title span",
    ban_pick_side_area: "div.ban_pick_side_area",
    ban_pick_side_holder: "div.ban_pick_side_holder",
    ban_character: ".ban_character",
    ban_weapon: ".ban_weapon",
    ban_selection: "ul.ban_selection",
    ban_entry: "li.ban_entry",
    weapon_ban_selection: "ul.weapon_ban_selection",
    weapon_ban_entry: "li.weapon_ban_entry",
    ban_entry_icon: "div.entry_icon",

    appear: "data-appear",

    picking: "data-picking",
    picked: "data-picked",

    text: "data-text",


    cardy_extension_behind: "#cardy_extension_behind",

    cardy_bans: ".cardy_bans",
    additional_ban_picks: ".additional_ban_picks",
    joker_ban_picks: ".joker_ban_picks",


    versus_record_board: "div#versus_record_board",

    show: "data-show",

    side_record_board: "div.side_record_board",

    side: "data-side",

    side_player_info: "div.side_player_info",
    side_player_name: "span.side_player_name",
    side_player_uid: "span.side_player_uid",
    side_player_ap: "span.side_player_ap",

    side_record: "div.side_record",
    record_stage: ".record_stage",
    record_total: ".record_total",

    stage: "data-stage",
    result: "data-result",

    time_record: "div.time_record",
    record_time_remains: "div.record_time_remains",
    input_remains: "input.remains",
    record_time_add: "div.record_time_add",
    record_time_clear: "div.record_time_clear",
    span_clear_time: "span.clear_time",
    record_time_clear_total: "div.record_time_clear_total",
    span_total_clear_time: "span.total_clear_time",
    span_divider: "span.divider",

    tko_selection: "div.tko_selection",
    tko_selected: "span.tko_selected",
    tko_selections: "div.tko_selections",
    tko_caused_by: "button.tko_caused_by",

    tko: "data-tko",

    versus_progress_panel: "div#versus_progress_panel",
    progress_panel: "div.progress_panel",
    versus: "div.versus",
    stage_superiority: "div.superiority",
    graph: "div.graph",
    stage_time_differ: "span.time_differ",

    superior: "data-superior",


    eachPlayerBoard: null,

    eachPlayerUid: null,
    eachPlayerUidInput: null,
    eachNameplate: null,
    eachNameplateInput: null,
    eachAccountPoint: null,
    eachAccountPointInput: null,
    eachProfileCharacter: null,
    eachProfileCharacterImage: null,
    eachAccountInfo: null,

    eachEntrySlotArea: null,
    eachEntrySlots: null,
    eachEntries: null,
    
    eachCostCounterHolder: null,
    eachCostCounterStack: null,
    eachCostRemains: null,
    eachCostPoolTotal: null,
    eachCostUsed: null,
    eachTextPartyCost: null,
    eachCostUsedCount: null,

    banPickBoard: null,
    eachBanSide: null,
    eachBanPickTitle: null,
    eachBanPickArea: null,
    eachBanPickCharacterHolder: null,
    eachBanPickWeaponHolder: null,
    eachBanSelection: null,
    eachBanEntries: null,
    eachWeaponBanSelection: null,
    eachWeaponBanEntries: null,


    redPlayerBoard: null,

    redPlayerUid: null,
    redPlayerUidInput: null,
    redNameplate: null,
    redNameplateInput: null,
    redAccountPoint: null,
    redAccountPointInput: null,
    redProfileCharacter: null,
    redProfileCharacterImage: null,
    redAccountInfo: null,

    redEntrySlotArea: null,    
    redEntrySlots: null,    
    redEntries: null,    

    redCostCounterHolder: null,
    redCostCounterStack: null,
    redCostRemains: null,
    redCostPoolTotal: null,
    redCostUsed: null,
    redCostUsedCount: null,

    redBanSide: null,
    redBanSelection: null,
    redBanEntries: null,
    redWeaponBanSelection: null,
    redWeaponBanEntries: null,

    
    bluePlayerBoard: null,

    bluehPlayerUid: null,
    bluePlayerUidInput: null,
    blueNameplate: null,
    blueNameplateInput: null,
    blueAccountPoint: null,
    blueAccountPointInput: null,
    blueProfileCharacter: null,
    blueProfileCharacterImage: null,
    blueAccountInfo: null,

    blueEntrySlotArea: null,
    blueEntrySlots: null,
    blueEntries: null,

    blueCostCounterHolder: null,
    blueCostCounterStack: null,
    blueCostRemains: null,
    blueCostPoolTotal: null,
    blueCostUsed: null,
    blueCostUsedCount: null,

    blueBanSide: null,
    blueBanSelection: null,
    blueBanEntries: null,
    blueWeaponBanSelection: null,
    blueWeaponBanEntries: null,


    cardyExtensionBehind: null,

    cardyBans: null,
    cardyAdditionalBan: null,
    cardyAdditionalBanSelection: { "red": null, "blue": null },
    cardyJokerBan: null,
    cardyJokerBanSelection: { "red": null, "blue": null },


    versusRecordBoard: null,

    eachSideRecordBoard: null,

    eachSidePlayerInfo: null,
    eachSidePlayerName: null,

    eachSideRecord: null,
    eachSideRecordStage: null,
    eachSideRecordTotal: null,

    eachTimeRecord: null,
    eachRecordTimeRemains: null,
    eachInputRemains: null,
    eachRecordTimeClear: null,
    eachSpanClearTime: null,

    eachRecordTimeAdd: null,
    eachTimeRecordTotal: null,
    eachRecordTimeClearTotal: null,
    eachSpanTotalClearTime: null,

    eachTkoSelection: null,
    eachTkoSelected: null,
    eachTkoCausedBy: null,
    eachTkoSelections: null,

    redSideRecordBoard: null,

    redSidePlayerInfo: null,
    redSidePlayerName: null,
    redSidePlayerUid: null,
    redSidePlayerAp: null,

    redSideRecord: null,
    redSideRecordStage: null,
    redSideRecordTotal: null,

    redTimeRecord: null,
    redRecordTimeRemains: null,
    redInputRemains: null,
    redRecordTimeClear: null,
    redSpanClearTime: null,

    redTimeRecordTotal: null,
    redRecordTimeClearTotal: null,
    redSpanTotalClearTime: null,

    redTkoSelection: null,
    redTkoSelected: null,
    redTkoCausedBy: null,

    blueSideRecordBoard: null,

    blueSidePlayerInfo: null,
    blueSidePlayerName: null,
    blueSidePlayerUid: null,
    blueSidePlayerAp: null,

    blueSideRecord: null,
    blueSideRecordStage: null,
    blueSideRecordToatl: null,

    blueTimeRecord: null,
    blueRecordTimeRemains: null,
    blueInputRemains: null,
    blueRecordTimeClear: null,
    blueSpanClearTime: null,

    blueTimeRecordTotal: null,
    blueRecordTimeClearTotal: null,
    blueSpanTotalClearTime: null,

    blueTkoSelection: null,
    blueTkoSelected: null,
    blueTkoCausedBy: null,

    versusProgressPanel: null,
    progressPanels: null,
    progressPanel: [],
    stageSuperiority: [],
    stageTimeDiffer: [],


    entryPicked: {"red": [], "blue": []},
    banPicked: {"red": [], "blue": []},
    banCardUsed: {"red": [], "blue": []},
    aBanPicked: {"red": [], "blue": []},
    jBanPicked: {"red": [], "blue": []},
    weaponBanPicked: {"red": [], "blue": []},

    sideAccCode: { "red": null, "blue": null },
    sideAccInfo: { "red": null, "blue": null },
    sideAccInfoPrev: { "red": null, "blue": null },

    vsTimeRemains: { "red": [], "blue": [] },
    vsClearTime: { "red": [], "blue": [] },

    timeAdds: null,

    TKO_FIRST_HALF: 0,
    TKO_SECOND_HALF: -1,

    TKO_BY_TIMEOVER: -1,
    TKO_BY_POWERLOSS: -3,
    TKO_BY_SURRENDER: -5,

    init: function() {
        console.log("init sideMaster");
        
        //set element
        this.eachPlayerBoard = $(this.player_board);

        this.eachPlayerUid = this.eachPlayerBoard.find(this.player_uid);
        this.eachPlayerUidInput = this.eachPlayerUid.find(this.input);
        this.eachNameplate = this.eachPlayerBoard.find(this.nameplate);
        this.eachNameplateInput = this.eachNameplate.find(this.input);
        this.eachAccountPoint = this.eachPlayerBoard.find(this.account_point);
        this.eachAccountPointInput = this.eachAccountPoint.find(this.input);
        this.eachProfileCharacter = this.eachPlayerBoard.find(this.profile_character);
        this.eachProfileCharacterImage = this.eachProfileCharacter.find(this.character_profile);
        this.eachAccountInfo = this.eachPlayerBoard.find(this.account_info);

        this.eachEntrySlotArea = this.eachPlayerBoard.find(this.entry_slots_area);
        this.eachEntrySlots = this.eachEntrySlotArea.find(this.entry_slots);
        this.eachEntries = this.eachEntrySlots.find(this.entry);

        this.eachCostCounterHolder = this.eachEntrySlotArea.find(this.cost_counter_holder);
        this.eachCostCounterStack = this.eachCostCounterHolder.find(this.cost_stack);
        this.eachCostRemains = this.eachCostCounterHolder.find(this.cost_remains);
        this.eachCostPoolTotal = this.eachCostCounterHolder.find(this.cost_pool_total);
        this.eachCostUsed = this.eachCostCounterHolder.find(this.cost_used);
        this.eachTextPartyCost = this.eachCostUsed.find(this.text_party_cost);
        this.eachCostUsedCount = this.eachCostUsed.find(this.cost_used_count);

        this.banPickBoard = $(this.ban_pick_board);
        this.eachBanSide = this.banPickBoard.find(this.ban_side);
        this.eachBanPickTitle = this.eachBanSide.find(this.ban_pick_title);
        this.eachBanPickArea = this.eachBanSide.find(this.ban_pick_side_area);
        this.eachBanPickCharacterHolder = this.eachBanPickArea.find(this.ban_pick_side_holder + this.ban_character);
        this.eachBanPickWeaponHolder = this.eachBanPickArea.find(this.ban_pick_side_holder + this.ban_weapon);
        this.eachBanSelection = this.eachBanSide.find(this.ban_selection);
        this.eachWeaponBanSelection = this.eachBanSide.find(this.weapon_ban_selection);
        this.eachWeaponBanEntries = this.eachWeaponBanSelection.find(this.weapon_ban_entry);


        this.redPlayerBoard = this.eachPlayerBoard.filter(this.red);

        this.redPlayerUid = this.redPlayerBoard.find(this.player_uid);
        this.redPlayerUidInput = this.redPlayerUid.find(this.input);
        this.redNameplate = this.redPlayerBoard.find(this.nameplate);
        this.redNameplateInput = this.redNameplate.find(this.input);
        this.redAccountPoint = this.redPlayerBoard.find(this.account_point);
        this.redAccountPointInput = this.redAccountPoint.find(this.input);
        this.redProfileCharacter = this.redPlayerBoard.find(this.profile_character);
        this.redProfileCharacterImage = this.redProfileCharacter.find(this.character_profile);
        this.redAccountInfo = this.redPlayerBoard.find(this.account_info);

        this.redEntrySlotArea = this.redPlayerBoard.find(this.entry_slots_area);
        this.redEntrySlots = this.redEntrySlotArea.find(this.entry_slots);
        this.redEntries = this.redEntrySlots.find(this.entry);

        this.redCostCounterHolder = this.redEntrySlotArea.find(this.cost_counter_holder);
        this.redCostCounterStack = this.redCostCounterHolder.find(this.cost_stack);
        this.redCostRemains = this.redCostCounterHolder.find(this.cost_remains);
        this.redCostPoolTotal = this.redCostCounterHolder.find(this.cost_pool_total);
        this.redCostUsed = this.redCostCounterHolder.find(this.cost_used);
        this.redCostUsedCount = this.redCostUsed.find(this.cost_used_count);

        this.redBanSide = this.eachBanSide.filter(this.red);
        this.redBanSelection = this.redBanSide.find(this.ban_selection);
        this.redWeaponBanSelection = this.redBanSide.find(this.weapon_ban_selection);
        this.redWeaponBanEntries = this.redWeaponBanSelection.find(this.weapon_ban_entry);


        this.bluePlayerBoard = this.eachPlayerBoard.filter(this.blue);

        this.bluehPlayerUid = this.bluePlayerBoard.find(this.player_uid);
        this.bluePlayerUidInput = this.bluehPlayerUid.find(this.input);
        this.blueNameplate = this.bluePlayerBoard.find(this.nameplate);
        this.blueNameplateInput = this.blueNameplate.find(this.input);
        this.blueAccountPoint = this.bluePlayerBoard.find(this.account_point);
        this.blueAccountPointInput = this.blueAccountPoint.find(this.input);
        this.blueProfileCharacter = this.bluePlayerBoard.find(this.profile_character);
        this.blueProfileCharacterImage = this.blueProfileCharacter.find(this.character_profile);
        this.blueAccountInfo = this.bluePlayerBoard.find(this.account_info);

        this.blueEntrySlotArea = this.bluePlayerBoard.find(this.entry_slots_area);
        this.blueEntrySlots = this.blueEntrySlotArea.find(this.entry_slots);
        this.blueEntries = this.blueEntrySlots.find(this.entry);

        this.blueCostCounterHolder = this.blueEntrySlotArea.find(this.cost_counter_holder);
        this.blueCostCounterStack = this.blueCostCounterHolder.find(this.cost_stack);
        this.blueCostRemains = this.blueCostCounterHolder.find(this.cost_remains);
        this.blueCostPoolTotal = this.blueCostCounterHolder.find(this.cost_pool_total);
        this.blueCostUsed = this.blueCostCounterHolder.find(this.cost_used);
        this.blueCostUsedCount = this.blueCostUsed.find(this.cost_used_count);

        this.blueBanSide = this.eachBanSide.filter(this.blue);
        this.blueBanSelection = this.blueBanSide.find(this.ban_selection);
        this.blueWeaponBanSelection = this.blueBanSide.find(this.weapon_ban_selection);
        this.blueWeaponBanEntries = this.blueWeaponBanSelection.find(this.weapon_ban_entry);



        this.cardyExtensionBehind = $(this.cardy_extension_behind);

        this.cardyBans = this.cardyExtensionBehind.find(this.cardy_bans);
        this.cardyAdditionalBan = this.cardyBans.filter(this.additional_ban_picks);
        this.cardyAdditionalBanSelection.red = this.cardyAdditionalBan.filter(this.red).find(this.ban_selection);
        this.cardyAdditionalBanSelection.blue = this.cardyAdditionalBan.filter(this.blue).find(this.ban_selection);
        this.cardyJokerBan = this.cardyBans.filter(this.joker_ban_picks);
        this.cardyJokerBanSelection.red = this.cardyJokerBan.filter(this.red).find(this.ban_selection);
        this.cardyJokerBanSelection.blue = this.cardyJokerBan.filter(this.blue).find(this.ban_selection);



        this.versusRecordBoard = $(this.versus_record_board);

        this.eachSideRecordBoard = this.versusRecordBoard.find(this.side_record_board);

        this.eachSidePlayerInfo = this.eachSideRecordBoard.find(this.side_player_info);
        this.eachSidePlayerName = this.eachSidePlayerInfo.find(this.side_player_name);
    
        this.eachSideRecord = this.eachSideRecordBoard.find(this.side_record);
        this.eachSideRecordStage = this.eachSideRecord.filter(this.record_stage);
        this.eachSideRecordTotal = this.eachSideRecord.filter(this.record_total);
    
        this.eachTimeRecord = this.eachSideRecordStage.find(this.time_record);
        this.eachRecordTimeRemains = this.eachTimeRecord.find(this.record_time_remains);
        this.eachInputRemains = this.eachRecordTimeRemains.find(this.input_remains);
        this.eachRecordTimeClear = this.eachTimeRecord.find(this.record_time_clear);
        this.eachSpanClearTime = this.eachRecordTimeClear.find(this.span_clear_time);
        this.eachSpanDivider = this.eachRecordTimeClear.find(this.span_divider);

        this.eachRecordTimeAdd = this.eachSideRecordTotal.find(this.record_time_add);
        this.eachTimeRecordTotal = this.eachSideRecordTotal.find(this.time_record);
        this.eachRecordTimeClearTotal = this.eachTimeRecordTotal.find(this.record_time_clear_total);
        this.eachSpanTotalClearTime = this.eachRecordTimeClearTotal.find(this.span_total_clear_time);
        this.eachSpanTotalDivider = this.eachRecordTimeClearTotal.find(this.span_divider);
    
        this.eachTkoSelection = this.eachSideRecordStage.find(this.tko_selection);
        this.eachTkoSelected = this.eachTkoSelection.find(this.tko_selected);
        this.eachTkoSelections = this.eachTkoSelection.find(this.tko_selections);
        this.eachTkoCausedBy = this.eachTkoSelection.find(this.tko_caused_by);

        
        this.redSideRecordBoard = this.eachSideRecordBoard.filter(this.red);

        this.redSidePlayerInfo = this.redSideRecordBoard.find(this.side_player_info);
        this.redSidePlayerName = this.redSidePlayerInfo.find(this.side_player_name);
        this.redSidePlayerUid = this.redSidePlayerInfo.find(this.side_player_uid);
        this.redSidePlayerAp = this.redSidePlayerInfo.find(this.side_player_ap);
    
        this.redSideRecord = this.redSideRecordBoard.find(this.side_record);
        this.redSideRecordStage = this.redSideRecord.filter(this.record_stage);
        this.redSideRecordTotal = this.redSideRecord.filter(this.record_total);
    
        this.redTimeRecord = this.redSideRecordStage.find(this.time_record);
        this.redRecordTimeRemains = this.redTimeRecord.find(this.record_time_remains);
        this.redInputRemains = this.redRecordTimeRemains.find(this.input_remains);
        this.redRecordTimeClear = this.redTimeRecord.find(this.record_time_clear);
        this.redSpanClearTime = this.redRecordTimeClear.find(this.span_clear_time);
        this.redSpanDivider = this.redRecordTimeClear.find(this.span_divider);

        this.redTimeRecordTotal = this.redSideRecordTotal.find(this.time_record);
        this.redRecordTimeClearTotal = this.redTimeRecordTotal.find(this.record_time_clear_total);
        this.redSpanTotalClearTime = this.redRecordTimeClearTotal.find(this.span_total_clear_time);
        this.redSpanTotalDivider = this.redRecordTimeClearTotal.find(this.span_divider);
    
        this.redTkoSelection = this.redSideRecordStage.find(this.tko_selection);
        this.redTkoSelected = this.redTkoSelection.find(this.tko_selected);
        this.redTkoCausedBy = this.redTkoSelection.find(this.tko_caused_by);


        this.blueSideRecordBoard = this.eachSideRecordBoard.filter(this.blue);

        this.blueSidePlayerInfo = this.blueSideRecordBoard.find(this.side_player_info);
        this.blueSidePlayerName = this.blueSidePlayerInfo.find(this.side_player_name);
        this.blueSidePlayerUid = this.blueSidePlayerInfo.find(this.side_player_uid);
        this.blueSidePlayerAp = this.blueSidePlayerInfo.find(this.side_player_ap);
    
        this.blueSideRecord = this.blueSideRecordBoard.find(this.side_record);
        this.blueSideRecordStage = this.blueSideRecord.filter(this.record_stage);
        this.blueSideRecordTotal = this.blueSideRecord.filter(this.record_total);
    
        this.blueTimeRecord = this.blueSideRecordStage.find(this.time_record);
        this.blueRecordTimeRemains = this.blueTimeRecord.find(this.record_time_remains);
        this.blueInputRemains = this.blueRecordTimeRemains.find(this.input_remains);
        this.blueRecordTimeClear = this.blueTimeRecord.find(this.record_time_clear);
        this.blueSpanClearTime = this.blueRecordTimeClear.find(this.span_clear_time);
        this.blueSpanDivider = this.blueRecordTimeClear.find(this.span_divider);

        this.blueTimeRecordTotal = this.blueSideRecordTotal.find(this.time_record);
        this.blueRecordTimeClearTotal = this.blueTimeRecordTotal.find(this.record_time_clear_total);
        this.blueSpanTotalClearTime = this.blueRecordTimeClearTotal.find(this.span_total_clear_time);
        this.blueSpanTotalDivider = this.blueRecordTimeClearTotal.find(this.span_divider);
    
        this.blueTkoSelection = this.blueSideRecordStage.find(this.tko_selection);
        this.blueTkoSelected = this.blueTkoSelection.find(this.tko_selected);
        this.blueTkoCausedBy = this.blueTkoSelection.find(this.tko_caused_by);

        
        this.versusProgressPanel = this.versusRecordBoard.find(this.versus_progress_panel);
        this.progressPanels = this.versusProgressPanel.find(this.progress_panel);
        this.progressPanel = new Array(4);
        this.progressPanel[0] = this.progressPanels.filter(".result");
        this.progressPanel[1] = this.progressPanels.filter(".stage1");
        this.progressPanel[2] = this.progressPanels.filter(".stage2");
        this.progressPanel[3] = this.progressPanels.filter(".stage3");
        this.stageSuperiority = new Array(4);
        this.stageSuperiority[0] = this.progressPanel[0].find(this.stage_superiority);
        this.stageSuperiority[1] = this.progressPanel[1].find(this.stage_superiority);
        this.stageSuperiority[2] = this.progressPanel[2].find(this.stage_superiority);
        this.stageSuperiority[3] = this.progressPanel[3].find(this.stage_superiority);
        this.stageTimeDiffer = new Array(4);
        this.stageTimeDiffer[0] = this.stageSuperiority[0].find(this.stage_time_differ);
        this.stageTimeDiffer[1] = this.stageSuperiority[1].find(this.stage_time_differ);
        this.stageTimeDiffer[2] = this.stageSuperiority[2].find(this.stage_time_differ);
        this.stageTimeDiffer[3] = this.stageSuperiority[3].find(this.stage_time_differ);
    


        //initialize
        this.initSideInfo();

        this.applyCostAmount();

        this.initCostRemains();
        this.initCostUsedCount();

        this.initEntries();
        this.resetEntryPicked();

        this.initBanEntries();

        this.initBanWeapons();

        this.initVersusRecordBoard();
        this.hideVersusRecordBoard();

        
        //set event
        this.eachNameplateInput.keydown(this.onEachNameplateInputKeydown);
        this.eachNameplateInput.focus(this.onEachNameplateInputFocus);
        this.redNameplateInput.on("change", this.onRedNameplateInputChanged);
        this.blueNameplateInput.on("change", this.onBlueNameplateInputChanged);

        this.eachPlayerUidInput.on("paste", this.onPasteData);
        this.eachNameplateInput.on("paste", this.onPasteData);
        this.eachAccountPointInput.on("paste", this.onPasteData);

        this.redAccountInfo.click(this.onClickRedAccountInfo);
        this.redAccountInfo.contextmenu(this.onRightClickRedAccountInfo);
        this.blueAccountInfo.click(this.onClickBlueAccountInfo);
        this.blueAccountInfo.contextmenu(this.onRightClickBlueAccountInfo);
        
        //매치 현황 패널 이벤트 구현
        this.eachInputRemains.on("input change", this.onVersusInputRemains);
        this.eachInputRemains.focus(function(e) { $(this).select(); });
        this.eachInputRemains.blur(this.onBlurVersusInputRemains);
        this.eachInputRemains.keydown(this.onKeydownVersusInputRemains);

        this.eachTkoCausedBy.click(this.onClickTkoButton);
    },

    initDesc: function() {
        let text = lang.text;

        this.eachAccountInfo.attr("title", text.accountInfoIndicatorDesc);

        this.initVersusRecordBoardDesc();
    },

    initSideInfo: function() {
        this.initPlayerUid();
        this.initNameplate();
        this.initAccountPoint();
        this.initProfileCharacter();
        this.initAccountInfo();
    },

    initPlayerUid: function() {
        this.redPlayerUidInput.val("");
        this.bluePlayerUidInput.val("");
    },

    initNameplate: function() {
        this.redNameplateInput.val(lang.text.sideRed);
        this.blueNameplateInput.val(lang.text.sideBlue);
    },

    initAccountPoint: function() {
        this.redAccountPointInput.val("");
        this.blueAccountPointInput.val("");
    },

    initProfileCharacter: function() {
        this.eachProfileCharacterImage.css("--src", urlTpGif);
        this.eachProfileCharacter.attr("data-show", "");
    },

    initAccountInfo: function() {
        this.setAccountInfo("red");
        this.setAccountInfo("blue");
    },

    initSideEntered: function(side) {
        switch(side) {
            case "red":
                this.redPlayerUidInput.val("");
                this.redNameplateInput.val(lang.text.sideRed);
                this.redAccountPointInput.val("");
                break;

            case "blue":
                this.bluePlayerUidInput.val("");
                this.blueNameplateInput.val(lang.text.sideBlue);
                this.blueAccountPointInput.val("");
                break;
        }
    },

    isEmptySideInfo: function() {
        return this.redPlayerUidInput.val() == "" && this.bluePlayerUidInput.val() == ""
            && this.redNameplateInput.val() == lang.text.sideRed && this.blueNameplateInput.val() == lang.text.sideBlue
            && this.redAccountPointInput.val() == "" && this.blueAccountPointInput.val() == ""
            && this.redProfileCharacterImage.css("--src") == urlTpGif && this.blueProfileCharacterImage.css("--src") == urlTpGif
            && this.redProfileCharacter.attr("data-show") == "" && this.blueProfileCharacter.attr("data-show") == ""
            && this.sideAccInfo["red"] == null && this.sideAccInfo["blue"] == null;
    },

    onEachNameplateInputKeydown: function(e) {
        let self = $(this);
        let isSideRed = self.hasClass(sideMaster.red_side);
        let isSideBlue = self.hasClass(sideMaster.blue_side);
        switch (e.keyCode) {
            case 13:
                if (isSideRed && sideMaster.blueNameplate.val() == lang.text.sideBlue) {
                    sideMaster.blueNameplate.focus()
                } else self.blur();
                e.preventDefault();
                return false;

            case 27:
                e.preventDefault();
                let prev = isSideRed ? redName : blueName;
                self.val(prev == null || prev == "" ? (isSideRed ? lang.text.sideRed : lang.text.sideBlue) : prev);
                self.blur();
                return false;
            
            default:
                break;
        }
    
    },

    onPasteData: function(e) {
        let self = $(e.target == null ? e : e.target);

        var raw = null;
        if (e.clipboardData != null) raw = e.clipboardData.getData("text/plain");

        let side = self.attr("class") == "red_side" ? "red" : "blue";

        if (raw != null) {
            if (sideMaster.applyAccountInfo(raw, side)) {
                e.preventDefault();
                return false;
            }
        } else {
            let prevData = self.val().trim();
            //self.val("");
            setTimeout(function() {
                let pasted = self.val().trim();
                let pastedClean = pasted.replace(/@GCBPSv[0-9]+:.*;/g, "").replace(/@GCBPSv[0-9]+:.*/g, "").replace(/{"player":\{.*\}.*\}/g, "");
                let data = pasted.replace(prevData, "");
                let success = sideMaster.applyAccountInfo(data, side);
                if (!success || sideMaster.sideAccInfo[side].player.name.trim() == "") self.val(pastedClean);
                //if (self.val() == "") self.focus();
            }, 10);
        }
    },

    applyAccountInfo: function(raw, side) {
        sideMaster.sideAccCode[side] = raw;
        var data = sideMaster.parsePlayerData(raw);

        if (data != null) {
            sideMaster.loadAccInfo(data, side);
            playerInfoMaster.loadedAccInfo(raw, data, side);
            playSound("뜍");
            return true;
        } else return false;
    },

    parsePlayerData: function(text) {
        if (text == null || text == "") return null;

        text = text.trim();
        var version;
        try {
            if (text.substr(0, 7) == "@GCBPSv") {
                let texts = text.split(":");
                let header = texts[0];
                version = parseInt(header.split("v")[1]);
                let base64 = texts[1].replace(/;/g, "");
                text = atob(base64);
            }
    
            var data;
            switch(version) {
                default:
                case 2:
                    data = Jcodd.parse(text);

                    let list = data.list;
                    for (var i=0; i<list.length; i++) {
                        var cons = list[i];
                        if (cons > 6) cons = 6;
                        else if (cons < 0) cons = null;
                        let id = charactersInfo.list[i].id;
                        if (id != null) data[id] = cons;
                    }
                    break;
    
                case 1:
                    data = JSON.parse(text);
                    break;
            }
        
            return data;
        } catch(e) {
            console.error(e.name, e.message, e.stack);
        }
        return null;
    },

    loadAccInfo(data, side, reload = false) {
        if (data != null && side != null) {
            this.setAccountInfo(side, data, reload);
            var point = 0;

            for(var i in data) {
                if (i != "player" && i != "prebanned" && i != "selfbanned" && i != "list") {
                    let cons = data[i];
                    let info = charactersInfo.list[charactersInfo[i]];
                    if (cons != null && info.class == "limited") point += parseInt(cons) + 1;
                }
            }

            let playerInfo = data.player;
            this.setPlayerInfo(side, point, playerInfo);
        }
    },

    setPlayerInfo: function(side, point, p) {
        switch(side) {
            case "red":
                if (p != null) {
                    if (p.uid != null && p.uid != "") this.redPlayerUidInput.val(p.uid);
                    if (p.name != null && p.name != "") this.redNameplateInput.val(unescape(p.name));
                    if (p.treveler != null && p.treveler != "") {
                        //행자 선택 구현 - 필요 없음
                    }
                }
                if (point != null) this.redAccountPointInput.val(point);
                break;

            case "blue":
                if (p != null) {
                    if (p.uid != null && p.uid != "") this.bluePlayerUidInput.val(p.uid);
                    if (p.name != null && p.name != "") this.blueNameplateInput.val(unescape(p.name));
                    if (p.treveler != null && p.treveler != "") {
                        //행자 선택 구현 - 필요 없음
                    }
                }
                if (point != null) this.blueAccountPointInput.val(point);
                break;
        }
    },

    setAccountInfo: function(side, data = null, reload = false) {
        if (side == null) return;

        let curInfo = this.sideAccInfo[side];
        if (curInfo != null && !reload) this.sideAccInfoPrev[side] = curInfo;
        this.sideAccInfo[side] = data;
        this.releaseAccountInfo(side);
    },

    reloadAccountInfo: function(side) {
        if (side == null) return;

        let prevInfo = this.sideAccInfoPrev[side];
        if (prevInfo != null) {
            this.loadAccInfo(prevInfo, side, true);
            playSound("쒇");
        }
    },

    releaseRedAccountInfo: function() {
        this.redAccountInfo.attr(this.filled, this.sideAccInfo.red != null ? "1" : "");
    },

    releaseBlueAccountInfo: function() {
        this.blueAccountInfo.attr(this.filled, this.sideAccInfo.blue != null ? "1" : "");
    },

    releaseAccountInfo: function(side) {
        switch(side) {
            case "red":
                this.releaseRedAccountInfo();
                break;

            case "blue":
                this.releaseBlueAccountInfo();
                break;
        }
    },

    onClickRedAccountInfo: function(e) {
        sideMaster.clearAccountInfo("red");
    },

    onClickBlueAccountInfo: function(e) {
        sideMaster.clearAccountInfo("blue");
    },

    clearAccountInfo: function(side) {
        if (this.sideAccInfo[side] != null) {
            this.setAccountInfo(side);
            playSound("띡");
        } else {
            this.initSideEntered(side);
            playSound("싁");
        }
        this.releaseAccountInfo(side);
    },

    onRightClickRedAccountInfo: function(e) {
        e.preventDefault();
        sideMaster.reloadAccountInfo("red");
        return false;
    },

    onRightClickBlueAccountInfo: function(e) {
        e.preventDefault();
        sideMaster.reloadAccountInfo("blue");
        return false;
    },

    //nameplate

    setNameplate: function(each, blue) {
        if (blue != null) {
            this.setNameRed(each);
            this.setNameBlue(blue);
        } else this.eachNameplateInput.val(each);
    },

    setNameRed: function(name) {
        this.redNameplateInput.val(name);
    },

    setNameBlue: function(name) {
        this.blueNameplateInput.val(name);
    },

    onEachNameplateInputFocus: function(e) {
        $(this).select();
    },
    
    onRedNameplateInputChanged: function(e) {
        redName = $(this).val();
    },

    onBlueNameplateInputChanged: function(e) {
        blueName = $(this).val();
    },

    setNameplateMix: function(side, set = "") {
        switch (side) {
            case "red":
                this.redNameplate.attr(this.mix, set);
                break;

            case "blue":
                this.blueNameplate.attr(this.mix, set);
                break;
        }
    },


    //Player profile
    setPlayerProfileShow(side, set = "") {
        switch (side) {
            case "red":
                this.redProfileCharacter.attr(this.show, set);
                break;

            case "blue":
                this.blueProfileCharacter.attr(this.show, set);
                break;
        }

    },


    //cost
    
    resetCostUsed: function() {
        this.resetCostUsedSide(this.eachCostCounterStack);
    },

    resetCostUsedSide: function(side) {
        side.find("li").each(function(i, item) {
            $(item).attr("data-used", null);
        });
    },

    releaseCostAmountChanged: function() {
        this.applyCostAmount();

        this.initCostRemains();
        this.initCostUsedCount();
    },

    applyCostAmount: function() {
        this.applyCostAmountSide(this.redCostCounterStack);
        this.applyCostAmountSide(this.blueCostCounterStack);
        this.eachCostPoolTotal.attr("data-count", rules.cost_amount);
    },

    applyCostAmountSide: function(stack) {
        stack.empty();
        for (i=0; i < rules.cost_amount; i++) {
            stack.append(this.buildCostStackItem());
        }
    },

    buildCostStackItem: function() {
        let item = document.createElement("li");
        let img = document.createElement("img");
        let costUrl = getPathR("images", "", "cost.png");
        img.setAttribute("src", costUrl);
        item.append(img);
        return item;
    },

    initCostRemains: function() {
        this.eachCostRemains.attr("data-count", rules.cost_amount);
    },

    initCostUsedCount: function() {
        this.eachCostUsedCount.attr("data-count", 0);
    },


    //entry

    initEntries: function() {
        this.eachEntrySlots.empty();

        var pickSeq = { "red": 0, "blue": 0 };
        var afterBan = { "red": false, "blue": false };
        for (var i=0; i<rules.sequence.length; i++) {
            let seq = rules.sequence[i];
            let counterSide = seq.side == "red" ? "blue" : "red";
            var targetSide = seq.side;

            for (var n=0; n<seq.amount; n++) {
                var slot;
                switch (seq.pick) {
                    case "entry":
                        if (seq.isSuper !== true) pickSeq[seq.side]++;
                        slot = this.buildEntrySlot(seq.side, pickSeq[seq.side], afterBan[seq.side], seq.isSuper);
                        afterBan[seq.side] = false;
                        break;

                    case "proffer":
                        if (seq.isSuper !== true) pickSeq[seq.side]++;
                        slot = this.buildEntrySlot(counterSide, pickSeq[seq.side], afterBan[seq.side], seq.isSuper);
                        targetSide = counterSide;
                        afterBan[seq.side] = false;
                        break;
                        
                    case "preban":
                    case "ban":
                        afterBan[seq.side] = true;
                        continue;
                }

                switch (targetSide) {
                    case "red":
                        this.redEntrySlots.append(slot);
                        break;
        
                    case "blue":
                        this.blueEntrySlots.append(slot);
                        break;
                }
            }
        }

        this.eachEntries = this.eachEntrySlots.find(this.entry);
        this.redEntries = this.redEntrySlots.find(this.entry);
        this.blueEntries = this.blueEntrySlots.find(this.entry);
        this.setEntryEvents();
    },

    buildEntrySlot(side, seq, afterBan, isSuper) {
        let item = document.createElement("li");
        item.setAttribute("class", "entry " + side);
        if (afterBan) item.setAttribute("data-after-ban", "1");
        if (isSuper === true) item.setAttribute("data-super-pick", "1");

        let icon = document.createElement("div");
        icon.setAttribute("class", "entry_icon");
        icon.setAttribute("data-seq", "" + seq);
        item.appendChild(icon);
        let info = document.createElement("div");
        info.setAttribute("class", "entry_info");
        item.appendChild(info);

        return item;
    },

    setEntryEvents: function() {
        this.eachEntries.find(this.entry_icon).click(this.onClickEntryIcon);
    },

    resetEntryPicked: function() {
        this.entryPicked["red"] = [];
        this.entryPicked["blue"] = [];
        this.eachEntries.each(function(i, item) {
            sideMaster.setEntryContent(item);
            sideMaster.setEntryAvailable(item);
            item = $(item)
            item.attr(sideMaster.id, "");
            item.attr(sideMaster.rarity, "");
            item.attr(sideMaster.enter, "");
            item.css("--src", "");
            item.css("--scale", "");
            item.css("--ph", "");
            item.css("--pv", "");
        });
    },

    onPickedEntry: function(id, side = rules.sequence[step].side) {
        let info = charactersInfo.list[charactersInfo[id]];

        var slot;
        switch(side) {
            case "red":
                slot = $(this.redEntries[this.entryPicked["red"].length]);
                this.entryPicked["red"].push(info);
                break;

            case "blue":
                slot = $(this.blueEntries[this.entryPicked["blue"].length]);
                this.entryPicked["blue"].push(info);
                break;
        }

        playSound("싕", 100);

        let constell = this.sideAccInfo[side] != null ? this.sideAccInfo[side][id] : null;

        let adds = ((rules.rule_type == "cost" || rules.rule_type == "preban") && constell != null) ? this.getAdditionalCost(id, parseInt(constell)) : 0;
        this.setEntryContent(slot, this.buildEntryIcon(info), this.buildEntryInfoArea(id, adds), info);
        slot.attr(this.id, info.id);
        slot.attr(this.rarity, info.rarity);
        slot.css("--src", "url('" + getPath("images", "character_wide", info.res_wide) + "')");
        slot.css("--scale", info.res_wide_meta_pos.scale);
        slot.css("--ph", info.res_wide_meta_pos.h);
        slot.css("--pv", info.res_wide_meta_pos.v);
        setTimeout(function() {
            slot.attr(sideMaster.enter, "1");
        }, 10);
        let constInput = slot.find(sideMaster.entry_icon + " > " + sideMaster.entry_constell);
        if (constell != null) {
            constInput.val(constell);
            constInput.attr(this.constell, constell);
        } else setTimeout(function() {
            constInput.focus();
        }, 100);

        let banCard = rules.rule_type == "ban card" ? rules.ban_card_accure[id] : null;

        //추가 코스트 이벤트(클릭/휠) 핸들
        slot = $(slot);
        let costArea = slot.find("div.entry_cost");
        costArea.click(function (e) {
            sideMaster.increaseAdditionalCost(this);
        });
        costArea.contextmenu(function (e) {
            e.preventDefault()
            sideMaster.decreaseAdditionalCost(this);
            return false;
        });
        costArea.on("wheel", function(e) {
            e.preventDefault();
            if (e.originalEvent.deltaY < 0) {
                sideMaster.increaseAdditionalCost(this);
                return false;
            } else if (e.originalEvent.deltaY > 0) {
                sideMaster.decreaseAdditionalCost(this);
                return false;
            }
        });
        costArea.on("mousedown", function(e) {
            if (e.which == 2) {
                e.preventDefault;
                sideMaster.initializeAdditionalCost(this);
                return false;
            }
        });

        if (constell != null) return buildStepHistoryExtra(constell, adds, false, banCard);
        else return buildStepHistoryExtraForBanCard(banCard);
    },

    onUndoPickEntry: function(id, side) {
        let sidePicked = this.entryPicked[side];
        
        for (i = sidePicked.length-1; i>-1; i--) {
            let picked = sidePicked[i];

            if (picked.id == id) {
                sidePicked.pop();

                var slot;
                switch (side) {
                    case "red":
                        slot = $(this.redEntries[i]);
                        break;

                    case "blue":
                        slot = $(this.blueEntries[i]);
                        break;
                }

                this.setEntryContent(slot);
                this.setEntryAvailable(slot[0]);
                slot.attr(this.id, "");
                slot.attr(this.rarity, "");
                slot.attr(this.enter, "");
                slot.css("--src", "");
                slot.css("--scale", "");
                slot.css("--ph", "");
                slot.css("--pv", "");
                break;
            }
        }
    },

    setEntryContent: function(item, icon = "", info = "", charInfo) {
        item = $(item);
        item.attr(this.picked, icon == "" ? null : "1");
        item.find(this.entry_icon).html(icon);
        if (icon != "") item.find(this.entry_icon).prepend(this.buildEntryElement(charInfo)).append(this.buildEntryTag(charInfo)).append(this.buildEntryIconExtra());
        let constell = item.find(this.entry_icon + " > " + this.entry_constell)
        constell.on("change input", this.onChangeEntryConstell);
        constell.focus(function(e) {
            this.select();
        });
        item.find(this.entry_info).html(info);
    },

    setEntryInfo: function(item, info = "") {
        item = $(item);
        item.find(this.entry_info).html(info);
    },

    setEntryAvailable: function(item, state = true) {
        if (state) item.removeAttribute(this.unabailable);
        else item.setAttribute(this.unabailable, "1");
    },

    buildEntryIcon: function(info) {
        let icon = document.createElement("img");
        icon.setAttribute("class", "character_icon");
        icon.setAttribute("src", getPathR("images", "character_icon", info.res_icon));
        icon.setAttribute("title", lang.text.setConstellationDesc);
        return icon;
    },

    buildEntryElement: function(info) {
        let element = document.createElement("img");
        element.setAttribute("class", "element_icon");
        if (info != null) {
            let charElement = commonInfo.element.res_icon[info.element];
            element.setAttribute("src", charElement == null ? tpGif : getPathR("images", "element_icon", charElement));
        }
        return element;
    },
    
    buildEntryTag: function(info) {
        let nametag = document.createElement("span");
        nametag.setAttribute("class", "name_tag");
        if (info != null) {
            try {
                nametag.innerHTML = info.name[loca];
            } catch (e) {

            }
        }
        return nametag;
    },
    
    buildEntryIconExtra: function() {
        let input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("class", "entry_constell");
        input.setAttribute("size", "1");
        input.setAttribute("maxlength", "1");
        input.setAttribute("placholder", "?");
        input.setAttribute("data-constell", "");
        input.setAttribute("title", lang.text.setConstellationDesc);

        return input;
    },

    buildEntryInfoArea: function(id, add = 0) {
        let info = document.createElement("div");
        switch(rules.rule_type) {
            case "preban":
            case "cost":
                info.setAttribute(this.step, stepHistory.length);
                let cost = this.getCostByCharacter(id);
                info.setAttribute("class", "entry_cost");
                info.setAttribute("title", lang.text.entryCostDesc);
                let baseCost = document.createElement("span");
                baseCost.setAttribute("class", "base_cost");
                baseCost.innerText = cost;
                info.append(baseCost);
                let addCost = document.createElement("span");
                addCost.setAttribute("class", "additional_cost");
                addCost.innerText = add > 0 ? "+" + add : (add == 0 ? "" : add);
                info.append(addCost);
                break;

            case "ban card":
                info.setAttribute(this.step, step);
                info.setAttribute("class", "ban_card_holder");
                if (rules.ban_card_accure[id]) {
                    info.setAttribute("title", lang.text.entryBanCardDesc);
                    let banCard = document.createElement("div");
                    banCard.setAttribute("class", "ban_card");
                    let banCardFront = document.createElement("div");
                    banCardFront.setAttribute("class", "ban_card_front");
                    let banEntryPlace = document.createElement("div");
                    banEntryPlace.setAttribute("class", "ban_entry_place");
                    let banEntry = document.createElement("img");
                    banEntry.setAttribute("class", "character_icon");
                    banEntry.setAttribute("src", tpGif);
                    banEntryPlace.append(banEntry);
                    banCardFront.append(banEntryPlace);
                    let banInitial = document.createElement("span");
                    banInitial.setAttribute("class", "ban_initial fw");
                    banInitial.textContent = "B";
                    banCardFront.append(banInitial);
                    let banInitialR = document.createElement("span");
                    banInitialR.setAttribute("class", "ban_initial bw");
                    banInitialR.textContent = "B";
                    banCardFront.append(banInitialR);
                    let banEntryElement = document.createElement("img");
                    banEntryElement.setAttribute("class", "element_icon fw");
                    banEntryElement.setAttribute("src", tpGif);
                    banCardFront.append(banEntryElement);
                    let banEntryElementR = document.createElement("img");
                    banEntryElementR.setAttribute("class", "element_icon bw");
                    banEntryElementR.setAttribute("src", tpGif);
                    banCardFront.append(banEntryElementR);
                    let nametag = document.createElement("span");
                    nametag.setAttribute("class", "name_tag");
                    banCardFront.append(nametag);
                    banCard.append(banCardFront);
                    let banCardBack = document.createElement("div");
                    banCardBack.setAttribute("class", "ban_card_back");
                    let banCardBehind = document.createElement("span");
                    banCardBehind.setAttribute("class", "ban_card_behind");
                    banCardBehind.textContent = "BAN";//뒷면 텍스트 다국어 처리 필요
                    banCardBack.append(banCardBehind);
                    banCard.append(banCardBack);
                    info.append(banCard);
                }

                break;
        }
        return info;
    },

    onClickEntryIcon: function(e) {
        let self = $(this);
        if (self.closest(sideMaster.entry).attr(sideMaster.picked) != "1") return;
        self.find(sideMaster.entry_constell).focus();
    },

    onChangeEntryConstell: function(e) {
        let self = $(this);

        if (self.val().trim() !== "" && parseInt(self.val()) > 6) self.val("6");
        self.attr(sideMaster.constell, self.val());

        let slot = self.closest(sideMaster.entry);

        if (rules.rule_type == "cost" || rules.rule_type == "preban") sideMaster.releaseAdditionalCostByEntryConstell(slot);
        playerInfoMaster.onChangedCharConstell(slot.attr(sideMaster.id), self.val());
    },

    getAdditionalCost(id, constell = 0) {
        let info = charactersInfo.list[charactersInfo[id]];

        if (rules.cost_table) {
            let base = poolMaster.getCost(id);
            let total = poolMaster.getCost(id, constell);
            return total - base;
        } else {
            let conds = rules.additional_cost.conditions;
            var adds = 0;
            for (var i=0; i < conds.length; i++) {
                let cond = conds[i];
                if (cond.c_class != null) {
                    if (info.class != cond.c_class) continue;
                }
                if (cond.c_constellations != null) {
                    let cons = cond.c_constellations.split(" ");
                    let con = parseInt(cons[1]);

                    switch (cons[0]) {
                        case "===":
                            if (!(constell == con)) continue;
                            break;

                        case "!==":
                            if (!(constell == con)) continue;
                            break;

                        case ">=":
                            if (!(constell >= con)) continue;
                            break;

                        case "<=":
                            if (!(constell <= con)) continue;
                            break;

                        case "<":
                            if (!(constell < con)) continue;
                            break;

                        case ">":
                            if (!(constell > con)) continue;
                            break;

                        default:
                            continue;
                    }
                }
                adds += parseInt(cond.cost);
            }

            return adds;
        }
    },

    releaseAdditionalCostByEntryConstell(slot) {
        slot = $(slot);
        let constellInput = slot.find(this.entry_icon + " > " + this.entry_constell);
        if (constellInput.length < 1) return;

        let constell = parseInt(constellInput.val());

        let id = slot.attr(this.id);
        let adds = this.getAdditionalCost(id, constell);

        let costArea = slot.find("div.entry_cost");
        this.setAdditionalCost(costArea, adds);
    },

    initializeAdditionalCost: function(adcp) {
        adcp = $(adcp);
        let step = adcp.attr(sideMaster.step);
        let cur = stepHistory[step];
        cur.additionalCost = 0;
        let add = cur.additionalCost;
        this.applyAdditionalCost(adcp, add);
        this.updateCostUsed();
    },

    setAdditionalCost: function(adcp, cost = 0) {
        adcp = $(adcp);
        let step = adcp.attr(sideMaster.step);
        let cur = stepHistory[step];
        if (cost == cur.additionalCost) return;
        cur.additionalCost = cost;
        let add = cur.additionalCost;
        this.applyAdditionalCost(adcp, add);

        playSound("챙");

        this.updateCostUsed();
    },

    increaseAdditionalCost: function(adcp) {
        if (rules.additional_cost == null) return;
        adcp = $(adcp);
        let step = adcp.attr(sideMaster.step);
        let cur = stepHistory[step];
        let increased = Math.min(cur.additionalCost + 1, rules.additional_cost.maximum);
        if (increased == cur.additionalCost) return;
        cur.additionalCost = increased;
        let add = cur.additionalCost;
        this.applyAdditionalCost(adcp, add);

        playSound("챙");

        this.updateCostUsed();
    },

    decreaseAdditionalCost: function(adcp) {
        if (rules.additional_cost == null) return;
        adcp = $(adcp);
        let step = adcp.attr(sideMaster.step);
        let cur = stepHistory[step];
        let decreased = Math.max(cur.additionalCost - 1, rules.additional_cost.minimum);
        if (decreased == cur.additionalCost) return;
        cur.additionalCost = decreased;
        let add = cur.additionalCost;
        this.applyAdditionalCost(adcp, add);

        playSound("챙");

        this.updateCostUsed();
    },

    applyAdditionalCost(adcp, cost) {
        adcp.find("span.additional_cost").html(cost > 0 ? "+" + cost : (cost == 0 ? "" : "&nbsp;" + cost));
    },

    buildEntryPickCursor: function(info) {
        let element = document.createElement("span");
        element.setAttribute("class", "pick_step_cursor");
        let inner = document.createElement("span");
        inner.setAttribute("class", "pick_text");
        inner.innerText = lang.text.pickCursorBan;
        element.append(inner);
        return element;
    },

    getCostByCharacter: function(id) {
        if (rules.cost_table != null) return poolMaster.getCost(id);
        else {
            for (i in costTable.tier1) if (costTable.tier1[i] == id) return 5;
            for (i in costTable.tier2) if (costTable.tier2[i] == id) return 4;
            for (i in costTable.tier3) if (costTable.tier3[i] == id) return 3;
            for (i in costTable.tier4) if (costTable.tier4[i] == id) return 2;
            for (i in costTable.exclude) if (costTable.exclude[i] == id) return 0;
            return 1;
        }
    },

    updateCostUsed: function() {
        var used = { red: 0, blue: 0 };
        let overCostRatio = rules.over_cost_ratio;

        for (i in stepHistory) {
            let cur = stepHistory[i];
            let seq = cur.stepReference;
            let pick = seq.pick;
            let picked = cur.picked;
            let isProfferPick = pick == "proffer";
            let isEntryPick = pick == "entry" || isProfferPick;
            let counterSide = seq.side == "red" ? "blue" : "red";
    
            if (isEntryPick && picked != null) {
                used[isProfferPick ? counterSide : seq.side] += this.getCostByCharacter(picked.id) + cur.additionalCost;
            }
        }

        let redUsed = used.red;
        let redRemains = rules.cost_amount - redUsed;
        this.redCostUsedCount.attr(this.count, redUsed);
        this.redCostRemains.attr(this.count, redRemains);

        let blueUsed = used.blue;
        let blueRemains = rules.cost_amount - blueUsed;
        this.blueCostUsedCount.attr(this.count, blueUsed);
        this.blueCostRemains.attr(this.count, blueRemains);

        if (overCostRatio != null) {
            if (redRemains < 0) playerInfoMaster.redAddMasterAdjust.val((redRemains * -1) * overCostRatio).change();
            if (blueRemains < 0) playerInfoMaster.blueAddMasterAdjust.val((blueRemains * -1) * overCostRatio).change();
        }

        this.releaseCostStack(used);
    },

    releaseCostStack: function(used) {
        var costUsed = used.red;
        var stacks = this.redCostCounterStack.find("li");
        for(var i=0; i < stacks.length; i++) {
            let coin = $(stacks[i]);
            coin.attr(this.used, i < costUsed ? "1" : "");
        }

        var costUsed = used.blue;
        var stacks = this.blueCostCounterStack.find("li");
        for(var i=0; i < stacks.length; i++) {
            let coin = $(stacks[i]);
            coin.attr(this.used, i < costUsed ? "1" : "");
        }
    },


    //ban

    initBanEntries: function() {
        let ttl = sequenceMaster.countEachPickAmountTotal();

        this.redBanSelection.empty();
        for (var i=0; i < ttl.rbx; i++) this.redBanSelection.append(this.buildBanEntry("red"));
        this.redBanEntries = this.redBanSelection.find(this.ban_entry);

        this.blueBanSelection.empty();
        for (var i=0; i < ttl.bbx; i++) this.blueBanSelection.append(this.buildBanEntry("blue"));
        this.blueBanEntries = this.blueBanSelection.find(this.ban_entry);

        this.eachBanEntries = this.eachBanSelection.find(this.ban_entry);

        this.eachBanEntries.click(this.onClickBanEntry);

        this.resetBanEntries();
    },

    buildBanEntry: function(side) {
        let item = document.createElement("li");
        item.setAttribute("class", "ban_entry " + side);
        let icon = document.createElement("div");
        icon.setAttribute("class", "entry_icon");
        let img = document.createElement("img");
        img.setAttribute("class", "character_icon");
        img.setAttribute("src", tpGif);
        icon.append(img);
        icon.append(this.buildEntryElement());
        let darker = document.createElement("div");
        darker.setAttribute("class", "jail_darkness full");
        icon.append(darker);
        let lighten = document.createElement("div");
        lighten.setAttribute("class", "jail_lighten full");
        icon.append(lighten);
        let shutter = document.createElement("div");
        shutter.setAttribute("class", "ban_shutter");
        icon.append(shutter);
        icon.append(this.buildEntryTag());
        item.append(icon);
        let cursor = document.createElement("div");
        cursor.setAttribute("class", "pick_step_cursor");
        let jail = document.createElement("span");
        jail.setAttribute("data-text", "Jail");
        cursor.append(jail);
        item.append(cursor);

        return item;
    },

    resetBanEntries: function() {
        this.banPicked["red"] = [];
        this.banPicked["blue"] = [];
        this.eachBanEntries.each(function(i, item) {
            sideMaster.setBanEntry(item);
        });
    },

    onPickedBan: function(id, side = rules.sequence[step].side) {
        let info = charactersInfo.list[charactersInfo[id]];

        var slot;
        switch(side) {
            case "red":
                slot = this.redBanEntries[this.banPicked["red"].length];
                this.banPicked["red"].push(info);
                break;

            case "blue":
                slot = this.blueBanEntries[this.banPicked["blue"].length];
                this.banPicked["blue"].push(info);
                break;
        }

        playSound("첩", 100);

        this.setBanEntry(slot, true, info);
    },

    onUndoPickBan: function(id, side) {
        let sidePicked = this.banPicked[side];
        
        for (i = sidePicked.length-1; i>-1; i--) {
            let picked = sidePicked[i];

            if (picked.id == id) {
                sidePicked.pop();

                var slot;
                switch (side) {
                    case "red":
                        slot = $(this.redBanEntries[i]);
                        break;

                    case "blue":
                        slot = $(this.blueBanEntries[i]);
                        break;
                }

                this.setBanEntry(slot);
                break;
            }
        }
    },

    setBanEntry: function(item, pick, info) {
        item = $(item);
        let iconPlace = item.find(this.ban_entry_icon);
        let isPicked = pick == true;
        let hasInfo = info != null;
        item.attr(this.picking, isPicked && !hasInfo ? "1" : null);
        item.attr(this.picked, isPicked && hasInfo ? "1" : null);
        item.attr(this.rarity, isPicked && hasInfo ? info.rarity : null);

        let img = iconPlace.find("img.character_icon");
        img.attr("src", info != null ? getPathR("images", "character_icon", info.res_icon) : tpGif);
        img.css("display", "inherit");
        // if (info != null) {
        //     img.attr("src", getPathR("images", "character_icon", info.res_icon));
        //     img.css("display", "inherit");
        // } else {
        //     if (img.attr("src") != null) {
        //         img.remove();
        //         iconPlace.prepend(document.createElement("img"));
        //     }
        // }
        
        let element = iconPlace.find("img.element_icon");
        let nametag = iconPlace.find("span.name_tag");
        if (info != null) {
            let charElement = commonInfo.element.res_icon[info.element];
            element.attr("src", charElement == null ? tpGif : getPathR("images", "element_icon", charElement));

            try {
                nametag.html(info.name[loca]);
            } catch (e) {

            }
        } else {
            element.attr("src", tpGif)
            nametag.html("");
        }
    },

    onClickBanEntry: function(e) {
        let self = $(this);

        if (self.attr(sideMaster.picked) == "1") playSound("촉");
    },


    //ban card ban
    onPickedBanCardBan: function(id, side = rules.sequence[step].side) {
        let info = charactersInfo.list[charactersInfo[id]];
        let checkRes = sequenceMaster.getCheckRes();

        var card;
        switch(side) {
            case "red":
                card = this.redEntries.find(this.ban_card_holder + '[' + this.step + '="' + step + '"]').find(this.ban_card);
                card = card[Math.min(card.length - 1, card.length - checkRes.banCardRem)];
                this.banCardUsed["red"].push(info);
                break;

            case "blue":
                card = this.blueEntries.find(this.ban_card_holder + '[' + this.step + '="' + step + '"]').find(this.ban_card);
                card = card[Math.min(card.length - 1, card.length - checkRes.banCardRem)];
                this.banCardUsed["blue"].push(info);
                break;
        }

        playSound("쪕", 100);

        this.setBanCardPlace(card, true, info);

        return buildStepHistoryExtraForUsingBanCard();
    },

    onUndoBanCardBan: function(id, side) {
        let sidePicked = this.banCardUsed[side];
        let checkRes = sequenceMaster.issueCheckRes();
        
        for (i = sidePicked.length-1; i>-1; i--) {
            let picked = sidePicked[i];

            if (picked.id == id) {
                sidePicked.pop();

                var slot;
                switch (side) {
                    case "red":
                        card = this.redEntries.find(this.ban_card_holder + '[' + this.step + '="' + step + '"]').find(this.ban_card);
                        card = card[Math.min(card.length - 1, card.length - checkRes.banCardRem)];
                        break;

                    case "blue":
                        card = this.blueEntries.find(this.ban_card_holder + '[' + this.step + '="' + step + '"]').find(this.ban_card);
                        card = card[Math.min(card.length - 1, card.length - checkRes.banCardRem)];
                        break;
                }

                this.setBanCardPlace(card);
                break;
            }
        }
    },

    setBanCardPlace: function(card, pick, info) {
        card = $(card);
        let entryPlace = card.find(this.ban_entry_place);
        let isPicked = pick == true;
        let hasInfo = info != null;
        card.attr(this.picking, isPicked && !hasInfo ? "1" : null);
        card.attr(this.picked, isPicked && hasInfo ? "1" : null);
        card.attr(this.rarity, isPicked && hasInfo ? info.rarity : null);

        let img = entryPlace.find("img.character_icon");
        img.attr("src", info != null ? getPathR("images", "character_icon", info.res_icon) : tpGif);
        
        let element = card.find("img.element_icon");
        let nametag = card.find("span.name_tag");
        if (info != null) {
            let charElement = commonInfo.element.res_icon[info.element];
            element.attr("src", charElement == null ? tpGif : getPathR("images", "element_icon", charElement));

            try {
                nametag.html(info.nameShort[loca]);
            } catch (e) {

            }
        } else {
            element.attr("src", tpGif)
            nametag.html("");
        }
    },


    //cardy bans
    initCardyBanEntries() {
        this.aBanPicked.red = [];
        this.aBanPicked.blue = [];
        this.jBanPicked.red = [];
        this.jBanPicked.blue = [];
        this.cardyAdditionalBanSelection.red.empty();
        this.cardyAdditionalBanSelection.blue.empty();
        this.cardyJokerBanSelection.red.empty();
        this.cardyJokerBanSelection.blue.empty();

        let cardyBans = sequenceMaster.cardyBans;
        if (cardyBans.side != null) {
            let side = cardyBans.side;
            let aban = cardyBans.aban;
            let jban = cardyBans.jban;

            for (var i=0; i<aban; i++) this.cardyAdditionalBanSelection[side].append(this.buildCardyBanEntryHolder());
            for (var i=0; i<jban; i++) this.cardyJokerBanSelection[side].append(this.buildCardyBanEntryHolder());

        }
    },

    buildCardyBanEntryHolder() {
        let entry = document.createElement("li");
        entry.setAttribute("class", "ban_entry");
        return entry;
    },

    onPickedCardyBan: function(id, pick = rules.sequence[step].pick, side = sequenceMaster.cardyBans.side) {
        let info = charactersInfo.list[charactersInfo[id]];
        let banPicked = pick == "aban" ? this.aBanPicked : (pick == "jban" ? this.jBanPicked : null);
        if (banPicked == null) return;

        var index;
        switch(side) {
            case "red":
                index = banPicked["red"].length;
                banPicked["red"].push(info);
                break;

            case "blue":
                index = banPicked["blue"].length;
                banPicked["blue"].push(info);
                break;
        }

        playSound("첩", 100);

        this.setCardyBanEntry(side, index, pick, info);
    },

    onUndoPickCardyBan: function(id, pick, side) {
        let banPicked = pick == "aban" ? this.aBanPicked : (pick == "jban" ? this.jBanPicked : null);
        if (banPicked == null) return;
        let sidePicked = banPicked[side];
        
        for (i = sidePicked.length-1; i>-1; i--) {
            let picked = sidePicked[i];

            if (picked.id == id) {
                sidePicked.pop();

                this.setCardyBanEntry(side, i, pick);
                break;
            }
        }
    },

    setCardyBanEntry: function(side, index, pick, info) {
        let banSelection = pick == "aban" ? this.cardyAdditionalBanSelection : (pick == "jban" ? this.cardyJokerBanSelection : null);
        if (banSelection == null) return;
        let banEntries = banSelection[side].find(this.ban_entry);
        let holder = $(banEntries[index]);
        holder.empty();

        if (info != null) {
            holder.append(poolMaster.buildCharacterIcon(info, "wide"));
        }
    },


    //ban weapon
    initBanWeapons: function() {
        let ttl = sequenceMaster.countEachPickAmountTotal();

        this.redWeaponBanSelection.empty();
        for (var i=0; i < ttl.rbwx; i++) this.redWeaponBanSelection.append(this.buildBanWeaponEntry("red"));
        this.redWeaponBanEntries = this.redWeaponBanSelection.find(this.weapon_ban_entry);

        this.blueWeaponBanSelection.empty();
        for (var i=0; i < ttl.bbwx; i++) this.blueWeaponBanSelection.append(this.buildBanWeaponEntry("blue"));
        this.blueWeaponBanEntries = this.blueWeaponBanSelection.find(this.weapon_ban_entry);

        this.eachWeaponBanEntries = this.eachWeaponBanSelection.find(this.weapon_ban_entry);

        this.weaponBanPicked.red = [];
        this.weaponBanPicked.blue = [];

        this.eachBanPickCharacterHolder.attr(this.appear, null);
        this.eachBanPickWeaponHolder.attr(this.appear, "-1");
    },

    buildBanWeaponEntry: function(side) {
        let item = document.createElement("li");
        item.setAttribute("class", "weapon_ban_entry " + side);
        let icon = document.createElement("div");
        icon.setAttribute("class", "entry_icon");
        let img = document.createElement("img");
        img.setAttribute("src", getPathR("images", "weapon_icon", weaponsInfo.default.res_icon));
        icon.append(img);
        let lock = document.createElement("div");
        lock.setAttribute("class", "ban_locker");
        lock.append(document.createElement("span"));
        icon.append(lock);
        item.append(icon);
        let info = document.createElement("div");
        info.setAttribute("class", "entry_info");
        item.append(info);

        return item;
    },

    onPickedBanWeapon: function(id, side = rules.sequence[step].side) {
        let info = weaponsInfo.list.find(item => item.id == id);

        var slot;
        switch(side) {
            case "red":
                slot = this.redWeaponBanEntries[this.weaponBanPicked["red"].length];
                this.weaponBanPicked["red"].push(info);
                break;

            case "blue":
                slot = this.blueWeaponBanEntries[this.weaponBanPicked["blue"].length];
                this.weaponBanPicked["blue"].push(info);
                break;
        }

        playSound("휙", 100);
        playSound("뗩", 150);

        this.setBanWeaponEntry(slot, info);
    },

    onUndoPickBanWeapon: function(id, side) {
        let sidePicked = this.weaponBanPicked[side];
        
        for (i = sidePicked.length-1; i>-1; i--) {
            let picked = sidePicked[i];

            if (picked.id == id) {
                sidePicked.pop();

                var slot;
                switch (side) {
                    case "red":
                        slot = $(this.redWeaponBanEntries[i]);
                        break;

                    case "blue":
                        slot = $(this.blueWeaponBanEntries[i]);
                        break;
                }

                this.setBanWeaponEntry(slot);
                break;
            }
        }
    },

    setBanWeaponEntry: function(entry, info) {
        entry = $(entry);
        let infoOrigin = info;
        if (info == null || info === true) info = weaponsInfo.default;

        let icon = entry.find(this.entry_icon);
        let img = icon.find("img");
        img.attr("src", getPathR("images", "weapon_icon", info.res_icon));

        this.setBanWeaponEntryInfo(entry, info != infoOrigin ? infoOrigin : info);
    },

    setBanWeaponEntryInfo: function(entry, info) {
        entry = $(entry);
        let ei = entry.find(this.entry_info);

        ei.empty();
        if (info != null) {
            if (info === true) {
                let inner = document.createElement("div");
                inner.setAttribute("class", "pick_step_cursor");
                let span = document.createElement("span");
                span.setAttribute(this.text, lang.text.pickCursorBanWeapon);
                inner.append(span);
                ei.append(inner);
                
                entry.attr(this.picking, "1");
                entry.attr(this.picked, null);
            } else {
                let inner = document.createElement("div");
                inner.setAttribute("class", "ban_entry_name");
                let span = document.createElement("span");
                span.setAttribute("class", "text_item");
                span.setAttribute(this.text, info.name[loca]);
                inner.append(span);
                ei.append(inner);

                entry.attr(this.picking, null);
                entry.attr(this.picked, "1");
            }
        } else {
            entry.attr(this.picking, null);
            entry.attr(this.picked, null);
        }
    },


    //cursor

    updatePickCursor: function() {
        let seq = rules.sequence[step];
        let bans = this.eachBanEntries;
        let picks = this.eachEntries;
        let wBans = this.eachWeaponBanEntries;

        let ttl = sequenceMaster.countEachPickAmountTotal();
        let res = sequenceMaster.checkHistoryProcessed();

        let banCount = { red: 0, blue: 0 };
        for (var i=0; i < bans.length; i++) {
            let entry = $(bans[i]);
            let side = entry.hasClass("red") ? "red" : "blue";
            banCount[side]++;
            var isOn = false;
            if (seq != null && (seq.pick == "ban" || seq.pick == "preban") && side == seq.side) {
                let cur = banCount[side];
                let picked = this.banPicked[side].length;
                //현재 픽 되어있는 것 이후(빈) 항목
                if (cur > picked) {
                    if (cur <= (side == "red" ? res.rbx : res.bbx)) isOn = true;
                    //if (settings.useEmptyPick) 
                }
            }

            let isPicking = entry.attr(this.picking) == "1";
            if (isPicking != isOn) this.setBanEntry(entry, isOn);
        }

        let pickCount = { red: 0, blue: 0 };
        for (var i=0; i < picks.length; i++) {
            let entry = $(picks[i]);
            let side = entry.hasClass("red") ? "red" : "blue";
            pickCount[side]++;
            var isOn = false;
            if (seq != null) {
                let isProfferPick = seq.pick == "proffer";
                let isEntryPick = seq.pick == "entry" || isProfferPick;
                let counterSide = seq.side == "red" ? "blue" : "red";
                let currentSide = isProfferPick ? counterSide : seq.side
                if (isEntryPick && side == currentSide) {
                    let cur = pickCount[side];
                    let picked = this.entryPicked[side].length;
                    //현재 픽 되어있는 것 이후(빈) 항목
                    if (cur > picked) {
                        if (cur <= (side == "red" ? res.rpx : res.bpx)) isOn = true;
                        //if (settings.useEmptyPick) 
                    }
                }
            }
            
            if (isOn) {
                entry.attr(this.picking, "1");
                this.setEntryInfo(entry, this.buildEntryPickCursor());
            } else {
                entry.attr(this.picking, null);
                if (entry.find("span.pick_step_cursor").length > 0) this.setEntryInfo(entry);
            }
        }

        let weaponBanCount = { red: 0, blue: 0 };
        for (var i=0; i < wBans.length; i++) {
            let entry = $(wBans[i]);
            let side = entry.hasClass("red") ? "red" : "blue";
            weaponBanCount[side]++;
            var isOn = false;
            if (seq != null && seq.pick == "ban weapon" && side == seq.side) {
                let cur = weaponBanCount[side];
                let picked = this.weaponBanPicked[side].length;
                //현재 픽 되어있는 것 이후(빈) 항목
                if (cur > picked) {
                    if (cur <= (side == "red" ? res.rbwx : res.bbwx)) isOn = true;
                    //if (settings.useEmptyPick) 
                }
            }

            if (isOn) this.setBanWeaponEntry(entry, true);
            else if (entry.attr(this.picking) == "1") this.setBanWeaponEntry(entry);
        }
        
        if (seq != null && ttl.rbwx + ttl.bbwx > 0) {
            let charPickTotal = ttl.rbx + ttl.bbx + ttl.rpx + ttl.bpx;
            let processed = res.rbx + res.bbx + res.rpx + res.bpx;

            if (seq.pick.indexOf("weapon") < 1) {//processed < charPickTotal
                this.eachBanPickCharacterHolder.attr(this.appear, null);
                this.eachBanPickWeaponHolder.attr(this.appear, "-1");

                //캐릭터 검색 구현 후 삭제
                if (searchMaster.searchInput.is(":focus")) searchMaster.searchInput.blur();
            } else {
                this.eachBanPickCharacterHolder.attr(this.appear, "1");
                this.eachBanPickWeaponHolder.attr(this.appear, null);
            }

            if (seq.pick.indexOf("weapon") > -1) {
                setTimeout(function () { searchMaster.searchInput.focus(); }, 1000);
            }
        }

        if (step == rules.sequence.length) {
            for (var i=rules.sequence.length-1; i>-1; i--) if (rules.sequence[i].pick == "ban weapon") {
                this.eachBanPickCharacterHolder.attr(this.appear, "1");
                this.eachBanPickWeaponHolder.attr(this.appear, null);
                break;
            }
        }
    },


    //versus record

    initVersusRecordBoard: function() {
        $("div#versus_entry_area").attr("data-wins", "");
        this.eachSideRecordStage.attr(this.result, "");
        this.redSidePlayerName.text("RED");
        this.blueSidePlayerName.text("BLUE");
        this.redSidePlayerUid.text("");
        this.blueSidePlayerUid.text("");
        this.redSidePlayerAp.text("");
        this.blueSidePlayerAp.text("");
        this.eachInputRemains.val("");
        this.eachSpanClearTime.text("");
        this.eachSpanDivider.text("-");
        this.eachTkoSelected.text("");
        this.progressPanels.attr(this.show, "0");
        let stageSuperiorities = this.progressPanels.find(this.stage_superiority);
        stageSuperiorities.find(this.graph + ".side_root").css("flex-grow", "").attr(sideMaster.superior, "");
        stageSuperiorities.find(this.stage_time_differ).text("");
        this.vsTimeRemains["red"] = [];
        this.vsTimeRemains["blue"] = [];
        this.vsClearTime["red"] = [];
        this.vsClearTime["blue"] = [];
    },

    initVersusRecordBoardDesc: function() {
        let text = lang.text;

        this.eachRecordTimeRemains.find(">label").text(text.vsRemains);
        this.eachRecordTimeClear.find(">label").text(text.vsElapsed);
        this.eachInputRemains.filter(".min").attr("placeholder", text.unitMin);
        this.eachInputRemains.filter(".sec").attr("placeholder", text.unitSec);
        this.eachTkoSelection.find("div.tko_summary > label").text(text.vsOptionTKO);
        this.eachTkoSelections.filter(".first_half").find(">label").text(text.vsHalf1st);
        this.eachTkoSelections.filter(".second_half").find(">label").text(text.vsHalf2nd);
        this.eachTkoCausedBy.filter(".timeover").text(text.vsBtnTkoByTimeover);
        this.eachTkoCausedBy.filter(".powerloss").text(text.vsBtnTkoByPowerloss);
        this.eachTkoCausedBy.filter(".surrender").text(text.vsBtnTkoBySurrender);
        this.eachRecordTimeAdd.find(">label").text(text.vsAdds);
        this.eachRecordTimeClearTotal.find(">label").text(text.vsTotalElapsed);
        this.versusProgressPanel.find(this.versus).text(text.vsVersus);
        this.progressPanel[0].find("div.title span").text(text.vsAggregated);
        for (var i=1; i<this.progressPanel.length; i++) this.progressPanel[i].find("div.title span").text(text.vsChamber.replace("#NO", "" + i));
    },

    showVersusRecordBoard: function() {
        $("div#versus_entry_area div.versus_divider").attr("data-wide", "1");

        let pim = playerInfoMaster;

        this.redSidePlayerName.text(redName);
        this.blueSidePlayerName.text(blueName);

        let redUid = this.redPlayerUidInput.val();
        let redPIUid = pim.redInfoUid.val();
        let blueUid = this.bluePlayerUidInput.val();
        let bluePIUid = pim.blueInfoUid.val();
        let redU = redPIUid != "" ? redPIUid : redUid;
        let blueU = bluePIUid != "" ? bluePIUid : blueUid
        this.redSidePlayerUid.text(redU != "" ? "UID: " + redU : "");
        this.blueSidePlayerUid.text(blueU != "" ? "UID: " + blueU : "");

        let redAp = this.redAccountPointInput.val().trim();
        let redPIAp = pim.redInfoAp.val().trim();
        let redApEx = redPIAp != "" ? redPIAp : redAp;
        let blueAp = this.blueAccountPointInput.val().trim();
        let bluePIAp = pim.blueInfoAp.val().trim();
        let blueApEx = bluePIAp != "" ? bluePIAp : blueAp;
        this.redSidePlayerAp.text(redApEx != "" ? redApEx : "");
        this.blueSidePlayerAp.text(blueApEx != "" ? blueApEx : "");

        //가산 시간
        let adds = playerInfoMaster.addsCalculated;
        this.timeAdds = adds;

        let redMin = Math.floor(adds.red / 60);
        let redSec = adds.red % 60;
        if (redSec < 10) redSec = "0" + redSec;
        let blueMin = Math.floor(adds.blue / 60);
        let blueSec = adds.blue % 60;
        if (blueSec < 10) blueSec = "0" + blueSec;
        
        this.redSideRecordTotal.find(".add_time.min").html("+" + redMin);
        this.redSideRecordTotal.find("div.record_time_add").find(".divider").html(":");
        this.redSideRecordTotal.find(".add_time.sec").html(redSec);
        this.blueSideRecordTotal.find(".add_time.min").html("+" + blueMin);
        this.blueSideRecordTotal.find("div.record_time_add").find(".divider").html(":");
        this.blueSideRecordTotal.find(".add_time.sec").html(blueSec);
        //---------

        versionDisplayShowFor(2);
        this.versusRecordBoard.attr(this.show, "1");
        setTimeout(function() {
            sequenceMaster.setSequenceTitle(lang.text.titleLeagueMatch.replace("#NAME", rules.name_full).replace("#TAIL", rules.league_tail));
            if (sideMaster.versusRecordBoard.attr(sideMaster.show) === "1") sideMaster.versusRecordBoard.attr(sideMaster.show, "2");

            setTimeout(function() {
                sideMaster.showDifferAddsByTotalVersusSuperiorityGraph();
                showCursorWholeScreen();
                //screenMaster.showSideArea();
            }, 500);
        }, 10);
    },

    hideVersusRecordBoard: function() {
        if (rules.show_side_area_on_versus === true) screenMaster.hideSideArea();
        $("div#versus_entry_area div.versus_divider").attr("data-wide", "0");

        this.versusRecordBoard.attr(this.show, "0");

        showCursorWholeScreen();
    },

    onVersusInputRemains: function(e) {
        let self = $(this);
        let set = self.closest(".remains_set");
        let side = self.closest(sideMaster.side_record_board).attr(sideMaster.side);
        let stage = parseInt(self.closest(sideMaster.side_record).attr(sideMaster.stage));
        let isMin = self.hasClass("min");

        sideMaster.releaseVersusRecordBoard(side, stage, isMin);

        if (isMin) {
            if (this.value.length > 0) set.find(".sec").focus();
        } else {
            
        }
    },

    onBlurVersusInputRemains: function(e) {
        let self = $(this);
        let set = self.closest(".remains_set");
        let side = self.closest(sideMaster.side_record_board).attr(sideMaster.side);
        let record = self.closest(sideMaster.side_record);
        let stage = parseInt(record.attr(sideMaster.stage));
        let isMin = self.hasClass("min");

        if (!set.is(":focus-within")) sideMaster.releaseVersusSuperiorityGraph(stage, side);
    },

    onClickTkoButton: function(e) {
        let self = $(this);
        let side = self.closest(sideMaster.side_record_board).attr(sideMaster.side);
        let stage = parseInt(self.closest(sideMaster.side_record).attr(sideMaster.stage));
        let cause = parseInt(self.attr(sideMaster.tko));

        sideMaster.releaseVersusRecordByTkoButton(side, stage, cause);
    },

    releaseVersusRecordByTkoButton: function(side, stage, cause) {
        sideMaster.releaseVersusRecordBoard(side, stage, null, cause);
        sideMaster.releaseVersusSuperiorityGraph(stage, side);
    },

    releaseVersusRecordBoard: function(side, stage, isMin, tkoCausedBy) {
        if (side == null || stage == null || (isMin == null && tkoCausedBy == null)) return;
        var recordStage;
        var minInput;
        var secInput;
        switch (side) {
            case "red":
                recordStage = this.redSideRecordStage.filter('[' + this.stage + '="' + stage + '"]')
                minInput = this.redInputRemains.filter(".min.stage" + stage);
                secInput = this.redInputRemains.filter(".sec.stage" + stage);
                break;

            case "blue":
                recordStage = this.blueSideRecordStage.filter('[' + this.stage + '="' + stage + '"]')
                minInput = this.blueInputRemains.filter(".min.stage" + stage);
                secInput = this.blueInputRemains.filter(".sec.stage" + stage);
                break;
        }
        if (tkoCausedBy == null) {//잔여시간 입력
            let minValue = minInput.val();
            let secValue = secInput.val();
            let isMinEmpty = minValue.length < 1 || isNaN(minValue);
            let isSecEmpty = secValue.length < 1 || isNaN(secValue);
            if (isMinEmpty) {
                minValue = "0";
                minInput.val(minValue);
                minInput.select();
            } else if (isSecEmpty && !isMin) {
                secValue = "0";
                secInput.val(secValue);
                secInput.select();
            }

            if (!isSecEmpty) {
                let min = parseInt(minValue);
                let sec = parseInt(secValue);
                let seconds = (min * 60) + sec;
                recordStage.attr(this.result, "clear");
                this.vsTimeRemains[side][stage] = seconds;
            } else {
                recordStage.attr(this.result, "");
                this.vsTimeRemains[side][stage] = null;
                return;
            }
        } else {//TKO 선택
            minInput.val("");
            secInput.val("");
            recordStage.attr(this.result, "tko");
            this.vsTimeRemains[side][stage] = tkoCausedBy;
        }

        this.releaseVersusTimeAttackDisplay(stage, side);
        saveLatestState();
    },

    releaseVersusTimeAttackDisplay: function(stage, side) {
        if (stage == null || side == null) return;
        let text = lang.text;
        var clearTime = null;
        var clearTimeDivider = null;
        var tkoSelected = null;
        switch (side) {
            case "red":
                clearTime = this.redSpanClearTime.filter(".stage" + stage);
                clearTimeDivider = this.redSpanDivider.filter(".stage" + stage);
                tkoSelected = this.redTkoSelected.filter(".stage" + stage);
                break;

            case "blue":
                clearTime = this.blueSpanClearTime.filter(".stage" + stage);
                clearTimeDivider = this.blueSpanDivider.filter(".stage" + stage);
                tkoSelected = this.blueTkoSelected.filter(".stage" + stage);
                break;
        }
        let clearTimeMin = clearTime.filter(".min");
        let clearTimeSec = clearTime.filter(".sec");

        let remains = this.vsTimeRemains[side][stage];
        if (remains < 0) {
            let tko = remains * -1;
            let tkoHalf = tko % 2;
            let tkoText = text.vsTkoHalf.replace("#HALF", tkoHalf === 1 ? text.vsHalf1st : text.vsHalf2nd);
            var tkoCausedBy = "";
            switch (remains) {
                case -1:
                case -2:
                    tkoCausedBy = text.vsTkoByTimeover;
                    break;
                    
                case -3:
                case -4:
                    tkoCausedBy = text.vsTkoByPowerloss;
                    break;
    
                case -5:
                case -6:
                    tkoCausedBy = text.vsTkoBySurrender;
                    break;
            }

            clearTimeMin.text("");
            clearTimeSec.text("");
            clearTimeDivider.text(tkoText);
            tkoSelected.text(tkoCausedBy);
        } else {
            let sec1min = 60
            let sec10min = 10 * sec1min;
            let elapsed = sec10min - remains;

            let elapsedMin = Math.floor(elapsed / sec1min);
            let elapsedSec = elapsed % sec1min;

            clearTimeMin.text("" + elapsedMin);
            clearTimeSec.text(("" + elapsedSec).padStart(2, "0"));
            clearTimeDivider.text(":");
            tkoSelected.text("");
        }


        if (this.progressPanel[stage].attr(this.show) == "1") this.releaseVersusSuperiorityGraph(stage, side);

        this.releaseVersusTimeAttackTotal(side);
    },

    releaseVersusTimeAttackTotal: function(side) {
        let sec1min = 60
        let sec10min = 10 * sec1min;
        let remains = this.vsTimeRemains[side][i];
        if (remains > -1) {
            let elapsed = sec10min - remains;
            totalElapsed += elapsed;
        }
        var totalElapsed = 0;

        for (var i=1; i<this.vsTimeRemains[side].length; i++) {
            let remains = this.vsTimeRemains[side][i];
            if (remains > -1) {
                let elapsed = sec10min - remains;
                totalElapsed += elapsed;
            }
        }

        if (totalElapsed < 1) return;

        let elapsedMin = Math.floor(totalElapsed / sec1min);
        let elapsedSec = totalElapsed % sec1min;

        var clearTime = null;
        var clearTimeDivider = null;
        switch (side) {
            case "red":
                clearTime = this.redSpanTotalClearTime;
                clearTimeDivider = this.redSpanTotalDivider;
                break;

            case "blue":
                clearTime = this.blueSpanTotalClearTime;
                clearTimeDivider = this.blueSpanTotalDivider;
                break;
        }

        let clearTimeMin = clearTime.filter(".min");
        let clearTimeSec = clearTime.filter(".sec");
        clearTimeMin.text("" + elapsedMin);
        clearTimeSec.text(("" + elapsedSec).padStart(2, "0"));
        clearTimeDivider.text(":");
    },

    onKeydownVersusInputRemains: function(e) {
        let self = $(this);
        let set = self.closest(".remains_set");
        let side = self.closest(sideMaster.side_record_board).attr(sideMaster.side);
        let stage = parseInt(self.closest(sideMaster.side_record).attr(sideMaster.stage));
        let isMin = self.hasClass("min");

        switch (e.keyCode) {
            case 8:
                //if (!isMin && this.selectionStart) 
                if (!isMin && (this.value.length < 1 || this.value == "0")) {
                    self.val("");
                    set.find(".min").focus();
                    e.preventDefault();
                    return false;
                }
                break;

            case 9:
                if (e.shiftKey) {
                    if (isMin) {
                        if (side == "red") {
                            if (stage > 1) {
                                sideMaster.blueInputRemains.filter(".sec.stage" + (stage - 1)).focus();
                                e.preventDefault();
                                return false;
                            }
                        } else {
                            sideMaster.redInputRemains.filter(".sec.stage" + stage).focus();
                            e.preventDefault();
                            return false;
                        }
                    }
                } else {
                    if (!isMin) {
                        if (side == "blue") {
                            if (sideMaster.vsTimeRemains["red"][stage] == null) {
                                sideMaster.redInputRemains.filter(".min.stage" + stage).focus();
                                return false;
                            } else if (stage < 3) {
                                sideMaster.redInputRemains.filter(".min.stage" + (stage + 1)).focus();
                                e.preventDefault();
                                return false;
                            }
                        } else {
                            sideMaster.blueInputRemains.filter(".min.stage" + stage).focus();
                            e.preventDefault();
                            return false;
                        }
                    }
                }
                break;

            case 13:
                var target = null;
                if (isMin) {//분 입력
                    if (side == "red") target = sideMaster.redInputRemains.filter(".sec.stage" + stage);
                    else target = sideMaster.blueInputRemains.filter(".sec.stage" + stage);
                } else {//초 입력
                    if (side == "red") target = sideMaster.blueInputRemains.filter(".min.stage" + stage);
                    else if (sideMaster.vsTimeRemains["red"][stage] == null) target = sideMaster.redInputRemains.filter(".min.stage" + stage);
                    else if (stage < 3) target = sideMaster.redInputRemains.filter(".min.stage" + (stage + 1));
                    else self.blur();
                }
                if (target != null) {
                    target.focus();
                    e.preventDefault();
                    //sideMaster.releaseVersusSuperiorityGraph(stage, side);
                    return false;
                }
                sideMaster.releaseVersusSuperiorityGraph(stage, side);
                break;
        }
    },

    showDifferAddsByTotalVersusSuperiorityGraph: function() {
        let addsMax = Math.max(this.timeAdds.red, this.timeAdds.blue) + 3;
        this.vsTimeRemains["red"][0] = addsMax - this.timeAdds.red;
        this.vsTimeRemains["blue"][0] = addsMax - this.timeAdds.blue;
        this.releaseVersusSuperiorityGraph(0);
    },

    releaseVersusSuperiorityGraph: function(stage, side, finale = false) {
        if (stage == null || isNaN(stage) || stage < 0) return;
        stage = parseInt(stage);

        let redRemains = this.vsTimeRemains["red"][stage];
        let blueRemains = this.vsTimeRemains["blue"][stage];

        if (redRemains == null || blueRemains == null) return;

        let isUpdatingTotalFinale = stage == 0 && finale;
        let showingPhaseTotals = this.progressPanel[stage].attr(this.show);
        let isFirstUpdate = showingPhaseTotals != "1" && showingPhaseTotals != "2";
        if (isFirstUpdate) {
            this.progressPanel[stage].attr(this.show, isUpdatingTotalFinale ? "2" :"1");
            setTimeout(function() { sideMaster.updateVersusSuperiorityGraph(stage, redRemains, blueRemains); }, 1000);
        } else this.updateVersusSuperiorityGraph(stage, redRemains, blueRemains, side);

        if (stage > 0) this.checkUpdateVersusResultGraph(stage, isUpdatingTotalFinale, isFirstUpdate);
    },

    updateVersusSuperiorityGraph: function(stage, redRemains, blueRemains, side) {
        let sup = this.stageSuperiority[stage];
        let redGraph = sup.find(this.graph + ".red");
        let blueGraph = sup.find(this.graph + ".blue");
        let timeDiffer = this.stageTimeDiffer[stage];
        let minimum = Math.min(redRemains, blueRemains);
        let differ = minimum - Math.max(redRemains, blueRemains);
        let lowcut = Math.max(3, minimum - 3);

        if (stage > 0) {
            var isRedTko = false;
            var isBlueTko = false;
            var redGrows;
            var blueGrows;
            if (redRemains < 0) {
                isRedTko = true;
                redGrows = (((redRemains * -1) - 1) % 2) + 1;
            } else redGrows = redRemains - minimum + 3;
            if (blueRemains < 0) {
                isBlueTko = true;
                blueGrows = (((blueRemains * -1) - 1) % 2) + 1;
            } else blueGrows = blueRemains - minimum + 3;
            let isTko = isRedTko || isBlueTko;
            let isDoubleTko = isRedTko && isBlueTko;

            let redWins = redGrows > blueGrows;
            let blueWins = redGrows < blueGrows;
    
            if (side != null) {//업데이트
                switch (side) {
                    case "red":
                        redGraph.css("flex-grow", "" + redGrows);
                        break;

                    case "blue":
                        blueGraph.css("flex-grow", "" + blueGrows);
                        break;
                }
            } else if (isDoubleTko) {//
                if (redWins) blueGraph.css("flex-grow", "2");
                if (blueWins) redGraph.css("flex-grow", "2");
            } else {
                if (redWins) redGraph.css("flex-grow", "" + redGrows);
                if (blueWins) blueGraph.css("flex-grow", "" + blueGrows);
            }
            redGraph.attr(this.superior, redWins ? "1" : "0")
            blueGraph.attr(this.superior, blueWins ? "1" : "0")
            timeDiffer.text(isTko ? "TKO" : differ + "s");
        } else {
            let redWins = redRemains > blueRemains;
            let blueWins = redRemains < blueRemains;
            let redTotal = "" + redRemains;
            let blueTotal = "" + blueRemains;

            if (redGraph.css("flex-grow") != redTotal) redGraph.css("flex-grow", redTotal);
            if (blueGraph.css("flex-grow") != blueTotal) blueGraph.css("flex-grow", blueTotal);
            redGraph.attr(this.superior, redWins ? "1" : "0")
            blueGraph.attr(this.superior, blueWins ? "1" : "0")
            timeDiffer.text(differ + "s");
        }
    },

    checkUpdateVersusResultGraph: function(stage, isFinale, isFirst) {
        let redRemains1 = this.vsTimeRemains["red"][1];
        let blueRemains1 = this.vsTimeRemains["blue"][1];
        let redRemains2 = this.vsTimeRemains["red"][2];
        let blueRemains2 = this.vsTimeRemains["blue"][2];
        let redRemains3 = this.vsTimeRemains["red"][3];
        let blueRemains3 = this.vsTimeRemains["blue"][3];

        let isRedTko1 = redRemains1 < 0;
        let isRedTko2 = redRemains2 < 0;
        let isRedTko3 = redRemains3 < 0;
        let isBlueTko1 = blueRemains1 < 0;
        let isBlueTko2 = blueRemains2 < 0;
        let isBlueTko3 = blueRemains3 < 0;

        let isStage1Complete = redRemains1 != null && blueRemains1 != null;
        let isStage2Complete = redRemains2 != null && blueRemains2 != null;
        let isStage3Complete = redRemains3 != null && blueRemains3 != null;
        let isComplete = isStage1Complete && isStage2Complete && isStage3Complete;
        let isRedTko = isRedTko1 || isRedTko2 || isRedTko3;
        let isBlueTko = isBlueTko1 || isBlueTko2 || isBlueTko3;
        let isTko = isRedTko || isBlueTko;
        let isStage1Tko = isRedTko1 || isBlueTko1;
        let isStage2Tko = isRedTko2 || isBlueTko2;
        let isStage3Tko = isRedTko3 || isBlueTko3;
        let isTkoEnd = (isStage1Tko && isStage1Complete) || (isStage2Tko && isStage2Complete) || (isStage3Tko && isStage3Complete);
        let isDoubleTko = isRedTko && isBlueTko;

        let addsMax = Math.max(this.timeAdds.red, this.timeAdds.blue);

        let redRemains = (redRemains1 != null && redRemains1 > 0 ? Math.abs(redRemains1) : 0) + (redRemains2 != null && redRemains2 > 0 ? Math.abs(redRemains2) : 0) + (redRemains3 != null && redRemains3 > 0 ? Math.abs(redRemains3) : 0) + (addsMax - this.timeAdds.red);
        let blueRemains = (blueRemains1 != null && blueRemains1 > 0 ? Math.abs(blueRemains1) : 0) + (blueRemains2 != null && blueRemains2 > 0 ? Math.abs(blueRemains2) : 0) + (blueRemains3 != null && blueRemains3 > 0 ? Math.abs(blueRemains3) : 0) + (addsMax - this.timeAdds.blue);

        this.vsTimeRemains["red"][0] = redRemains;
        this.vsTimeRemains["blue"][0] = blueRemains;

        if (isComplete || isTkoEnd || isDoubleTko) {
            let text = lang.text;
            var redWins = false;
            var blueWins = false;
            if (isTko) {
                let stage1Tko = isRedTko1 && isBlueTko1 ? "both" : (isRedTko1 ? "red" : (isBlueTko1 ? "blue" : "neither"));
                let stage2Tko = isRedTko2 && isBlueTko2 ? "both" : (isRedTko2 ? "red" : (isBlueTko2 ? "blue" : "neither"));
                let stage3Tko = isRedTko3 && isBlueTko3 ? "both" : (isRedTko3 ? "red" : (isBlueTko3 ? "blue" : "neither"));
                let redTkoHalf1 = (((redRemains1 * -1) - 1) % 2) + 1;
                let blueTkoHalf1 = (((blueRemains1 * -1) - 1) % 2) + 1;
                let redTkoHalf2 = (((redRemains2 * -1) - 1) % 2) + 1;
                let blueTkoHalf2 = (((blueRemains2 * -1) - 1) % 2) + 1;
                let redTkoHalf3 = (((redRemains3 * -1) - 1) % 2) + 1;
                let blueTkoHalf3 = (((blueRemains3 * -1) - 1) % 2) + 1;

                if (isStage1Tko) {
                    switch (stage1Tko) {
                        case "red":
                            blueWins = true;
                            break;

                        case "blue":
                            redWins = true;
                            break;

                        case "both":
                            if (redTkoHalf1 != blueTkoHalf1) {
                                if (redTkoHalf1 > blueTkoHalf1) redWins = true;
                                else blueWins = true;
                            }
                            break;
                    }
                } else if (isStage2Tko) {
                    switch (stage2Tko) {
                        case "red":
                            blueWins = true;
                            break;

                        case "blue":
                            redWins = true;
                            break;

                        case "both":
                            if (redTkoHalf2 != blueTkoHalf2) {
                                if (redTkoHalf2 > blueTkoHalf2) redWins = true;
                                else blueWins = true;
                            }
                            break;
                    }
                } else if (isStage3Tko) {
                    switch (stage3Tko) {
                        case "red":
                            blueWins = true;
                            break;

                        case "blue":
                            redWins = true;
                            break;

                        case "both":
                            if (redTkoHalf3 != blueTkoHalf3) {
                                if (redTkoHalf3 > blueTkoHalf3) redWins = true;
                                else blueWins = true;
                            }
                            break;
                    }
                }
            } else {
                redWins = redRemains > blueRemains;
                blueWins = redRemains < blueRemains;
            }
            let versusEntryArea = $("div#versus_entry_area");
            let isFirstResult = versusEntryArea.attr("data-wins") == "";
            if (redWins || blueWins) {
                let wins = redWins ? "red" : "blue";
                let finish = function() {
                    if (step > rules.sequence.length) {
                        console.log(":: finish");
                        versusEntryArea.attr("data-wins", wins);
                        let winner = wins == "red" ? redName : blueName;
                        let winsText = isTko ? text.vsWinsByTko : text.vsWins;
                        sequenceMaster.setSequenceTitle(winsText.replace("#NAME", winner));
                    }
                };

                if (isFirstResult) setTimeout(finish, 2000);
                else finish();
            } else {
                sequenceMaster.setSequenceTitle(isTko ? text.vsDoubleTko : text.vsDraw);
                versusEntryArea.attr("data-wins", "");
            }

            //this.releaseVersusSuperiorityGraph(0);
            if (!isFirstResult) this.releaseVersusSuperiorityGraph(0, null, true);
            else setTimeout(function() { sideMaster.releaseVersusSuperiorityGraph(0, null, true); }, 1500);
        } else {
            //this.updateVersusSuperiorityGraph(0, redRemains, blueRemains);
            if (stage < 2) this.releaseVersusSuperiorityGraph(0);
            else setTimeout(function() { sideMaster.releaseVersusSuperiorityGraph(0); }, 2000);
        }
    },

    eoo: eoo
}


//player info operation control panel
let playerInfoMaster = {

    player_info_op_cp: "div#player_info_op_cp",


    player_info_side: "div.player_info_side",

    info_side: "div.info_side",

    player_profile_select: "button.player_profile_select",
    player_info_clear: "button.player_info_clear",
    info_title: "span.info_title",
    info_ap: "input.info_ap",
    info_name: "input.info_name",
    info_uid: "input.info_uid",
    info_treveler: "div.info_treveler",
    info_copy: "button.info_copy",
    info_code: "textarea.info_code",

    info_add: "div.info_add",
    class_constell: ".constell",
    class_weapon: ".weapon",
    class_refine: ".refine",
    class_disadv: ".disadv",
    class_sum: ".sum",

    active: "data-active",

    line_title: "label.line_title",
    total_label: "label.total_label",
    addition_unit: "span.addition_unit",
    ratio_unit: "span.ratio_unit",
    input_addition: "input.addition",
    add_per_constell: "input.addition.constell",
    add_by_had_weapon: "input.addition.weapon",
    add_per_refine: "input.addition.refine",
    add_disadv_ratio: "input.addition.disadv",
    add_master_adjust: "input.addition.adjust",
    total_value: "span.total_value",
    apply_value: "span.apply_value",

    unit: "data-unit",



    selection_side: "div.selection_side",
    selection_entry: "div.selection_entry",

    entry: "data-entry",
    char: "data-char",
    weapon: "data-weapon",

    detected_adds: "span.detected_adds",
    
    entry_icon_area: "div.entry_icon_area",
    entry_icon: "div.entry_icon",
    char_constell: "input.char_constell",

    entry_info: "div.entry_info",
    char_name: "input.char_name",
    weapon_name: "input.weapon_name",

    entry_weapon_icon_area: "div.entry_weapon_icon_area",
    entry_weapon_icon: "div.entry_weapon_icon",
    weapon_refine: "input.weapon_refine",

    index: "data-index",



    playerInfoOpCP: null,


    eachPlayerInfoSide: null,

    eachInfoSide: null,

    eachPlayerProfileSelect: null,
    eachPlayerInfoClear: null,

    eachInfoAdd: null,
    eachInputAddition: null,
    eachAddPerConstell: null,
    eachAddByHadWeapon: null,
    eachAddPerRefine: null,
    eachAddDisadvRatio: null,
    eachAddMasterAdjust: null,
    eachTotalAddPerConstell: null,
    eachTotalAddByHadWeapon: null,
    eachTotalAddPerRefine: null,
    eachAppliedDisadv: null,
    eachTotalAddsValue: null,


    redInfoSide: null,

    redPlayerProfileSelect: null,
    redPlayerInfoClear: null,
    redInfoAp: null,
    redInfoName: null,
    redInfoUid: null,
    redInfoTreveler: null,
    redInfoTrevelerRadios: null,
    redInfoCopy: null,
    redInfoCode: null,

    redInfoAdd: null,
    redInputAddition: null,
    redAddPerConstell: null,
    redAddByHadWeapon: null,
    redAddPerRefine: null,
    redAddDisadvRatio: null,
    redAddMasterAdjust: null,
    redTotalAddPerConstell: null,
    redTotalAddByHadWeapon: null,
    redTotalAddPerRefine: null,
    redAppliedDisadv: null,
    redTotalAddsValue: null,


    blueInfoSide: null,

    bluePlayerProfileSelect: null,
    bluePlayerInfoClear: null,
    blueInfoAp: null,
    blueInfoName: null,
    blueInfoUid: null,
    blueInfoTreveler: null,
    blueInfoTrevelerRadios: null,
    blueInfoCopy: null,
    blueInfoCode: null,

    blueInfoAdd: null,
    blueInputAddition: null,
    blueAddPerConstell: null,
    blueAddByHadWeapon: null,
    blueAddPerRefine: null,
    blueAddDisadvRatio: null,
    blueAddMasterAdjust: null,
    blueTotalAddPerConstell: null,
    blueTotalAddByHadWeapon: null,
    blueTotalAddPerRefine: null,
    blueAppliedDisadv: null,
    blueTotalAddsValue: null,
    

    eachSelectionSide: null,
    eachSelectionEntry: null,

    eachEntryIconArea: null,
    eachEntryIcon: null,
    eachCharConstell: null,
    eachCharDetectedAdds: null,

    eachEntryInfo: null,
    eachCharName: null,
    eachWeaponName: null,

    eachEntryWeaponIconArea: null,
    eachEntryWeaponIcon: null,
    eachWeaponRefine: null,
    eachWeaponDetectedAdds: null,
    

    selectionSides: { red: null, blue: null },
    selectionEntries: { red: null, blue: null },

    entryIconAreas: { red: null, blue: null },
    entryIcons: { red: null, blue: null },
    charConstells: { red: null, blue: null },
    charDetectedAdds: { red: null, blue: null },

    entryInfos: { red: null, blue: null },
    charNames: { red: null, blue: null },
    weaponNames: { red: null, blue: null },

    entryWeaponIconAreas: { red: null, blue: null },
    entryWeaponIcons: { red: null, blue: null },
    weaponRefines: { red: null, blue: null },
    weaponDetectedAdds: { red: null, blue: null },
    

    inputs: null,


    addSecDefaults: {
        constell: 2,
        weapon: 4,
        refine: 2,
        disadv: 0.5,
        adjust: 0,
    },

    addSecs: {
        red: {
            constell: null,
            weapon: null,
            refine: null,
            disadv: null,
            adjust: null,
        },
        blue: {
            constell: null,
            weapon: null,
            refine: null,
            disadv: null,
            adjust: null,
        }
    },

    addsCalculated: { red: 0, blue: 0 },



    playerAccInfo: { red: null, blue: null },

    weapons: {
        "sword": [],
        "claymore": [],
        "polearm": [],
        "bow": [],
        "catalyst": []
    },

    weaponFiltered: null,


    init: function() {

        this.playerInfoOpCP = $(this.player_info_op_cp);


        this.eachPlayerInfoSide = this.playerInfoOpCP.find(this.player_info_side);

        this.eachInfoSide = this.eachPlayerInfoSide.find(this.info_side);
        this.eachInfoAp = this.eachInfoSide.find(this.info_ap);
        this.eachInfoName = this.eachInfoSide.find(this.info_name);
        this.eachInfoUid = this.eachInfoSide.find(this.info_uid);
        this.eachInfoTreveler = this.eachInfoSide.find(this.info_treveler);
        this.eachInfoTrevelerRadios = this.eachInfoTreveler.find('input[type="radio"]');
        this.eachInfoCopy = this.eachInfoSide.find(this.info_copy);
        this.eachInfoCode = this.eachInfoSide.find(this.info_code);
    
        this.eachPlayerProfileSelect = this.eachInfoSide.find(this.player_profile_select);
        this.eachPlayerInfoClear = this.eachInfoSide.find(this.player_info_clear);

        this.eachInfoAdd =  this.eachInfoSide.find(this.info_add);
        this.eachInputAddition = this.eachInfoAdd.find(this.input_addition);
        this.eachAddPerConstell = this.eachInfoAdd.find(this.add_per_constell);
        this.eachAddByHadWeapon = this.eachInfoAdd.find(this.add_by_had_weapon);
        this.eachAddPerRefine = this.eachInfoAdd.find(this.add_per_refine);
        this.eachAddDisadvRatio = this.eachInfoAdd.find(this.add_disadv_ratio);
        this.eachAddMasterAdjust = this.eachInfoAdd.find(this.add_master_adjust);
        this.eachTotalAddPerConstell = this.eachInfoAdd.filter(this.class_constell).find(this.total_value);
        this.eachTotalAddByHadWeapon = this.eachInfoAdd.filter(this.class_weapon).find(this.total_value);
        this.eachTotalAddPerRefine = this.eachInfoAdd.filter(this.class_refine).find(this.total_value);
        this.eachAppliedDisadv = this.eachInfoAdd.filter(this.class_disadv).find(this.apply_value);
        this.eachTotalAddsValue = this.eachInfoAdd.filter(this.class_sum).find(this.total_value);
    

        this.redPlayerInfoSide = this.eachPlayerInfoSide.filter(".red");
        this.redInfoSide = this.redPlayerInfoSide.find(this.info_side);

        this.redPlayerProfileSelect = this.redInfoSide.find(this.player_profile_select);
        this.redPlayerInfoClear = this.redInfoSide.find(this.player_info_clear);
        this.redInfoAp = this.redInfoSide.find(this.info_ap);
        this.redInfoName = this.redInfoSide.find(this.info_name);
        this.redInfoUid = this.redInfoSide.find(this.info_uid);
        this.redInfoTreveler = this.redInfoSide.find(this.info_treveler);
        this.redInfoTrevelerRadios = this.redInfoTreveler.find('input[type="radio"]');
        this.redInfoCopy = this.redInfoSide.find(this.info_copy);
        this.redInfoCode = this.redInfoSide.find(this.info_code);
    
        this.redInfoAdd =  this.redInfoSide.find(this.info_add);
        this.redInputAddition = this.redInfoAdd.find(this.input_addition);
        this.redAddPerConstell = this.redInfoAdd.find(this.add_per_constell);
        this.redAddByHadWeapon = this.redInfoAdd.find(this.add_by_had_weapon);
        this.redAddPerRefine = this.redInfoAdd.find(this.add_per_refine);
        this.redAddDisadvRatio = this.redInfoAdd.find(this.add_disadv_ratio);
        this.redAddMasterAdjust = this.redInfoAdd.find(this.add_master_adjust);
        this.redTotalAddPerConstell = this.redInfoAdd.filter(this.class_constell).find(this.total_value);
        this.redTotalAddByHadWeapon = this.redInfoAdd.filter(this.class_weapon).find(this.total_value);
        this.redTotalAddPerRefine = this.redInfoAdd.filter(this.class_refine).find(this.total_value);
        this.redAppliedDisadv = this.redInfoAdd.filter(this.class_disadv).find(this.apply_value);
        this.redTotalAddsValue = this.redInfoAdd.filter(this.class_sum).find(this.total_value);
    
    
        this.bluePlayerInfoSide = this.eachPlayerInfoSide.filter(".blue");
        this.blueInfoSide = this.bluePlayerInfoSide.find(this.info_side);

        this.bluePlayerProfileSelect = this.blueInfoSide.find(this.player_profile_select);
        this.bluePlayerInfoClear = this.blueInfoSide.find(this.player_info_clear);
        this.blueInfoAp = this.blueInfoSide.find(this.info_ap);
        this.blueInfoName = this.blueInfoSide.find(this.info_name);
        this.blueInfoUid = this.blueInfoSide.find(this.info_uid);
        this.blueInfoTreveler = this.blueInfoSide.find(this.info_treveler);
        this.blueInfoTrevelerRadios = this.blueInfoTreveler.find('input[type="radio"]');
        this.blueInfoCopy = this.blueInfoSide.find(this.info_copy);
        this.blueInfoCode = this.blueInfoSide.find(this.info_code);
    
        this.blueInfoAdd =  this.blueInfoSide.find(this.info_add);
        this.blueInputAddition = this.blueInfoAdd.find(this.input_addition);
        this.blueAddPerConstell = this.blueInfoAdd.find(this.add_per_constell);
        this.blueAddByHadWeapon = this.blueInfoAdd.find(this.add_by_had_weapon);
        this.blueAddPerRefine = this.blueInfoAdd.find(this.add_per_refine);
        this.blueAddDisadvRatio = this.blueInfoAdd.find(this.add_disadv_ratio);
        this.blueAddMasterAdjust = this.blueInfoAdd.find(this.add_master_adjust);
        this.blueTotalAddPerConstell = this.blueInfoAdd.filter(this.class_constell).find(this.total_value);
        this.blueTotalAddByHadWeapon = this.blueInfoAdd.filter(this.class_weapon).find(this.total_value);
        this.blueTotalAddPerRefine = this.blueInfoAdd.filter(this.class_refine).find(this.total_value);
        this.blueAppliedDisadv = this.blueInfoAdd.filter(this.class_disadv).find(this.apply_value);
        this.blueTotalAddsValue = this.blueInfoAdd.filter(this.class_sum).find(this.total_value);


        this.eachSelectionSide = this.playerInfoOpCP.find(this.selection_side);
        this.eachSelectionEntry = this.eachSelectionSide.find(this.selection_entry);

        this.eachEntryIconArea = this.eachSelectionEntry.find(this.entry_icon_area);
        this.eachEntryIcon = this.eachEntryIconArea.find(this.entry_icon);
        this.eachCharConstell = this.eachEntryIcon.find(this.char_constell);
        this.eachCharDetectedAdds = this.eachEntryIcon.find(this.detected_adds);

        this.eachEntryInfo = this.eachSelectionEntry.find(this.entry_info);
        this.eachCharName = this.eachEntryInfo.find(this.char_name);
        this.eachWeaponName = this.eachEntryInfo.find(this.weapon_name);

        this.eachEntryWeaponIconArea = this.eachSelectionEntry.find(this.entry_weapon_icon_area);
        this.eachEntryWeaponIcon = this.eachEntryWeaponIconArea.find(this.entry_weapon_icon);
        this.eachWeaponRefine = this.eachEntryWeaponIcon.find(this.weapon_refine);
        this.eachWeaponDetectedAdds = this.eachEntryWeaponIcon.find(this.detected_adds);


        this.selectionSides["red"] = this.eachSelectionSide.filter(".red");
        this.selectionEntries["red"] = this.selectionSides["red"].find(this.selection_entry);

        this.entryIconAreas["red"] = this.selectionEntries["red"].find(this.entry_icon_area);
        this.entryIcons["red"] = this.entryIconAreas["red"].find(this.entry_icon);
        this.charConstells["red"] = this.entryIcons["red"].find(this.char_constell);
        this.charDetectedAdds["red"] = this.entryIcons["red"].find(this.detected_adds);

        this.entryInfos["red"] = this.selectionEntries["red"].find(this.entry_info);
        this.charNames["red"] = this.entryInfos["red"].find(this.char_name);
        this.weaponNames["red"] = this.entryInfos["red"].find(this.weapon_name);

        this.entryWeaponIconAreas["red"] = this.selectionEntries["red"].find(this.entry_weapon_icon_area);
        this.entryWeaponIcons["red"] = this.entryWeaponIconAreas["red"].find(this.entry_weapon_icon);
        this.weaponRefines["red"] = this.entryWeaponIcons["red"].find(this.weapon_refine);
        this.weaponDetectedAdds["red"] = this.entryWeaponIcons["red"].find(this.detected_adds);


        this.selectionSides["blue"] = this.eachSelectionSide.filter(".blue");
        this.selectionEntries["blue"] = this.selectionSides["blue"].find(this.selection_entry);

        this.entryIconAreas["blue"] = this.selectionEntries["blue"].find(this.entry_icon_area);
        this.entryIcons["blue"] = this.entryIconAreas["blue"].find(this.entry_icon);
        this.charConstells["blue"] = this.entryIcons["blue"].find(this.char_constell);
        this.charDetectedAdds["blue"] = this.entryIcons["blue"].find(this.detected_adds);

        this.entryInfos["blue"] = this.selectionEntries["blue"].find(this.entry_info);
        this.charNames["blue"] = this.entryInfos["blue"].find(this.char_name);
        this.weaponNames["blue"] = this.entryInfos["blue"].find(this.weapon_name);

        this.entryWeaponIconAreas["blue"] = this.selectionEntries["blue"].find(this.entry_weapon_icon_area);
        this.entryWeaponIcons["blue"] = this.entryWeaponIconAreas["blue"].find(this.entry_weapon_icon);
        this.weaponRefines["blue"] = this.entryWeaponIcons["blue"].find(this.weapon_refine);
        this.weaponDetectedAdds["blue"] = this.entryWeaponIcons["blue"].find(this.detected_adds);


        this.inputs = this.eachSelectionEntry.find("input");



        //init
        // this.initDesc();
        // this.initAddsDefault();
        // this.initAddSecs();
        this.applyAddsDefaultByRuleBook();
        this.resetPicks();



        //default set
        this.showPlayerInfoLayer();


        this.eachPlayerProfileSelect.click(this.onClickPlayerProfileSelectButton);
        this.eachPlayerProfileSelect.contextmenu(this.onRightClickPlayerProfileSelectButton);
        this.eachPlayerInfoClear.click(this.onClickPlayerInfoClearButton);
        this.eachPlayerInfoClear.contextmenu(this.onRightClickPlayerInfoClearButton);

        this.redPlayerProfileSelect.keydown(function(e) {
            let pim = playerInfoMaster;

            switch (e.keyCode) {
                case 9://Tab
                    if (e.shiftKey) {
                        pim.blueInfoTrevelerRadios.first().focus();
                        return false;
                    }
                    break;
            }
        });
        this.redInfoTrevelerRadios.keydown(function(e) {
            let pim = playerInfoMaster;

            switch (e.keyCode) {
                case 9://Tab
                    if (!e.shiftKey) {
                        pim.bluePlayerProfileSelect.focus();
                        return false;
                    }
                    break;

                case 38://↑
                    pim.redInfoUid.focus();
                    return false;
                case 40://↓
                    pim.redInfoCopy.focus();
                    return false;
            }
        });
        this.bluePlayerProfileSelect.keydown(function(e) {
            let pim = playerInfoMaster;

            switch (e.keyCode) {
                case 9://Tab
                    if (e.shiftKey) {
                        pim.redInfoTrevelerRadios.first().focus();
                        return false;
                    }
                    break;
            }
        });
        this.blueInfoTrevelerRadios.keydown(function(e) {
            let pim = playerInfoMaster;

            switch (e.keyCode) {
                case 9://Tab
                    if (!e.shiftKey) {
                        pim.redPlayerProfileSelect.focus();
                        return false;
                    }
                    break;

                case 38://↑
                    pim.blueInfoUid.focus();
                    return false;
                case 40://↓
                    pim.blueInfoCopy.focus();
                    return false;
            }
        });

        this.redInfoAp.change(function(e) {
            playerInfoMaster.releaseSecondsForAdds();
        });
        this.blueInfoAp.change(function(e) {
            playerInfoMaster.releaseSecondsForAdds();
        });


        this.redInfoCopy.keydown(function(e) {
            let pim = playerInfoMaster;

            switch (e.keyCode) {
                case 9://Tab
                    if (e.shiftKey) {
                        pim.redInfoCode.focus();
                        return false;
                    }
                    break;

                case 37://←
                    pim.charConstells["red"].first().focus();
                    return false;
                case 38://↑
                    pim.redInfoTrevelerRadios.first().focus();
                    return false;
                case 39://→
                    pim.blueInfoCopy.focus();
                    return false;
                case 40://↓
                    pim.redInfoCode.focus();
                    return false;
            }
        });
        this.redInfoCode.keydown(function(e) {
            let pim = playerInfoMaster;

            switch (e.keyCode) {
                case 9://Tab
                    if (!e.shiftKey) {
                        pim.redInfoCopy.focus();
                        return false;
                    }
                    break;
            }
        });
        this.blueInfoCopy.keydown(function(e) {
            let pim = playerInfoMaster;

            switch (e.keyCode) {
                case 9://Tab
                    if (e.shiftKey) {
                        pim.blueInfoCode.focus();
                        return false;
                    }
                    break;

                case 37://←
                    pim.redInfoCopy.focus();
                    return false;
                case 38://↑
                    pim.blueInfoTrevelerRadios.first().focus();
                    return false;
                case 39://→
                    pim.charConstells["blue"].first().focus();
                    return false;
                case 40://↓
                    pim.blueInfoCode.focus();
                    return false;
            }
        });
        this.blueInfoCode.keydown(function(e) {
            let pim = playerInfoMaster;

            switch (e.keyCode) {
                case 9://Tab
                    if (!e.shiftKey) {
                        pim.blueInfoCopy.focus();
                        return false;
                    }
                    break;
            }
        });

        this.eachInfoCode.focus(function(e) { $(this).select(); });
        this.eachInfoCode.on("paste", this.onPasteAccountCode);


        this.redAddPerConstell.keydown(function(e) {
            let pim = playerInfoMaster;

            switch (e.keyCode) {
                case 9://Tab
                    if (e.shiftKey) {
                        pim.blueAddMasterAdjust.focus();
                        return false;
                    }
                    break;
            }
        });
        //this.redAddByHadWeapon
        this.redAddMasterAdjust.keydown(function(e) {
            let pim = playerInfoMaster;

            switch (e.keyCode) {
                case 9://Tab
                    if (!e.shiftKey) {
                        pim.blueAddPerConstell.focus();
                        return false;
                    }
                    break;
            }
        });

        this.blueAddPerConstell.keydown(function(e) {
            let pim = playerInfoMaster;

            switch (e.keyCode) {
                case 9://Tab
                    if (e.shiftKey) {
                        pim.redAddMasterAdjust.focus();
                        return false;
                    }
                    break;
            }
        });
        //this.blueAddByHadWeapon
        this.blueAddMasterAdjust.keydown(function(e) {
            let pim = playerInfoMaster;

            switch (e.keyCode) {
                case 9://Tab
                    if (!e.shiftKey) {
                        pim.redAddPerConstell.focus();
                        return false;
                    }
                    break;
            }
        });

        this.redInputAddition.contextmenu(function(e) {
            this.value = "";
            if (onShift) playerInfoMaster.blueInfoSide.find("input#" + this.id.replace("red", "blue")).val("");
            return false;
        });
        this.blueInputAddition.contextmenu(function(e) {
            this.value = "";
            if (onShift) playerInfoMaster.redInfoSide.find("input#" + this.id.replace("blue", "red")).val("");
            return false;
        });
        this.redAddPerConstell.change(function(e) {
            let pim = playerInfoMaster;
            let value = this.value.trim();
            let isEmpty = value == null || value == "" || isNaN(value);
            let v = isEmpty ? pim.addSecDefaults.constell : parseInt(value);
            pim.addSecs.red.constell = v;
            if (onShift) {
                pim.blueAddPerConstell.val(value);
                pim.addSecs.blue.constell = v;
            }
            pim.releaseSecondsForAdds();
        });
        this.redAddPerConstell.keydown(function(e) {
            if (e.keyCode == 13 && e.shiftKey) {
                playerInfoMaster.blueAddPerConstell.val(this.value);
            }
        });
        this.redAddByHadWeapon.change(function(e) {
            let pim = playerInfoMaster;
            let value = this.value.trim();
            let isEmpty = value == null || value == "" || isNaN(value);
            let v = isEmpty ? pim.addSecDefaults.weapon : parseInt(value);
            pim.addSecs.red.weapon = v;
            if (onShift) {
                pim.blueAddByHadWeapon.val(value);
                pim.addSecs.blue.weapon = v;
            }
            pim.releaseSecondsForAdds();
        });
        this.redAddByHadWeapon.keydown(function(e) {
            if (e.keyCode == 13 && e.shiftKey) {
                playerInfoMaster.blueAddByHadWeapon.val(this.value);
            }
        });
        this.redAddPerRefine.change(function(e) {
            let pim = playerInfoMaster;
            let value = this.value.trim();
            let isEmpty = value == null || value == "" || isNaN(value);
            let v = isEmpty ? pim.addSecDefaults.refine : parseInt(value);
            pim.addSecs.red.refine = v;
            if (onShift) {
                pim.blueAddPerRefine.val(value);
                pim.addSecs.blue.refine = v;
            }
            pim.releaseSecondsForAdds();
        });
        this.redAddPerRefine.keydown(function(e) {
            if (e.keyCode == 13 && e.shiftKey) {
                playerInfoMaster.blueAddPerRefine.val(this.value);
            }
        });
        this.redAddDisadvRatio.change(function(e) {
            let pim = playerInfoMaster;
            let value = this.value.trim();
            let isEmpty = value == null || value == "" || isNaN(value);
            let v = isEmpty ? pim.addSecDefaults.disadv : parseFloat(value);
            pim.addSecs.red.disadv = v;
            if (onShift) {
                pim.blueAddDisadvRatio.val(value);
                pim.addSecs.blue.disadv = v;
            }
            pim.releaseSecondsForAdds();
        });
        this.redAddDisadvRatio.keydown(function(e) {
            if (e.keyCode == 13 && e.shiftKey) {
                playerInfoMaster.blueAddDisadvRatio.val(this.value);
            }
        });
        this.redAddMasterAdjust.change(function(e) {
            let pim = playerInfoMaster;
            let value = this.value.trim();
            let isEmpty = value == null || value == "" || isNaN(value);
            let v = isEmpty ? 0 : parseInt(value);
            pim.addSecs.red.adjust = v;
            pim.releaseSecondsForAdds();
        });
        this.redAddMasterAdjust.on("wheel", function(e) {
            e.preventDefault();
            let pim = playerInfoMaster;
            var val = this.value;
            if (val == "") val = 0;
            else val = parseInt(val);

            if (e.originalEvent.deltaY < 0) val++;
            else if (e.originalEvent.deltaY > 0) val--;

            this.value = val;
            pim.addSecs.red.adjust = val;
            pim.releaseSecondsForAdds();
            return false;
        });

        this.blueAddPerConstell.change(function(e) {
            let pim = playerInfoMaster;
            let value = this.value.trim();
            let isEmpty = value == null || value == "" || isNaN(value);
            let v = isEmpty ? pim.addSecDefaults.constell : parseInt(value);
            pim.addSecs.blue.constell = v;
            if (onShift) {
                pim.redAddPerConstell.val(value);
                pim.addSecs.red.constell = v;
            }
            pim.releaseSecondsForAdds();
        });
        this.blueAddPerConstell.keydown(function(e) {
            if (e.keyCode == 13 && e.shiftKey) {
                playerInfoMaster.redAddPerConstell.val(this.value);
            }
        });
        this.blueAddByHadWeapon.change(function(e) {
            let pim = playerInfoMaster;
            let value = this.value.trim();
            let isEmpty = value == null || value == "" || isNaN(value);
            let v = isEmpty ? pim.addSecDefaults.weapon : parseInt(value);
            pim.addSecs.blue.weapon = v;
            if (onShift) {
                pim.redAddByHadWeapon.val(value);
                pim.addSecs.red.weapon = v;
            }
            pim.releaseSecondsForAdds();
        });
        this.blueAddByHadWeapon.keydown(function(e) {
            if (e.keyCode == 13 && e.shiftKey) {
                playerInfoMaster.redAddByHadWeapon.val(this.value);
            }
        });
        this.blueAddPerRefine.change(function(e) {
            let pim = playerInfoMaster;
            let value = this.value.trim();
            let isEmpty = value == null || value == "" || isNaN(value);
            let v = isEmpty ? pim.addSecDefaults.refine : parseInt(value);
            pim.addSecs.blue.refine = v;
            if (onShift) {
                pim.redAddPerRefine.val(value);
                pim.addSecs.red.refine = v;
            }
            pim.releaseSecondsForAdds();
        });
        this.blueAddPerRefine.keydown(function(e) {
            if (e.keyCode == 13 && e.shiftKey) {
                playerInfoMaster.redAddPerRefine.val(this.value);
            }
        });
        this.blueAddDisadvRatio.change(function(e) {
            let pim = playerInfoMaster;
            let value = this.value.trim();
            let isEmpty = value == null || value == "" || isNaN(value);
            let v = isEmpty ? pim.addSecDefaults.disadv : parseFloat(value);
            pim.addSecs.blue.disadv = v;
            if (onShift) {
                pim.redAddDisadvRatio.val(value);
                pim.addSecs.red.disadv = v;
            }
            pim.releaseSecondsForAdds();
        });
        this.blueAddPerRefine.keydown(function(e) {
            if (e.keyCode == 13 && e.shiftKey) {
                playerInfoMaster.redAddDisadvRatio.val(this.value);
            }
        });
        this.blueAddMasterAdjust.change(function(e) {
            let pim = playerInfoMaster;
            let value = this.value.trim();
            let isEmpty = value == null || value == "" || isNaN(value);
            let v = isEmpty ? 0 : parseInt(value);
            pim.addSecs.blue.adjust = v;
            pim.releaseSecondsForAdds();
        });
        this.blueAddMasterAdjust.on("wheel", function(e) {
            e.preventDefault();
            let pim = playerInfoMaster;
            var val = this.value;
            if (val == "") val = 0;
            else val = parseInt(val);

            if (e.originalEvent.deltaY < 0) val++;
            else if (e.originalEvent.deltaY > 0) val--;

            this.value = val;
            pim.addSecs.blue.adjust = val;
            pim.releaseSecondsForAdds();
            return false;
        });


        this.eachEntryIcon.contextmenu(function(e) {
            e.preventDefault();
            $(this).find(playerInfoMaster.char_constell).val("");
            return false;
        });
        this.eachWeaponRefine.contextmenu(function(e) {
            e.preventDefault();
            this.value = "";
            return false;
        });
        this.eachEntryWeaponIcon.contextmenu(function(e) {
            e.preventDefault();
            $(this).find(playerInfoMaster.weapon_refine).val("");
            return false;
        });
        this.eachWeaponRefine.contextmenu(function(e) {
            e.preventDefault();
            this.value = "";
            return false;
        });

        this.eachCharConstell.focus(function(e) { $(this).attr("type", "number") });
        this.eachCharConstell.blur(function(e) { $(this).attr("type", "text") });
        this.eachWeaponRefine.focus(function(e) { $(this).attr("type", "number") });
        this.eachWeaponRefine.blur(function(e) { $(this).attr("type", "text") });
        this.eachCharConstell.on("input paste cut change", this.onNumericEnterSelections);
        this.eachWeaponRefine.on("input paste cut change", this.onNumericEnterSelections);
        this.eachCharConstell.on("focus input paste cut change", function(e) { if ($(this).is(":focus")) this.select(); });
        this.eachWeaponRefine.on("focus input paste cut change", function(e) { if ($(this).is(":focus")) this.select(); });

        this.inputs.focus(function(e) { $(this).closest(playerInfoMaster.selection_entry).attr("data-focus", this.className); $(this).select(); });
        this.inputs.blur(function(e) { let selectionEntry = $(this).closest(playerInfoMaster.selection_entry); if (selectionEntry.attr("data-focus") == this.className) selectionEntry.attr("data-focus", ""); });
        this.inputs.keydown(this.onKeydownSelectionEntry);
        this.eachEntryIconArea.click(function(e) { $(this).find("input").focus(); });
        this.eachEntryWeaponIconArea.click(function(e) { $(this).find("input").focus(); });

        this.charConstells["red"].first().keydown(function(e) {
            let pim = playerInfoMaster;

            switch (e.keyCode) {
                case 9://Tab
                    if (e.shiftKey) {
                        pim.weaponRefines["blue"].last().focus();
                        return false;
                    }
                    break;
            }
        });
        this.weaponRefines["red"].last().keydown(function(e) {
            let pim = playerInfoMaster;

            switch (e.keyCode) {
                case 9://Tab
                    if (!e.shiftKey) {
                        pim.charConstells["blue"].first().focus();
                        return false;
                    }
                    break;
            }
        });
        this.charConstells["blue"].first().keydown(function(e) {
            let pim = playerInfoMaster;

            switch (e.keyCode) {
                case 9://Tab
                    if (e.shiftKey) {
                        pim.weaponRefines["red"].last().focus();
                        return false;
                    }
                    break;
            }
        });
        this.weaponRefines["blue"].last().keydown(function(e) {
            let pim = playerInfoMaster;

            switch (e.keyCode) {
                case 9://Tab
                    if (!e.shiftKey) {
                        pim.charConstells["red"].first().focus();
                        return false;
                    }
                    break;
            }
        });
        this.eachCharConstell.keydown(this.onKeydownCharConstell);
        this.eachCharName.keydown(this.onKeydownCharName);
        this.eachWeaponName.keydown(this.onKeydownWeaponName);
        this.eachWeaponRefine.keydown(this.onKeydownWeaponRefine);

        this.eachWeaponName.on("input cut paste change", this.onInputWeaponName);

        this.eachWeaponName.focus(this.onFocusWeaponName);
        this.eachWeaponName.blur(this.onBlurWeaponName);


        this.preloadWeaponsInfo();
        
    },

    initDesc: function() {
        let text = lang.text;

        this.redPlayerProfileSelect.find(this.info_title).text(text.sideRed);
        this.bluePlayerProfileSelect.find(this.info_title).text(text.sideBlue);
        this.eachPlayerProfileSelect.attr("title", text.pisPlayerProfileSelectDesc);
        this.eachPlayerProfileSelect.attr("placeholder", text.pisPlayerProfileSelectDesc);
        this.eachPlayerInfoClear.attr("title", text.pisPlayerInfoClearDesc);
        this.eachInfoTreveler.find('label.info_treveler_style.female').text(text.pisLumine);
        this.eachInfoTreveler.find('label.info_treveler_style.male').text(text.pisAether);
        this.eachInfoCopy.text(text.pisCopyAccountCode);
        this.eachInfoCopy.attr("title", text.pisCopyAccountCodeDesc);
        this.eachInfoCode.attr("placeholder", text.pisDataAccountCode);
        this.eachInfoCode.attr("title", text.pisDataAccountCodeDesc);
        this.eachInfoAdd.filter(this.class_constell).find(this.line_title).text(text.pisAddTimeConstell);
        this.eachInfoAdd.filter(this.class_weapon).find(this.line_title).text(text.pisAddTimeHasWapon);
        this.eachInfoAdd.filter(this.class_refine).find(this.line_title).text(text.pisAddTimeWeponRefine);
        this.eachInfoAdd.find(this.total_label).text(text.sum);
        this.eachInfoAdd.find(this.addition_unit).attr(this.unit, text.unitSec);
        this.eachInfoAdd.filter(this.class_disadv).find(this.line_title).text(text.pisAddTimeDisadvRatio);
        this.eachInfoAdd.filter(this.class_sum).find(this.line_title).text(text.pisAddTimeAdjust);
        this.eachInfoAdd.filter(this.class_sum).find(this.total_label).text(text.pisAddsTotal);
        if (this.addSecDefaults != null) {
            this.redAddPerConstell.attr("title", text.pisAddTimeConstellDesc.replace("#SIDE", text.sideRed) + "\n" + text.pisAddTimeCommonTails.replace("#SEC", this.addSecDefaults.constell));
            this.blueAddPerConstell.attr("title", text.pisAddTimeConstellDesc.replace("#SIDE", text.sideBlue) + "\n" + text.pisAddTimeCommonTails.replace("#SEC", this.addSecDefaults.constell));
            this.redAddByHadWeapon.attr("title", text.pisAddTimeHasWaponDesc.replace("#SIDE", text.sideRed) + "\n" + text.pisAddTimeCommonTails.replace("#SEC", this.addSecDefaults.weapon));
            this.blueAddByHadWeapon.attr("title", text.pisAddTimeHasWaponDesc.replace("#SIDE", text.sideBlue) + "\n" + text.pisAddTimeCommonTails.replace("#SEC", this.addSecDefaults.weapon));
            this.redAddPerRefine.attr("title", text.pisAddTimeWeponRefineDesc.replace("#SIDE", text.sideRed) + "\n" + text.pisAddTimeCommonTails.replace("#SEC", this.addSecDefaults.refine));
            this.blueAddPerRefine.attr("title", text.pisAddTimeWeponRefineDesc.replace("#SIDE", text.sideBlue) + "\n" + text.pisAddTimeCommonTails.replace("#SEC", this.addSecDefaults.refine));
        }
        this.redAddDisadvRatio.attr("title", text.pisAddTimeDisadvRatioDesc.replace("#SIDE", text.sideRed));
        this.blueAddDisadvRatio.attr("title", text.pisAddTimeDisadvRatioDesc.replace("#SIDE", text.sideBlue));
        this.redAddMasterAdjust.attr("title", text.pisAddTimeAdjustDesc.replace("#SIDE", text.sideRed));
        this.blueAddMasterAdjust.attr("title", text.pisAddTimeAdjustDesc.replace("#SIDE", text.sideBlue));

        this.eachEntryIcon.attr("title", text.pssCharConstellDesc);
        this.eachCharConstell.attr("title", text.pssCharConstellDesc);
        this.eachCharName.attr("title", text.pssCharNameDesc);
        for (var i=0; i<this.charNames["red"].length; i++) $(this.charNames["red"][i]).attr("placeholder", text.pssCharName.replace("#NO", "" + (i + 1)));
        for (var i=0; i<this.charNames["blue"].length; i++) $(this.charNames["blue"][i]).attr("placeholder", text.pssCharName.replace("#NO", "" + (i + 1)));
        this.eachWeaponName.attr("title", text.pssWeaponNameDesc);
        for (var i=0; i<this.weaponNames["red"].length; i++) $(this.weaponNames["red"][i]).attr("placeholder", text.pssWeaponName.replace("#NO", "" + (i + 1)));
        for (var i=0; i<this.weaponNames["blue"].length; i++) $(this.weaponNames["blue"][i]).attr("placeholder", text.pssWeaponName.replace("#NO", "" + (i + 1)));
        this.eachEntryWeaponIcon.attr("title", text.pssWeaponRefineDesc);
        this.eachWeaponRefine.attr("title", text.pssWeaponRefineDesc);
    },

    togglePlayerInfoLayer: function() {
        if (this.playerInfoOpCP.is(":visible")) this.hidePlayerInfoLayer(true);
        else this.showPlayerInfoLayer(true);
    },

    showPlayerInfoLayer: function(byToggle) {
        if (!byToggle) this.lastStatePIL = this.getStatePlayerInfoLayer();
        this.playerInfoOpCP.fadeIn(270);
    },

    hidePlayerInfoLayer: function(byToggle) {
        if (!byToggle) this.lastStatePIL = this.getStatePlayerInfoLayer();
        this.playerInfoOpCP.fadeOut(270);
    },

    getStatePlayerInfoLayer: function() {
        let opacity = this.playerInfoOpCP.css("opacity");
        return this.playerInfoOpCP.css("display") != "none" && opacity == 1;
    },

    checkBackShowingPlayerInfoLayer: function() {
        let ls = this.lastStatePIL;
        if (ls != null) {
            if (ls || step == -1) this.showPlayerInfoLayer(true);
            else this.hidePlayerInfoLayer(true);
        }
    },

    onClickPlayerProfileSelectButton: function(e) {
        let side = $(this).attr("data-side");
        if (side == null || side == "") return;
        if (sequenceMaster.pickingPlayerProfile[side]) {
            playSound("훧");
            playerInfoMaster.returnPlayerProfileSelection(side);
            return;
        } else {
            let proffer = side == "red" ? "blue" : "red";
            playerInfoMaster.returnPlayerProfileSelection(proffer);
        }

        playSound("뽁");

        sequenceMaster.setSequenceTitleHtml(lang.text.playerProfileSelection.replace("#SIDE", '<span class="text' + (side == "red" ? "Red" : "Blue") + '">' + side.toUpperCase() + '</span>'));
        sequenceMaster.pickingPlayerProfile[side] = true;
        sequenceMaster.pickingPlayerProfile[side == "red" ? "blue" : "red" ] = false;
        sideMaster.setNameplateMix(side, "1");
        sideMaster.setPlayerProfileShow(side, "1");
        playerInfoMaster.setPlayerProfileActive(side, "1");
    },

    returnPlayerProfileSelection: function(side) {
        var id = sequenceMaster.selectedPlayerProfile[side];
        if (id == null) this.finishPlayerProfile(side);
        else {
            this.endSelectionPlayerProfile(side);
            let t = "treveler";
            var treveler;
            if (id.indexOf(t) == 0) {
                treveler = id[id.length-1] == "F" ? "0" : "1";
                id = t;
            }
            this.setPlayerProfile(id, side, treveler);
        }
    },

    setPlayerProfile: function(id, side, treveler) {
        if (id == null || id == "" || side == null || side == "") return null;

        var index = charactersInfo[id];
        if (id == "treveler" && treveler != null && treveler != "") index += parseInt(treveler);
        let info = charactersInfo.list[index];

        if (info == null) return null;
        if (info.res_wide == null || info.res_wide == "") return false;

        let style = "url('" + getPath("images", "character_wide", info.res_wide) + "')";
        let scale = info.res_wide_meta_pos.scale;
        let ph = info.res_wide_meta_pos.h;
        let pv = info.res_wide_meta_pos.v;

        playSound("뽑");

        switch (side) {
            case "red":
                sideMaster.redProfileCharacterImage.css("--src", style);
                sideMaster.redProfileCharacterImage.css("--scale", scale);
                sideMaster.redProfileCharacterImage.css("--ph", ph);
                sideMaster.redProfileCharacterImage.css("--pv", pv);
                break;

            case "blue":
                sideMaster.blueProfileCharacterImage.css("--src", style);
                sideMaster.blueProfileCharacterImage.css("--scale", scale);
                sideMaster.blueProfileCharacterImage.css("--ph", ph);
                sideMaster.blueProfileCharacterImage.css("--pv", pv);
                break;
        }
        sideMaster.setPlayerProfileShow(side, "2");
        //this.setPlayerProfileActive(side);
    },

    finishPlayerProfile: function(side, id) {
        this.endSelectionPlayerProfile(side);
        if (id == null) this.closePlayerProfile(side);
    },

    endSelectionPlayerProfile(side) {
        sequenceMaster.pickingPlayerProfile[side] = false;
        sequenceMaster.setSequenceTitleByCurrent();
        this.setPlayerProfileActive(side);
    },

    closePlayerProfile: function(side) {
        sideMaster.setNameplateMix(side);
        sideMaster.setPlayerProfileShow(side);
        this.releasePlayerProfile(side);
    },

    onRightClickPlayerProfileSelectButton: function(e) {
        e.preventDefault();

        let side = $(this).attr("data-side");
        playerInfoMaster.breakPlayerProfile(side);

        return false;
    },

    breakPlayerProfile: function(side) {
        if (sequenceMaster.pickingPlayerProfile[side]) {
            playSound("훧");
            playerInfoMaster.endSelectionPlayerProfile(side);
        }
        playSound("웋");
        sequenceMaster.selectedPlayerProfile[side] = null;
        playerInfoMaster.closePlayerProfile(side);
    },

    releasePlayerProfile: function(side, hide = false) {
        switch (side) {
            case "red":
            sideMaster.redProfileCharacterImage.css("--src", urlTpGif);
            sideMaster.redProfileCharacterImage.css("--scale", "");
            sideMaster.redProfileCharacterImage.css("--ph", "");
            sideMaster.redProfileCharacterImage.css("--pv", "");
            if (hide) sideMaster.redProfileCharacter.attr("data-show", "");
            break;

        case "blue":
            sideMaster.blueProfileCharacterImage.css("--src", urlTpGif);
            sideMaster.blueProfileCharacterImage.css("--scale", "");
            sideMaster.blueProfileCharacterImage.css("--ph", "");
            sideMaster.blueProfileCharacterImage.css("--pv", "");
            if (hide) sideMaster.blueProfileCharacter.attr("data-show", "");
            break;
        }
        //sideMaster.setNameplateMix(side);
    },

    clearPlayerProfile: function(side) {
        switch (side) {
            case "red":
            sideMaster.redProfileCharacterImage.css("--src", urlTpGif);
            break;

        case "blue":
            sideMaster.blueProfileCharacterImage.css("--src", urlTpGif);
            break;
        }
    },

    setPlayerProfileActive(side, set = "") {
        switch (side) {
            case "red":
            this.redPlayerProfileSelect.attr(this.active, set);
            break;

        case "blue":
            this.bluePlayerProfileSelect.attr(this.active, set);
            break;
        }

    },

    releaseCharPick: function(side, no) {
        let picked = sideMaster.entryPicked[side];

        for (var i=0; i < 8; i++) {
            let info = picked[i];
            let entry = $(this.selectionEntries[side][i]);
            if (info == null) {
                if (entry.attr(this.char) != "") {//clear
                    entry.attr(this.char, "");
                    //--class_back
                    $(this.entryIcons[side][i]).css("--src", urlTpGif);
                    $(this.charConstells[side][i]).val("");
                    $(this.charNames[side][i]).val("");
                }
            } else if (info.id != entry.attr(this.char)) {
                entry.attr(this.char, info.id);
                //--class_back
                $(this.entryIcons[side][i]).css("--src", "url('" + getPath("images", "character_icon", info.res_icon) + "')");
                let isForCalc = info.rarity == "5" && info.id != "treveler";
                var rarity = "";
                if (this.playerAccInfo[side] != null) {
                    let rarityValue = this.playerAccInfo[side][info.id];
                    let rarityInt = parseInt(rarityValue);
                    rarity = "" + rarityValue;
                    switch (rarity) {
                        case "null":
                            if (isForCalc) sequenceMaster.setSequenceTitle(lang.text.alertPlayerNotOwnCharacter, 5000);
                            break;
                        case "undefined":
                            rarity = "";
                            break;
                    }
                    rarity = "" + (isNaN(rarityInt) ? (isForCalc ? 0 : "") : rarityInt);
                } else if (isForCalc) rarity = "0";
                $(this.charConstells[side][i]).val(rarity);
                $(this.charNames[side][i]).val(info.nameShort[loca]);
            }
        }
        this.releaseSecondsForAdds();
    },

    onClickPlayerInfoClearButton: function(e) {
        let side = $(this).attr("data-side");
        playerInfoMaster.clearSelectionInfos(side);
        playerInfoMaster.weaponNames[side][0].focus();
    },

    onRightClickPlayerInfoClearButton: function(e) {
        e.preventDefault();

        let side = $(this).attr("data-side");
        playerInfoMaster.clearPlayerInfos(side);
        playerInfoMaster.clearSelectionInfos(side);

        return false;

    },

    clearSelectionInfos: function(side) {
        this.selectionEntries[side].attr(this.weapon, "");
        this.entryWeaponIcons[side].css("--src", urlTpGif);
        this.weaponNames[side].val("");
        this.weaponRefines[side].val("");

        this.releaseSecondsForAdds();
    },

    clearPlayerInfos: function(side) {
        this.setPlayerInfo(side);
        this.playerAccInfo[side] = null;
        for (var i=0; i<this.charConstells[side].length; i++) {
            let cons = $(this.charConstells[side][i]);
            let char = $(this.selectionEntries[side][i]).attr(this.char);
            if (char != null && char != "") {
                let c = charactersInfo.list[charactersInfo[char]];
                cons.val(c.rarity == 5 ? "0" : "");
            }
        }
        this.breakPlayerProfile(side);
        sideMaster.clearAccountInfo(side);
        sideMaster.initSideEntered(side);
        switch (side) {
            case "red":
                this.redInfoCode.val("").focus();
                break;

            case "blue":
                this.blueInfoCode.val("").focus();
                break;
        }
    },

    resetPicks: function() {
        this.eachSelectionEntry.attr(this.char, "");
        this.eachSelectionEntry.attr(this.weapon, "");
        //--class_back
        this.eachEntryIcon.css("--src", urlTpGif);
        this.eachCharConstell.val("");
        this.eachCharName.val("");
        this.eachEntryWeaponIcon.css("--src", urlTpGif);
        this.eachWeaponName.val("");
        this.eachWeaponRefine.val("");

        this.releaseSecondsForAdds();
    },

    onPasteAccountCode: function(e) {
        let self = $(e.target == null ? e : e.target);

        var raw = null;
        if (e.clipboardData != null) raw = e.clipboardData.getData("text/plain");

        let side = self.attr("data-side");

        if (raw != null) {
            if (playerInfoMaster.applyAccountInfo(raw, side)) {
                e.preventDefault();
                return false;
            }
        } else {
            let prevData = self.val().trim();
            setTimeout(function() {
                let pasted = self.val().trim();
                let pastedClean = pasted.replace(/@GCBPSv[0-9]+:.*;/g, "").replace(/@GCBPSv[0-9]+:.*/g, "").replace(/{"player":\{.*\}.*\}/g, "");
                let data = prevData == pasted ? pasted : pasted.replace(prevData, "");
                let success = playerInfoMaster.applyAccountInfo(data, side);
                self.val(data);
                //if (self.val() == "") self.focus();
            }, 10);
        }
    },

    applyAccountInfo: function(raw, side) {
        var data = sideMaster.parsePlayerData(raw);

        if (data != null && this.loadedAccInfo(raw, data, side)) {
            playSound("뜍");
            playerInfoMaster.releaseSecondsForAdds();
            return true;
        }
        playSound("웋");
        return false;
    },

    loadedAccInfo: function(raw, data, side) {
        if (raw != null && data != null && side != null) {
            let infoCode;
            switch (side) {
                case "red":
                    infoCode = this.redInfoCode;
                    break;
    
                case "blue":
                    infoCode = this.blueInfoCode;
                    break;
            }
    
            infoCode.val(raw);

            this.setAccountInfo(side, data);
            var point = 0;

            try {
                for(var i in data) {
                    if (i != "player" && i != "prebanned" && i != "selfbanned" && i != "list") {
                        let cons = data[i];
                        let info = charactersInfo.list[charactersInfo[i]];
                        if (cons != null && info.class == "limited") {
                            var banned = false;
                            for (var id in rules.global_banned) if (id == info.id) {
                                banned = true;
                                break;
                            }
                            if (!banned) point += parseInt(cons) + 1;
                        }
                    }
                }

                let playerInfo = data.player;
                this.setPlayerInfo(side, point, playerInfo);
                if (rules.rule_type == "cardy") sequenceMaster.calcCardyPreBans();
            } catch (e) {
                return false;
            }
            return true;
        } return false;
    },

    setAccountInfo: function(side, data) {
        if (side != null && data != null && data.player != null) {
            this.playerAccInfo[side] = data;

        }
    },

    setPlayerInfo: function(side, point = "", p = { name: "", uid: "", treveler: null }) {
        if (side == null && side == "") return;

        var infoAp;
        var infoName;
        var infoUid;
        var infoTrevelers;
        switch (side) {
            case "red":
                infoAp = this.redInfoAp;
                infoName = this.redInfoName;
                infoUid = this.redInfoUid;
                infoTrevelers = this.redInfoTrevelerRadios;
                break;

            case "blue":
                infoAp = this.blueInfoAp;
                infoName = this.blueInfoName;
                infoUid = this.blueInfoUid;
                infoTrevelers = this.blueInfoTrevelerRadios;
                break;
        }

        infoAp.val(point);
        infoName.val(unescape(p.name));
        infoUid.val(p.uid);
        if (p.treveler != null) infoTrevelers.filter('[value="' + p.treveler + '"]')[0].checked = true;
    },

    onChangedCharConstell: function(id, constell) {
        let found = this.eachSelectionEntry.filter('[' + this.char + '="' + id + '"]');
        if (found.length > 0) found.find(this.char_constell).val(constell);
        this.releaseSecondsForAdds();
    },

    onKeydownSelectionEntry: function(e) {
        let pim = playerInfoMaster;
        let selectionEntry = $(this).closest(pim.selection_entry);
        let selectionSide = selectionEntry.parent();
        let side = selectionSide.hasClass("red") ? "red" : "blue";
        let entry = parseInt(selectionEntry.attr(pim.entry));
        let isLastOrder = entry == 8;
        let nextEntry = isLastOrder ? 0 : entry;
        let nextSide = isLastOrder ? (side == "red" ? "blue" : "red") : side;

        if (e.keyCode == 13) {
            e.preventDefault();
            switch(this.className) {
                case "char_constell":
                    $(pim.charConstells[nextSide][nextEntry]).focus();
                    break;

                case "char_name":
                    $(pim.charNames[nextSide][nextEntry]).focus();
                    break;

                case "weapon_name":
                    $(pim.weaponNames[nextSide][nextEntry]).focus();
                    break;

                case "weapon_refine":
                    let nextName = $(pim.weaponNames[nextSide][nextEntry]);
                    let nextRefine = $(pim.weaponRefines[nextSide][nextEntry]);
                    if (nextName.val() == "") nextName.focus();
                    else nextRefine.focus();
                    break;
            }
            return false;
        }
    },

    onNumericEnterSelections: function(e) {
        let value = this.value;
        var val = value.trim();
        if (val != "") {
            if (isNaN(val)) val = "";
            else {
                let self = $(this);
                let max = self.attr("max");
                let min = self.attr("min");
                let v = parseInt(val);
                if (v > parseInt(max)) val = max;
                else if (v < parseInt(min)) val = min;
            }
        }
        if (value != val) {
            this.value = val;
            setTimeout(function() { playerInfoMaster.releaseSecondsForAdds(); }, 10);
        } else playerInfoMaster.releaseSecondsForAdds();
    },

    onKeydownCharConstell: function(e) {
        let pim = playerInfoMaster;
        let selectionEntry = $(this).closest(pim.selection_entry);

        switch (e.keyCode) {
            case 9://Tab
                if (!e.shiftKey) {
                    $(this).closest(pim.selection_entry).find(pim.weapon_name).focus();
                    return false;
                }
                break;

            case 191:// '/'
                if (!e.shiftKey) {
                    pim.setWeaponIsSignature(selectionEntry);
                    return false;
                }
                break;
        }
    },

    onKeydownCharName: function(e) {
        let pim = playerInfoMaster;
        let selectionEntry = $(this).closest(pim.selection_entry);

        switch (e.keyCode) {
            case 191:// '/'
                if (!e.shiftKey) {
                    pim.setWeaponIsSignature(selectionEntry);
                    return false;
                }
                break;
        }
    },

    onFocusWeaponName: function(e) {
        let pim = playerInfoMaster;
        let selectionEntry = $(this).closest(pim.selection_entry);
        let charId = selectionEntry.attr(pim.char);
        if (charId == null || charId == "") return;
        let info = charactersInfo.list[charactersInfo[charId]];
        if (info == null || info == "" || info == {}) return;
        // if (this.value.length > 0) pim.weaponFiltered = pim.checkWeaponName(selectionEntry);
        // else
        pim.weaponFiltered = pim.weapons[info.weapon].filter((weapon, index) => weapon.class != "unreleased");
    },

    onKeydownWeaponName: function(e) {
        let pim = playerInfoMaster;
        let self = $(this);
        let selectionEntry = self.closest(pim.selection_entry);
        let input = selectionEntry.find(pim.weapon_name);

        if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
            e.preventDefault();

            let value = Math.max(Math.min(parseInt(e.key), 5), 1);
            let refine = selectionEntry.find(pim.weapon_refine);
            refine.focus();
            setTimeout(function(e) {
                refine.val("" + value);
                refine.select();
            }, 10);

            return false;
        } else switch (e.keyCode) {
            case 9://Tab
                if (e.shiftKey) {
                    e.preventDefault();
                    $(this).closest(pim.selection_entry).find(pim.char_constell).focus();
                    return false;
                }
                break;

            case 38://Up
                e.preventDefault();
                pim.setWeaponSelectionBy(input, false);
                return false;

            case 40://Down
                e.preventDefault();
                pim.setWeaponSelectionBy(input, true);
                return false;

            case 191:// '/'/ ?
                e.preventDefault();
                if (!e.shiftKey) {
                    pim.setWeaponIsSignature(selectionEntry);
                    return false;
                } else {
                    let refine = selectionEntry.find(pim.weapon_refine);

                    searchMaster.request({
                        callback: (info) => {
                            this.setWeaponIn(selectionEntry, info);
                            input.val(info.name[loca]);
                            refine.focus();
                        },
                        onCancel: () => input.focus(),
                        element: this,
                        searchFor: "weapon",
                        searchWord: input.val(),
                        from: playerInfoMaster,
                        side: selectionEntry.closest(pim.selection_side).hasClass("red") ? "red" : "blue",
                        character: { id: selectionEntry.attr(pim.char) }
                    });
                }
                return false;

            case 220:
                e.preventDefault();
                this.value = "";
                return false;
        }
    },

    onKeydownWeaponRefine: function(e) {
        let pim = playerInfoMaster;
        let selectionEntry = $(this).closest(pim.selection_entry);

        switch (e.keyCode) {
            case 191:// '/'
                if (!e.shiftKey) {
                    pim.setWeaponIsSignature(selectionEntry);
                    return false;
                }
                break;
        }
    },

    onInputWeaponName: function(e) {
        let pim = playerInfoMaster;
        let selectionEntry = $(this).closest(pim.selection_entry);
        let input = selectionEntry.find(pim.weapon_name);

        let value = input.val().trim();
        var isAlias = pim.isSignatureWeaponAlias(value);
        if (isAlias || value == "/") {
            pim.setWeaponIsSignature(selectionEntry);
        } else {
            //pim.weaponFiltered = pim.checkWeaponName(selectionEntry);
            pim.checkWeaponName(selectionEntry);
            pim.releaseSecondsForAdds();
        }
    },

    onBlurWeaponName: function(e) {
        let pim = playerInfoMaster;
        let self = $(this);
        let value = self.val().trim();
        let selectionEntry = self.closest(pim.selection_entry);
        let charId = selectionEntry.attr(pim.char);
        if (charId == null || charId == "") return;
        let info = charactersInfo.list[charactersInfo[charId]];
        let weaponId = selectionEntry.attr(pim.weapon);

        if (weaponId != null && weaponId != "") {
            if (!pim.isSignatureWeaponAlias(value)) {
                let found = pim.weapons[info.weapon].find((item, index) => item.id == weaponId);

                if (found != null) {
                    var fullWord = null;
                    for (i=0; i<found.aliases[loca].length; i++) if (found.aliases[loca][i].indexOf(value) == 0) {
                        fullWord = found.aliases[loca][i];
                        break;
                    }
                    if (fullWord != null) self.val(fullWord);
                    else {
                        let weaponName = found.name[loca];
                        if (weaponName.indexOf(value) !== 0) {
                            let weaponAlias = found.aliases[loca][0];
                            self.val(weaponAlias != null && weaponAlias.length > 0 ? weaponAlias : weaponName);
                        }
                    }
                }
            }
        }
        self.attr(pim.index, null);
        this.weaponFiltered = null;
    },

    isSignatureWeaponAlias(value) {
        let valueLc = value.toLowerCase();
        let aliases = lang.text.valueSignatureWeaponAliases.split("|");
        for (var i=0; i<aliases.length; i++) if (valueLc == aliases[i].toLowerCase()) {
            return true;
            break;
        }
        return false;
    },

    setWeaponSelectionBy(input, prev) {
        if (this.weaponFiltered != null) {
            let filtered = this.weaponFiltered;
            let filteredLength = filtered.length;
            let selectionEntry = input.closest(this.selection_entry);
            var index = parseInt(input.attr(this.index));
            if (isNaN(index)) {
                let weaponId = selectionEntry.attr(this.weapon);
                index = null;
                if (weaponId != null && weaponId != "") {
                    for (var i in filtered) if (filtered[i].id == weaponId) {
                        index = i;
                        break;
                    }
                }
                if (index == null) index = prev ? filteredLength - 1 : 0;
            }
            else index = parseInt(index);
            let target = prev ? (index < 0 ? filteredLength - 1 : index - 1) : (index >= filteredLength ? 0 : index + 1);
            let weapon = filtered[target];
            if (weapon != null) {
                this.setWeaponIn(selectionEntry, weapon);
                let weaponAlias = weapon.aliases[loca][0];
                input.val(weaponAlias != null && weaponAlias.length > 0 ? weaponAlias : weapon.name[loca]);
            }
            input.attr(this.index, target);
        }
    },

    setWeaponIsSignature: function(selectionEntry) {
        let input = selectionEntry.find(this.weapon_name);
        let refine = selectionEntry.find(this.weapon_refine);
        input.val(lang.text.valueSignatureWeapon);
        let found = this.checkWeaponName(selectionEntry);
        this.releaseSecondsForAdds();
        setTimeout(function() {
            if (found != null) refine.focus();
            else input.focus();
        }, 10);
    },

    checkWeaponName: function(selectionEntry) {
        let input = selectionEntry.find(this.weapon_name);
        let value = input.val().trim();

        if (value == "") {
            this.setWeaponIn(selectionEntry);
            return;
        }
        
        let charId = selectionEntry.attr(this.char);
        if (charId == null || charId == "") return;
        let info = charactersInfo.list[charactersInfo[charId]];
        if (info == null || info == "" || info == {}) return null;

        var found = null;
        var filtered = null;
        if (value == lang.text.valueSignatureWeapon) {
            found = this.weapons[info.weapon].find((item, index) => {
                return item.favority[0] == charId;
            });
        } else {
            filtered = this.searchWeapons(value, info.weapon);
        }

        if (filtered != null && filtered.length > 0) found = filtered[0];
        if (found != null) {
            this.setWeaponIn(selectionEntry, found);
        } else {
            this.setWeaponIn(selectionEntry);
        }

        return filtered != null ? filtered : [found];
    },

    setWeaponIn(selectionEntry, weapon) {
        let weaponIcon = selectionEntry.find(this.entry_weapon_icon);
        let refine = selectionEntry.find(this.weapon_refine);

        if (weapon != null) { 
            selectionEntry.attr(this.weapon, weapon.id);
            weaponIcon.css("--src", "url('" + getPath("images", "weapon_icon", weapon.res_icon) + "')")
            refine.val("1");
        } else {
            selectionEntry.attr(this.weapon, "");
            weaponIcon.css("--src", urlTpGif);
            refine.val("");
        }
    },

    searchWeapons(value, weaponType) {
        let valuePressed = value.replace(/\b/ig, "");
        return this.weapons[weaponType].filter((item, index) => {
            return this.checkMatchAllLanguages(item.name, (text) => text.indexOf(value) == 0)
                || this.checkMatchAllLanguages(item.name, (text) => text.replace(/\b/ig, "").match(new RegExp(valuePressed, "i")) != null)
                || this.checkMatchAllLanguages(item.aliases, (aliases) => aliases.find((alias, idx) => { return alias.indexOf(value) == 0; }) != null);
        });
    },

    checkMatchAllLanguages(langSet, matchChecker) {
        for (var l in langSet) {
            let text = langSet[l];
            if (matchChecker(text)) return true;
        }
        return false;
    },
    
    preloadWeaponsInfo: function() {
        for (var i in weaponsInfo.list) {
            let info = weaponsInfo.list[i];
            if (info.id == "reserved") continue;
            this.weapons[info.type].push(info);
        }
    },

    initAddsDefault: function() {
        if (this.addSecDefaults == null) return;
        this.eachAddPerConstell.attr("placeholder", "" + this.addSecDefaults.constell);
        this.eachAddByHadWeapon.attr("placeholder", "" + this.addSecDefaults.weapon);
        this.eachAddPerRefine.attr("placeholder", "" + this.addSecDefaults.refine);
        this.eachAddDisadvRatio.attr("placeholder", "" + this.addSecDefaults.disadv);
        this.eachAddMasterAdjust.attr("placeholder", "" + this.addSecDefaults.adjust);
        this.eachAddPerConstell.val(this.addSecDefaults.constell);
        this.eachAddByHadWeapon.val(this.addSecDefaults.weapon);
        this.eachAddPerRefine.val(this.addSecDefaults.refine);
        this.eachAddDisadvRatio.val(this.addSecDefaults.disadv);
        this.eachAddMasterAdjust.val(this.addSecDefaults.adjust);
    },

    initAddSecs: function() {
        this.initAddSideSecs("red");
        this.initAddSideSecs("blue");
    },

    initAddSideSecs: function(side) {
        if (this.addSecDefaults == null) return;
        this.addSecs[side].constell = this.addSecDefaults.constell;
        this.addSecs[side].weapon = this.addSecDefaults.weapon;
        this.addSecs[side].refine = this.addSecDefaults.refine;
        this.addSecs[side].disadv = this.addSecDefaults.disadv;
        this.addSecs[side].adjust = this.addSecDefaults.adjust;
    },

    applyAddsDefaultByRuleBook: function() {
        this.addSecDefaults = rules.addSecDefaults;
        this.initDesc();
        this.initAddsDefault();
        this.initAddSecs();
        //this.releaseSecondsForAdds();
    },

    releaseSecondsForAdds: function() {

        let red = this.releaseSideAddEntity("red");
        let blue = this.releaseSideAddEntity("blue");

        var redAP = this.redInfoAp.val();
        redAP = redAP.trim() == "" ? 0 : parseInt(redAP);
        var blueAP = this.blueInfoAp.val();
        blueAP = blueAP.trim() == "" ? 0 : parseInt(blueAP);
        let diffAP = Math.abs(redAP - blueAP);

        var side = "red";
        var redTotal = 0;
        var redAPC = this.addSecs[side].constell;
        let redTotalConstell = red.constells * redAPC;
        this.redTotalAddPerConstell.text("" + redTotalConstell);
        redTotal += redTotalConstell;
        let redABW = this.addSecs[side].weapon;
        let redTotalWeapon = red.weaponHas * redABW;
        this.redTotalAddByHadWeapon.text("" + redTotalWeapon);
        redTotal += redTotalWeapon;
        let redAPR = this.addSecs[side].refine;
        let redTotalRefine = red.weaponRefines * redAPR;
        this.redTotalAddPerRefine.text("" + redTotalRefine);
        redTotal += redTotalRefine;
        var redDisadv = 0;
        if (redAP > blueAP) {
            redDisadv = Math.floor(diffAP * this.addSecs[side].disadv);
            redTotal += redDisadv;
        }
        this.redAppliedDisadv.text("" + redDisadv);
        redTotal += this.addSecs[side].adjust;
        this.redTotalAddsValue.text("" + redTotal);

        
        var side = "blue";
        var blueTotal = 0;
        let blueAPC = this.addSecs[side].constell;
        let blueTotalConstell = blue.constells * blueAPC;
        this.blueTotalAddPerConstell.text("" + blueTotalConstell);
        blueTotal += blueTotalConstell;
        let blueABW = this.addSecs[side].weapon;
        let blueTotalWeapon = blue.weaponHas * blueABW;
        this.blueTotalAddByHadWeapon.text("" + blueTotalWeapon);
        blueTotal += blueTotalWeapon;
        let blueAPR = this.addSecs[side].refine;
        let blueTotalRefine = blue.weaponRefines * blueAPR;
        this.blueTotalAddPerRefine.text("" + blueTotalRefine);
        blueTotal += blueTotalRefine;
        var blueDisadv = 0;
        if (redAP < blueAP) {
            blueDisadv = Math.floor(diffAP * this.addSecs[side].disadv);
            blueTotal += blueDisadv;
        }
        this.blueAppliedDisadv.text("" + blueDisadv);
        blueTotal += this.addSecs[side].adjust;
        this.blueTotalAddsValue.text("" + blueTotal);

        this.addsCalculated.red = Math.max(0, redTotal);
        this.addsCalculated.blue = Math.max(0, blueTotal);

        saveLatestState();
    },

    releaseSideAddEntity: function(side) {
        let sideEntries = this.selectionEntries[side];
        let sideCons = this.charConstells[side];
        let sideRefs = this.weaponRefines[side];
        let sideCharAdds = this.charDetectedAdds[side];
        let sideWeaponAdds = this.weaponDetectedAdds[side];

        var constells = 0;
        for (var i=0; i<sideCons.length; i++) {
            var adds = 0;
            let charId = $(sideEntries[i]).attr(this.char);
            if (charId != null && charId != "" && charId != "treveler" && charId != "trevelerF" && charId != "trevelerM") {
                let info = charactersInfo.list[charactersInfo[charId]];
                if (info != null && info.rarity == "5") {
                    var cons = sideCons[i].value;
                    if (cons != null && cons != "" && !isNaN(cons)) {
                        cons = parseInt(cons) + 1;
                        adds = cons * this.addSecs[side].constell;
                        constells += cons;
                    }
                }
            }
            $(sideCharAdds[i]).text(adds > 0 ? "+" + adds + "s" : "");
        }
        var weaponHas = 0;
        var weaponRefines = 0;
        for (var i=0; i<sideRefs.length; i++) {
            var adds = 0;
            let weaponId = $(sideEntries[i]).attr(this.weapon);
            if (weaponId != null || weaponId != "") {
                let weapon = weaponsInfo.list.find(item => item.id == weaponId);
                if (weapon != null && weapon.rarity == "5") {
                    var refine = sideRefs[i].value;
                    if (refine != null && refine != "" && !isNaN(refine) > 0) {
                        refine = parseInt(refine);
                        adds += this.addSecs[side].weapon;
                        weaponHas++;
                        if (refine > 1) {
                            let addiRefine = refine - 1;
                            adds += addiRefine * this.addSecs[side].refine;
                            weaponRefines += addiRefine;
                        }
                    }
                }
            }
            $(sideWeaponAdds[i]).text(adds > 0 ? "+" + adds + "s" : "");
        }

        return { constells: constells, weaponHas: weaponHas, weaponRefines: weaponRefines };
    },

    eoo
}


//global ban manager
let globalBanMaster = {

    hide: "data-hide",
    wide: "data-wide",
    shift: "data-shift",


    global_ban_manager: "div#global_ban_manager",

    global_ban_entries: "div#global_ban_entries",

    picked_for_gb: "div#picked_for_gb",
    entry_picked_for_gb: "ul#entry_picked_for_gb",

    clear_list_gb: "button#clear_list_gb",
    previous_gb: "div#previous_gb",
    list_previous_gb: "ul#list_previous_gb",

    global_ban_character_pool_filter: "div#global_ban_character_pool_filter",

    gbcp_saf_preset: "div.gbcp_saf_preset",
    start_sequence_afp: "button.start_sequence_afp",
    preset_for_auto_filter: "ul.preset_for_auto_filter",

    started: "data-started",
    textStart: "data-text-start",
    textStop: "data-text-stop",
    current: "data-current",

    reset: "data-reset",
    allElem: "data-all-elem",
    allWeap: "data-all-weap",
    allCate: "data-all-cate",
    allCost: "data-all-cost",
    allExtras: "data-all-extras",
    selection: "data-selection",

    filter_for_cp: "ul.filter_for_cp",
    gbcp_filter_element: "#gbcp_filter_element",
    gbcp_filter_weapon: "#gbcp_filter_weapon",
    gbcp_filter_category: "#gbcp_filter_category",
    gbcp_filter_cost: "#gbcp_filter_cost",
    gbcp_filter_extras: "#gbcp_filter_extras",


    default: "data-default",
    selected: "data-selected",
    all: "data-all",
    include_treveler: "data-include-treveler",
    previous: "data-previous",


    globalBanManager: null,
    
    globalBanEntries: null,

    pickedForGB: null,
    entryPickedForGB: null,

    clearListGB: null,
    previousGB: null,
    listPreviousGB: null,

    globalBanCharacterPoolFilter: null,

    gbcpSafPresets: null,
    startAfpSeqButtons: null,

    filterForCP: null,
    gbcpFilterElement: null,
    gbcpFilterWeapon: null,
    gbcpFilterCategory: null,
    gbcpFilterCost: null,
    gbcpFilterExtras: null,

    elemAll: null,
    elemItems: null,
    weapAll: null,
    weapItems: null,
    cateAll: null,
    cateItems: null,
    costAll: null,
    costItems: null,
    extraAll: null,
    extraItems: null,


    previousList: [],

    afpSequence: null,
    afpsBegin: null,

    init: function() {

        this.globalBanManager = $(this.global_ban_manager);

        this.globalBanEntries = this.globalBanManager.find(this.global_ban_entries);

        this.pickedForGB = this.globalBanEntries.find(this.picked_for_gb);
        this.entryPickedForGB = this.pickedForGB.find(this.entry_picked_for_gb);

        this.clearListGB = this.globalBanEntries.find(this.clear_list_gb);
        this.previousGB = this.globalBanEntries.find(this.previous_gb);
        this.listPreviousGB = this.previousGB.find(this.list_previous_gb);

        this.globalBanCharacterPoolFilter = this.globalBanManager.find(this.global_ban_character_pool_filter);

        this.gbcpSafPresets = this.globalBanCharacterPoolFilter.find(this.gbcp_saf_preset);
        this.startAfpSeqButtons = this.gbcpSafPresets.find(this.start_sequence_afp);

        this.filterForCP = this.globalBanCharacterPoolFilter.find(this.filter_for_cp);
        this.gbcpFilterElement = this.filterForCP.filter(this.gbcp_filter_element);
        this.gbcpFilterWeapon = this.filterForCP.filter(this.gbcp_filter_weapon);
        this.gbcpFilterCategory = this.filterForCP.filter(this.gbcp_filter_category);
        this.gbcpFilterCost = this.filterForCP.filter(this.gbcp_filter_cost);
        this.gbcpFilterExtras = this.filterForCP.filter(this.gbcp_filter_extras);

        
        this.elemAll = this.gbcpFilterElement.find("> li[" + this.all + "='1']");
        this.elemItems = this.gbcpFilterElement.find("> li:not([" + this.all + "='1'])");
        this.weapAll = this.gbcpFilterWeapon.find("> li[" + this.all + "='1']");
        this.weapItems = this.gbcpFilterWeapon.find("> li:not([" + this.all + "='1'])");
        this.cateAll = this.gbcpFilterCategory.find("> li[" + this.all + "='1']");
        this.cateItems = this.gbcpFilterCategory.find("> li:not([" + this.all + "='1'])");
        this.costAll = this.gbcpFilterCost.find("> li[" + this.all + "='1']");
        this.costItems = this.gbcpFilterCost.find("> li:not([" + this.all + "='1'])");
        this.extraAll = this.gbcpFilterExtras.find("> li[" + this.all + "='1']");
        this.extraItems = this.gbcpFilterExtras.find("> li:not([" + this.all + "='1'])");


        this.loadGlobalBannedStore();
        this.loadPreviousGlobalBannedStore();

        this.takeGlobalBanned();

        this.initAFPS();


        this.clearListGB.click(this.onClickClear);

        this.startAfpSeqButtons.click(this.onClickStartAFPS);
        this.gbcpSafPresets.find("li").click(this.onClickAfpsItem);

        this.elemAll.click(this.filterElementForAll);
        this.weapAll.click(this.filterWeaponForAll);
        this.cateAll.click(this.filterCategoryForAll);
        this.costAll.click(this.filterCostForAll);
        this.extraAll.click(this.filterExtraForAll);
        this.elemItems.click(this.filterOnClick);
        this.weapItems.click(this.filterOnClick);
        this.cateItems.click(this.filterOnClick);
        this.costItems.click(this.filterOnClick);
        this.extraItems.click(this.filterOnClick);
    },

    bringGlobalBanPanel: function() {
        rulesMaster.ruleAlter.prop("disable", true);
        controllerMaster.globalBanPickerButton.hide();
        setTimeout(function() {
            if (step == -2) controllerMaster.randomPickButton.fadeIn(300);
        }, 1700);
        controllerMaster.togglePlayerInfoButton.hide();
        controllerMaster.discardPickGlobalBanButton.show();
        controllerMaster.mainActionButton.text("APPLY");
        controllerMaster.mainActionButton.attr("title", "현재 선택한 후보 캐릭터를 글로벌 밴으로 적용합니다");
        controllerMaster.subActionButton.attr("title", "마지막 선택한 캐릭터를 글로벌 밴 후보에서 제외합니다");
        controllerMaster.buttonReset.attr("title", "현재 선택된 글로벌 밴 목록을 비웁니다");

        sequenceMaster.sequenceTitleHolder.attr(this.shift, "1");
        sequenceMaster.sequenceBlock.attr(this.hide, "1");
        $("#center_area").attr(this.wide, "1");
        $("#league_title").attr(this.hide, "1");
        poolMaster.eachSideSelectionArea.attr(this.wide, "1");
        poolMaster.sideBehind.attr(this.wide, "1");
        poolMaster.poolBlock.attr(this.shift, "1");
        poolMaster.unavailables.attr(this.hide, "1");
        versionDisplayShowFor();
        playerInfoMaster.hidePlayerInfoLayer();
        sideMaster.eachPlayerBoard.attr(this.hide, "3");
        sideMaster.banPickBoard.attr(this.hide, "1");
        // timerMaster.timerGauges.attr(this.hide, "1");
        timerMaster.timerHost.attr(this.hide, "1");
        // timerMaster.timerRelay.attr(this.hide, "1");
        
        this.globalBanManager.fadeIn(320);
        let globalBanPool = this.getGlobalBanPool();
        if (globalBanPool != null) globalBanPool.parent().show();
        
        this.initFilter();
        this.initPicked(true);
        
        step = -2;

        sequenceMaster.setSequenceTitleByCurrent(step);
    },

    discardGlobalBanPanel: function() {
        this.clearPicked();

        this.closeGlobalBanPanel();
    },

    applyGlobalBanPicked: function() {
        this.saveGlobalBannedStore();

        this.closeGlobalBanPanel();

        poolMaster.initPickPool();
        this.takeGlobalBanned();
    },

    closeGlobalBanPanel: function() {
        step = -1;

        sequenceMaster.setSequenceTitleByCurrent(step);

        this.stopAFPS();
        this.clearFilter();
        this.takeGlobalBanned();

        let text = lang.text;
        this.globalBanManager.fadeOut(320);

        sequenceMaster.sequenceTitleHolder.attr(this.shift, "");
        sequenceMaster.sequenceBlock.attr(this.hide, "");
        $("#center_area").attr(this.wide, "");
        $("#league_title").attr(this.hide, "");
        poolMaster.eachSideSelectionArea.attr(this.wide, "");
        poolMaster.sideBehind.attr(this.wide, "");
        poolMaster.poolBlock.attr(this.shift, "");
        poolMaster.unavailables.attr(this.hide, "");
        versionDisplayShowFor(false);
        playerInfoMaster.checkBackShowingPlayerInfoLayer();
        sideMaster.eachPlayerBoard.attr(this.hide, "");
        sideMaster.banPickBoard.attr(this.hide, "");
        // timerMaster.timerGauges.attr(this.hide, "");
        timerMaster.timerHost.attr(this.hide, "");
        // timerMaster.timerRelay.attr(this.hide, "");

        controllerMaster.buttonReset.attr("title", text.btnResetDesc);
        controllerMaster.subActionButton.attr("title", text.btnUndoDesc);
        controllerMaster.mainActionButton.attr("title", text.btnMainDesc);
        controllerMaster.mainActionButton.text(text.btnStart);
        controllerMaster.discardPickGlobalBanButton.hide();
        controllerMaster.togglePlayerInfoButton.show();
        controllerMaster.randomPickButton.hide();
        controllerMaster.globalBanPickerButton.show();
        rulesMaster.ruleAlter.prop("disable", false);
    },

    takeGlobalBanned: function() {
        let pool = this.getGlobalBanPool();
        if (pool == null) return;
        let parent = pool.parent();

        if (pool != null && rules.global_banned != null && Object.keys(rules.global_banned).length > 0 && rules.apply_dynamic_global_ban) {
            for (var id in rules.global_banned) {

                let item = poolMaster.eachCharacters.filter("[" + poolMaster.id + "='" + id + "']");
                item.remove();
                pool.append(item);
            }
            if (parent != null) parent.show();
        } else {
            if (parent != null) parent.hide();
        }

        if (step == -2){
            this.releasePicked();
            this.applyFilter();
        }
    },

    getGlobalBanPool: function() {
        switch(rules.rule_type) {
            case "ban card":
                return poolMaster.eachGradeArea.filter(poolMaster.global_banned_area).find("ul." + poolMaster.each_grade_pool);
                break;

            case "preban":
            case "cost":
                return poolMaster.globalBannedPool;
                break;
        } 
    },

    //store
    loadGlobalBannedStore: function() {
        let data = settingsMaster.getGlobalString(settingsMaster.GLOBAL_BANNED, "[]");

        var list;
        try {
            list = JSON.parse(data);
        } catch (e) {
            list = [];
        }

        this.pushGlobalBanList(list);
    },

    saveGlobalBannedStore: function() {
        let picked = this.entryPickedForGB.find("> li");

        let list = [];
        for (var i=0; i<picked.length; i++) {
            let item = $(picked[i]);
            let id = item.attr("data-id");

            list.push(id);
        }

        this.emptyGlobalBanList();
        this.pushGlobalBanList(list);
        settingsMaster.putGlobalString(settingsMaster.GLOBAL_BANNED, JSON.stringify(list));
        this.savePreviousGlobalBannedStore(list);
    },

    loadPreviousGlobalBannedStore: function() {
        let data = settingsMaster.getGlobalString(settingsMaster.PREVIOUS_GLOBAL_BANNED, "[]");

        var list;
        try {
            list = JSON.parse(data);
        } catch (e) {
            list = [];
        }
        this.previousList = list;

        this.listPreviousGB.empty();

        if (list.length > 0) {
            for (i in list) {
                let item = list[i];

                this.listPreviousGB.prepend(this.buildPreviousBannedSet(item));
            }
        } else {
            let span = document.createElement("span");
            span.innerText = "list is empty";
            this.listPreviousGB.append(span);
        }
        this.listPreviousGB.find("> li > button").click(this.onClickErase);
    },

    savePreviousGlobalBannedStore: function(picked) {
        list = this.previousList;

        if (picked != null) {
            let now = new Date();
            let date = now.getFullYear() + "-" + (now.getMonth() + 1).toString().padStart(2, "0") + "-" + now.getDate().toString().padStart(2, "0");
            let time = now.getHours() + ":" + now.getMinutes().toString().padStart(2, "0") + ":" + now.getSeconds().toString().padStart(2, "0");
            let set = { id: now.getTime(), date: date, time: time, list: picked };
            list.push(set);

            this.listPreviousGB.prepend(this.buildPreviousBannedSet(set));
            this.listPreviousGB.find("> span").remove();
            this.listPreviousGB.find("> li > button").off("click").click(this.onClickErase);
        }

        let json = JSON.stringify(list);
        settingsMaster.putGlobalString(settingsMaster.PREVIOUS_GLOBAL_BANNED, json);
    },

    emptyGlobalBanList: function() {
        rules.global_banned = [];
    },

    pushGlobalBanList: function(list) {
        for (id of list) {
            rules.global_banned[id] = true;
        }
    },

    buildPreviousBannedSet: function(set) {
        let li = document.createElement("li");
        li.setAttribute("data-id", set.id);
        li.setAttribute("data-date", set.date);
        li.setAttribute("title", set.time);
        let ul = document.createElement("ul");
        ul.setAttribute("class", "each_pool_block");
        if (set.list.length > 0) {
            for (i in set.list) {
                let id = set.list[i];
                let info = charactersInfo.list[charactersInfo[id]];

                ul.append(poolMaster.buildCharacterItem(info, false, id == "treveler" ? "0" : null, "vcut"));
            }
        } else {
            let span = document.createElement("span");
            span.innerText = "empty";
            ul.append(span);
        }
        li.append(ul);
        let button = document.createElement("button");
        button.innerText = "ERASE";
        li.append(button);
        return li;
    },

    //previous list
    onClickClear: function(e) {
        globalBanMaster.clearPreviousList();
    },

    clearPreviousList: function() {
        if (confirm("기존 글로벌 밴 기록 전체를 지웁니다. 진행할까요?")) {
            settingsMaster.putGlobalString(settingsMaster.PREVIOUS_GLOBAL_BANNED, "[]");
            this.loadPreviousGlobalBannedStore();
            this.applyFilter();
        }
    },

    onClickErase: function(e) {
        globalBanMaster.erasePreviousList($(e.target).parent());
    },

    erasePreviousList: function(item) {
        if (confirm("해당 기록을 지웁니다. 진행할까요?")) {
            let id = item.attr("data-id");

            if (id != null && id != "") for (i in this.previousList) {
                let set = this.previousList[i];
                if (set.id == id) {
                    this.previousList.splice(i, 1);
                    this.savePreviousGlobalBannedStore();
                    break;
                }
            }

            item.remove();
            this.applyFilter();
        }
    },

    //pick
    initPicked: function() {
        this.entryPickedForGB.empty();

        for (id in rules.global_banned) {
            this.appendPicked(id);
        }
        this.entryPickedForGB.find("> li").click(this.onClickPicked);
    },

    releasePicked: function() {
        let list = this.entryPickedForGB.find("> li");

        for (item of list) this.appendPicked($(item).attr(poolMaster.id), true);
    },

    onPicked: function(id) {
        if (globalBanMaster.entryPickedForGB.find("> li[" + poolMaster.id + "='" + id + "']").length < 1) {
            this.appendPicked(id);

            this.releaseAfpsStep();
        }
    },

    appendPicked: function(id, release = false) {
        let info = charactersInfo.list[charactersInfo[id]];

        if (release !== true) {
            this.entryPickedForGB.append(poolMaster.buildCharacterItem(info, false, id == "treveler" ? "0" : null, "vcut"));
            this.entryPickedForGB.find("> li").last().click(this.onClickPicked);
        }

        let item = poolMaster.eachCharacters.filter("[" + poolMaster.id + "='" + id + "']");
        item.attr(poolMaster.pick_type, "entry");
        item.attr(poolMaster.picked, "1");
        setTimeout(function() {
            item.attr(poolMaster.picked, "2");
        }, 600);
    },

    onClickPicked: function(e) {
        if (globalBanMaster.afpSequence != null) {
            let list = globalBanMaster.entryPickedForGB.find("> li");
            
            if (list[list.length-1] == e.target) {
                globalBanMaster.excludePicked($(e.target)); 

                globalBanMaster.releaseAfpsStep();
            } else {
                sequenceMaster.setSequenceTitle("순차 뽑기 중에는 가장 마지막에 선택한 캐릭터만 제외할 수 있습니다", 2000);
            }

        } else globalBanMaster.excludePicked($(e.target));
    },

    excludePicked: function(item) {
        var forLast = false;
        if (item == null) {
            let list = this.entryPickedForGB.find("> li");
            item = list.last();
            forLast = true;
        } else if (!(item instanceof jQuery)) item = $(item);

        let id = item.attr("data-id");
        item.remove();

        item = poolMaster.eachCharacters.filter("[" + poolMaster.id + "='" + id + "']");
        item.attr(poolMaster.pick_type, "");
        item.attr(poolMaster.picked, "");

        if (forLast) this.releaseAfpsStep();
    },

    clearPicked: function() {
        let list = this.entryPickedForGB.find("> li");

        for (item of list) this.excludePicked(item);

        this.releaseAfpsStep();
    },

    //character pool filter
    initFilter: function() {
        let isSelectElem = this.elemAll.attr(this.default);
        let isSelectWeap = this.weapAll.attr(this.default);
        let isSelectCate = this.cateAll.attr(this.default);
        let isSelectCost = this.costAll.attr(this.default);
        let isSelectExtra = this.extraAll.attr(this.default);

        if (isSelectCate != null) this.filterElementForAll(true, isSelectElem == "1" ? true : false);
        if (isSelectCate != null) this.filterWeaponForAll(true, isSelectWeap == "1" ? true : false);
        if (isSelectCate != null) this.filterCategoryForAll(true, isSelectCate == "1" ? true : false);
        if (isSelectCost != null) this.filterCostForAll(true, isSelectCost == "1" ? true : false);
        if (isSelectExtra != null) this.filterExtraForAll(true, isSelectExtra == "1" ? true : false);

        this.applyFilter();
    },

    filterElementForAll: function(init, force) {
        if (typeof init == "object") {
            globalBanMaster.filterElementForAll();
            return;
        }

        let isAll = force != null ? !force : this.isAllSelected(this.elemItems);

        this.elemAll.attr(this.selected, "");
        this.elemItems.attr(this.selected, isAll ? "" : "1");

        if (!init) this.applyFilter();
    },

    filterWeaponForAll: function(init, force) {
        if (typeof init == "object") {
            globalBanMaster.filterWeaponForAll();
            return;
        }

        let isAll = force != null ? !force : this.isAllSelected(this.weapItems);

        this.weapAll.attr(this.selected, "");
        this.weapItems.attr(this.selected, isAll ? "" : "1");

        if (!init) this.applyFilter();
    },

    filterCategoryForAll: function(init, force) {
        if (typeof init == "object") {
            globalBanMaster.filterCategoryForAll();
            return;
        }

        let isAll = force != null ? !force : this.isAllSelected(this.cateItems);

        this.cateAll.attr(this.selected, "");
        this.cateItems.attr(this.selected, isAll ? "" : "1");

        if (!init) this.applyFilter();
    },

    filterCostForAll: function(init, force) {
        if (typeof init == "object") {
            globalBanMaster.filterCostForAll();
            return;
        }

        let isAll = force != null ? !force : this.isAllSelected(this.costItems);

        this.costAll.attr(this.selected, "");
        this.costItems.attr(this.selected, isAll ? "" : "1");

        if (!init) this.applyFilter();
    },

    filterExtraForAll: function(init, force) {
        if (typeof init == "object") {
            globalBanMaster.filterExtraForAll();
            return;
        }

        let isAll = force != null ? !force : this.isAllSelected(this.extraItems);

        this.extraAll.attr(this.selected, "");
        this.extraItems.attr(this.selected, isAll ? "" : "1");

        if (!init) this.applyFilter();
    },

    isAllSelected: function(filterItems) {
        for(var i=0; i<filterItems.length; i++) {
            if ($(filterItems[i]).attr(this.selected) !== "1") {
                return false;
            }
        }
        return true;
    },

    filterOnClick: function(e) {
        globalBanMaster.toggleFilter($(this));
    },

    toggleFilter(item) {
        let current = item.attr(this.selected);
        item.attr(this.selected, current === "1" ? "" : "1");

        this.applyFilter();
    },

    applyFilter: function() {
        this.clearFilter();

        let pool = poolMaster.eachCharacters;
        let elemExcept = this.elemItems.filter(":not([" + this.selected + "='1'])");
        for (var i=0; i<elemExcept.length; i++) {
            let item = $(elemExcept[i]);
            let element = item.attr(poolMaster.element);

            let filter = "[" + poolMaster.element + "='" + element + "']";

            pool.filter(filter).attr(poolMaster.except, "1");
        }
        let weapExcept = this.weapItems.filter(":not([" + this.selected + "='1'])");
        for (var i=0; i<weapExcept.length; i++) {
            let item = $(weapExcept[i]);
            let weapon = item.attr(poolMaster.weapon);

            let filter = "[" + poolMaster.weapon + "='" + weapon + "']";

            pool.filter(filter).attr(poolMaster.except, "1");
        }
        let cateExcept = this.cateItems.filter(":not([" + this.selected + "='1'])");
        for (var i=0; i<cateExcept.length; i++) {
            let item = $(cateExcept[i]);
            let rarity = item.attr(poolMaster.rarity);
            let classB = item.attr(poolMaster.class);
            let incTrev = item.attr(this.include_treveler);

            var filter = "";
            if (rarity != null && rarity != "") filter += "[" + poolMaster.rarity + "='" + rarity + "']";
            if (classB != null && classB != "") filter += "[" + poolMaster.class + "='" + classB + "']";
            if (incTrev === "true") filter += "[" + poolMaster.id + "='treveler']";
            else if (incTrev === "false") filter += ":not([" + poolMaster.id + "='treveler'])";

            pool.filter(filter).attr(poolMaster.except, "1");
        }
        let costExcept = this.costItems.filter(":not([" + this.selected + "='1'])");
        for (var i=0; i<costExcept.length; i++) {
            let item = $(costExcept[i]);
            let cost = item.attr(poolMaster.cost);

            let filter = "[" + poolMaster.cost + "='" + cost + "']";

            pool.filter(filter).attr(poolMaster.except, "1");
        }
        let extraExcept = this.extraItems.filter(":not([" + this.selected + "='1'])");
        for (var i=0; i<extraExcept.length; i++) {
            let item = $(extraExcept[i]);
            let previous = item.attr(this.previous);

            for (set of this.previousList) {
                for (id of set.list) {
                    pool.filter("[" + poolMaster.id + "='" + id + "']").attr(poolMaster.except, "1");
                }
            }
        }

        pool.filter("[" + poolMaster.treveler + "='1']").attr(poolMaster.except, "1");
    },

    clearFilter: function() {
        poolMaster.eachCharacters.attr(poolMaster.except, "");
    },

    //Sequenced auto filter preset
    initAFPS: function() {
        if (this.afpSequence == null) {
            this.startAfpSeqButtons.attr(this.started, "");
            this.startAfpSeqButtons.attr("title", "조건 별 순차 뽑기 시작");
            this.gbcpSafPresets.find("li[" + this.current + "='1']").attr(this.current, "");
        } else {
            this.afpSequence.filter("[" + this.current + "='1']").attr(this.current, "");
            this.afpSequence = null;
            this.afpsBegin = null;

            this.initFilter();
        }
    },

    onClickStartAFPS: function(e) {
        $this = $(this);
        if ($this.attr(globalBanMaster.started) != "1") globalBanMaster.startAFPS($this.parent());
        else globalBanMaster.stopAFPS($this.parent());
    },

    startAFPS: function(presetBlock) {
        let button = presetBlock.find(this.start_sequence_afp);
        let preset = presetBlock.find(this.preset_for_auto_filter);
        this.afpSequence = preset.find("li");

        let isbeCleared = this.afpSequence.filter("[" + this.reset + "='1']").length > 0;
        this.afpsBegin = isbeCleared ? 0 : this.entryPickedForGB.find("> li").length;

        button.attr(this.started, "1");
        button.attr("title", "순차 뽑기 진행을 중단합니다");

        $(this.afpSequence[0]).attr(this.current, "1");
        this.processAfpsCurrentStep();
    },

    stopAFPS: function(presetBlock) {
        if (presetBlock == null && this.afpSequence != null) {
            presetBlock = this.afpSequence.closest(this.gbcp_saf_preset);
        }

        if (presetBlock != null) {
            let button = presetBlock.find(this.start_sequence_afp);

            button.attr(this.started, "");
            button.attr("title", "조건 별 순차 뽑기 시작");
        }

        this.initAFPS();
    },

    processAfpsCurrentStep: function() {
        let current = this.afpSequence.filter("[" + this.current + "='1']");
        this.applyFilterPreset($(current[0]));

        // for (var i=0; i<this.afpSequence.length; i++) {
        //     let item = $(this.afpSequence[i]);

        //     if (item.attr(this.current) == "1") {
        //         this.applyFilterPreset(item);
        //         break;
        //     }
        // }
    },

    releaseAfpsStep: function() {
        if (this.afpSequence != null) {
            let current = this.afpSequence.filter("[" + this.current + "='1']");
            var cs = -1;
            for (cs=0; cs<this.afpSequence.length; cs++) if (this.afpSequence[cs] == current[0]) break;

            current.attr(this.current, "");

            let isCleared = this.afpSequence.filter("[" + this.reset + "='1']").length > 0;
            //let totalPicks = this.afpSequence.filter(":not([" + this.reset + "='1'])").length;
            let currentPick = this.entryPickedForGB.find("> li").length - this.afpsBegin;
            let previousStep = cs + (isCleared ? -1 : 0);

            let next = cs + (currentPick < previousStep ? -1 : 1);
            if (next >= this.afpSequence.length) this.stopAFPS();
            else {
                $(this.afpSequence[next]).attr(this.current, "1");
                this.processAfpsCurrentStep();
            }
        }
    },

    onClickAfpsItem: function(e) {
        globalBanMaster.applyFilterPreset($(this));
    },

    applyFilterPreset: function(current) {
        let reset = current.attr(this.reset);

        if (reset == "1") this.clearPicked();
        else {
            let allElem = current.attr(this.allElem);
            let allWeap = current.attr(this.allWeap);
            let allCate = current.attr(this.allCate);
            let allCost = current.attr(this.allCost);
            let allExtras = current.attr(this.allExtras);
            let selection = current.attr(this.selection);

            if (allCate != null && allCate != "") this.filterCategoryForAll(false, allCate == "select" ? true : (allCate == "drop" ? false : null));
            if (allCost != null && allCost != "") this.filterCostForAll(false, allCost == "select" ? true : (allCost == "drop" ? false : null));
            if (allExtras != null && allExtras != "") this.filterExtraForAll(false, allExtras == "select" ? true : (allExtras == "drop" ? false : null));

            if (selection != null && selection != "") {
                let selections = selection.split(",");
                for (target of selections) this.filterForCP.find("#" + target).click();
            }
        }
    },

    eoo
}


//search handle
let searchMaster = {

    search_host: "div#search_host",
    search_input: "input#search_input",

    search_holder: "div#search_holder",


    search_result: "div#search_result",
    list_holder: "div.list_holder",
    list_host: "ul.list_host",


    searchHost: null,
    searchInput: null,

    searchHolder: null,

    
    resultMaster: null,
    listHolder: null,
    listHost: null,


    currentSearchRequest: null,//{ callback, searchFor: "weapon", from: playerInfoMaster, character: { id } };


    weaponSuggests: { "red": [], "blue": [] },
    
    init: function() {

        this.searchHost = $(this.search_host);
        this.searchInput = this.searchHost.find(this.search_input);

        this.searchHolder = $(this.search_holder);

        this.resultMaster = $(this.search_result);
        this.listHolder = this.resultMaster.find(this.list_holder);
        this.listHost = this.listHolder.find(this.list_host);

        this.initSearchInput();
        this.initSearchInputHelps();

        for (var i in this.weaponSuggests) this.weaponSuggests[i] = [];
        this.listHost.empty();

        this.updateResultChange();
    },

    initSearchInput: function() {
        this.searchInput.off();
        this.searchInput.focus(this.onFocusInput);
        this.searchInput.blur(this.onBlurInput);
        this.searchInput.on("input cut paste", this.onInputChanges);
        this.searchInput.on("keydown", this.onKeydownInput);
    },

    initSearchInputHelps: function() {
        this.searchInput.attr("placeholder", lang.text.searchPlaceholder);
        this.searchInput.attr("title", lang.text.searchDesc);

    },

    onFocusInput: function(e) {
        let master = searchMaster;

        if (master.searchHost.find(master.search_input).length > 0) {
            let rect = master.searchInput[0].getBoundingClientRect();
            master.searchHolder.append(master.searchInput.remove());
            master.searchHolder.css("top", rect.top);
            master.searchHolder.css("left", rect.left);
            master.searchHolder.show();
            master.searchInput.focus();
            master.initSearchInput();
        }

        //리스트 생성
        master.checkUpdataResultByStep();

        master.showResultLayer();

        setTimeout(function() {
            if (searchMaster.searchInput.is(":focus")) searchMaster.showResultLayer();
        }, 500);
    },

    onBlurInput: function(e) {
        let master = searchMaster;

        if (master.searchHolder.find(master.search_input).length > 0) {
            master.searchHost.append(master.searchInput.remove());
            master.searchHolder.hide();
            master.initSearchInput();
        }

        let request = master.currentSearchRequest;
        setTimeout(function() {
            searchMaster.resultMaster.fadeOut(100);
            if (master.currentSearchRequest == request) master.currentSearchRequest = null;
        }, 300);
    },

    onInputChanges: function(e) {
        let master = searchMaster;

        master.checkUpdataResultByStep();
    },

    onKeydownInput: function(e) {
        let master = searchMaster;
        let self = $(this);
        let seq = rules.sequence[step];
        //let side = seq.side;
        let list = master.getItems();
        let cur = master.getSelected();
        let position = master.getPositionInItems(list, cur).position;

        var moveTo = null;

        switch (e.keyCode) {
            case 13://Enter
                e.preventDefault();
                master.pickCurrentItemFromResult();
                setTimeout(function() { master.checkUpdataResultByStep(); }, 100);
                return false;

            case 27://Esc
                e.preventDefault();
                if (self.val().length < 1 && master.currentSearchRequest != null) {
                    master.currentSearchRequest.onCancel();
                } else self.val("");
                return false;

            case 33://PgUp
                moveTo = 0;
                if (position != null) { 
                    let next = position - 5;
                    if (next > -1) moveTo = next;
                }
                break;

            case 34://PgDn
                moveTo = 0;
                if (position != null) {
                    let next = position + 5;
                    moveTo = next < list.length ? next : list.length - 1;
                }
                break;

            case 35://End
                if (e.ctrlKey || e.altKey || e.shiftKey) break;
                moveTo = list.length - 1;
                break;

            case 36://Home
                if (e.ctrlKey || e.altKey || e.shiftKey) break;
                moveTo = 0;
                break;

            case 38://↑
                moveTo = 0;
                if (position != null) { 
                    let next = position - 1;
                    moveTo = next > -1 ? next : list.length - 1;
                }
                break;

            case 40://↓
                moveTo = 0;
                if (position != null) {
                    let next = position + 1;
                    if (next < list.length) moveTo = next;
                }
                break;
            
            default:
                break;
        }

        if (moveTo != null) {
            e.preventDefault();
            var target = $(list[moveTo]);
            master.setCursorResult(target, list);
            master.checkScrollItemInView(target[0]);

            playSound("팝");

            return false;
        }
    },

    showResultLayer: function() {
        if (this.resultMaster.css("display") == "none") {
            //show
            this.resultMaster.fadeIn(100);
        }
    },

    request: function(request) {
        this.currentSearchRequest = request;
        this.searchInput.focus();
        if (request.searchWord != null) {
            setTimeout(() => {
                this.searchInput.val(request.searchWord);
                this.checkUpdataResultByStep();
            }, 10);
        }
    },

    getItems: function(query = "li") {
        return this.listHost.find(query);
    },

    getSelected: function() {
        return this.getItems('li[data-cursor="1"]');
    },

    getPositionInItems: function(list = this.getItems(), find = this.getSelected()) {
        find = $(find);
        var position = null;
        if (find.length > 0) for (var i in list) {
            let item = list[i];
            if (item == find[0]) {
                position = parseInt(i);
                break;
            }
        }
        return { list: list, item: find, position: position };
    },

    pickCurrentItemFromResult: function(item = this.getSelected()) {
        var id;
        if (typeof item == "string") id = item;
        else if (item == null || $(item).length < 1) {
            this.setCursorResult()
            return;
        } else id = $(item).attr("data-id");
        if (id == null) return;
        let info = weaponsInfo.list.find(info => info.id == id);
        if (info == null) return;

        playSound("뽁");

        if (this.currentSearchRequest != null) {
            this.currentSearchRequest.callback(info);
            this.searchInput.blur();
        } else sequenceMaster.onPick(id);
        this.searchInput.val("");
    },

    updateResultChange: function() {
        let items = this.getItems();

        items.off("click");
        items.click(this.onClickItem);
        items.hover(function(e) { playSound("뽁"); });
    },

    clearCursorResult(list = this.getItems()) {
        $(list).attr("data-cursor", null);
    },

    setCursorResult(item, clear) {
        if (item == null) item = this.getItems()[0];
        if (clear != null) this.clearCursorResult(clear === true ? this.getItems() : clear);
        $(item).attr("data-cursor", "1");
    },

    checkScrollItemInView: function(target) {
        if (!checkInView(this.resultMaster[0], target)) target.scrollIntoView();
    },

    checkUpdataResultByStep: function() {
        let isRequest;
        let searchCase;
        let side;
        let entries;
        if (this.currentSearchRequest != null) {
            let request = this.currentSearchRequest;
            isRequest = true;
            searchCase = request.searchFor;
            side = request.side;
            entries = [charactersInfo.list[charactersInfo[request.character.id]]];
        } else {
            if (step < 0 || step >= rules.sequence.length) return;
            isRequest = false;
            let seq = rules.sequence[step];
            searchCase = seq.pick;
            side = seq.side;
        }
        let counter = side == "blue" ? "red" : "blue";


        this.resultMaster.css("--current-side-color", "var(--color-side-" + side + ")");
        this.resultMaster.css("--counter-position", side == "red" ? "right" : "left");

        switch (searchCase) {
            case "weapon":
            case "ban weapon":
                let isBanWeapon = searchCase == "ban weapon";
                let weaponTypes = {};
                let currentSuggest = isRequest ? [] : this.weaponSuggests[isBanWeapon ? counter : side];
                var checkLastPick = true;
                for (var i=step+1; i<rules.sequence.length; i++) {
                    let cur = rules.sequence[i];
                    if (cur.pick.indexOf("entry") > -1) {
                        checkLastPick = false;
                        break;
                    }
                }

                if (currentSuggest.length < 1) {
                    if (isBanWeapon) entries = sideMaster.entryPicked[isBanWeapon ? counter : side];
                    for (var i in entries) {
                        let entry = entries[i];

                        weaponTypes[entry.weapon] = true;
                    }

                    for (var i=weaponsInfo.list.length-1; i > -1; i--) {
                        let item = weaponsInfo.list[i];
                        if (item.id == "reserved") continue;

                        if (item.class != "unreleased" && (!checkLastPick || weaponTypes[item.type])) currentSuggest.push(item);

                    }
                }


                let sInput = this.searchInput.val().trim();
                let sWords = sInput.split(" ");

                this.listHost.empty();

                for (var i in currentSuggest) {
                    let info = currentSuggest[i];

                    if (sInput == "" || this.isFound(info.search, sWords)) this.listHost.append(this.buildWeaponListItem(info));
                }

                let list = this.listHost.find("li");
                if (list.length > 0) {
                    this.setCursorResult(list[0]);
                    this.checkScrollItemInView(list[0]);
                }

                break;
        }

        this.updateResultChange();
    },

    isFound: function(pool, words) {
        for (var i in words) {
            let word = words[i].trim().toLowerCase();
            if (word == "") continue;
            if (pool.indexOf(word) > -1) return true;
        }
        return false;
    },

    buildWeaponListItem: function(info) {
        let item = document.createElement("li");
        item.setAttribute("data-id", info.id);
        item.setAttribute("data-rarity", info.rarity);
        let wraper = document.createElement("div");
        wraper.setAttribute("class", "item_wraper");
        let icon = document.createElement("div");
        icon.setAttribute("class", "icon_holder");
        let img = document.createElement("img");
        img.setAttribute("class", "icon");
        img.setAttribute("src", getPathR("images", "weapon_icon", info.res_icon));
        icon.append(img);
        wraper.append(icon);
        let mainInfo = document.createElement("div");
        mainInfo.setAttribute("class", "main_info");
        let rarity = document.createElement("span");
        rarity.setAttribute("class", "rarity emoji");
        mainInfo.append(rarity);
        let name = document.createElement("span");
        name.setAttribute("class", "name text_item");
        name.setAttribute("data-text", info.name[loca]);
        mainInfo.append(name);
        wraper.append(mainInfo);
        item.append(wraper);

        return item;
    },

    onClickItem: function(e) {
        let self = $(this);
        let id = self.attr("data-id");

        console.log(self.attr("data-id"));

        if (id == null || id == "") return;

        searchMaster.pickCurrentItemFromResult(self);
        
        //if (!searchMaster.searchInput.is(":focus")) setTimeout(function() { searchMaster.searchInput.focus(); }, 10);
    },


    eoo: eoo
}


//rule alter selection control
let rulesMaster = {

    rule_alter: "select#rule_alter",

    league_title: "div#league_title",
    league_name: "span.league_name",
    league_tail: "span.league_tail",


    ruleAlter: null,

    leagueTitle: null,
    leagueName: null,
    leagueTail: null,


    init: function() {

        this.ruleAlter = $(this.rule_alter);

        this.leagueTitle = $(this.league_title);
        this.leagueName = this.leagueTitle.find(this.league_name);
        this.leagueTail = this.leagueTitle.find(this.league_tail);

        this.initRuleTables();

        this.initAlterSelector();
        this.initAlterSelections();

        this.applyRuleAlterSelection();
    },

    initAlterSelector: function() {
        this.ruleAlter.off("change");
        this.ruleAlter.change(this.onSelectedAlter);
    },

    blockAlterSelector: function() {
        this.ruleAlter.prop("disabled", true);
    },

    releaseAlterSelector: function() {
        this.ruleAlter.prop("disabled", false);
    },

    initAlterSelections: function() {
        this.ruleAlter.empty();

        let alters = rules.rule_alter;
        for (i in alters) if (alters[i]["selectable"]) this.ruleAlter.append(this.buildAlterOption(i, alters[i]));
    },

    buildAlterOption(offset, detail) {
        let option = document.createElement("option");
        option.setAttribute("value", offset);
        if (offset == rules.alter_default) option.setAttribute("selected", "");
        option.innerHTML = detail.name;
        return option;
    },

    onSelectedAlter: function(e) {
        let self = $(this);
        let offset = parseInt(self.val());

        rulesMaster.releaseRuleAlterBy(offset);

        playSound("풛");
    },

    releaseRuleAlterBy(offset) {
        rulesMaster.applyRuleAlterSelection(offset);

        if (rules.rule_type == "ban card") poolMaster.releasePosessionBanCard();

        $(document.body).attr("data-double-pick", rules.double_pick === true ? "1" : "0")
        
        sideMaster.releaseCostAmountChanged();

        sideMaster.initBanEntries();

        sideMaster.initBanWeapons();

        poolMaster.initPickPool();
        globalBanMaster.takeGlobalBanned();

        playerInfoMaster.applyAddsDefaultByRuleBook();

    },

    applyRuleAlterSelection: function(offset = rules.alter_default) {
        if (offset < 0 || offset >= rules.rule_alter.length) offset = rules.alter_default;
        rules.alterSelected = offset;

        //base rule apply
        let base = rules.base_rule;
        this.loadRuleSet(base);

        let alter = rules.rule_alter[offset];
        this.loadRuleSet(alter, offset);

        this.leagueName.html(rules.name_full.replace(/\n/g, "<br />"));
        this.leagueTail.html(rules.league_tail.replace(/\n/g, "<br />"));

        sequenceMaster.init();

        sequenceMaster.setSequenceTitle(alter.name, 3000);
    },

    loadRuleSet: function(ruleset, offset) {
        let alter = rules.rule_alter;
        if (ruleset == null && offset != null) ruleset = alter[offset];
        if (ruleset == null) return;
        for (var def in ruleset) {
            if (def == "" || def == eoo) break;
            let rule = ruleset[def];

            if (def.indexOf("accure") > -1) {
                if (typeof rule == "object") {
                    if(rules[def] == null || offset == null) {
                        rules[def] = Array.isArray(rule) ? [] : {};
                        this.loadRuleDetailAccure(rules[def], rule);
                    } else for (i=0; i < Math.min(alter.length, offset + 1); i++) this.loadRuleDetailAccure(rules[def], alter[i][def]);
                }
            } else rules[def] = rule;
        };
    },

    loadRuleDetailAccure: function(to, from) {
        if (to == null || from == null) return;
        if (!Array.isArray(from)) for (k in from) to[k] = from[k];
        else for (i in from) if (to.indexOf(rule[i]) < 0) to.push(from[i]);
    },

    initRuleTables() {
        if (rules.cardy_rating != null && rules.cardy_rating.point_sheet != null) this.loadTable(rules.cardy_rating, "point_sheet", "point_table", ["Characters"]);
    },

    loadTable(set, from, to, ignores = [], def = [0, 0, 0, 0, 0, 0, 0]) {
        set[to] = {};
        let bp = set[from];
        let ap = set[to];
        //for (var info of charactersInfo.list) ap[info.id] = def;

        let lines = bp.split(/[\r\n]+/);
        for (var line of lines) {
            let divided = line.split("\t");
            let key = divided.shift();
            if (ignores.indexOf(key) > -1) continue;
            
            var id = null;
            for (var info of charactersInfo.list) {
                for (var locate in info.nameShort) if (info.nameShort[locate] == key) {
                    id = info.id;
                    break;
                }
                if (id != null) break;
            }
            if (id != null) {
                let values = divided.map((v) => parseInt(v));
                ap[info.id] = values;
            }
        }
    },

    eoo
}


//locale & language handle
let localeMaster = {

    languageSelector: null,


    init: function() {
        console.log("init localeMaster");

        //set element
        this.languageSelector = $("select#language");

        //initializing locale
        this.initLocale();

        //set language options
        this.initLanguageSelector(true);
        this.initLanguageSelectorText();

        //set event
        this.languageSelector.on("change", localeMaster.onLanguageSelected);
    },

    initLocale: function() {
        let langs = navigator.languages;
        for (i in langs) {
            var l = langs[i];
            if (l.indexOf("-") == -1) {
                for (la in locales) {
                    var ln = la.split("-");
                    if (ln[0] == l) {
                        loca = la;
                        break;
                    }
                }
                if (loca != null) break;
            } else if (locales[l] != null) {
                lmatch = l;
                break;
            }
        }
        if (loca == null) loca = "en-global";
        lang = locales[loca];
    
    },

    initLanguageSelector: function(init = false) {
        let langSel = this.languageSelector;
        langSel.empty()
        for (la in locales) {
            let loc = locales[la];
            var item = document.createElement("option");
            item.innerText = loc.name;
            item.setAttribute("value", la);
            item.setAttribute("title", loc.comment);
            if (la == loca) item.selected = true;
            langSel.append(item);
        }
        
        if (!init) this.applyLanguageSelection();
    },

    initLanguageSelectorText: function() {
        this.languageSelector.attr("title", lang.text.btnLangDesc);
    },

    applyLanguageSelection: function() {
        //language selection applier
        let text = lang.text;
        
        try {
            this.initLanguageSelectorText();
            sideMaster.initDesc();
            playerInfoMaster.initDesc();
            timerMaster.initDesc();
            searchMaster.initSearchInputHelps();
            controllerMaster.initButtonTexts();
        } catch (e) {
            console.error(e.name, e.message, e.stack);
        }

        //apply character name
        poolMaster.initPickPool();
        
        //replace texts
        sequenceMaster.releaseStepStateDisplay();
    },

    onLanguageSelected: function(e) {
        loca = $(this).val();
        lang = locales[loca];
        localeMaster.applyLanguageSelection();
    },

    blockLanguageSelector: function() {
        this.languageSelector.prop("disabled", true);
    },

    releaseLanguageSelector: function() {
        this.languageSelector.prop("disabled", false);
    },

    eoo: eoo
}

//main controller set
let controllerMaster = {

    main_controller: "div#main_controller",

    main_action: "button#main_action",
    sub_action: "button#sub_action",

    use_remocon: "button#use_remocon",
    toggle_player_info: "button#toggle_player_info",
    random_picker: "button#random_picker",
    discard_pick_global_ban: "button#discard_pick_global_ban",
    global_ban_picker: "button#global_ban_picker",

    extra_action: "div#extra_action",
    settings: "button#settings",
    reset: "button#reset",

    tool_infos: "div#tool_infos",
    popup_credits: "span#popup_credits",
    popup_sound_panel: "span#popup_sound_panel",


    mainController: null,

    mainActionButton: null,
    subActionButton: null,

    remoconCallerButton: null,
    togglePlayerInfoButton: null,
    randomPickButton: null,
    discardPickGlobalBanButton: null,
    globalBanPickerButton: null,

    extraActions: null,
    buttonSettings: null,
    buttonReset: null,

    toolInfos: null,
    popupCredits: null,
    popupSoundPanel: null,



    triggerCount: 0,
    triggerExceed: 2,


    init: function() {
        
        this.mainController = $(this.main_controller);

        this.mainActionButton = this.mainController.find(this.main_action);
        this.subActionButton = this.mainController.find(this.sub_action);

        this.extraActions = this.mainController.find(this.extra_action);
        this.buttonSettings = this.extraActions.find(this.settings);
        this.buttonReset = this.extraActions.find(this.reset);

        this.remoconCallerButton = this.mainController.find(this.use_remocon);
        this.togglePlayerInfoButton = this.mainController.find(this.toggle_player_info);
        this.randomPickButton = this.mainController.find(this.random_picker);
        this.discardPickGlobalBanButton = this.mainController.find(this.discard_pick_global_ban);
        this.globalBanPickerButton = this.mainController.find(this.global_ban_picker);

        this.toolInfos = this.mainController.find(this.tool_infos);
        this.popupCredits = this.toolInfos.find(this.popup_credits);
        this.popupSoundPanel = this.toolInfos.find(this.popup_sound_panel);

        
        this.initButtonTexts();

        this.mainActionButton.click(this.mainButton);
        this.mainActionButton.contextmenu(this.mainButtonRight);
        this.subActionButton.click(this.subButton);
        this.remoconCallerButton.click(this.remoconButton);
        this.togglePlayerInfoButton.click(this.playerInfoToggleButton);
        this.randomPickButton.click(this.randomButton);
        this.randomPickButton.contextmenu(this.randomButtonRight);
        this.randomPickButton.mouseenter(this.randomButtonHover);
        this.randomPickButton.mouseleave(this.randomButtonHoverOut);
        this.discardPickGlobalBanButton.click(this.discardGlobalBanButton);
        this.globalBanPickerButton.click(this.globalBanButton);
        this.buttonSettings.click(this.settingsButton);
        this.buttonSettings.contextmenu(this.settingsButtonRight);
        this.buttonReset.click(this.resetButton);
        this.popupCredits.click(this.creditButton);
        this.popupSoundPanel.click(this.soundPanelButton);

        this.hideRandomButton();
    },

    initButtonTexts: function() {
        let text = lang.text;

        this.subActionButton.text(text.btnUndo);
        this.buttonSettings.text(text.btnSettings);
        this.buttonReset.text(text.btnReset);

        this.mainActionButton.attr("title", text.btnMainDesc);
        this.subActionButton.attr("title", text.btnUndoDesc);
        this.remoconCallerButton.attr("title", text.btnRemoconDesc);
        this.togglePlayerInfoButton.attr("title", text.btnPlayerInfoToggleDesc);
        this.randomPickButton.attr("title", text.btnRandomDesc);
        this.buttonSettings.attr("title", text.btnSettingsDesc);
        this.buttonReset.attr("title", text.btnResetDesc);
    },

    mainButton: function(e) {
        switch(step) {
            case -2:
                globalBanMaster.applyGlobalBanPicked();
                break;
    
            case -1:
                sequenceMaster.startPick();
                break;
    
            case rules.sequence.length:
                sequenceMaster.finishPick();
                break;
    
            default:
                if (step > rules.sequence.length) {

                } else sequenceMaster.passPick();
                break;
        }
    },

    mainButtonRight: function(e) {
        let master = controllerMaster;

        if (step < -1) {
            //do nothing
            return false;
        } if (step < rules.sequence.length) {
            e.preventDefault();

            if (master.triggerCount < master.triggerExceed) {
                master.triggerCount++;
            } else {
                master.triggerCount = 0;
                poolMaster.rollCursorRandom();
                sequenceMaster.autoRandomPick();
            }

            return false;
        }
    },

    remoconButton: function(e) {
        popupMaster.call("remocon");
    },

    playerInfoToggleButton: function(e) {
        playerInfoMaster.togglePlayerInfoLayer();
    },

    randomButton: function(e) {
        if (sequenceMaster.rollingRandomPicks === true) {
            sequenceMaster.rollingRandomPicks = false;
        } else sequenceMaster.randomPick();
    },

    randomButtonRight: function(e) {
        e.preventDefault();

        if (step === -2) {
            //do nothing
        } else if (sequenceMaster.rollingRandomPicks === true) {
            sequenceMaster.rollingRandomPicks = false;
            poolMaster.stopRollRandomCursor();
        } else sequenceMaster.autoRandomPick();

        return false;
    },

    randomButtonHover: function(e) {
        poolMaster.rollCursorRandom();
    },

    randomButtonHoverOut: function(e) {
        if (sequenceMaster.rollingRandomPicks !== true) poolMaster.stopRollRandomCursor();
    },

    showRandomButton: function() {
        this.randomPickButton.show();//fadeIn(200);
    },

    hideRandomButton: function() {
        this.randomPickButton.hide();//fadeOut(200);
    },

    onRollingRandomPick: function() {
        controllerMaster.randomPickButton.text("!");
    },
    
    nonRollingRandomPick: function() {
        controllerMaster.randomPickButton.text("?");
    },

    discardGlobalBanButton: function() {
        globalBanMaster.discardGlobalBanPanel();
    },

    globalBanButton: function() {
        globalBanMaster.bringGlobalBanPanel();
    },
    
    subButton: function(e) {
        if (step == -2) globalBanMaster.excludePicked();
        else undoStep();
    },
    
    resetButton: function(e) {
        if (step == -2) globalBanMaster.clearPicked();
        else if (step == -1 && sideMaster.isEmptySideInfo()) {
            playerInfoMaster.clearPlayerInfos("red");
            playerInfoMaster.clearPlayerInfos("blue");
            this.focus();
        } else initializeStep();
    },
    
    settingsButton: function(e) {
        toggleDarkmode();
    },
    
    settingsButtonRight: function(e) {
        e.preventDefault();

        toggleSnow();

        return false;
    },
    
    creditButton: function(e) {
        let master = controllerMaster;
        let float = $("div.float_layer#credit_extra");
        let popup = $("div.popup_layer#credits");
        let closer = popup.find("div.popup_closer");
        let content = popup.find("div.popup_content");
    
        closer.off("click");
        closer.click(function(e) {
            float.fadeOut(300);
            $(this).closest("div.popup_layer").hide(300);
        });
    
        content.empty();
        content.append(master.buildCreditItem(commonInfo.comment));
        content.append(master.buildCreditItem( "<span class=\"subject\">" + rules.rule_title + " &nbsp;" + rules.rule_version + " &nbsp;<i>&lt;" + master.getRuleTypeForText() + "&gt;</i></span><br/>" +  rules.comment, "Pickup rules"));
        if (typeof costTable != "undefined") content.append(master.buildCreditItem(costTable.comment, "Cost table"));
    
        for (l in locales) {
            let la = locales[l];
            content.append(master.buildCreditItem(la.comment, la.name + " (" + l + ") Language text (translated by)"));
        }
    
        float.fadeIn(300);
        popup.show(300);
    },

    getRuleTypeForText: function(type = rules.rule_type) {
        return type == "cost" ? lang.text.ruleTypeCost : (type == "ban card" ? lang.text.ruleTypeBanCard : type + " system");
    },

    soundPanelButton: function(e) {
        soundsMaster.showSoundPanel();
    },
    
    buildCreditItem: function(content, title) {
        let item = document.createElement("div");
        if (title != null) {
            let titleLine = document.createElement("span");
            titleLine.setAttribute("class", "title emoji");
            titleLine.innerHTML = title;
            item.append(titleLine);
        }
        let contents = document.createElement("span");
        contents.setAttribute("class", "content");
        contents.innerHTML = setAutoLink(content).replace(/\n/g, "<br />");
        item.append(contents);
        return item;
    },

    eoo
}


//timer
let timerMaster = {

    timer_gauges: "div#timer_gauges",

    neutral_side_gauge: "div#neutral_side_gauge",
    red_side_gauge: "div#red_side_gauge",
    blue_side_gauge: "div#blue_side_gauge",

    active: "data-active",

    gauge_elapsed: "div.gauge_elapsed",
    gauge_remains: "div.gauge_remains",

    impend: "data-impend",


    timer: "div#timer",

    side: "data-side",

    timer_ui: "div#timer_ui",
    timer_adder: "button.timer_adder",
    add_min_10: "button#add_min_10",
    add_min_5: "button#add_min_5",
    add_min_1: "button#add_min_1",
    add_sec_60: "button#add_sec_60",
    add_sec_30: "button#add_sec_30",
    add_sec_15: "button#add_sec_15",
    add_sec_10: "button#add_sec_10",

    timer_display: "div#timer_display",
    timer_icon_animated: "div#timer_icon_animated",
    timer_min_1: "span#timer_min_1",
    timer_min_0: "span#timer_min_0",
    timer_sec_2: "span#timer_sec_2",
    timer_sec_1: "span#timer_sec_1",
    timer_sec_0: "span#timer_sec_0",
    timer_cs_1: "span#timer_cs_1",
    timer_cs_0: "span#timer_cs_0",

    timer_setting: "div#timer_setting",
    stack_holder: "div.stack_holder",
    timer_options: "ul.timer_options",
    toi_sound: "li#toi_sound",
    timer_sound_on: "input#timer_sound_on",
    toi_counter_sound: "li#toi_counter_sound",
    timer_counter_sound_on: "input#timer_counter_sound_on",
    toi_control_sound_volume: "li#toi_control_sound_volume",
    timer_control_sound_volume: "input#timer_control_sound_volume",
    toi_counter_sound_volume: "li#toi_counter_sound_volume",
    timer_counter_sound_volume: "input#timer_counter_sound_volume",
    toi_interlock_side: "li#toi_interlock_side",
    timer_interlock_side_on: "input#timer_interlock_side_on",
    toi_interlock_amount: "li#toi_interlock_amount",
    timer_interlock_amount_on: "input#timer_interlock_amount_on",
    toi_automatic_start_ban: "li#toi_automatic_start_ban",
    timer_automatic_start_ban_on: "input#timer_automatic_start_ban_on",
    toi_automatic_start_entry: "li#toi_automatic_start_entry",
    timer_automatic_start_entry_on: "input#timer_automatic_start_entry_on",
    toi_automatic_pass_ran_out: "li#toi_automatic_pass_ran_out",
    timer_automatic_pass_ran_out_on: "input#timer_automatic_pass_ran_out_on",
    toi_automatic_start_setup_phase: "li#toi_automatic_start_setup_phase",
    timer_automatic_start_setup_phase_on: "input#timer_automatic_start_setup_phase_on",
    toi_default_timeout_setup_phase: "li#toi_default_timeout_setup_phase",
    timer_default_timeout_setup_phase_min: "input#timer_default_timeout_setup_phase_min",
    timer_default_timeout_setup_phase_sec: "input#timer_default_timeout_setup_phase_sec",

    settings_area: "div.settings_area",
    settings_icon: "button#settings_icon",

    timer_default_display: "div#timer_default_display",
    timer_default_sec_2: "span#timer_default_sec_2",
    timer_default_sec_1: "span#timer_default_sec_1",
    timer_default_sec_0: "span#timer_default_sec_0",

    folded: "data-folded",

    timer_relay: "div#timer_relay",

    show: "data-show",


    timerGauges: null,
    eachGauges: null,
    neutralSideGauge: null,
    redSideGauge: null,
    blueSideGauge: null,    

    timerHost: null,

    timerUi: null,
    timerAdders: null,
    timerAdderMin10: null,
    timerAdderMin5: null,
    timerAdderMin1: null,
    timerAdderSec60: null,
    timerAdderSec30: null,
    timerAdderSec15: null,
    timerAdderSec10: null,

    timerDisplay: null,
    timerIconAnimated: null,
    timerIconLottie: null,
    timerMin1: null,
    timerMin0: null,
    timerSec2: null,
    timerSec1: null,
    timerSec0: null,
    timerCS1: null,
    timerCS0: null,

    timerSetting: null,
    stackHolder: null,
    timerOptions: null,
    toiSound: null,
    timerSoundOn: null,
    toiCounterSound: null,
    timerCounterSoundOn: null,
    toiControlSoundVolume: null,
    timerControlSoundVolume: null,
    toiCounterSoundVolume: null,
    timerCounterSoundVolume: null,
    toiInterlockSide: null,
    timerInterlockSideOn: null,
    toiInterlockAmount: null,
    timerInterlockAmountOn: null,
    toiAutomaticStartBan: null,
    timerAutomaticStartBanOn: null,
    toiAutomaticStartEntry: null,
    timerAutomaticStartEntryOn: null,
    toiAutomaticPassRanOut: null,
    timerAutomaticPassRanOutOn: null,
    toiAutomaticStartSetupPhase: null,
    timerAutomaticStartSetupPhaseOn: null,
    toiDefaultTimeoutSetupPhase: null,
    timerDefaultTimeoutSetupPhaseMin: null,
    timerDefaultTimeoutSetupPhaseSec: null,

    settingsArea: null,
    settingsIcon: null,

    timerDefaultDisplay: null,
    timerDefaultSec2: null,
    timerDefaultSec1: null,
    timerDefaultSec0: null,

    timerRelay: null,


    timePreset: {
        "default": { min: 0, sec: 30, ms: 0 },
        "ban card": { min: 0, sec: 40, ms: 0 }
    },
    timeSetOrigin: { min: 0, sec: 30, ms: 0 },
    timeSetDefault: {},
    timeSet: {},
    latestSec: null,
    timerBegin: null,
    currentTimer: null,
    runningTimers: [],

    settings: {
        sound: true,
        counterSound: true,
        controlSoundVolume: 70,
        counterSoundVolume: 90,
        interlockSide: true,
        interlockAmount: true,
        autoStartBan: false,
        autoStartEntry: true,
        autoPassTimeout: true,
        autoStartSetupPhase: true,
        setupPhaseTimeSet: { min: 3, sec: 0, ms: 0 },
    },

    init: function() {

        this.timerGauges = $(this.timer_gauges);
        this.eachGauges = this.timerGauges.find("> div");
        this.neutralSideGauge = this.timerGauges.find(this.neutral_side_gauge);
        this.redSideGauge = this.timerGauges.find(this.red_side_gauge);
        this.blueSideGauge = this.timerGauges.find(this.blue_side_gauge);

        
        this.timerHost = $(this.timer);

        this.timerUi = this.timerHost.find(this.timer_ui);
        this.timerAdders = this.timerUi.find(this.timer_adder);
        this.timerAdderMin5 = this.timerAdders.filter(this.add_min_5);
        this.timerAdderMin1 = this.timerAdders.filter(this.add_min_1);
        this.timerAdderSec60 = this.timerAdders.filter(this.add_sec_60);
        this.timerAdderSec30 = this.timerAdders.filter(this.add_sec_30);
        this.timerAdderSec15 = this.timerAdders.filter(this.add_sec_15);
        this.timerAdderSec10 = this.timerAdders.filter(this.add_sec_10);

        this.timerDisplay = this.timerHost.find(this.timer_display);
        this.timerIconAnimated = this.timerDisplay.find(this.timer_icon_animated);
        this.timerIconLottie = this.timerIconAnimated.find("lottie-player");
        this.timerMin1 = this.timerDisplay.find(this.timer_min_1);
        this.timerMin0 = this.timerDisplay.find(this.timer_min_0);
        this.timerSec2 = this.timerDisplay.find(this.timer_sec_2);
        this.timerSec1 = this.timerDisplay.find(this.timer_sec_1);
        this.timerSec0 = this.timerDisplay.find(this.timer_sec_0);
        this.timerCS1 = this.timerDisplay.find(this.timer_cs_1);
        this.timerCS0 = this.timerDisplay.find(this.timer_cs_0);

        this.timerSetting = this.timerHost.find(this.timer_setting);
        this.stackHolder = this.timerSetting.find(this.stack_holder);
        this.timerOptions = this.stackHolder.find(this.timer_options);
        this.toiSound = this.timerOptions.find(this.toi_sound);
        this.timerSoundOn = this.toiSound.find(this.timer_sound_on);
        this.toiCounterSound = this.timerOptions.find(this.toi_counter_sound);
        this.timerCounterSoundOn = this.toiCounterSound.find(this.timer_counter_sound_on);
        this.toiControlSoundVolume = this.timerOptions.find(this.toi_control_sound_volume);
        this.timerControlSoundVolume = this.toiControlSoundVolume.find(this.timer_control_sound_volume);
        this.toiCounterSoundVolume = this.timerOptions.find(this.toi_counter_sound_volume);
        this.timerCounterSoundVolume = this.toiCounterSoundVolume.find(this.timer_counter_sound_volume);
        this.toiInterlockSide = this.timerOptions.find(this.toi_interlock_side);
        this.timerInterlockSideOn = this.toiInterlockSide.find(this.timer_interlock_side_on);
        this.toiInterlockAmount = this.timerOptions.find(this.toi_interlock_amount);
        this.timerInterlockAmountOn = this.toiInterlockAmount.find(this.timer_interlock_amount_on);
        this.toiAutomaticStartBan = this.timerOptions.find(this.toi_automatic_start_ban);
        this.timerAutomaticStartBanOn = this.toiAutomaticStartBan.find(this.timer_automatic_start_ban_on);
        this.toiAutomaticStartEntry = this.timerOptions.find(this.toi_automatic_start_entry);
        this.timerAutomaticStartEntryOn = this.toiAutomaticStartEntry.find(this.timer_automatic_start_entry_on);
        this.toiAutomaticPassRanOut = this.timerOptions.find(this.toi_automatic_pass_ran_out);
        this.timerAutomaticPassRanOutOn = this.toiAutomaticPassRanOut.find(this.timer_automatic_pass_ran_out_on);
        this.toiAutomaticStartSetupPhase = this.timerOptions.find(this.toi_automatic_start_setup_phase);
        this.timerAutomaticStartSetupPhaseOn = this.toiAutomaticStartSetupPhase.find(this.timer_automatic_start_setup_phase_on);
        this.toiDefaultTimeoutSetupPhase = this.timerOptions.find(this.toi_default_timeout_setup_phase);
        this.timerDefaultTimeoutSetupPhaseMin = this.toiDefaultTimeoutSetupPhase.find(this.timer_default_timeout_setup_phase_min);
        this.timerDefaultTimeoutSetupPhaseSec = this.toiDefaultTimeoutSetupPhase.find(this.timer_default_timeout_setup_phase_sec);

        this.settingsArea = this.timerSetting.find(this.settings_area);
        this.settingsIcon = this.settingsArea.find(this.settings_icon);

        this.timerDefaultDisplay = this.settingsArea.find(this.timer_default_display);
        this.timerDefaultSec2 = this.timerDefaultDisplay.find(this.timer_default_sec_2);
        this.timerDefaultSec1 = this.timerDefaultDisplay.find(this.timer_default_sec_1);
        this.timerDefaultSec0 = this.timerDefaultDisplay.find(this.timer_default_sec_0);

        this.timerRelay = $(this.timer_relay);
        this.timerRelayDisplay = this.timerRelay.find(this.timer_display);
        this.timerRelaySec2 = this.timerRelayDisplay.find(this.timer_sec_2);
        this.timerRelaySec1 = this.timerRelayDisplay.find(this.timer_sec_1);
        this.timerRelaySec0 = this.timerRelayDisplay.find(this.timer_sec_0);
        this.timerRelayCS1 = this.timerRelayDisplay.find(this.timer_cs_1);
        this.timerRelayCS0 = this.timerRelayDisplay.find(this.timer_cs_0);


        let timeSetCurrentRule = this.timePreset[rules.rule_type];
        this.applyTimeSet(timeSetCurrentRule == null ? this.timePreset.default : timeSetCurrentRule, this.timeSetOrigin);

        
        this.initDesc();

        this.initGaugesWidth();
        
        this.applyTimeSetOrigin();
        this.applyTimeSet();

        this.initTimer();

        this.applySide();


        this.timerUi.on("wheel", function(e) {
            e.preventDefault();
            if (e.originalEvent.deltaY < 0) timerMaster.appendSec(1);
            else if (e.originalEvent.deltaY > 0) timerMaster.appendSec(-1);
            return false;
        });
        this.timerUi.on("mousedown", function(e) {
            if (e.which == 2) {
                e.preventDefault;
                if (timerMaster.timerBegin == null) {
                    timerMaster.applyTimeSetWithAmount();
                    timerMaster.releaseTimerDisplay();
                }
                return false;
            }
        });

        this.timerAdderMin5.click(function(e) {
            timerMaster.appendMin(5);
        });
        this.timerAdderMin1.click(function(e) {
            timerMaster.appendMin(1);
        });
        this.timerAdderSec60.click(function(e) {
            timerMaster.appendSec(60);
        });
        this.timerAdderSec30.click(function(e) {
            timerMaster.appendSec(30);
        });
        this.timerAdderSec15.click(function(e) {
            timerMaster.appendSec(15);
        });
        this.timerAdderSec10.click(function(e) {
            timerMaster.appendSec(10);
        });

        this.timerAdderMin5.contextmenu(function(e) {
            e.preventDefault();
            timerMaster.appendMin(-5);
            return false;
        });
        this.timerAdderMin1.contextmenu(function(e) {
            e.preventDefault();
            timerMaster.appendMin(-1);
            return false;
        });
        this.timerAdderSec60.contextmenu(function(e) {
            e.preventDefault();
            timerMaster.appendSec(-60);
            return false;
        });
        this.timerAdderSec30.contextmenu(function(e) {
            e.preventDefault();
            timerMaster.appendSec(-30);
            return false;
        });
        this.timerAdderSec15.contextmenu(function(e) {
            e.preventDefault();
            timerMaster.appendSec(-15);
            return false;
        });
        this.timerAdderSec10.contextmenu(function(e) {
            e.preventDefault();
            timerMaster.appendSec(-10);
            return false;
        });

        $(this.getLottie()).on("enterFrame", this.onFrameIconLottie);

        this.timerDisplay.click(this.onClickTimerDisplay);
        this.timerDisplay.contextmenu(this.onRightClickTimerDisplay);
        this.timerDisplay.on("wheel", function(e) {
            if (timerMaster.currentTimer == null) {
                e.preventDefault();
                if (e.originalEvent.deltaY < 0) timerMaster.adjustDefault(1);
                else if (e.originalEvent.deltaY > 0) timerMaster.adjustDefault(-1);
                return false;
            }
        });
        this.timerDisplay.on("mousedown", function(e) {
            if (e.which == 2) {
                e.preventDefault;
                timerMaster.adjustDefault();
                return false;
            }
        });

        this.timerSoundOn.change(function(e) {
            let state = $(this).is(":checked");
            timerMaster.settings.sound = state;
        });
        this.timerCounterSoundOn.change(function(e) {
            let state = $(this).is(":checked");
            timerMaster.settings.counterSound = state;
        });
        this.toiControlSoundVolume.find("label").click(function(e) {
            let input = timerMaster.timerControlSoundVolume;
            input.val(input.attr("data-default"));
            timerMaster.releaseControlSoundVolume();
        });
        this.timerControlSoundVolume.on("input change", function(e) {
            let volume = $(this).val();
            timerMaster.releaseControlSoundVolume(volume);
        });
        this.toiCounterSoundVolume.find("label").click(function(e) {
            let input = timerMaster.timerCounterSoundVolume;
            input.val(input.attr("data-default"));
            timerMaster.releaseCounterSoundVolume();
        });
        this.timerCounterSoundVolume.on("input change", function(e) {
            let volume = $(this).val();
            timerMaster.releaseCounterSoundVolume(volume);
        });
        this.timerInterlockSideOn.change(function(e) {
            let state = $(this).is(":checked");
            timerMaster.settings.interlockSide = state;
            timerMaster.activeGauge();
            timerMaster.releaseGaugeProgress();
            if (state) timerMaster.applySide();
            else timerMaster.applySide(null);
            timerMaster.setProgressIconLottie();
        });
        this.timerInterlockAmountOn.change(function(e) {
            let state = $(this).is(":checked");
            timerMaster.settings.interlockAmount = state;
            timerMaster.applyTimeSetWithAmount();
            timerMaster.releaseTimerDisplay();
        });
        this.timerAutomaticStartBanOn.change(function(e) {
            let state = $(this).is(":checked");
            timerMaster.settings.autoStartBan = state;
        });
        this.timerAutomaticStartEntryOn.change(function(e) {
            let state = $(this).is(":checked");
            timerMaster.settings.autoStartEntry = state;
        });
        this.timerAutomaticPassRanOutOn.change(function(e) {
            let state = $(this).is(":checked");
            timerMaster.settings.autoPassTimeout = state;
        });
        this.timerAutomaticStartSetupPhaseOn.change(function(e) {
            let state = $(this).is(":checked");
            timerMaster.settings.autoStartSetupPhase = state;
        });

        this.timerDefaultTimeoutSetupPhaseMin.click(function(e) {
            $(this).select();
        });
        this.timerDefaultTimeoutSetupPhaseSec.click(function(e) {
            $(this).select();
        });
        this.timerDefaultTimeoutSetupPhaseMin.on("input change", function(e) {
            let value = $(this).val();
            timerMaster.settings.setupPhaseTimeSet.min = value;
        });
        this.timerDefaultTimeoutSetupPhaseSec.on("input change", function(e) {
            let value = $(this).val();
            timerMaster.settings.setupPhaseTimeSet.sec = value;
        });
        this.timerDefaultTimeoutSetupPhaseMin.on("wheel", function(e) {
            e.preventDefault();
            if (e.originalEvent.deltaY < 0) timerMaster.appendSetupPhaseTimeoutMin(1);
            else if (e.originalEvent.deltaY > 0) timerMaster.appendSetupPhaseTimeoutMin(-1);
            return false;
        });
        this.timerDefaultTimeoutSetupPhaseSec.on("wheel", function(e) {
            e.preventDefault();
            if (e.originalEvent.deltaY < 0) timerMaster.appendSetupPhaseTimeoutSec(1);
            else if (e.originalEvent.deltaY > 0) timerMaster.appendSetupPhaseTimeoutSec(-1);
            return false;
        });

        this.settingsIcon.click(function(e) {
            let tm = timerMaster;
            let ts = tm.timerSetting;
            let folded = ts.attr(tm.folded);
            ts.attr(tm.folded, folded == "1" ? "0" : "1");
        });
        this.settingsIcon.contextmenu(function(e) {
            e.preventDefault();
            let tm = timerMaster;
            let ts = tm.timerSetting;
            ts.attr(tm.folded, "");
            return false;
        });
    },

    initDesc: function() {
        let text = lang.text;
        let optionSetTitle = "label.option_set_title";
        let val = "#VALUE";
        let def = "data-default";

        this.timerDisplay.attr("title", text.timerDisplayDesc);

        this.timerAdderMin5.attr("title", text.timerAdderMinDesc.replace(/#NO/g, "5"));
        this.timerAdderMin1.attr("title", text.timerAdderMinDesc.replace(/#NO/g, "1"));
        this.timerAdderSec60.attr("title", text.timerAdderSecDesc.replace(/#NO/g, "60"));
        this.timerAdderSec30.attr("title", text.timerAdderSecDesc.replace(/#NO/g, "30"));
        this.timerAdderSec15.attr("title", text.timerAdderSecDesc.replace(/#NO/g, "15"));
        this.timerAdderSec10.attr("title", text.timerAdderSecDesc.replace(/#NO/g, "10"));

        this.timerOptions.filter("#sound_options").find(optionSetTitle).attr("title", text.timerOptionsSetSoundDesc);
        this.timerOptions.filter("#interlock_options").find(optionSetTitle).attr("title", text.timerOptionsSetInterlockDesc);
        this.timerOptions.filter("#automatic_options").find(optionSetTitle).attr("title", text.timerOptionsSetAutomaticDesc);
        this.timerOptions.filter("#setup_phase_options").find(optionSetTitle).attr("title", text.timerOptionsSetSetupPhaseDesc);

        this.toiSound.find("label").attr("title", text.timerOptionSoundOnDesc);
        this.timerSoundOn.attr("title", text.timerOptionSoundOnDesc);
        this.toiCounterSound.find("label").attr("title", text.timerOptionCounterSoundOnDesc);
        this.timerCounterSoundOn.attr("title", text.timerOptionCounterSoundOnDesc);
        this.toiControlSoundVolume.find("label").attr("title", text.timerOptionControlSoundVolumeDesc + "\n" + text.timerOptionSoundVolumeDefaultDesc.replace(val, this.timerControlSoundVolume.attr(def)));
        this.timerControlSoundVolume.attr("title", text.timerOptionControlSoundVolumeDesc);
        this.toiCounterSoundVolume.find("label").attr("title", text.timerOptionCounterSoundVolumeDesc + "\n" + text.timerOptionSoundVolumeDefaultDesc.replace(val, this.timerCounterSoundVolume.attr(def)));
        this.timerCounterSoundVolume.attr("title", text.timerOptionCounterSoundVolumeDesc);
        this.toiInterlockSide.find("label").attr("title", text.timerOptionInterlockSideOnDesc);
        this.timerInterlockSideOn.attr("title", text.timerOptionInterlockSideOnDesc);
        this.toiInterlockAmount.find("label").attr("title", text.timerOptionInterlockAmountOnDesc);
        this.timerInterlockAmountOn.attr("title", text.timerOptionInterlockAmountOnDesc);
        this.toiAutomaticStartBan.find("label").attr("title", text.timerOptionAutomaticStartBanOnDesc);
        this.timerAutomaticStartBanOn.attr("title", text.timerOptionAutomaticStartBanOnDesc);
        this.toiAutomaticStartEntry.find("label").attr("title", text.timerOptionAutomaticStartEntryOnDesc);
        this.timerAutomaticStartEntryOn.attr("title", text.timerOptionAutomaticStartEntryOnDesc);
        this.toiAutomaticPassRanOut.find("label").attr("title", text.timerOptionAutomaticPassRanOutOnDesc);
        this.timerAutomaticPassRanOutOn.attr("title", text.timerOptionAutomaticPassRanOutOnDesc);
        this.toiAutomaticStartSetupPhase.find("label").attr("title", text.timerOptionAutomaticStartSetupPhaseOnDesc);
        this.timerAutomaticStartSetupPhaseOn.attr("title", text.timerOptionAutomaticStartSetupPhaseOnDesc);
        this.toiDefaultTimeoutSetupPhase.find("label").attr("title", text.timerOptionDefaultTimeoutSetupPhaseTextDesc);
        this.timerDefaultTimeoutSetupPhaseMin.attr("title", text.timerOptionDefaultTimeoutSetupPhaseMinDesc);
        this.timerDefaultTimeoutSetupPhaseSec.attr("title", text.timerOptionDefaultTimeoutSetupPhaseSecDesc);

        this.settingsIcon.attr("title", text.timerSettingsIconDesc);
    },

    releaseControlSoundVolume: function(vol = this.timerControlSoundVolume.val()) {
        if (vol == null || isNaN(vol)) return;
        this.toiControlSoundVolume.find("span.value_indicator").text(vol);
        this.settings.controlSoundVolume = parseInt(vol);
    },

    releaseCounterSoundVolume: function(vol = this.timerCounterSoundVolume.val()) {
        if (vol == null || isNaN(vol)) return;
        this.toiCounterSoundVolume.find("span.value_indicator").text(vol);
        this.settings.counterSoundVolume = parseInt(vol);
    },

    hideGauge: function(side) {
        this.getActivatedGauges().attr(this.active, "");
        setTimeout(function() { timerMaster.initGaugesWidth(); }, 300);
    },

    activeGauge: function(side = getCurrentSide()) {
        if (this.timerBegin == null) {
            this.hideGauge();
            return;
        }
        if (!this.settings.interlockSide) side = null;

        var selected = this.getGaugeBy(side);

        for (var i=0; i < this.eachGauges.length; i++) {
            let cur = this.eachGauges[i];
            let curr = $(cur);
            if (cur == selected[0]) {
                if (curr.attr(this.active) == "") curr.attr(this.active, "1");
            } else curr.attr(this.active, "");
        }

        this.releaseGaugeProgress();
    },

    getGaugeBy(side = getCurrentSide()) {
        var specific;
        switch(side) {
            case "red":
                specific = this.redSideGauge;
                break;

            case "blue":
                specific = this.blueSideGauge;
                break;

            default:
                specific = this.neutralSideGauge;
                break;
        }
        return specific;
    },

    getActivatedGauges: function() {
        return this.timerGauges.find('> div[' + this.active + '="1"]');
    },

    releaseGaugeProgress: function() {
        let active = this.getActivatedGauges();
        if (active.length < 1) return;

        let remains = this.getTimeRamains();
        let percentage = this.getProgressPercentage().toFixed(1);

        let remain = active.find(this.gauge_remains);
        remain.css("width", percentage + "%");

        if (remains <= 15000) this.applyImpendFor(remain, remains <= 5000 ? "2" : "1");
        else this.applyImpendFor(remain);
    },

    initGaugesWidth: function() {
        this.eachGauges.find(this.gauge_remains).css("width", "100%");
    },

    applyImpendFor: function(remain, impendency = "") {
        if (remain == null || remain.length < 1) return;
        let impend = remain.attr(this.impend);
        if (impendency != impend) remain.attr(this.impend, impendency);
    },

    initTimer: function(byUser) {
        if (this.currentTimer != null) {
            this.finishCurrentTimer();
            if (byUser === false) {
                this.releaseTimerDisplay(0, 0);
                this.releaseGaugeProgress();
                let activatedStep = step;
                setTimeout(function() {
                    if (activatedStep == step) {
                        if (timerMaster.settings.sound) playSoundV("뾷", timerMaster.settings.controlSoundVolume);
                        timerMaster.initTimer();

                        if (timerMaster.settings.autoPassTimeout) {
                            if (activatedStep == step) setTimeout(function() {
                                if (step < 0) sequenceMaster.startPick();
                                else if (step < rules.sequence.length) sequenceMaster.passPick();
                                else if (step == rules.sequence.length) sequenceMaster.finishPick();
                            }, 500);
                        }
                    }
                }, 1000);
                return;
            }
        }

        this.timerBegin = null;
        this.finishCurrentTimer();
        if (this.settings.autoStartSetupPhase && step != null && step == rules.sequence.length && latestStep < step) this.applyTimeSet(this.settings.setupPhaseTimeSet);
        else if (this.settings.autoStartSetupPhase && step != null && step > rules.sequence.length && latestStep < step) this.applyTimeSet({ min: 10, sec: 0, ms: 0 });
        else this.applyTimeSetWithAmount();

        this.releaseTimerDisplay();
        this.hideTimerRelay();
        this.hideGauge();
        this.playTurnIconLottie();

        if (this.settings.interlockSide) this.applySide();
        else this.applySide(null);


        if (byUser && this.settings.sound) playSoundV("흽", this.settings.controlSoundVolume);
    },
    

    startTimer: function(byUser = true) {
        if (byUser && this.settings.sound) playSoundV("훱", this.settings.controlSoundVolume);
        this.timerBegin = Date.now();
        this.currentTimer = setInterval(this.timerProcessor, 15);
        this.runningTimers.push(this.currentTimer);
        this.showTimerRelay();
        this.activeGauge();
        this.playBeginIconLottie();
    },

    pauseTimer: function() {
        if (this.currentTimer == null) return;
        if (this.settings.sound) playSoundV("덥", this.settings.controlSoundVolume);

        let remains = this.getTimeRamains();
        this.finishCurrentTimer();

        let sec = Math.floor(remains / 1000);
        let ms = Math.floor(remains % 1000);
        this.timeSet.min = 0;
        this.timeSet.sec = sec;
        this.timeSet.ms = ms;

        this.releaseTimerDisplay();
    },

    resumeTimer: function() {
        if (this.timerBegin == null) return true;
        if (this.currentTimer != null) return false;
        if (this.settings.sound) playSoundV("뜝", this.settings.controlSoundVolume);
        this.startTimer(false);
    },

    finishCurrentTimer: function() {
        clearInterval(this.currentTimer);
        this.currentTimer = null;
        while (this.runningTimers.length > 0) {
            clearInterval(this.runningTimers.splice(0, 1)[0]);
        }
    },

    showTimerRelay: function() {
        this.timerRelay.attr(this.show, "1");
    },

    hideTimerRelay: function() {
        this.timerRelay.attr(this.show, "");
    },

    applyTimeSetWithAmount: function() {
        let seq = rules.sequence[step];
        if (this.settings.interlockAmount && seq != null) {
            this.applyTimeSetWithMagnification(seq.amount);
        } else this.applyTimeSet();
    },

    applyTimeSet: function(from = this.timeSetDefault, to = this.timeSet, magnify = 1) {
        for (var i in from) to[i] = from[i] * magnify;

        if (to == this.timeSetDefault) this.releaseTimerDefaultDisplay();
    },

    applyTimeSetWithMagnification: function(magnify = 1) {
        this.applyTimeSet(this.timeSetDefault, this.timeSet, magnify);
    },

    applyTimeSetOrigin(def = this.timeSetDefault) {
        this.applyTimeSet(this.timeSetOrigin, def);
    },

    appendMin: function(mins = 1) {
        this.timeSet.min += mins;
        if (this.timeSet.min > 99) this.timeSet.min = 99;
        else if (this.timeSet.min < 0) this.timeSet.min = 0;
        this.releaseTimerDisplay();
    },

    appendSec: function(secs = 1) {
        this.timeSet.sec += secs;
        if (this.timeSet.sec > 999) this.timeSet.sec = 999;
        else if (this.timeSet.sec < 1) this.timeSet.sec = 1;
        this.releaseTimerDisplay();
    },

    adjustDefault: function(alter = 0) {
        if (timerMaster.timerBegin == null) {
            if (alter > 0) this.timeSetDefault.sec++;
            else if (alter < 0) {
                this.timeSetDefault.sec--;
                if (this.timeSetDefault.sec < 1) this.timeSetDefault.sec = 1;
            } else this.applyTimeSetOrigin();
            this.applyTimeSet();
        } else {
            if (alter === 0) {
                this.applyTimeSetOrigin();
                return;
            } else if (this.currentTimer == null) {
                if (alter > 0) {
                    this.appendSec(1);
                    this.timeSetDefault.sec++;
                } else if (alter < 0) {
                    this.appendSec(-1);
                    this.timeSetDefault.sec--;
                    if (this.timeSetDefault.sec < 1) this.timeSetDefault.sec = 1;
                } else return;
            } else return;
        }
        this.releaseTimerDefaultDisplay();
        this.releaseTimerDisplay();
    },

    appendSetupPhaseTimeoutMin: function(min) {
        if (min == null || min == 0) return;
        let set = this.settings.setupPhaseTimeSet;
        set.min += min;
        if (set.min > 16) set.min = 16;
        else if (set.min < 0) {
            set.min = 0;
            if (set.sec == 0) set.sec = 1;
        }
        this.releaseSetupPhaseTimeoutChanged();
    },

    appendSetupPhaseTimeoutSec: function(sec) {
        if (sec == null || sec == 0) return;
        let set = this.settings.setupPhaseTimeSet;
        set.sec += sec;
        if (set.sec > 59) {
            if (set.min < 16) {
                set.sec = 0;
                set.min++;
            } else set.sec = 59
        } else if (set.sec > 39) {
            if (set.min == 16) set.sec = 39
        } else if (set.sec < 0) {
            if (set.min > 0) {
                set.min--;
                set.sec = 59;
            } else set.sec = 1;
        } else if (set.sec < 1 && set.min < 1) set.sec = 1;
        this.releaseSetupPhaseTimeoutChanged();
    },

    releaseSetupPhaseTimeoutChanged: function() {
        let set = this.settings.setupPhaseTimeSet;
        let curMin = parseInt(this.timerDefaultTimeoutSetupPhaseMin.val());
        if (curMin != set.min) this.timerDefaultTimeoutSetupPhaseMin.val(set.min);
        let curSec = parseInt(this.timerDefaultTimeoutSetupPhaseSec.val());
        if (curSec != set.sec) this.timerDefaultTimeoutSetupPhaseSec.val(set.sec);
    },

    timerProcessor: function() {
        let tm = timerMaster;

        let remains = tm.getTimeRamains();

        if (remains <= 15) {
            if (tm.settings.sound || tm.settings.counterSound) playSoundV("뾱", Math.max(tm.settings.controlSoundVolume, tm.settings.counterSoundVolume));
        } else {
            let curSec = Math.floor(remains / 1000);
            let latestSec = tm.latestSec;

            if (curSec != latestSec) {
                if (latestSec > 15) {
                    if (tm.settings.counterSound && latestSec % 2 == 0) playSoundV("뻡", tm.settings.counterSoundVolume);
                } else if (latestSec > 10) {
                    if (tm.settings.counterSound) playSoundV("뻡", tm.settings.counterSoundVolume);
                } else {
                    if (latestSec <= 5) setTimeout(function() { if (tm.settings.counterSound) playSoundV("뻡", tm.settings.counterSoundVolume); }, 500);
                    if (tm.settings.counterSound) playSoundV("떵", tm.settings.counterSoundVolume);
                }

                tm.latestSec = curSec;
            }
        }
        if (remains <= 0) {
            tm.initTimer(false);
        } else {
            let sec = Math.floor(remains / 1000);
            let cs = Math.floor((remains % 1000) / 10);

            tm.releaseTimerDisplay(sec, cs);
            tm.releaseGaugeProgress();
            tm.setProgressIconLottie(remains);
        }
    },

    getMilisecondsFrom: function(timeset) {
        return (((timeset.min * 60) + timeset.sec) * 1000) + timeset.ms;
    },

    getTimeGone: function() {
        let tm = timerMaster;
        let begin = tm.timerBegin;
        let now = Date.now();
        return now - begin;
    },

    getTimeRamains: function() {
        let tm = timerMaster;
        let gone = this.getTimeGone();
        let timer = this.getMilisecondsFrom(tm.timeSet);
        return timer - gone;
    },

    getProgressDecimal: function() {
        let gone = this.getTimeGone();
        return gone / parseFloat(this.getMilisecondsFrom(this.timeSet));
    },

    getProgressPercentage: function() {
        let remains = this.getTimeRamains();
        return remains * 100 / parseFloat(this.getMilisecondsFrom(this.timeSet));
    },

    releaseTimerDisplay: function(rsec, rcs) {
        var min = this.timeSet.min;
        //var min = this.timeSet.min + "";
        // if (min.length < 2) min = "0" + min;
        // var min1 = min[0];
        // var min0 = min[1];
        //var sec = this.timeSet.sec + "";
        var sec = ((min * 60) + this.timeSet.sec) + "";
        if (sec.length < 2) sec = "00" + sec;
        else if (sec.length < 3) sec = "0" + sec;
        var sec2 = sec[0];
        var sec1 = sec[1];
        var sec0 = sec[2];
        var ms = this.timeSet.ms + "";
        if (ms.length < 2) ms = "00" + ms;
        else if (ms.length < 3) ms = "0" + ms;
        var cs1 = ms[0];
        var cs0 = ms[1];

        if (rsec != null) {
            sec = rsec + "";
            if (sec.length < 2) sec = "00" + sec;
            else if (sec.length < 3) sec = "0" + sec;
            sec2 = sec[0];
            sec1 = sec[1];
            sec0 = sec[2];
        }
        if (rcs != null) {
            var cs = rcs + "";
            if (cs.length < 2) cs = "0" + cs;
            cs1 = cs[0];
            cs0 = cs[1];
        }

        if (sec2 == "0") sec2 = "";
        if (sec1 == "0" && sec2 == "") sec1 = "";

        // if (this.timerMin1.text() != min1) this.timerMin1.text(min1);
        // if (this.timerMin0.text() != min0) this.timerMin0.text(min0);
        if (this.timerSec2.text() != sec2) this.timerSec2.text(sec2);
        if (this.timerSec1.text() != sec1) this.timerSec1.text(sec1);
        if (this.timerSec0.text() != sec0) this.timerSec0.text(sec0);
        if (this.timerCS1.text() != cs1) this.timerCS1.text(cs1);
        if (this.timerCS0.text() != cs0) this.timerCS0.text(cs0);

        if (this.timerRelaySec2.text() != sec2) this.timerRelaySec2.text(sec2);
        if (this.timerRelaySec1.text() != sec1) this.timerRelaySec1.text(sec1);
        if (this.timerRelaySec0.text() != sec0) this.timerRelaySec0.text(sec0);
        if (this.timerRelayCS1.text() != cs1) this.timerRelayCS1.text(cs1);
        if (this.timerRelayCS0.text() != cs0) this.timerRelayCS0.text(cs0);
    },

    releaseTimerDefaultDisplay: function() {
        var sec = this.timeSetDefault.sec + "";
        if (sec.length < 2) sec = "00" + sec;
        else if (sec.length < 3) sec = "0" + sec;
        var sec2 = sec[0];
        var sec1 = sec[1];
        var sec0 = sec[2];

        if (sec2 == "0") sec2 = "";
        if (sec1 == "0" && sec2 == "") sec1 = "";

        if (this.timerDefaultSec2.text() != sec2) this.timerDefaultSec2.text(sec2);
        if (this.timerDefaultSec1.text() != sec1) this.timerDefaultSec1.text(sec1);
        if (this.timerDefaultSec0.text() != sec0) this.timerDefaultSec0.text(sec0);
    },

    loadIconLottie: function(side) {
        var lottie = this.getIconLottie(side);
        this.timerIconLottie[0].load(lottie);
    },

    getIconLottie: function(side) {
        var lottie;
        switch(side) {
            case "red":
                lottie = commonInfo.lotties.sandtimer_red;
                break;

            case "blue":
                lottie = commonInfo.lotties.sandtimer_blue;
                break;

            default:
                lottie = commonInfo.lotties.sandtimer_neutral;
                break;
        }
        return lottie;
    },

    onFrameIconLottie: function(e) {
        let frame = parseInt(this.currentFrame);
        //console.log(frame);
        if ((frame >= 10 && frame < 34) || (frame >= 40 && frame < 43)) this.pause();
    },

    getLottie: function() {
        return this.timerIconLottie[0].getLottie();
    },

    setProgressIconLottie: function(remains = this.getTimeRamains()) {
        let lottie = this.getLottie();
        if (lottie.currentFrame < 10) return;

        let total = this.getMilisecondsFrom(this.timeSet);
        let total1 = total - 250; //finish animation

        let gone = this.getTimeGone();
        let gone1 = gone - 416; //begin animation

        let decimal = this.getProgressDecimal();

        if (gone < total1) {
            let frame = 10 + Math.floor(24 * decimal);

            this.setFrameIconLottie(frame);
        } else if (lottie.currentFrame < 34) this.playFinishIconLottie();
    },

    setFrameIconLottie: function(frame) {
       this.getLottie().goToAndStop(frame, true);
    },

    playBeginIconLottie: function() {
        this.getLottie().goToAndPlay(0, true);
    },

    playFinishIconLottie: function() {
        this.getLottie().goToAndPlay(34, true);
    },

    playTurnIconLottie: function() {
        try {
            this.getLottie().goToAndPlay(42, true);
        } catch (e) {
            
        }
    },

    applySide: function(side = getCurrentSide()) {
        this.timerHost.attr(this.side, side == null ? "" : side);
        this.timerRelay.attr(this.side, side == null ? "" : side);
        this.loadIconLottie(side);
    },

    onClickTimerDisplay: function(e) {
        let tm = timerMaster;
        if (tm.timerBegin == null) tm.startTimer();
        else tm.initTimer(true);
    },

    onRightClickTimerDisplay: function(e) {
        e.preventDefault();
        let tm = timerMaster;
        if (tm.currentTimer != null) tm.pauseTimer();
        else if (tm.resumeTimer()) {
            tm.applyTimeSet();
            tm.releaseTimerDisplay();
        }
        return false;
    },

    onChangedStep: function() {
        saveLatestState();
        if (this.settings.interlockSide) {
            this.initTimer();
        }
        let seq = rules.sequence[step];
        let triggerStep = step;
        if (seq != null && seq.amount > 0) switch (seq.pick) {
            case "preban":
            case "ban":
            case "ban weapon":
                if (this.settings.autoStartBan) setTimeout(function() { if (triggerStep == step) timerMaster.startTimer(); }, 500);
                break;
            
            case "entry":
            case "proffer":
                if (this.settings.autoStartEntry && seq.isSuper !== true) setTimeout(function() { if (triggerStep == step) timerMaster.startTimer(); }, 500);
                break;
        } else if (step == rules.sequence.length) {
            if (this.settings.autoStartSetupPhase) setTimeout(function() { if (triggerStep == step) timerMaster.startTimer(); }, 500);
        }
    },

    eoo
}


let screenMaster = {

    side_area: "data-side-area",


    side_area_toggle: "div#side_area_toggle",

    opened: "data-opened",



    body: null,

    sideAreaToggle: null,


    init: function() {

        this.body = $(document.body);

        this.sideAreaToggle = $(this.side_area_toggle);

        

        this.sideAreaToggle.click(function(e) {
            if (screenMaster.body.attr(screenMaster.side_area) == "1") screenMaster.hideSideArea();
            else screenMaster.showSideArea();
        });
    },

    showSideArea: function() {
        this.body.attr(this.side_area, "1");
        this.sideAreaToggle.attr(this.opened, "1");
    },

    hideSideArea: function() {
        this.body.attr(this.side_area, "0");
        this.sideAreaToggle.attr(this.opened, "0");
    },

    eoo
}


//popup windows handler
let popupMaster = {

    widthDefault: 360,
    heightDefault: 640,

    handler: {},


    preset: {//"name": {"url": "./~", w: 480, h: 640, t: nnn, "l": nnn, r: false, p: false},
        "remocon": {"url": "./remocon.html", w: 640, h: 640},
    },


    init: function() {
        this.register("", document, document.body);
        window.popups = this;
    },

    register: function(name, port, wnd, doc, bdy) {
        this.handler[name] = { "port": port, "window": wnd, "document": doc, "body": bdy, };
    },

    remove: function(name) {
        this.handler[name] = undefined;
    },

    new: function(name, url = "about:blank", w, h, t, l, r = true, p = true) {
        let top = window.top;
        if (t == null) {
            var screenY = top.screenY;
            var outerHeight = top.outerHeight;
            var innerHeight = top.innerHeight;
            var shift = 0;
            if (screenY < 0) {
                shift = screenY * -1;
                screenY += shift;
            }
            t = Math.floor((screenY / 2) + (outerHeight / 2) + ((outerHeight - innerHeight) / 2) - (h / 2) - shift);
        }
        if (l == null) {
            var screenX = top.screenX;
            var outerWidth = top.outerWidth;
            var innerWidth = top.innerWidth;
            var shift = 0;
            if (screenX < 0) {
                shift = screenX * -1;
                screenX += shift;
            }
            l = Math.floor((screenX / 2) + (outerWidth / 2) + ((outerWidth - innerWidth) / 2) - (w / 2) - shift);
        }
        let wind = window.open(url, name, (p === true ? "popup": "") + ",innerWidth=" + w + ",innerHeight=" + h + ",screenY=" + t + ",screenX=" + l + (r === true ? ",resizable" : "") + "");
        let mesCh = new MessageChannel();
        mesCh.port1.addEventListener('message', this.messageReceiver);
        wind.postMessage("called", location.href.replace("index.html", "") + url.replace("./", ""), [mesCh.port2]);
        this.register(name, mesCh.port1 , wind);
        return wind;
    },

    call: function(name, url) {
        let set = this.preset[name];
        if (set == null) {
            return this.new(name, url);
        }
        if (this.handler[name] == null) {
            return this.new(name, set.url, set.w, set.h, set.t, set.l, set.r, set.p);
        } else return this.new(name, url = set.url);
    },

    bind: function(window) {
        bindCommonHandles(window);
    },

    messageReceiver: function(e) {
        let handler = this.handler;
        console.log(e.data);
        let data = e.data;
        if (data != null) {
            switch (data["op"]) {
                case "init":
                    if (handler[e.name] == null) return;
                    let handle = handler[e.name];
                    handle["document"] = data["document"];
                    handle["body"] = data["body"];

                    break;
            }
        }
    },

    eoo
}
let popupHandler = popupMaster.handler;


var let = {
    it: function(thing) {
        this[thing] = eval(thing);
    }
}

function bindCommonHandles(window) {
    // window[""] = ;
    // window[""] = ;
    // window[""] = ;
    // window[""] = ;
}


//reset pick progress
function initializeStep() {
    gameId = Date.now();
    step = -1;
    if (stepHistory.length > 0 || playerInfoMaster.playerAccInfo.red != null || playerInfoMaster.playerAccInfo.blue != null) {
        //stepHistoryPrev = stepHistory;
        settingsMaster.putGlobalString(settingsMaster.TOTAL_STATE_PREVIOUS, settingsMaster.getGlobalString(settingsMaster.TOTAL_STATE_LATEST));
    }
    stepHistory = [];
    // redNamePrev = redName;
    // blueNamePrev = blueName;
    redName = "";
    blueName = "";
    latestStep = -2;
    latestStepSide = null;

    //initialize step sequence indicator & sequence title
    sequenceMaster.releaseStepStateDisplay();

    //initialize pick pool(cost table)
    poolMaster.initPickState();

    //initialize each side player infos
    sideMaster.initSideInfo();

    //initialize each side cost count
    sideMaster.resetCostUsed();
    sideMaster.initCostRemains();
    sideMaster.initCostUsedCount();

    //initialize each side entries
    sideMaster.initEntries();
    sideMaster.resetEntryPicked();

    //initialize each side ban picks
    sideMaster.resetBanEntries();

    //initialize each side cardy ban picks
    //sequenceMaster.calcCardyPreBans(true);
    sideMaster.initCardyBanEntries();

    //initialize each side weapon ban picks
    sideMaster.initBanWeapons();

    //initialize player info selection eneries
    playerInfoMaster.resetPicks();

    //initialize versus sequence showing
    sequenceMaster.closeVersusSequenceShowing();

    //initialize versus record board
    sideMaster.initVersusRecordBoard();

    controllerMaster.triggerCount = 0;

    timerMaster.initTimer();

    versionDisplayShowFor(false);

    playSound("풛");
}

function restoreStoredState(stored) {
    if (stored == null || stored == "") return;

    if ($(document.body).attr("data-shift") != "1") {
        initializeStep();
    }
    
    gameId = stored.gameId;

    // settingsMaster.putGlobalString(settingsMaster.TOTAL_STATE_PREVIOUS, stored.previous); //exceed storage

    if (stored.league != null && !isNaN(stored.league)) rulesMaster.ruleAlter.val(stored.league).change();//rulesMaster.releaseRuleAlterBy(stored.league);

    let red = stored.redInfo;
    let blue = stored.blueInfo;

    if ($(document.body).attr("data-shift") != "1") {
        if (red.code != null) sideMaster.applyAccountInfo(red.code, "red");
        if (blue.code != null) sideMaster.applyAccountInfo(blue.code, "blue");
    }

    let redInfo = red.playerInfo;
    let blueInfo = blue.playerInfo;

    let pim = playerInfoMaster;
    
    pim.redInfoCode.val(redInfo.code);
    pim.blueInfoCode.val(blueInfo.code);

    pim.playerAccInfo.red = redInfo.data;
    pim.playerAccInfo.blue = blueInfo.data;

    let his = stored.stepHis;
    sequenceMaster.startPick();
    var s = 0;
    let picker = function() {
        if (s < his.length) {
            let stp = his[s];
            if (stp != null) {
                if (stp.picked == null) controllerMaster.mainButton();
                else {
                    let id = stp.picked.id;
                    let item = poolMaster.eachCharacters.filter('[data-id="' + id + '"]');
                    sequenceMaster.onPick(id, $(item[0]));
                }
                s++;
                setTimeout(picker, 100);
            }
        } else {
            //side constell 복원
            let rsec = sideMaster.redEntries.find(sideMaster.entry_constell);
            for (var i=0; i<red.constells; i++) $(rsec[i]).val(red.constells[i]).change();
            let bsec = sideMaster.blueEntries.find(sideMaster.entry_constell);
            for (var i=0; i<blue.constells; i++) $(bsec[i]).val(blue.constells[i]).change();
            //playerinfo constell/weapon/refine 복원
            let sides = { "red": redInfo, "blue": blueInfo };
            for (var side in sides) {
                let info = sides[side];
                let cons = pim.charConstells[side];
                for (var i=0; i<info.constells; i++) $(cons[i]).val(info.constells[i]).change();
                let weps = pim.weaponNames[side];
                for (var i=0; i<info.weapons; i++) $(weps[i]).val(info.weapons[i]).change();
                let refs = pim.weaponRefines[side];
                for (var i=0; i<info.refines; i++) $(refs[i]).val(info.refines[i]).change();
                //add options 복원
                let adds = info.adds;
                var rec;
                var ir;
                switch (side) {
                    case "red":
                        pim.redAddPerConstell.val(adds.apc).change();
                        pim.redAddByHadWeapon.val(adds.ahw).change();
                        pim.redAddPerRefine.val(adds.apr).change();
                        pim.redAddDisadvRatio.val(adds.adr).change();
                        pim.redAddMasterAdjust.val(adds.ama).change();

                        rec = red.record;
                        ir = sideMaster.redInputRemains;
                        break;

                    case "blue":
                        pim.blueAddPerConstell.val(adds.apc).change();
                        pim.blueAddByHadWeapon.val(adds.ahw).change();
                        pim.blueAddPerRefine.val(adds.apr).change();
                        pim.blueAddDisadvRatio.val(adds.adr).change();
                        pim.blueAddMasterAdjust.val(adds.ama).change();

                        rec = blue.record;
                        ir = sideMaster.blueInputRemains;            
                        break;
                }
                //versusboard(Time remains/TKO) 복원
                for (var i=0; i<3; i++) {
                    let j = i + 1;
                    if (rec[i].tr > 0) {
                        if (rec[i].min != null && rec[i].min != "") ir.filter(".stage" + j + ".min").val(rec[i].min).change();
                        if (rec[i].sec != null && rec[i].sec != "") ir.filter(".stage" + j + ".sec").val(rec[i].sec).change();
                    } else {
                        sideMaster.releaseVersusRecordByTkoButton(side, "" + j, rec[i].tr);
                    }
                }
            }
            //last step 상태(versus 전/후 여부) 복원
        }
    };
    setTimeout(picker, 100);
}

function undoStep() {
    let latestStored = settingsMaster.getGlobalString(settingsMaster.TOTAL_STATE_LATEST);
    let previousStored = settingsMaster.getGlobalString(settingsMaster.TOTAL_STATE_PREVIOUS);

    if (step == -1 && (latestStored != null || previousStored != null)) {
        //recover previous step sequence
        // stepHistory = stepHistoryPrev;
        // step = stepHistory.length;
        // redName = redNamePrev;
        // blueName = blueNamePrev;
        // sideMaster.setNameplate(redName, blueName);
        // sideMaster.updateCostUsed();
        // sequenceMaster.checkUpdateCurrentStepComplition()
        // sequenceMaster.releaseStepStateDisplay();

        let latest = JSON.parse(latestStored);
        let prev = JSON.parse(previousStored);
        if (latest.gameId != gameId) restoreStoredState(latest);
        else restoreStoredState(prev);
        playSound("롿");
    } else if (step > rules.sequence.length) {
        sequenceMaster.undoFinishPick();
        playSound("닫");
    } else {
        //basic undo step sequence
        sequenceMaster.undoPick();
        playSound("뿹");
    }
}

function getCurrentSide() {
    if (step > -1 && step < rules.sequence.length) return rules.sequence[step].side;
    else return null;
}

var latestStep = -2;
var latestStepSide = null;

function checkOnChangedSide() {
    let cur = getCurrentSide();

    if (cur != latestStepSide) onChangedSide(cur);
}

function onChangedSide(cur) {
    poolMaster.onChangedSide(cur);
    $(document.body).attr("data-step-side", cur);
    latestStepSide = cur;
}

function onChangedStep() {
    timerMaster.onChangedStep();
    if (step < 0 || step >= rules.sequence.length) poolMaster.stopRollRandomCursor();
    else {
        let seq = rules.sequence[step];
        $(document.body).attr("data-step-pick", seq.pick);
        $(document.body).attr("data-step-pick-type", seq.pick.indexOf("ban") > -1 ? "ban" : "entry");
        if (seq.pick == "preban") {
            let info = playerInfoMaster.playerAccInfo[seq.side];
            if (info != null) {
                let entries = info.prebanned;
                if (entries != null) {
                    let res = sequenceMaster.getCheckRes();
                    if (res.rem == seq.amount) {
                        let delay = seq.side == "red" ? 0 : 500;
                        for (i in entries) if (i < seq.amount) {
                            let id = entries[i];
                            let item = poolMaster.eachCharacters.filter('[data-id="' + id + '"]');
                            setTimeout(() => { sequenceMaster.onPick(id, item); }, delay + (i * 200));
                        }
                    }
                }
            }
        }
    }
}

function hideCursorWholeScreen() {
    let body = $(document.body);
    body.addClass("hideCursor");
    body.on("mousemove", function(e) {
        showCursorWholeScreen();
    });
}

function showCursorWholeScreen() {
    let body = $(document.body);
    body.removeClass("hideCursor");
    body.off("mousemove");
}


function eventKeydown(e) {
    var isProcessed = false;
    var tagName = e.target.tagName;

    switch(e.keyCode) {
        case 90://z
            if (e.ctrlKey) {//Ctrl+Z
                if (tagName != "INPUT" && tagName != "TEXTAREA") {
                    undoStep();
                    isProcessed = true;
                }
            }
            break;
    }

    if (isProcessed) {
        e.preventDefault();
        return false;
    }
}


function toggleDarkmode() {
    let body = $(document.body);
    let dark = "dark";
    if (body.hasClass(dark)) {
        body.removeClass(dark);
        //$.cookie("dark_mode", "false", { expires: 36525 });
        settingsMaster.putBoolean(settingsMaster.DARK_MODE, false);
    } else {
        body.addClass(dark);
        //$.cookie("dark_mode", "true", { expires: 36525 });
        settingsMaster.putBoolean(settingsMaster.DARK_MODE, true);
    }
}

function setDarkmode(enable = true) {
    let body = $(document.body);
    let dark = "dark";
    let has = body.hasClass(dark);
    if (enable && !has) {
        body.addClass(dark);
    } else if (!enable && has) {
        body.removeClass(dark);
    }
}

function setDarkModeBySystem() {
    setDarkmode(window.matchMedia("(prefers-color-scheme: dark)").matches);
}

function toggleTp(e) {
    switch(e.which) {
        case 3:
            e.preventDefault();
            e.stopPropagation();
            let self = $(this);
            self.attr("data-hide", self.attr("data-hide") == "1" ? null : "1")
            return false;
    }
}


//sound control
let sounds = commonInfo.path.sounds;
let soundsMaster = {

    res_sounds: "div#res_sounds",

    common_control_panel: "div.common_control_panel",
    sound_controls: "input#sound_controls",
    volume_value: "span#volume_value",
    sound_volume: "input#sound_volume",
    clip_id: "input#clip_id",
    popup_closer: "div.popup_closer",
    
    sound_panel: "ul#sound_panel",


    soundResourceHolder: null,

    commonControlPanel: null,
    soundControlsToggle: null,
    volumeValueIndicator: null,
    volumeControlSlider: null,
    clipForId: null,
    soundPanelCloser: null,

    soundPanel: null,


    volumeDefault: 60,


    init: function() {

        this.soundResourceHolder = $(this.res_sounds);

        this.commonControlPanel = this.soundResourceHolder.find(this.common_control_panel);
        this.soundControlsToggle = this.commonControlPanel.find(this.sound_controls);
        this.volumeValueIndicator = this.commonControlPanel.find(this.volume_value);
        this.volumeControlSlider = this.commonControlPanel.find(this.sound_volume);
        this.clipForId = this.commonControlPanel.find(this.clip_id);
        this.soundPanelCloser = this.commonControlPanel.find(this.popup_closer);

        this.soundPanel = this.soundResourceHolder.find(this.sound_panel);


        this.initSoundPanel();
    
        this.soundControlsToggle.change(this.onToggleSoundControls);

        this.volumeValueIndicator.click(function(e) {
            soundsMaster.muteSound();
        });
        this.volumeValueIndicator.contextmenu(function(e) {
            e.preventDefault();
            soundsMaster.setDefaultVolume();
            return false;
        });

        //let seVolumeSet = $.cookie("se_volume");
        let seVolumeSet = settingsMaster.getInt(settingsMaster.SE_VOLUME);
        if (seVolumeSet != null && !isNaN(seVolumeSet)) {
            let seVolume = parseInt(seVolumeSet);
            if (seVolume > -1 && seVolume < 101) this.volumeControlSlider.val(seVolume);
        }

        this.releaseVolume();
        this.volumeControlSlider.on("input change", function (e) {
            soundsMaster.releaseVolume();
        });
    
        this.soundPanelCloser.click(function(e) {
            soundsMaster.hideSoundPanel();
        });
    },

    initSoundPanel: function() {
        this.soundPanel.empty();
        sounds.ids.forEach(id => {
            if (id == eoa) return;
            let item = document.createElement("li");
            item.setAttribute("data-id", id);
            let button = document.createElement("button");
            button.innerText = id;
            item.append(button);
            let audio = document.createElement("audio");
            audio.setAttribute("src", getPathA(id));
            audio.setAttribute("preload", "auto");
            audio.setAttribute("autoplay", "");
            //audio.setAttribute("controls", "");
            audio.volume = 0;
            audio.innerText = "?";
            item.append(audio);
            soundsMaster.soundPanel.append(item);
            let btn = $(button);
            btn.click(soundsMaster.onClickSoundButton);
            btn.contextmenu(soundsMaster.onRightClickSoundButton);
        });
    },

    showSoundPanel: function() {
        soundsMaster.soundResourceHolder.show(300);
    },

    hideSoundPanel: function() {
        soundsMaster.soundResourceHolder.hide(200);
    },

    onToggleSoundControls: function(e) {
        let self = $(this);
        soundsMaster.soundPanel.find("audio").each(function (i, item) {
            item.controls = self.is(":checked");
        });
    },

    setDefaultVolume: function() {
        this.volumeControlSlider.val(this.volumeDefault);
        this.releaseVolume();
    },
    
    muteSound: function() {
        this.volumeControlSlider.val(0);
        this.releaseVolume();
    },

    releaseVolume: function(value = this.volumeControlSlider.val()) {
        //$.cookie("se_volume", value, { expires: 36525 });
        settingsMaster.putInt(settingsMaster.SE_VOLUME, value);
        this.volumeValueIndicator.text(value);
    },

    findAudioBy: function(id) {
        return this.soundPanel.find('li[data-id="' + id + '"] audio');
    },

    onClickSoundButton: function(e) {
        let self = $(this);
        let item = self.parent();
        let audio = item.find("audio");
        if (audio.length > 0) playAudio(audio[0]);
    },

    onRightClickSoundButton: function(e) {
        e.preventDefault();

        soundsMaster.copyToClipboard($(this).parent().attr("data-id"));

        return false;
    },

    copyToClipboard(text) {
        if (!navigator.clipboard) {
            this.clipForId.val(text);
            this.clipForId.select();
            document.execCommand("copy");
        } else {
            navigator.clipboard.writeText(text)
                .then(() => {
                    console.log("Text copied to clipboard...")
                })
                .catch(err => {
                    console.log('Something went wrong', err);
                });
        }
    }
}

function playSound(id, delay, volume) {
    if (delay != null && !isNaN(delay)) {
        setTimeout(function () { playSound(id) }, delay);
    } else {
        let audio = soundsMaster.findAudioBy(id);
        if (audio.length > 0) {
            if (volume != null && !isNaN(volume)) {
                playAudio(audio[0], volume);
            } else {
                playAudio(audio[0]);
            }
        }
    }
}

function playSoundV(id, volume, delay = null) {
    playSound(id, delay, volume);
}

function playAudio(a, volume = soundsMaster.volumeControlSlider.val()) {
    if (a == null) return;
    a.pause();
    a.currentTime = 0;
    if (volume == 0) return;
    a.volume = parseInt(volume) / 100.0;
    a.play();
}

function releaseVersionDisplay() {
    let vi = $("div#version_info span");
    let vd = $("div#version_display");
    let vr = vi.attr("title");
    let vrs = vr.split(".");
    vd.find("div.version_number").text(vi.text());
    vd.find("span.release").text(vrs[0] + ".");
    vd.find("span.release_date").text(vrs[1] + "." + vrs[2]);
}

function versionDisplayShowFor(full = true) {
    let vd = $("div#version_display");
    vd.attr("data-full", full === true ? "1" : (isNaN(full) || full == false ? "" : full));
}


let settingsMaster = {

    prefix: "settings_",

    TOTAL_STATE_LATEST: "total_state_latest",
    TOTAL_STATE_PREVIOUS: "total_state_previous",

    GLOBAL_BANNED: "global_banned",
    PREVIOUS_GLOBAL_BANNED: "previous_global_banned",

    SE_VOLUME: "sevolume",
    DARK_MODE: "darkmode",
    DROP_SNOW: "dropsnow",

    putBoolean: function(key, bool) {
        if (key == null || key == "") return;
        localStorage.setItem(this.prefix + key, bool);
    },

    getBoolean: function(key, def) {
        if (key == null || key == "") return undefined;
        let bool = localStorage.getItem(this.prefix + key);

        if (bool == "true") return true;
        else if (bool == "false") return false;
        else if (bool == "null") return null;
        else return def;
    },

    putInt: function(key, integer = null) {
        if (key == null || key == "") return;
        localStorage.setItem(this.prefix + key, integer);
    },

    getInt: function(key, def) {
        if (key == null || key == "") return undefined;
        let integer = localStorage.getItem(this.prefix + key);

        if (integer == null || integer == "null") return def;
        else return parseInt(integer);
    },

    putFloat: function(key, float = null) {
        if (key == null || key == "") return;
        localStorage.setItem(this.prefix + key, float);
    },

    getFloat: function(key, def) {
        if (key == null || key == "") return undefined;
        let float = localStorage.getItem(this.prefix + key);

        if (float == null || float == "null") return def;
        else return parseFloat(float);
    },

    putString: function(key, str) {
        if (key == null || key == "") return;
        localStorage.setItem(this.prefix + key, str);
    },

    getString: function(key, def = null) {
        if (key == null || key == "") return undefined;
        let str = localStorage.getItem(this.prefix + key);

        if (str == null) return def;
        else return str;
    },

    putGlobalString: function(key, str) {
        if (key == null || key == "") return;
        localStorage.setItem(key, str);
    },

    getGlobalString: function(key, def = null) {
        if (key == null || key == "") return undefined;
        let str = localStorage.getItem(key);

        if (str == null) return def;
        else return str;
    },
}

function dropSnow(much = 500) {
    settingsMaster.putBoolean(settingsMaster.DROP_SNOW, true);
    let field = $("#snow_field");

    for (var i=0; i<much; i++) {
        let xpos = Math.random() * 100;

        let scalz = Math.random();

        let opac = (Math.random() * 0.7) + 0.2;

        let blur = (Math.random() * 2.5) + 2;

        let sh1 = parseInt((Math.random() * 15) - 7.5);
        let sh2 = parseInt((Math.random() * 15) - 7.5);

        let sc1 = parseInt(Math.random() * 30) + 30;
        let sc2 = parseInt(Math.random() * (100 - sc1 - 30)) + sc1 + 30;

        let sv1 = (Math.random() * 0.4) + 0.30;
        let sv2 = (Math.random() * (1.0 - sv1 - 0.30)) + sv1 + 0.30;

        let s1c = sc1;
        let s1h = sh1;
        let s1v = sv1;

        let s2c = sc2;
        let s2h = sh2;
        let s2v = sv2;

        let durat = Math.floor(Math.random() * 20) + 10;

        let delay = Math.floor(Math.random() * 30) * -1;

        let dir = Math.floor(Math.random() * 2) == 1 ? 1 : -1;
        let dirv = Math.floor(Math.random() * 2) == 1 ? 1 : -1;

        let snow = document.createElement("div");
        snow.setAttribute("class", "snow");
        snow.setAttribute("style", "translate: " + xpos + "vw -10px; scale: " + scalz + "; opacity: " + opac + "; filter: blur(" + blur + "px); animation: snowfall" + i + " " + durat + "s " + delay + "s cubic-bezier(0.45, 0, 0.55, 1) infinite; --dir: " + dir + "; " + "--dirv: " + dirv + "; ");
        field.append("<style> @keyframes snowfall" + i + " { from { translate: " + xpos + "vw -60px; } " + s1c + "% { translate: " + (xpos + s1h) + "vw calc(" + (100 * s1v) + "vh - 10px); } " + s2c + "% { translate: " + (xpos + s2h) + "vw calc(" + (100 * s2v) + "vh - 10px); } to { translate: " + xpos + "vw calc(100vh + 10px); } } </style>")
        field.append(snow);
    }
}

function clearSnow() {
    settingsMaster.putBoolean(settingsMaster.DROP_SNOW, false);
    let field = $("#snow_field");

    field.empty();
}

function toggleSnow() {
    let field = $("#snow_field");

    let childes = field.find(">*");

    if (childes.length > 0) clearSnow();
    else dropSnow();
}

//onload
$(document).ready(function() {

    let.it("established");
    let.it("eoa");
    let.it("eoo");
    let.it("tpGif");

    let.it("sequenceMaster");
    let.it("poolMaster");
    let.it("sideMaster");
    let.it("searchMaster");
    let.it("rulesMaster");
    let.it("localeMaster");
    let.it("controllerMaster");
    let.it("timerMaster");
    let.it("popupMaster");
    let.it("popupHandler");
    let.it("sounds");
    let.it("soundsMaster");


    $(document).keydown(function(e) {
        switch(e.keyCode) {
            case 16:
                onShift = true;
                break;

            case 17:
                onCtrl = true;
                break;

            case 18:
                onAlt = true;
                break;
        }
    })
    $(document).keyup(function(e) {
        switch(e.keyCode) {
            case 16:
                onShift = false;
                break;

            case 17:
                onCtrl = false;
                break;

            case 18:
                onAlt = false;
                break;
        }
    })


    //initializing//
    //Initialize section objects & Generate variable things//

    gameId = Date.now();

    //version display
    releaseVersionDisplay();

    //screen
    screenMaster.init();

    //rules & rule alters
    rulesMaster.init();

    //locale & language
    localeMaster.init();

    //character pool - cost table
    poolMaster.init();

    //each side player board & ban pick board
    sideMaster.init();

    //global ban manager panel
    globalBanMaster.init();

    //player info operation control panel
    playerInfoMaster.init();

    //search
    searchMaster.init();

    //pick sequence
    sequenceMaster.init();

    //main controls
    controllerMaster.init();

    //timer
    timerMaster.init();

    //popup windows
    popupMaster.init();

    //global event
    $(document).keydown(eventKeydown);
    $(document.body).on("keydown keyup", function(e) {
        let self = $(this);
        let ctrlPrev = self.attr("data-ctrl");
        let ctrlCurr = e.ctrlKey ? "1" : "";
        if (ctrlCurr != ctrlPrev) self.attr("data-ctrl", ctrlCurr);
        let altPrev = self.attr("data-alt");
        let altCurr = e.altKey ? "1" : "";
        if (altCurr != altPrev) self.attr("data-alt", altCurr);
        let shiftPrev = self.attr("data-shift");
        let shiftCurr = e.shiftKey ? "1" : "";
        if (shiftCurr != shiftPrev) self.attr("data-shift", shiftCurr);
    });

    //extra event
    let unabailables = $("#unavailables");
    unabailables.mousedown(toggleTp);
    unabailables.contextmenu(function(e) { e.preventDefault(); return false; });


    //settings apply
    // let darkModeState = $.cookie("dark_mode");
    let darkModeState = settingsMaster.getBoolean(settingsMaster.DARK_MODE);
    if (darkModeState != null && darkModeState) toggleDarkmode();
    else if (darkModeState != false) setDarkModeBySystem();



    //step init
    //initializeStep();
    
    
    //preloads
    soundsMaster.init();
    

    //end of loading all images
    Promise.all(Array.from(document.images).map(img => {
        if (img.complete)
            return Promise.resolve(img.naturalHeight !== 0);
        return new Promise(resolve => {
            img.addEventListener('load', () => resolve(true));
            img.addEventListener('error', () => resolve(false));
        });
    })).then(results => {
        if (results.every(res => res))
            console.log('all images loaded successfully');
        else
            console.log('some images failed to load, all finished loading');

        if (settingsMaster.getBoolean(settingsMaster.DROP_SNOW, false)) dropSnow();

        setTimeout(function() {
            $("div#loading_cover").css("opacity", 0);
            setTimeout(function() {
                $("div#loading_cover").hide();
                sequenceMaster.setSequenceTitle(lang.text.titleReady);
                //상단 정보 입력 대신 플레이어 정보 입력을 쓰면서 방해됨
                //setTimeout(function() { sideMaster.redNameplateInput.focus(); }, 1000);

                //for cardy cup implement works
                // sideMaster.applyAccountInfo("@GCBPSv2:e3BsYXllcjp7bmFtZToiJXVDNTQ0JXVCNTE0Iix1aWQ6IjgyMTMxNDEzOSIsdHJldmVsZXI6IjEifSxsaXN0Ols2LDYsNSw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsMywzLDMsMywwLDAsNiwwLDYsMCwwLG4sMCwxLDYsNiwwLDIsMCw2LDAsMCw2LDMsMCw2LDYsMCw2LDAsNiwwLDIsNiw2LDYsMyw2LDYsbiwwLDIsNiw2LDAsNiwwLDIsMSwwLDAsNiw2LDEsNixuLDEsNiw2LDYsMCw2LDAsbixuLG4sbixuLG5dfQ==;", "red");
                // sideMaster.applyAccountInfo("@GCBPSv2:e3BsYXllcjp7bmFtZToiJXVDNTQ0JXVCNTE0Iix1aWQ6IjgyMTMxNDEzOSIsdHJldmVsZXI6IjEifSxsaXN0Ols2LDYsNSw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsbiwzLDMsMywwLG4sNiwwLDYsMCwwLG4sMCwxLDYsNixuLDIsMCw2LDAsMCw2LDMsMCw2LDYsbiw2LDAsNiwwLDIsNiw2LDYsMyw2LDYsbiwwLDIsNiw2LG4sNiwwLDIsMSwwLDAsNiw2LDEsNixuLDEsNiw2LDYsMCw2LDAsbixuLG4sbixuLG5dfQ==;", "red");
                //sideMaster.applyAccountInfo("@GCBPSv2:e3BsYXllcjp7bmFtZToiJXVDNTQ0JXVCNTE0Iix1aWQ6IjgyMTMxNDEzOSIsdHJldmVsZXI6IjEifSxsaXN0Ols2LDYsNSw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsbiwzLDMsMywwLG4sNiwwLDYsMCwwLG4sMCwxLDYsNixuLDIsMCw2LDAsMCw2LDMsMCw2LDYsbiw2LDAsNiwwLDIsNiw2LDYsMyw2LDYsbiwwLG4sNiw2LG4sNiwwLDIsMSwwLDAsNiw2LDEsNixuLDEsNixuLDYsMCw2LDAsbixuLG4sbixuLG5dfQ==;", "red");
                // sideMaster.applyAccountInfo("@GCBPSv2:e3BsYXllcjp7bmFtZToiJXVDNUQwJXVDMkE0JXVEMTMwMXoiLHVpZDoiODA2MDkzNzAyIix0cmV2ZWxlcjoiMCJ9LGxpc3Q6WzYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDIsNiw2LDMsNiw2LDIsMiwyLDYsNiw2LDEsNCw2LDYsMywwLDYsMyw0LDYsNiw0LDYsMiw0LDQsNiw2LDYsNiw1LDYsNiwyLDIsMywyLDYsMSwyLDAsMiw0LDIsMCwxLDYsMSwxLDAsMCw0LDAsMSwwLDYsMSwwLDAsMSwwLDAsMCwxLDAsMF19;", "blue");
                //sideMaster.applyAccountInfo("@GCBPSv2:e3BsYXllcjp7bmFtZToiJXVDNUQwJXVDMkE0JXVEMTMwMXoiLHVpZDoiODA2MDkzNzAyIix0cmV2ZWxlcjoiMCJ9LHNlbGZiYW5uZWQ6WyJ0YXJ0YWdsaWEiLCJodXRhbyIsImFsaGFpdGhhbSIsImx5bmV5IiwibmV1dmlsbGV0dGUiXSxsaXN0Ols2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiwyLDYsNiwzLDYsNiwyLDIsMiw2LDYsNiwxLDQsNiw2LDMsMCw2LDMsNCw2LDYsNCw2LDIsNCw0LDYsNiw2LDYsNSw2LDYsMiwyLDMsMiw2LDEsMiwwLDIsNCwyLDAsMiw2LDEsMSwwLDAsNCwwLDEsMCw2LDEsMCwwLDEsMCwwLDAsMiwwLDAsMCw0LDBdfQ==;", "blue");
                //sideMaster.applyAccountInfo("@GCBPSv2:e3BsYXllcjp7bmFtZToiJXVDNjI0JXVENjFDJXVDNkQwIix1aWQ6IiIsdHJldmVsZXI6IjEifSxsaXN0Ols2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDZdfQ==;", "blue");
            }, 2500);
        }, 100);
    });

});

