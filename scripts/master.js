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

//end of array alias
let eoa = "reserved";
//end of object alias
let eoo = "reserved";


//current locale selected
var loca = null;
var lang = null;

//state variables
var step = -1;
var stepLast = 0;
var stepHistory = [];
var stepHistoryPrev = null;
var redName = "";
var blueName = "";
var redNamePrev = null;
var blueNamePrev = null;

function buildStepHistory(seqReference, id = null, extra = buildStepHistoryExtra()) {
    return {
        stepReference: seqReference,
        picked: id == null ? null : (seqReference.pick.indexOf("weapon") > -1 ? weaponsInfo.list.find(item => item.id == id) : charactersInfo.list[charactersInfo[id]]),
        c_constellations: extra.c_constellations,
        additionalCost: extra.addCost,
        isPassed: function() { return this.picked == null }
    };
}

function buildStepHistoryExtra(contell = 0, add = 0) {
    return { c_constellations: contell, addCost: add };
}

//common static values
let tpGif = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

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

    side: "data-side",
    target: "data-target",
    pick: "data-pick",
    amount: "data-amount",
    current: "data-current",

    sequence_milestone: "div#sequence_milestone",
    sequence_steps: "ul#sequence_steps",
    sequence_item: "li.sequence_item",


    sequence_title: "div#sequence_title",


    main_action: "button#main_action",


    sequenceMilestone: null,
    stepHolder: null,

    sequenceTitleHolder: null,
    sequenceTitle: null,


    mainButton: null,


    rollingRandomPicks: null,

    init: function() {
        console.log("init sequenceMaster");

        //set element
        this.sequenceMilestone = $(this.sequence_milestone);
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

        item.setAttribute("class", "sequence_item");
        item.setAttribute(this.side, info.side == "red" ? "R" : "B");
        item.setAttribute(this.target, info.pick.indexOf("weapon") > -1 ? "W" : "C");
        item.setAttribute(this.pick, info.pick.indexOf("ban") > -1 ? "B" : (info.pick.indexOf("entry") > -1 ? "E" : "P"));
        item.setAttribute(this.amount, info.amount);
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
        let seq = rules.sequence[newStep];

        var message = "";

        if (newStep < 0) {
             message = text.titleReady;
        } else if (newStep == rules.sequence.length) {
            message = text.titlePicked;
        } else if (newStep > rules.sequence.length) {
            message = text.titleVersus;
        } else {
            let eClass = seq.side == "red" ? "textRed" : "textBlue";
            let tSide = seq.side == "red" ? redName : blueName;
            var tType = "?";
            switch (seq.pick) {
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
                case "ban":
                case "entry":
                case "proffer":
                    tAmount = text.amountPickCharacter.replace("#AMOUNT", seq.amount)
                    break;
                case "ban weapon":
                    tAmount = text.amountPick.replace("#AMOUNT", seq.amount)
                    break;
            }
            message = text.stepTitle.replace("#CLASS", eClass).replace("#SIDE", tSide).replace("#TYPE", tType).replace("#AMOUNT", tAmount);
        }

        this.setSequenceTitleHtml(message);
    },

    releaseStepStateDisplay: function() {
        this.releaseActionStateByStep();
        this.updateSequenceIndicators(step);
        this.setSequenceTitleByCurrent(step);
        sideMaster.updatePickCursor(step);
        if (step >= rules.sequence.length && searchMaster.searchInput.is(":focus")) searchMaster.searchInput.blur();
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
        } else {
            rulesMaster.releaseAlterSelector();
            localeMaster.releaseLanguageSelector();
            controllerMaster.hideRandomButton();
        }
        this.releaseMainButton(step);
        onChangedStep();
    },

    startPick: function() {
        step = 0;

        redName = sideMaster.redNameplateInput.val();
        blueName = sideMaster.blueNameplateInput.val();

        //구현
        playSound("힇");

        this.releaseStepStateDisplay();
    },
    
    onPick: function(id, item) {
        if (item != null && item.attr(poolMaster.picked) != "") return;
        if (step < 0) {
            this.setSequenceTitle(lang.text.readyForStart, 3000);
            return;
        } else if (step == rules.sequence.length) {
            this.setSequenceTitle(lang.text.readyForVersus, 3000);
            return;
        }
        let seq = rules.sequence[step];

        let isCharacterPick = seq.pick.indexOf("weapon") < 0;
        let isProfferPick = seq.pick == "proffer";
        let counterSide = seq.side == "red" ? "blue" : "red";

        if (isCharacterPick) {//캐릭터 픽
            //if (item.weapon == null) return;
            if (id.indexOf("_") > -1) return;
            if (id == "treveler" && item.attr(poolMaster.treveler) == "1") id += "M";
        } else {//무기 픽
            //if (item.serise == null) return;
            if (id.indexOf("_") < 0) return;
        }

        playSound("픽", 0);

        var extra = buildStepHistoryExtra();

        //구현 - 현재 step에 따른 entry pick / ban pick 구분 처리
        var pickNote;
        switch(seq.pick) {
            case "ban":
                sideMaster.onPickedBan(id);
                pickNote = lang.text.pickedBan;
                break;

            case "entry":
            case "proffer":
                extra = sideMaster.onPickedEntry(id, isProfferPick ? counterSide : seq.side);
                pickNote = lang.text.pickedEntry;
                break;

            case "ban weapon":
                sideMaster.onPickedBanWeapon(id);
                break;

        }
        

        //update pick pool
        if (isCharacterPick) {
            item.attr(poolMaster.pick_side, isProfferPick ? counterSide : seq.side);
            item.attr(poolMaster.pick_type, seq.pick);
            item.attr(poolMaster.pick_note, pickNote);
            item.attr(poolMaster.picked, "1");
            setTimeout(function() {
                item.attr(poolMaster.picked, "2");
            }, 600);
        }
        
        //add step history
        stepHistory.push(buildStepHistory(seq, id, extra));

        //코스트 표시 업데이트
        if (isCharacterPick) sideMaster.updateCostUsed();

        //update pincking sequence
        this.checkUpdateCurrentStepComplition()
        this.releaseStepStateDisplay();
    },

    passPick: function() {
        stepHistory.push(buildStepHistory(rules.sequence[step]))
        step++;
        this.releaseStepStateDisplay();
    },

    undoPick: function() {
        let seq = rules.sequence[step];
        let last = stepHistory.pop();

        if (last == null) {
            step--;
            this.releaseStepStateDisplay();
            return;
        }

        //process roll back
        if (last.isPassed()) {
            step--;
        } else {
            let picked = last.picked;
            let ref = last.stepReference;
            let prev = stepHistory[stepHistory.length-1];
            let isCharacterPick = ref.pick.indexOf("weapon") < 0;

            if (ref != seq) step--;


            //변경사항 출력 되돌리기 구현

            //픽/밴 엔트리 캐릭터 검색 복원 구현
            switch (ref.pick) {
                case "ban":
                    sideMaster.onUndoPickBan(picked.id);
                    break;

                case "entry":
                case "proffer":
                    sideMaster.onUndoPickEntry(picked.id);
                    break;
                    
                case "ban weapon":
                    sideMaster.onUndoPickBanWeapon(picked.id);
                    break;
            }

            //코스트 테이블 캐릭터 검색 복원
            if (isCharacterPick) {
                let item = poolMaster.eachCostCharacters.filter('[' + poolMaster.id  + '="' + picked.id + '"]');
                item.attr(poolMaster.pick_side, "");
                item.attr(poolMaster.pick_type, "");
                item.attr(poolMaster.pick_note, null);
                item.attr(poolMaster.picked, "");
            }
        }

        //update cost used
        sideMaster.updateCostUsed();
        
        //update pincking sequence
        this.checkUpdateCurrentStepComplition()
        this.releaseStepStateDisplay();
    },

    finishPick: function() {
        step++;
        this.setSequenceTitle(lang.text.titleVersus);
        this.releaseActionStateByStep();

        //VERSUS 시퀀스 구현
        playSound("훻");

    },

    undoFinishPick: function() {
        step = rules.sequence.length;
        this.setSequenceTitleByCurrent(step);
        this.releaseActionStateByStep();
    },

    checkUpdateCurrentStepComplition: function() {
        if (step < 0 || step >= rules.sequence.length) return;
        let seq = rules.sequence[step];
        let res = this.checkHistoryProcessed();

        var rem;
        switch (seq.side) {
            case "red":
                switch (seq.pick) {
                    case "ban":
                        rem = res.rbx;
                        for (var i in res.rb) {
                            if (res.rb[i].isPassed()) { if (settings.useEmptyPick) rem--; }
                            else rem--;
                        }
                        break;

                    case "entry":
                        rem = res.rpx;
                        for (var i in res.rp) {
                            if (res.rp[i].isPassed()) { if (settings.useEmptyPick) rem--; }
                            else rem--;
                        }
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
                    case "ban":
                        rem = res.bbx;
                        for (var i in res.bb) {
                            if (res.bb[i].isPassed()) { if (settings.useEmptyPick) rem--; }
                            else rem--;
                        }
                        break;

                    case "entry":
                        rem = res.bpx;
                        for (var i in res.bp) {
                            if (res.bp[i].isPassed()) { if (settings.useEmptyPick) rem--; }
                            else rem--;
                        }
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

        if (rem == 0) step++;
    },

    countEachPickAmountTotal: function(res = {
        rbx: 0,
        rpx: 0,
        rbwx: 0,
        bbx: 0,
        bpx: 0,
        bbwx: 0
    }, eor = rules.sequence.length) {
        
        for (var i=0; i < eor; i++) {
            let s = rules.sequence[i];
            let amount = parseInt(s.amount);

            switch (s.side) {
                case "red":
                    switch (s.pick) {
                        case "ban":
                            res.rbx += amount;
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
                        case "ban":
                            res.bbx += amount;
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
            rpx: 0,
            rbwx: 0,
            bbx: 0,
            bpx: 0,
            bbwx: 0,
            rb: [],
            rp: [],
            rbw: [],
            bb: [],
            bp: [],
            bbw: []
        }, Math.min(step + 1, rules.sequence.length));

        for (var i in stepHistory) {
            let cur = stepHistory[i];
            let ref = cur.stepReference;

            switch (ref.side) {
                case "red":
                    switch (ref.pick) {
                        case "ban":
                            res.rb.push(cur);
                            break;

                        case "entry":
                            res.rp.push(cur);
                            break;

                        case "proffer":
                            res.bp.push(cur);
                            break;

                        case "ban weapon":
                            res.rbw.push(cur);
                            break;
                    }
                    break;

                case "blue":
                    switch (ref.pick) {
                        case "ban":
                            res.bb.push(cur);
                            break;

                        case "entry":
                            res.bp.push(cur);
                            break;

                        case "proffer":
                            res.rp.push(cur);
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

        if (seq != null) switch (seq.pick) {
            case "ban":
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

    pick_pool: "div#pick_pool",
    pool_cost_area: "div.pool_cost_area",

    cost5: "#cost5",
    cost4: "#cost4",
    cost3: "#cost3",
    cost2: "#cost2",
    cost1: "#cost1",

    each_cost_pool_area: "div.each_cost_pool_area",
    each_cost_pool: "ul.each_cost_pool",
    character: "li.character",

    id: "data-id",
    treveler: "data-treveler",
    rarity: "data-rarity",
    name: "data-name",
    pick_side: "data-pick-side",
    pick_type: "data-pick-type",
    pick_note: "data-pick-note",
    picked: "data-picked",
    view: "data-view",
    cursor: "data-cursor",

    unallowed_pool: "ul#unallowed_pool",

    title: "data-title",

    pickPool: null,
    poolCostArea: null,
    pool5Area: null,
    pool4Area: null,
    pool3Area: null,
    pool2Area: null,
    pool1Area: null,
    eachPoolCostPoolArea: null,
    cost5Area: null,
    cost4Area: null,
    cost3Area: null,
    cost2Area: null,
    cost1Area: null,
    eachCostPool: null,
    cost5Pool: null,
    cost4Pool: null,
    cost3Pool: null,
    cost2Pool: null,
    cost1Pool: null,
    eachCostCharacters: null,


    underplacer: "div#underplacer",


    unavailables: "div#unavailables",
    
    unallowedPool: null,

    
    table: null,
    pool: null,


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

        this.pickPool = $(this.pick_pool);
        this.poolCostArea = this.pickPool.find(this.pool_cost_area);
        this.pool5Area = this.poolCostArea.filter(this.cost5);
        this.pool4Area = this.poolCostArea.filter(this.cost4);
        this.pool3Area = this.poolCostArea.filter(this.cost3);
        this.pool2Area = this.poolCostArea.filter(this.cost2);
        this.pool1Area = this.poolCostArea.filter(this.cost1);
        this.eachPoolCostPoolArea = this.poolCostArea.find(this.each_cost_pool_area);
        this.cost5Area = this.pool5Area.find(this.each_cost_pool_area);
        this.cost4Area = this.pool4Area.find(this.each_cost_pool_area);
        this.cost3Area = this.pool3Area.find(this.each_cost_pool_area);
        this.cost2Area = this.pool2Area.find(this.each_cost_pool_area);
        this.cost1Area = this.pool1Area.find(this.each_cost_pool_area);
        this.eachCostPool = this.eachPoolCostPoolArea.find(this.each_cost_pool);
        this.cost5Pool = this.cost5Area.find(this.each_cost_pool);
        this.cost4Pool = this.cost4Area.find(this.each_cost_pool);
        this.cost3Pool = this.cost3Area.find(this.each_cost_pool);
        this.cost2Pool = this.cost2Area.find(this.each_cost_pool);
        this.cost1Pool = this.cost1Area.find(this.each_cost_pool);

        this.underplacer = $(this.underplacer);

        this.unavailables = $(this.unavailables);
        this.unallowedPool = this.unavailables.find(this.unallowed_pool);

        this.eachSideBehind.empty();

        this.initSideSelectionArea();

        this.initUnavailables();

        this.initCostTable();

        this.pickPool.contextmenu(this.onRightClickPickPool);
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

    initCostTable: function(table = costTable) {
        this.table = table;

        this.pool = {};
        charactersInfo.list.forEach(c => {
            if (c.id == eoa) return;
            poolMaster.pool[c.id] = false;
        });

        this.eachCostPool.empty();
        this.unallowedPool.empty();

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
            self.unallowedPool.append(self.buildCharacterItem(self.getCharacterInfo(id)));
        });

        //else case to single cost pool
        for (id in this.pool) {
            let self = poolMaster;
            if (self.pool[id]) continue;
            self.pool[id] = true;
            self.cost1Pool.append(self.buildCharacterItem(self.getCharacterInfo(id)));
        };

        this.eachCostCharacters = this.eachCostPool.find(this.character);
        let items = this.eachCostCharacters;
        items.mouseenter(this.onCharacterItemMouseEnter);
        items.mouseleave(this.onCharacterItemMouseLeave);
        items.click(this.onCharacterItemClick);

        this.unavailables.attr(this.title, lang.text.pickUnallowed);
    },

    buildCharacterItem: function(info) {
        let item = document.createElement("li");
        item.setAttribute("class", "character");
        let img = this.buildCharacterIcon(info);
        if (info != null) {
            item.setAttribute(this.id, info.id);
            item.setAttribute(this.rarity, info.rarity);
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
        }
        item.append(img);
        if (info != null && info.id == "treveler") {
            item.setAttribute(this.treveler, "0");
            item.append(this.buildCharacterIcon(charactersInfo.list[charactersInfo.trevelerM]));
        }
        let element = document.createElement("img");
        element.setAttribute("class", "element_icon");
        if (info != null) {
            let charElement = commonInfo.element.res_icon[info.element];
            element.setAttribute("src", charElement == null ? tpGif : getPathR("images", "element_icon", charElement));
        }
        item.prepend(element);
        let nametag = document.createElement("span");
        nametag.setAttribute("class", "name_tag");
        if (info != null) {
            try {
                nametag.innerHTML = info.name[loca];
            } catch (e) {

            }
        }
        item.append(nametag);

        return item;
    },

    buildCharacterIcon: function(info) {
        let img = document.createElement("img")
        img.setAttribute("class", "character_icon");
        if (info != null) {
            img.setAttribute("src", getPathR("images", "character_icon", info.res_icon));
        }
        return img;
    },

    getCharacterInfo: function(id) {
        var info = charactersInfo.list[charactersInfo[id]];
        return info != null ? info : charactersInfo.unknown;
    },

    initPickState: function() {
        let items = this.eachCostCharacters;
        items.attr(this.pick_side, "");
        items.attr(this.pick_type, "");
        items.attr(this.picked, "");
        
        this.toggleTrevelerAlter(0);
    },

    onCharacterItemMouseEnter: function(e) {
        poolMaster.setCursorCharacter(this);
    },

    onCharacterItemMouseLeave: function(e) {
        poolMaster.setCursorOutCharacter(this);
    },

    onCharacterItemClick: function(e) {
        poolMaster.setPickCursorCharacter(this);
    },

    setCursorCharacter: function(item) {
        this.clearCursorOnPool();

        let seq = rules.sequence[step];
        if (seq == null) return;

        let pick = seq.pick
        let side = seq.side;
        item = $(item);
        let picked = item.attr(this.picked);
        let isPicked = picked != null && picked != "";
        let isProfferPick = pick == "proffer";
        let isEntryPick = pick == "entry" || isProfferPick;
        let counterSide = side == "red" ? "blue" : "red";

        playSound(isEntryPick ? "떻" : "뚁");

        item.attr(this.cursor, "1");

        this.displayCharacterName(pick, side, item.attr(this.name));

        if (isEntryPick && !isPicked) this.insertSideSelectionView(item, isProfferPick ? counterSide : side);
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
        poolMaster.removeSideSelectionView(item);
        playSound("휙");
    },

    getCurrentCursor: function() {
        return this.eachCostCharacters.filter('[' + this.cursor + '="1"]');
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
        let items = poolMaster.eachCostCharacters.filter('[' + poolMaster.picked + '=""]:not([' + poolMaster.cursor + '="1"])');

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
                if (pick == "ban") this.leftSideBehind.append(display);
                else this.rightSideBehind.append(display);
                break;

            case "blue":
                if (pick == "ban") this.rightSideBehind.append(display);
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
        let item = this.eachCostCharacters.filter('[' + this.id + '="treveler"]');
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
    account_info: "div.account_info",
    input: "input",

    filled: "data-filled",

    entry_slots_area: "div.entry_slots_area",
    entry_slots: "ul.entry_slots",
    entry: "li.entry",
    entry_icon: "div.entry_icon",
    entry_info: "div.entry_info",

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


    eachPlayerBoard: null,

    eachPlayerUid: null,
    eachPlayerUidInput: null,
    eachNameplate: null,
    eachNameplateInput: null,
    eachAccountPoint: null,
    eachAccountPointInput: null,
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

    eachBanPickBoard: null,
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


    entryPicked: {"red": [], "blue": []},
    banPicked: {"red": [], "blue": []},
    weaponBanPicked: {"red": [], "blue": []},

    sideAccInfo: { "red": null, "blue": null },
    sideAccInfoPrev: { "red": null, "blue": null },

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

        this.eachBanPickBoard = $(this.ban_pick_board);
        this.eachBanSide = this.eachBanPickBoard.find(this.ban_side);
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



        //initialize
        this.initSideInfo();

        this.applyCostAmount();

        this.initCostRemains();
        this.initCostUsedCount();

        this.resetEntryPicked();

        this.initBanEntries();

        this.initBanWeapons();

        
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

        this.eachEntries.find(this.entry_icon).click(this.onClickEntryIcon);
    },

    initDesc: function() {
        let text = lang.text;

        this.eachAccountInfo.attr("title", text.accountInfoIndicatorDesc);
    },

    initSideInfo: function() {
        this.initPlayerUid();
        this.initNameplate();
        this.initAccountPoint();
        this.initAccountInfo();
    },

    initAccountInfo: function() {
        this.setAccountInfo("red");
        this.setAccountInfo("blue");
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
        var data = sideMaster.parsePlayerData(raw);

        if (data != null) {
            sideMaster.loadAccInfo(data, side);
            playSound("뜍");
            return true;
        } else return false;
    },

    parsePlayerData: function(text) {
        if (text == null || text == "") return null;

        text = text.trim();
        try {
            if (text.substr(0, 7) == "@GCBPSv") {
                let texts = text.split(":");
                let header = texts[0];
                let version = header.split("v")[1];
                let base64 = texts[1].split(";")[0];
                text = atob(base64);
            }
    
            let data = JSON.parse(text);
    
            return data;
        } catch(e) {
            console.error(e.name, e.message, e.stack);
        }
        return null;
    },

    loadAccInfo(data, side, reload = false) {
        if (data != null) switch(side) {
            case "red":
                this.setAccountInfo(side, data, reload);

                var point = 0;
                for(var i in data) {
                    if (i == "player") {
                        let p = data.player;
                        if (p.uid != null && p.uid != "") this.redPlayerUidInput.val(p.uid);
                        if (p.name != null && p.name != "") this.redNameplateInput.val(unescape(p.name));
                        if (p.treveler != null && p.treveler != "") {
                            //행자 선택 구현
                        }
                    } else {
                        let cons = data[i];
                        if (cons != null) point += parseInt(cons) + 1;
                    }
                }
                this.redAccountPointInput.val(point);
                break;

            case "blue":
                this.setAccountInfo(side, data, reload);

                var point = 0;
                for(var i in data) {
                    if (i == "player") {
                        let p = data.player;
                        if (p.uid != null && p.uid != "") this.bluePlayerUidInput.val(p.uid);
                        if (p.name != null && p.name != "") this.blueNameplateInput.val(unescape(p.name));
                        if (p.treveler != null && p.treveler != "") {
                            //행자 선택 구현
                        }
                    } else {
                        let cons = data[i];
                        if (cons != null) point += parseInt(cons) + 1;
                    }
                }
                this.blueAccountPointInput.val(point);
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

        let cost = this.getCostByCharacter(id);
        let adds = constell != null ? this.getAdditionalCost(id, parseInt(constell)) : 0;
        this.setEntryContent(slot, this.buildEntryIcon(info), this.buildEntryInfoArea(cost, adds), info);
        slot.attr(this.id, info.id);
        slot.attr(this.rarity, info.rarity);
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

        if (constell != null) return buildStepHistoryExtra(constell, adds);
        else return buildStepHistoryExtra();
    },

    onUndoPickEntry: function(id) {
        for (side in this.entryPicked) {
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
                    break;
                }
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

    buildEntryInfoArea: function(cost, add = 0) {
        //구현
        let info = document.createElement("div");
        info.setAttribute("class", "entry_cost");
        info.setAttribute("title", lang.text.entryCostDesc);
        info.setAttribute(this.step, stepHistory.length);
        let baseCost = document.createElement("span");
        baseCost.setAttribute("class", "base_cost");
        baseCost.innerText = cost;
        info.append(baseCost);
        let addCost = document.createElement("span");
        addCost.setAttribute("class", "additional_cost");
        addCost.innerText = add > 0 ? "+" + add : (add == 0 ? "" : add);
        info.append(addCost);
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

        sideMaster.releaseAdditionalCostByEntryConstell(slot);
    },

    getAdditionalCost(id, constell = 0) {
        let info = charactersInfo.list[charactersInfo[id]];

        let conds = rules.additional_cost.conditions;
        var adds = 0;
        for (var i=0; i < conds.length; i++) {
            let cond = conds[i];
            if (cond.c_class != null) {
                if (info.class != cond.c_class) continue;
            }
            if (cond.c_constellations != null) {
                let cons = cond.c_constellations.split(" ");
                let con =  parseInt(cons[1]);

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
        for (i in costTable.tier1) if (costTable.tier1[i] == id) return 5;
        for (i in costTable.tier2) if (costTable.tier2[i] == id) return 4;
        for (i in costTable.tier3) if (costTable.tier3[i] == id) return 3;
        for (i in costTable.tier4) if (costTable.tier4[i] == id) return 2;
        for (i in costTable.exclude) if (costTable.exclude[i] == id) return 0;
        return 1;
    },

    updateCostUsed: function() {
        var used = { red: 0, blue: 0 };

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

    onUndoPickBan: function(id) {
        for (side in this.banPicked) {
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

    onUndoPickBanWeapon: function(id) {
        for (side in this.weaponBanPicked) {
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
            if (seq != null && seq.pick == "ban" && side == seq.side) {
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

    },

    eoo: eoo
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

        setTimeout(function() { searchMaster.resultMaster.fadeOut(100); }, 300);
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
                self.val("");
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

        sequenceMaster.onPick(id);
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
        if (step < 0 || step >= rules.sequence.length) return;

        let seq = rules.sequence[step];
        let side = seq.side;
        let counter = side == "blue" ? "red" : "blue";

        this.resultMaster.css("--current-side-color", "var(--color-side-" + side + ")");
        this.resultMaster.css("--counter-position", side == "red" ? "right" : "left");

        switch (seq.pick) {
            case "ban weapon":
                let weaponTypes = {};
                let entries = sideMaster.entryPicked[counter];
                let currentSuggest = this.weaponSuggests[counter];

                if (currentSuggest.length < 1) {
                    for (var i in entries) {
                        let entry = entries[i];

                        weaponTypes[entry.weapon] = true;
                    }

                    for (var i=weaponsInfo.list.length-1; i > -1; i--) {
                        let item = weaponsInfo.list[i];
                        if (item.id == "reserved") continue;

                        if (item.class != "unreleased" && weaponTypes[item.type]) currentSuggest.push(item);

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
        for (i in alters) this.ruleAlter.append(this.buildAlterOption(i, alters[i]));
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

        rulesMaster.applyRuleAlterSelection(self.val());

        sideMaster.releaseCostAmountChanged();

        sideMaster.initBanEntries();

        sideMaster.initBanWeapons();

        playSound("풛");
    },

    applyRuleAlterSelection: function(offset = rules.alter_default) {
        if (offset < 0 || offset >= rules.rule_alter.length) offset = rules.alter_default;
        //base rule apply
        let base = rules.base_rule;
        this.loadRuleSet(base);

        let alter = rules.rule_alter[offset];
        this.loadRuleSet(alter);

        this.leagueName.html(rules.name_full.replace(/\n/g, "<br />"));
        this.leagueTail.html(rules.league_tail.replace(/\n/g, "<br />"));

        sequenceMaster.init();

        sequenceMaster.setSequenceTitle(alter.name, 3000);
    },

    loadRuleSet: function(ruleset) {
        for (var def in ruleset) {
            if (def == "" || def == eoo) break;
            let rule = ruleset[def];

            rules[def] = rule;
        };
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
        if (loca != null) lang = locales[loca];
        else loca = locales["en-us"];

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
            timerMaster.initDesc();
            searchMaster.initSearchInputHelps();
            controllerMaster.initButtonTexts();
        } catch (e) {
            console.error(e.name, e.message, e.stack);
        }

        //apply character name
        poolMaster.initCostTable();
        
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

    random_picker: "button#random_picker",

    extra_action: "div#extra_action",
    settings: "button#settings",
    reset: "button#reset",

    tool_infos: "div#tool_infos",
    popup_credits: "span#popup_credits",
    popup_sound_panel: "span#popup_sound_panel",


    mainController: null,

    mainActionButton: null,
    subActionButton: null,

    randomPickButton: null,

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

        this.randomPickButton = this.mainController.find(this.random_picker);

        this.toolInfos = this.mainController.find(this.tool_infos);
        this.popupCredits = this.toolInfos.find(this.popup_credits);
        this.popupSoundPanel = this.toolInfos.find(this.popup_sound_panel);

        
        this.initButtonTexts();

        this.mainActionButton.click(this.mainButton);
        this.mainActionButton.contextmenu(this.mainButtonRight);
        this.subActionButton.click(this.subButton);
        this.randomPickButton.click(this.randomButton);
        this.randomPickButton.contextmenu(this.randomButtonRight);
        this.randomPickButton.mouseenter(this.randomButtonHover);
        this.randomPickButton.mouseleave(this.randomButtonHoverOut);
        this.buttonSettings.click(this.settingsButton);
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
        this.randomPickButton.attr("title", text.btnRandomDesc);
        this.buttonSettings.attr("title", text.btnSettingsDesc);
        this.buttonReset.attr("title", text.btnResetDesc);
    },

    mainButton: function(e) {
        switch(step) {
            case -1:
                sequenceMaster.startPick();
                break;
    
            case rules.sequence.length:
                sequenceMaster.finishPick();
                break;
    
            default:
                sequenceMaster.passPick();
                break;
        }
    },

    mainButtonRight: function(e) {
        let master = controllerMaster;

        if (step < rules.sequence.length) {
            e.preventDefault();

            if (master.triggerCount < master.triggerExceed) {
                master.triggerCount++;
            } else {
                master.triggerCount = 0;
                sequenceMaster.autoRandomPick();
            }

            return false;
        }
    },

    randomButton: function(e) {
        if (sequenceMaster.rollingRandomPicks === true) {
            sequenceMaster.rollingRandomPicks = false;
        } else sequenceMaster.randomPick();
    },

    randomButtonRight: function(e) {
        e.preventDefault();

        if (sequenceMaster.rollingRandomPicks === true) {
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
        this.randomPickButton.fadeIn(200);
    },

    hideRandomButton: function() {
        this.randomPickButton.fadeOut(200);
    },

    onRollingRandomPick: function() {
        controllerMaster.randomPickButton.text("!");
    },
    
    nonRollingRandomPick: function() {
        controllerMaster.randomPickButton.text("?");
    },
    
    subButton: function(e) {
        undoStep();
    },
    
    resetButton: function(e) {
        initializeStep();
    },
    
    settingsButton: function(e) {
        toggleDarkmode();
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
        content.append(master.buildCreditItem(rules.comment, "Pickup rules"));
        content.append(master.buildCreditItem(costTable.comment, "Cost table"));
    
        for (l in locales) {
            let la = locales[l];
            content.append(master.buildCreditItem(la.comment, la.name + " (" + l + ") Language text (translated by)"));
        }
    
        float.fadeIn(300);
        popup.show(300);
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
                setTimeout(function() {
                    if (timerMaster.settings.sound) playSoundV("뾷", timerMaster.settings.controlSoundVolume);
                    timerMaster.initTimer();

                    if (timerMaster.settings.autoPassTimeout) {
                        setTimeout(function() {
                            if (step < 0) sequenceMaster.startPick();
                            else if (step < rules.sequence.length) sequenceMaster.passPick();
                            else if (step == rules.sequence.length) sequenceMaster.finishPick();
                        }, 500);
                    }
                }, 1000);
                return;
            }
        }

        this.timerBegin = null;
        this.finishCurrentTimer();
        if (this.settings.autoStartSetupPhase && step != null && step == rules.sequence.length) this.applyTimeSet(this.settings.setupPhaseTimeSet);
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

    applyTimeSetOrigin() {
        this.applyTimeSet(this.timeSetOrigin, this.timeSetDefault);
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
        // var min = this.timeSet.min + "";
        // if (min.length < 2) min = "0" + min;
        // var min1 = min[0];
        // var min0 = min[1];
        var sec = this.timeSet.sec + "";
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

    onChangedSide: function() {
        if (this.settings.interlockSide) {
            this.initTimer();
        }
        let seq = rules.sequence[step];
        let triggerStep = step;
        if (seq != null && seq.amount > 0) switch (seq.pick) {
            case "ban":
            case "ban weapon":
                if (this.settings.autoStartBan) setTimeout(function() { if (triggerStep == step) timerMaster.startTimer(); }, 500);
                break;
            
            case "entry":
            case "proffer":
                if (this.settings.autoStartEntry) setTimeout(function() { if (triggerStep == step) timerMaster.startTimer(); }, 500);
                break;
        } else if (step == rules.sequence.length) {
            if (this.settings.autoStartSetupPhase) setTimeout(function() { if (triggerStep == step) timerMaster.startTimer(); }, 500);
        }
    },

    eoo
}


//reset pick progress
function initializeStep() {
    step = -1;
    if (stepHistory.length > 0) stepHistoryPrev = stepHistory;
    stepHistory = [];
    redNamePrev = redName;
    blueNamePrev = blueName;
    redName = "";
    blueName = "";
    latestStep = null;

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
    sideMaster.resetEntryPicked();

    //initialize each side ban picks
    sideMaster.resetBanEntries();

    //initialize each side weapon ban picks
    sideMaster.initBanWeapons();

    controllerMaster.triggerCount = 0;

    timerMaster.initTimer();

    playSound("풛");
}

function undoStep() {
    if (step == -1 && stepHistoryPrev != null) {
        //recover previous step sequence
        stepHistory = stepHistoryPrev;
        step = stepHistory.length;
        redName = redNamePrev;
        blueName = blueNamePrev;
        sideMaster.setNameplate(redName, blueName);
        sideMaster.updateCostUsed();
        sequenceMaster.checkUpdateCurrentStepComplition()
        sequenceMaster.releaseStepStateDisplay();
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

var latestStep = null;

function onChangedStep() {
    let cur = getCurrentSide();

    if (cur != latestStep) {
        timerMaster.onChangedSide();
        poolMaster.onChangedSide(cur);
        if (step < 0 || step >= rules.sequence.length) poolMaster.stopRollRandomCursor();
        latestStep = cur;
    }
}


function eventKeydown(e) {
    var isProcessed = false;

    switch(e.keyCode) {
        case 90://z
            if (e.ctrlKey) {//Ctrl+Z
                undoStep();
                isProcessed = true;
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
        $.cookie("dark_mode", "false", { expires: 36525 });
    } else {
        body.addClass(dark);
        $.cookie("dark_mode", "true", { expires: 36525 });
    }
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

        let seVolumeSet = $.cookie("se_volume");
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
        $.cookie("se_volume", value, { expires: 36525 });
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

//onload
$(document).ready(function() {

    //initializing//
    //Initialize section objects & Generate variable things//

    //rules & rule alters
    rulesMaster.init();

    //locale & language
    localeMaster.init();

    //character pool - cost table
    poolMaster.init();

    //each side player board & ban pick board
    sideMaster.init();

    //search
    searchMaster.init();

    //pick sequence
    sequenceMaster.init();

    //main controls
    controllerMaster.init();

    //timer
    timerMaster.init();

    //global event
    $(document).keydown(eventKeydown);
    $(document.body).on("keydown keyup", function(e) {
        let self = $(this);
        let ctrlPrev = self.attr("data-ctrl");
        let ctrlCurr = e.ctrlKey ? "1" : "";
        if (ctrlCurr != ctrlPrev) self.attr("data-ctrl", ctrlCurr);
    });

    //extra event
    let unabailables = $("#unavailables");
    unabailables.mousedown(toggleTp);
    unabailables.contextmenu(function(e) { e.preventDefault(); return false; });


    //settings apply
    let darkModeState = $.cookie("dark_mode");
    if (darkModeState != null && darkModeState == "true") toggleDarkmode();



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

        setTimeout(function() {
            $("div#loading_cover").css("opacity", 0);
            setTimeout(function() {
                $("div#loading_cover").hide();
                sequenceMaster.setSequenceTitle(lang.text.titleReady);
                setTimeout(function() { sideMaster.redNameplateInput.focus(); }, 1000);
            }, 2500);
        }, 100);
    });

});

