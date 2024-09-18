//rule book load
for (var book in ruleBooks) {
    rules = ruleBooks[book];
    break;
}

let isPrebanRule = typeof prebanRule != "undefined";
let isCardyRule = typeof cardyRule != "undefined";

if (isPrebanRule) for (var alter of rules.rule_alter) {
    if (alter.rule_type == "preban") {
        prebanRule = alter;
        break;
    }
}
if (isCardyRule) for (var alter of rules.rule_alter) {
    if (alter.rule_type == "cardy") {
        cardyRule = alter;
        break;
    }
}


let isKorean;


charactersInfo.list.pop();
charactersInfo.list.forEach(ch => {
    //load character name every languages
    ch.name = [];
    ch.nameShort = [];
    for (l in locales) {
        let text = locales[l];
        ch.name[l] = text["characters"][ch.id];
        ch.nameShort[l] = text["characters_short"][ch.id];
    }

    //override character info for rule
    let override = rules.characters_override[ch.id];
    if (override != null) {
        for (attr in override) {
            if (attr == "comment" || attr == "reserved" || attr == "") continue;
            ch[attr] = override[attr];
        }
    }
})

//inits
const initLocale = function() {
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

    var unused;
    if (loca.indexOf("ko") > -1) unused = document.querySelector("body > div:lang(en)");
    else unused = document.querySelector("body > div:lang(ko)");
    unused.remove();

}


let loadTable = function (set, from, to, ignores = [], def = [0, 0, 0, 0, 0, 0, 0]) {
    set[to] = {};
    let bp = set[from];
    let ap = set[to];

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
}

if (isCardyRule && rules.cardy_rating != null && rules.cardy_rating.point_sheet != null) loadTable(rules.cardy_rating, "point_sheet", "point_table", ["Characters"]);

function getInputs() {
    return document.querySelectorAll('input.char_constells');
}

function getInputsL() {
    return document.querySelectorAll('input.char_constells.limited');
}

function getInputsO() {
    return document.querySelectorAll('input.char_constells.ordinary');
}

function getInputs4() {
    return document.querySelectorAll('input.char_constells.fourstars');
}

function getSumChecker() {
    return document.querySelectorAll('input.sum_checker');
}

function getSumChecked() {
    return document.querySelectorAll('input.sum_checker:checked');
}

function getSelfbanChecker() {
    return document.querySelectorAll('input.selfban_checker');
}

function getSelfbanCheckerUnexcluded() {
    return document.querySelectorAll('input.selfban_checker:not([excluded])');
}

function getSelfbanChecked() {
    return document.querySelectorAll('input.selfban_checker:not([excluded]):checked');
}

function getSelfbanUnchecked() {
    return document.querySelectorAll('input.selfban_checker:not([excluded]):not(:checked)');
}

function getPrebanChecker() {
    return document.querySelectorAll('input.preban_checker');
}

function getPrebanCheckerUnexcluded() {
    return document.querySelectorAll('input.preban_checker:not([excluded])');
}

function getPrebanCheckerRarity(rarity) {
    return document.querySelectorAll('input.preban_checker:not([excluded])[data-rarity="' + rarity + '"]');
}

function getPrebanChecked() {
    return document.querySelectorAll('input.preban_checker:checked');
}

function getPrebanCheckedUnexcluded() {
    return document.querySelectorAll('input.preban_checker:not([excluded]):checked');
}

function getPrebanCheckedRarity(rarity) {
    return document.querySelectorAll('input.preban_checker:not([excluded])[data-rarity="' + rarity + '"]:checked');
}

let lineCalc = function (e) {
    let isOrdinary = this.className.indexOf("ordinary") > -1;
    let is4stars = this.className.indexOf("fourstars") > -1;
    var v = e.target.value;
    v = v != null && !isNaN(parseInt(v)) ? Math.max(Math.min(parseInt(v), 6), 0) : "";
    e.target.value = v;
    let val = parseInt(e.target.value);
    let cid = e.target.getAttribute('data-cid');
    //if (!isOrdinary && !is4stars) document.getElementById(cid).innerText = !isNaN(val) ? v + 1 : 0;
    if (rules.rule_type == "cost") addCost(cid, val);
    if (isCardyRule) {
        setPoint(cid, val);
        calcTotalCardyPoints();
    }

    if (v !== "") focusNext(e.target);
};

let focused = function (e) {
    e.target.select();
}


