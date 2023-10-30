ruleBooks["AngChamps v3"] = {
    "comment": "\
Rule refferenced by 앙리형 (Angri-hyung / brother Henry - Streamer & Youtuber)\n\
Youtube: https://www.youtube.com/@angrihyung_genshin \n\
Twitch(Official): https://www.twitch.tv/angrimoldi \n\
Twitch(for Live): https://www.twitch.tv/angrihyung \n\
\n\
check this videos: \n\
https://www.youtube.com/@angrihyung_genshin/search?query=%EC%9B%90%EC%8B%A0%20%EC%B1%94%EC%8A%A4 \n\
\n\
Rule data created by Esterisk (에스터1z / Ester1z) \n\
* this file is rule data reference and basic standard.\n\
    ",
    "rule_title": "앙챔스 룰북",
    "rule_version": "3.1",

    "rule_type": "ban card",

    "sequence": null,

    "ban_card_accure": null,

    "base_rule": {
        "league_tail": "LEAGUE",
        "double_pick": null,
        "sequence": [
            { "side": "red", "pick": 'ban', "amount": "2" },
            { "side": "blue", "pick": 'ban', "amount": "2" },
            { "side": "red", "pick": 'entry', "amount": "1" },
            { "side": "blue", "pick": 'entry', "amount": "1" },
            { "side": "red", "pick": 'entry', "amount": "1" },
            { "side": "blue", "pick": 'entry', "amount": "1" },
            { "side": "red", "pick": 'entry', "amount": "1" },
            { "side": "blue", "pick": 'entry', "amount": "1" },
            { "side": "red", "pick": 'ban', "amount": "1" },
            { "side": "blue", "pick": 'ban', "amount": "1" },
            { "side": "blue", "pick": 'entry', "amount": "2" },
            { "side": "red", "pick": 'entry', "amount": "2" },
            { "side": "blue", "pick": 'entry', "amount": "2" },
            { "side": "red", "pick": 'entry', "amount": "2" },
            { "side": "blue", "pick": 'entry', "amount": "1" },
            { "side": "red", "pick": 'entry', "amount": "1" },
            { "side": "blue", "pick": 'entry', "amount": "0" },
            { "side": "red", "pick": 'entry', "amount": "0" },
            "reserved"
        ],

        "addSecDefaults": {
            "constell": 2,
            "weapon": 4,
            "refine": 2,
        },
    
        "ban_card_accure": {
            "treveler": false,
            "trevelerM": false,
            "amber": false,
            "kaeya": false,
            "lisa": false,
            "babara": false,
            "razor": false,
            "xiangling": false,
            "beidou": false,
            "xingqiu": false,
            "ningguang": false,
            "fischl": false,
            "bennett": false,
            "noelle": false,
            "chongyun": false,
            "sucrose": false,
            "jean": false,
            "diluc": false,
            "qiqi": false,
            "mona": false,
            "keqing": false,
            "venti": false,
            "klee": false,
            "diona": false,
            "tartaglia": false,
            "xinyan": false,
            "zhongli": false,
            "albedo": false,
            "ganyu": false,
            "xiao": false,
            "hutao": false,
            "rosaria": false,
            "yanfei": false,
            "eula": false,
            "kazuha": false,
            "ayaka": false,
            "sayu": false,
            "yoimiya": false,
            "aloy": false,
            "sara": false,
            "shogun": false,
            "kokomi": false,
            "thoma": false,
            "gorou": false,
            "itto": false,
            "yunjin": false,
            "shenhe": false,
            "yae": false,
            "ayato": false,
            "yelan": false,
            "shinobu": false,
            "heizo": false,
            "collei": false,
            "tighnari": false,
            "dori": false,
            "candace": false,
            "cyno": false,
            "nilou": false,
            "nahida": false,
            "layla": false,
            "faruzan": false,
            "wanderer": false,
            "yaoyao": false,
            "alhaitham": false,
            "dehya": false,
            "mika": false,
            "kaveh": false,
            "baizhu": false,
            "kirara": false,
            "lynette": false,
            "lyney": false,
            "freminet": false,
            "wriothesley": false,
            "neuvillette": false,
            "charlotte": false,
            "furina": false,
        },
        "": ""
    },

    "alter_default": 3,

    "rule_alter": [
        {
            "name": "맨손 리그",
            "name_full": "MAN SON",
            "score_range": "0-14",
            "double_pick": true,
            "established": false,
            "selectable": false,
    
            "ban_card_accure": {
                "treveler": true,
                "trevelerM": true,
                "amber": true,
                "kaeya": true,
                "lisa": true,
                "babara": true,
                "razor": true,
                "ningguang": true,
                "noelle": true,
                "chongyun": true,
                "diluc": true,
                "qiqi": true,
                "xinyan": true,
                "yanfei": true,
                "sayu": true,
                "aloy": true,
                "thoma": true,
                "heizo": true,
                "collei": true,
                "dori": true,
                "candace": true,
                "kaveh": true,
                "freminet": true,
            },
            "": ""
        },
        {
            "name": "무인검 리그",
            "name_full": "무인검",
            "score_range": "15-24",
            "established": false,
            "selectable": false,

            "ban_card_accure": {
            },
            "":""
        },
        {
            "name": "티바트 리그",//"흑술창 리그",
            "name_full": "Teyvat",//"흑술창",
            "score_range": "0-55",//"25-34",
            "established": false,
            "selectable": true,

            "ban_card_accure": {
                "beidou": true,
                "fischl": true,
                "sucrose": true,
                "keqing": true,
                "rosaria": true,
                "sara": true,
                "gorou": true,
                "yunjin": true,
                "layla": true,
                "faruzan": true,
                "yaoyao": true,
                "dehya": true,
                "mika": true,
                "kirara": true,
                "lynette": true,
            },
            "": ""
        },
        {
            "name": "통합 리그",//"제례활 리그",
            "name_full": "Unified",//"제례활",
            "score_range": "0+",//"35-59",
            "established": true,
            "selectable": true,

            "ban_card_accure": {
                "xiangling": true,
                "xingqiu": true,
                "bennett": true,
                "jean": true,
                "mona": true,
                "diona": true,
                "shinobu": true,
            },
            "": ""
        },
        {
            "name": "셀레스티아 리그",//"카구라 리그",
            "name_full": "Celestia",//"카구라의 진의",
            "score_range": "56+",//"60-99",
            "established": false,
            "selectable": true,

            "ban_card_accure": {
                "klee": true,
                "tartaglia": true,
                "albedo": true,
                "ganyu": true,
                "xiao": true,
                "hutao": true,
                "eula": true,
                "kokomi": true,
                "shenhe": true,
                "nilou": true,
                "baizhu": true,
            },
            "": ""
        },
        {
            "name": "일태도 리그",
            "name_full": "무상의 일태도",
            "score_range": "100+",
            "established": false,
            "selectable": false,

            "ban_card_accure": {
                "venti": true,
                "ayaka": true,
                "yoimiya": true,
                "itto": true,
                "yae": true,
                "ayato": true,
                "tighnari": true,
                "cyno": true,
                "wanderer": true,
                "alhaitham": true,
                "lyney": true,
                "wriothesley": true,
            },
            "": ""
        },
        {
            "name": "일태도 미러",
            "name_full": "동상의 일태도",
            "score_range": "100+",
            "established": false,
            "selectable": false,

            "ban_card_accure": {
            },
            "sequence": [
                {"side":"red","pick":"ban","amount":"2"},
                {"side":"blue","pick":"ban","amount":"2"},
                {"side":"red","pick":"entry","amount":"1"},
                {"side":"red","pick":"proffer","amount":"1"},
                {"side":"blue","pick":"entry","amount":"1"},
                {"side":"blue","pick":"proffer","amount":"1"},
                {"side":"red","pick":"entry","amount":"1"},
                {"side":"red","pick":"proffer","amount":"1"},
                {"side":"blue","pick":"entry","amount":"1"},
                {"side":"blue","pick":"proffer","amount":"1"},
                {"side":"red","pick":"entry","amount":"0"},
                {"side":"blue","pick":"entry","amount":"0"},
                {"side":"red","pick":"ban","amount":"1"},
                {"side":"blue","pick":"ban","amount":"1"},
                {"side":"blue","pick":"entry","amount":"1"},
                {"side":"blue","pick":"proffer","amount":"1"},
                {"side":"red","pick":"entry","amount":"1"},
                {"side":"red","pick":"proffer","amount":"1"},
                {"side":"blue","pick":"entry","amount":"1"},
                {"side":"blue","pick":"proffer","amount":"1"},
                {"side":"red","pick":"entry","amount":"1"},
                {"side":"red","pick":"proffer","amount":"1"},
                {"side":"blue","pick":"entry","amount":"0"},
                {"side":"red","pick":"entry","amount":"0"},
                "reserved"
            ],
            "":""
        },
    ],

    "ban_card_excepted": {
        "zhongli": true,
        "kazuha": true,
        "shogun": true,
        "yelan": true,
        "nahida": true,
        "neuvillette": true,
    },

    "characters_override": {
        "comment": "\
For using alter of characters classification by rule \n\
        ",
    },

    "weapons_override": {
        "comment": "\
For using alter of weapons classification by rule \n\
        "
    },
}