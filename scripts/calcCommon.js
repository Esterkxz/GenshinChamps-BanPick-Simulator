
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
    if (rules.rule_type == "cost") addCost(cid, v);

    if (v !== "") {
        let list = getInputs();
        var index = null;
        for (i in list) {
            let item = list[i];
            if (item == e.target) {
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
};

let changed = function (e) {
    var v = e.target.value;
    v = v != null && !isNaN(parseInt(v)) ? Math.max(Math.min(parseInt(v), 6), 0) : "";
    e.target.value = v;

    if (v !== "") {
        let list = getInputs();
        var index = null;
        for (i in list) {
            let item = list[i];
            if (item == e.target) {
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
}

let focused = function (e) {
    e.target.select();
}


//cost calc
let setCost = function (cid) {
    let id = cid.replace("c_", "");
    let constells = document.querySelector('input[data-cid="' + cid + '"]');
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

    let prebanned = [];
    let checked = getPrebanChecked();
    for (check of checked) prebanned.push(check.dataset.id);
    if (prebanned.length > 0) data["prebanned"] = prebanned;

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