let focusNext = function (current) {
    let list = getInputs();
    var index = null;
    for (i in list) {
        let item = list[i];
        if (item == current) {
            index = parseInt(i);
            
            if (index + 1 == list.length) {
                document.getElementById("copy_table").focus();
                break;
            }
        } else if (index != null && i == index + 1) {
            item.focus();
            break;
        }
    }
}


let calcTotalCardyPoints = function () {
    let pointTable = rules.cardy_rating.point_table;
    let list = getInputs();
    var totals = 0;
    var dieted = 0;

    for (var input of list) {
        let id = input.dataset.cid.replace("c_", "");
        var constell = parseInt(input.value);
        let pointSet = pointTable[id];
        if (pointSet != null) {
            if (!isNaN(constell)) totals += pointSet[constell];
        }
        let checker = document.getElementById("check_" + id);
        if (!isExcluded(id)) {
            if (isNaN(constell)) {
                checker.checked = false;
                checker.disabled = true;
            } else {
                checker.disabled = false;
                if (!checker.checked && pointSet != null) dieted += pointSet[constell]; 
            }
        }
    }

    document.getElementById("cardy_total_points").innerText = dieted != totals ? "(" + totals + ") " + dieted : totals;

    let checked = getSelfbanChecked();
    let exceed = checked.length >= rules.cardy_self_bans;
    let checker = getSelfbanUnchecked();
    for (var check of checker) {
        let id = check.dataset.id;
        let input = document.querySelector('input.char_constells[data-cid="c_' + id + '"]');
        check.disabled = input.value == "" ? true : exceed;
    }

}


//cost calc
let setCost = function (cid) {
    let id = cid.replace("c_", "");
    let constells = document.querySelector('input.char_constells[data-cid="' + cid + '"]');
    if (constells == null) return;
    let cons = constells.value;
    var basic = getAddCost(id);
    var add = getAddCost(id, cons);
    if (add == null) add = 0;
    else add = add - basic;
    let costBasic = document.querySelector('span[class="cost_basic"][data-cid="' + cid + '"]');
    if (costBasic != null) costBasic.innerText = basic;
    let cosAdd = document.querySelector('span[class="cost_add"][data-cid="' + cid + '"]')
    if (cosAdd != null) cosAdd.innerText = add;
    let cosSum = document.querySelector('span[class*="cost_sum"][data-cid="' + cid + '"]')
    if (cosSum != null) cosSum.innerText = isNaN(add) ? basic : basic + add;
}

let addCost = function (cid, cons) {
    let id = cid.replace("c_", "");
    var basic = getAddCost(id);
    var add = getAddCost(id, cons);
    if (add == null) add = 0;
    else add = add - basic;
    let costBasic = document.querySelector('span[class="cost_basic"][data-cid="' + cid + '"]');
    if (costBasic != null) {
        let basic = parseInt(costBasic.innerText);
        let cosAdd = document.querySelector('span[class="cost_add"][data-cid="' + cid + '"]')
        if (cosAdd != null) cosAdd.innerText = add;
        let cosSum = document.querySelector('span[class*="cost_sum"][data-cid="' + cid + '"]')
        if (cosSum != null) cosSum.innerText = isNaN(add) ? basic : basic + add;
    }
}

let setPoint = function (cid, cons) {
    let id = cid.replace("c_", "");
    let pointSet = rules.cardy_rating.point_table[id];
    if (isNaN(cons)) cons = null;

    let cardyPoint = document.querySelector('span.cardy_point[data-cid="' + cid + '"]');
    cardyPoint.innerText = pointSet == null ? "-" : (cons != null ? pointSet[cons] : 0);
}

let getAddCost = function (id, constell = 0) {
    let line = rules.cost_table[id];
    var cost;
    if (typeof line == "number") cost = line;
    else cost = line[constell];

    return cost;
}

let ontake = function(e) {
    let self = e.target;

    setTimeout(function() {
        clearing(self);
    }, 100);
}

let clearing = function(self) {
    self.value = "";
    self.blur();
}

let forParse = function(e) {
    let self = e.target == null ? e : e.target;
    setTimeout(function() {
        parsePasted(self.value);
        clearing(self)
    }, 10);
}

let packDataSet = function(pureJson = false, format = 2) {
    var data = {};

    let name = document.getElementById("player_name").value;
    let uid = document.getElementById("player_uid").value;
    let treveler = document.querySelector("input[name=trevelers]:checked").value;
    
    let player = { name: name, uid: uid, treveler: treveler };
    
    data["player"] = player;

    if (isPrebanRule) {
        let prebanned = [];
        let checked = getPrebanChecked();
        for (check of checked) prebanned.push(check.dataset.id);
        if (prebanned.length > 0) data["prebanned"] = prebanned;
    }
    if (isCardyRule) {
        let selfbanned = [];
        let checked = getSelfbanChecked();
        for (check of checked) selfbanned.push(check.dataset.id);
        if (selfbanned.length > 0) data["selfbanned"] = selfbanned;
    }

    let arr = [];
    let obj = {};
    var code;
    var fv;
    var collect = "";

    getInputs().forEach(input => {
        let id = input.getAttribute("data-cid").split("_")[1];

        let value = input.value;

        obj[id] = value == "" ? null : parseInt(value);
        collect += value;
    });

    //if (collect.length < 1) return;

    switch (format) {
        default:
        case 2:
            for (var i=0; i<charactersInfo.list.length; i++) {
                let c = charactersInfo.list[i];

                let cons = obj[c.id];
                var char;
                if (cons != null) char = cons;
                else char = null;

                arr.push(char);
            }

            data["list"] = arr;

            code = Jcodd.coddify(data);

            break;

        case 1:
            if (player.name.match(/[\u0080-\uFFFF]/g) != null) player.name = escape(player.name);

            for (var id in obj) {
                let c = obj[id];
                data[id] = c;
            }

            code = JSON.stringify(data);

            break;
    }

    fV = format;

    var text;
    if (pureJson) text = code;
    else text = "@GCBPSv" + fV + ":" + btoa(code) + ";";

    copyToClipboard(text);
}

let copyToClipboard = function(text) {
    if (!navigator.clipboard) {
        pasteTable.value = text;
        pasteTable.select();
        document.execCommand("copy");
        setTimeout(function() { forParse(pasteTable); }, 10);
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


let calcSumCkecked = function() {
    let checkedLength;
    if (isCardyRule) {
        checkedLength = checkCardySelfBan();
        calcTotalCardyPoints();
    } else if (isPrebanRule) {
        checkedLength = checkPreban();
    } else {
        let checked = getChecked();
        var sum = 0;
        for (var i=0; i<checkedLength.length; i++) {
            let id = checkedLength[i].getAttribute("data-id");
            let constells = document.querySelector('input[data-cid="c_' + id + '"]');
            if (constells == null) continue;
            let cons = constells.value;
            if (cons == "") cons = 0;
            sum += getAddCost(id, cons);
        }
        document.getElementById("total_cost_sum").innerText = sum;
        checkedLength = checked.length;
    }
    document.getElementById("count_checked").innerText = checkedLength;
}

let checkCardySelfBan = function() {
    let table = rules.cardy_rating.point_table;
    let checked = getSelfbanChecked();

    var points = 0;
    for (var checker of checked) {
        let id = checker.dataset.id;
        let pointSet = table[id];
        if (pointSet == null) continue;
        let constellInput = document.querySelector('input[data-cid="c_' + id + '"]');
        var constell = constellInput != null ? parseInt(constellInput.value) : null;
        if (constell == null || isNaN(constell)) continue;

        let point = pointSet[constell];
        points -= point;
    }
    document.getElementById("dieted_weight_points").innerText = points;
    return checked.length;
}

let checkPreban = function() {
    let selections = prebanRule.prebanSelections;
    var completed = true;
    var checkedLength = 0;
    for (var selection of selections) {
        let checker = getPrebanCheckerRarity(selection.rarity);
        let checked = getPrebanCheckedRarity(selection.rarity);

        let isCompleted = checked.length >= selection.amount;
        for (var check of checker) check.disabled = isCompleted && !check.checked;

        if (checked.length != selection.amount) completed = false;
        checkedLength += checked.length;
    }

    document.getElementById("preban_completed").innerText = completed ? (isKorean ? "완료" : "COMPLETE") : (isKorean ? "미완료" : "incomplete");
    document.getElementById("copy_table").disabled = !completed;
    return checkedLength;
}

let pasteTable;


let parsePasted = function(text) {
    if (text == null || text == "") return false;

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

        if (isPrebanRule) {
            getPrebanChecked().forEach((input) => { input.checked = false; });
            getPrebanCheckerUnexcluded().forEach((input) => { input.disabled = false; });
        }

        for (var i in data) {
            let cons = data[i];

            if (i == "player") {
                document.getElementById("player_name").value = unescape(cons.name);
                document.getElementById("player_uid").value = cons.uid;
                document.querySelector('input[name=trevelers][value="' + cons.treveler + '"]').checked = true;

                continue;
            } else if (i == "prebanned") {
                if (isPrebanRule) {
                    let prebanned = data[i];
                    if (prebanned != null) for (var preban of prebanned) {
                        let check = document.getElementById("check_" + preban);
                        if (check != null) check.checked = true;
                    }
                }

                continue;
            } else if (i == "selfbanned") {
                if (isCardyRule) {
                    let selfbanned = data[i];
                    if (selfbanned != null) for (var selfban of selfbanned) {
                        let check = document.getElementById("check_" + selfban);
                        if (check != null) check.checked = true;
                    }
                }

                continue;
            } else if (i == "list") {
                continue;
            }

            var consI = parseInt(cons);
            if (consI > 6) consI = 6;
            else if (consI < 0) consI = null;
            let cid = "c_" + i;

            let constell = document.querySelector('input.char_constells[data-cid="' + cid + '"]')
            if (constell != null) constell.value = cons;
            let point = document.getElementById(cid)
            if (point != null) {
                if (point.innerText != "-") point.innerText = cons != null && !isNaN(cons) ? consI + 1 : 0;
                if (rules.rule_type == "cost") addCost(cid, consI);
            }
            if (isCardyRule) setPoint(cid, consI)
        }
        for (var i=1; i<charactersInfo.list.length; i++) {
            let info = charactersInfo.list[i];
            let id = info.id;
            var cons = data[id];
            if (cons != null) cons = 0;
            addCost("c_" + id, data[id]);
        }
        calcSumCkecked();
        //leagueCalc();

        return true;
    } catch(e) {
        console.error(e.name, e.message, e.stack);
    }
    return false;
}


let leagues;



function buildCharLine(no, name, id, rarity, excluded = false, attrs = "", addClass = "", point = 0, usepoint = true, cost = 0, usecost = true) {
    var charLine = `                <tr#ATTRS>
                    <td><div><p class="right">#NO</p></div></td>
                    <td><div><p class="right"><span>#NAME</span></p></div></td>
                    <td><div> <p class=""> <span>
                        <input type="number" min="0" max="6" placeholder="#CONST_PLACEHOLDER" data-cid="c_#ID" class="char_constells#CLASS">
                    </span></p></div></td>
                    <td class="checkbox"><div><p class="center">
                        <input type="checkbox" class="#CHK_BOX_CLASS" id="check_#ID" data-id="#ID" data-rarity="#RARITY" #CHECK_ATTR />
                    </p></div></td>
                    <td><div><p class="right">
`;
    if (isCardyRule) charLine += `                        <span><span class="cardy_point" data-cid="c_#ID">#POINT</span>#POINTUNIT</span>
`;
    else charLine += `                        <span>(<span class="cost_basic" data-cid="c_#ID"></span> +<span class="cost_add" data-cid="c_#ID"></span>)&nbsp;<span data-cid="c_#ID" class="cost_sum bold">#COST</span>#COSTUNIT</span>
`;
    charLine += `                    </p></div></td>
                </tr>
`;
    return charLine.replace("#NO", no).replace("#NAME", name).replace(/#ID/g, id).replace("#RARITY", rarity).replace("#CONST_PLACEHOLDER", isKorean ? "미보유 (비움)" : "Now own(empty)").replace("#CHK_BOX_CLASS", isCardyRule ? "selfban_checker" : (isPrebanRule ? "preban_checker" : "sum_checker")).replace("#CHECK_ATTR", excluded ? "excluded disabled" : "").replace("#ATTRS", attrs).replace("#CLASS", addClass).replace("#POINTUNIT", usepoint ? (isKorean ? " 점" : " p") : "&nbsp; &nbsp;").replace("#COSTUNIT", usepoint ? (isKorean ? " 코" : " cost") : "&nbsp; &nbsp;").replace("#POINT", point == null ? "-" : point).replace("#COST", cost);
}

function initCharList() {
    let tbody = document.getElementById("main_table_body");
    let divider = tbody.querySelector("tr.divider");
    let limited = tbody.querySelectorAll("tr.limited");
    let ordinary = tbody.querySelectorAll("tr.ordinary");
    let tfoot = document.getElementById("main_table_foot");
    let fourstars = tfoot.querySelectorAll("tr.fourstars");
    let pointTable;
    if (isCardyRule) pointTable = rules.cardy_rating.point_table;
    else pointTable = null;

    limited.forEach(e => e.remove());
    ordinary.forEach(e => e.remove());
    fourstars.forEach(e => e.remove());

    var seqLimited = 0;
    var seqOrdinary = 0;
    var seq4stars = 0;

    for (var i=1; i<charactersInfo.list.length; i++) {
        let info = charactersInfo.list[i];
        let excluded = isExcluded(info.id);
        let pointSet = pointTable != null ? pointTable[info.id] : 0;
        let point = pointSet != null ? 0 : null;

        if (info.class == "unreleased") continue;

        var category;
        if (info.rarity == "5" && info.id != "treveler") {
            category = info.class;
        } else category = "fourstars";

        switch (category) {
            case "limited":
                seqLimited++;
                let linel = buildCharLine(seqLimited, info.name[loca], info.id, info.rarity, excluded, ' class="limited"', " limited", point);
                let eleml = document.createElement("div");
                tbody.insertBefore(eleml, divider);
                eleml.outerHTML = linel;
                break;

            case "ordinary":
                seqOrdinary++;
                let lineo = buildCharLine(seqOrdinary, info.name[loca], info.id, info.rarity, excluded, ' class="ordinary"', " ordinary", point);
                let elemo = document.createElement("div");
                tbody.append(elemo);
                elemo.outerHTML = lineo;
                break;

            case "fourstars":
                seq4stars++;
                let linef = buildCharLine(seq4stars, info.name[loca], info.id, info.rarity, excluded, ' class="fourstars"', " fourstars", point);
                let elemf = document.createElement("div");
                tfoot.append(elemf);
                elemf.outerHTML = linef;
                break;
        }

        setCost("c_" + info.id);
    }

    getInputsL().forEach(input => {
        input.onfocus = focused;
        input.oninput = lineCalc;
        input.oncut = lineCalc;
        input.onpaste = lineCalc;
    });
    getInputsO().forEach(input => {
        input.onfocus = focused;
        input.oninput = lineCalc;
        input.oncut = lineCalc;
        input.onpaste = lineCalc;
    });
    getInputs4().forEach(input => {
        input.onfocus = focused;
        input.oninput = lineCalc;//changed;
        input.oncut = lineCalc;//changed;
        input.onpaste = lineCalc;//changed;
    });

    if (isCardyRule) {
        getSelfbanChecker().forEach(input => {
            input.onchange = function(e) {
                e.stopPropagation();

                calcSumCkecked();
            }
        });
        document.getElementById("cardy_self_ban_count").innerText = rules.cardy_self_bans;
        calcTotalCardyPoints();
    } else if (isPrebanRule) {
        getPrebanChecker().forEach(input => {
            input.onchange = function(e) {
                e.stopPropagation();

                calcSumCkecked();
            }
        });
    } else {
        getSumChecker().forEach(input => {
        input.onchange = function(e) {
            e.stopPropagation();

            calcSumCkecked();
        }
    });
    }

    document.querySelectorAll("table.score_calc td.checkbox").forEach(td => {
        td.onclick = function (e) {    
            if (e.target.tagName != "INPUT" && e.target.tagName != "BUTTON") {
                e.stopPropagation();

                this.querySelector("input[type=checkbox]").click();
            }
        }
    });

}

function isExcluded(id) {
    if (isCardyRule) {
        let pointSet = rules.cardy_rating.point_table[id];
        if (pointSet == null) return true;
        else return false;
    } else if (isPrebanRule) {
        for (var current of prebanRule.excludePreban) if (current == id) return true;
        return false;
    } else return null;
}

//onload
addEventListener('load', function() {
    
    initLocale();

    isKorean = loca.indexOf("ko") > -1;


    if (rules.rule_type == "cost") {
        document.getElementById("gi_ver").innerText = costTable != null ? costTable.version : "???";
        document.getElementById("gi_phase").innerText = costTable != null ? costTable.phase : "???";
        if (loca.indexOf("ko") > -1)document.getElementById("gi_spiral").innerText = costTable != null ? costTable.month + "월 " + (costTable.half === 1 ? "상" : "하") + "반기" : "???";
        else document.getElementById("gi_spiral").innerText = costTable != null ? costTable.month + "월 " + (costTable.half === 1 ? "1st" : "2nd") + "lanf" : "???";
        document.getElementById("gi_rev").innerText = costTable != null && costTable.revision > 0 ? " rev." + costTable.revision : "";
    } else document.querySelector("#cost_table_info").style.display = "none";
    
    document.getElementById("init_check").onclick = function (e) {
        if (isCardyRule) {
            getSelfbanChecked().forEach(input => {
                input.checked = false;
            });
        } else if (isPrebanRule) {
            getPrebanChecked().forEach(input => {
                input.checked = false;
            });
        } else {
            getSumChecked().forEach(input => {
                input.checked = false;
            });
        }
        calcSumCkecked();
    }

    
    pasteTable = document.getElementById("paste_table");

    // pasteTable.onblur = ontake;
    // pasteTable.oninput = ontake;
    pasteTable.onchange = ontake;
    pasteTable.onpaste = forParse;

    pasteTable.onfocus = function(e) {
        getInputs().forEach(input => {
            let cid = input.getAttribute("data-cid");
            input.value = "";
            // if (document.getElementById(cid).innerText != "-") document.getElementById(cid).innerText = 0;
            if (rules.rule_type == "cost") addCost(cid, 0);
        });
    }
    
        
    document.getElementById("copy_table").onclick = function(e) {
        if (e.shiftKey) packDataSet(false, 1);
        else packDataSet();
    };
    document.getElementById("copy_table").oncontextmenu = function(e) {
        e.preventDefault();

        if (e.shiftKey) packDataSet(true, 1);
        else packDataSet(true);

        return false;
    };


    leagues = document.getElementById("leagues");
    if (leagues != null) {
        leagues.innerHTML = "";
        for (var i=0; i < rules.rule_alter.length; i++) {
            let cr = rules.rule_alter[i];
            if (!cr.established) continue;
        
            let ca = cr.cost_amount != null ? cr.cost_amount : rules.base_rule.cost_amount;
            let scr = cr.score_range;
        
            var cst;
            if (ca < 64) {
                if (loca.indexOf("ko") > -1)cst = "<b>" + ca + "</b> 코스트";
                else cst = "<b>" + ca + "</b> cost";
            } else {
                if (loca.indexOf("ko") > -1)cst = "<b>무제한</b>";
                else cst = "<b>unlimited</b>";
            }
        
            let tr = document.createElement("tr");
            let td1 = document.createElement("td");
            if (loca.indexOf("ko") > -1)td1.innerHTML = "<b>" + cr.name + "</b> " + "룰";
            else td1.innerHTML = "<b>" + cr.name + "</b> " + "rule";
            tr.append(td1);
            let td2 = document.createElement("td");
            td2.innerHTML = cst;
            tr.append(td2);
        
            leagues.append(tr);
        }
    }
    
    document.getElementById("rule_title").innerText = rules.rule_title;
    document.getElementById("rule_version").innerText = rules.rule_version;
    
    document.getElementById("toggle_ordinary").onclick = function(e) {
        let tbody = document.getElementById("main_table_body");
        let show = tbody.getAttribute("data-show-ordinary");
        let spans = this.querySelectorAll("span.arrow");
        
        var toShow;
        switch (show) {
            case "1":
                toShow = "";
                break;
    
            default:
                toShow = "1";
                break;
        }
    
        tbody.setAttribute("data-show-ordinary", toShow);
    
        
        if (toShow == "1") {
            for (var i=0; i<spans.length; i++) spans[i].innerText = "︽";
            document.querySelector("input.ordinary").focus();
        } else for (var i=0; i<spans.length; i++) spans[i].innerText = "︾";
    };
    
    document.getElementById("toggle_4stars").onclick = function(e) {
        let foot = document.getElementById("main_table_foot");
        let show = foot.getAttribute("data-show-4stars");
        let spans = this.querySelectorAll("span.arrow");
        
        var toShow;
        switch (show) {
            case "1":
                toShow = "";
                break;
    
            default:
                toShow = "1";
                break;
        }
    
        foot.setAttribute("data-show-4stars", toShow);
    
        
        if (toShow == "1") {
            for (var i=0; i<spans.length; i++) spans[i].innerText = "︽";
            document.querySelector("input.fourstars").focus();
        } else for (var i=0; i<spans.length; i++) spans[i].innerText = "︾";
    };


    initCharList();

    document.querySelector('input.char_constells').focus();

    
} , false);