ruleBooks["ArdyCup v0"] = {
    "comment": "\
Rule refferenced by 아디 (Ardy - Streamer & Youtuber)\n\
Youtube: https://www.youtube.com/@ardy703 \n\
Chzzk: https://chzzk.naver.com/b331322b656faef773c9bc732064bf5c \n\
Twitch: https://www.twitch.tv/ardy1ardy \n\
Discord: https://discord.com/invite/9SWSHycT3Z \n\
\n\
data reference: \n\
https://docs.google.com/spreadsheets/d/12Dg_OWHA0QBD9QeXj-JUNHj6DATnw2cMwETFVhYns0k/edit#gid=1397116232 \n\
\n\
Rule data created by Esterisk (에스터1z / Ester1z) \n\
* this file is rule data reference and basic standard for cost game.\n\
    ",
    "rule_title": "아디컵 룰북",
    "rule_version": "v.0.2.1",

    "rule_type": "cost",

    "sequence": null,

    "ban_card_accure": null,

    "base_rule": {
        "league_tail": "LEAGUE",
        "double_pick": null,
        "apply_dynamic_global_ban": true,
        "sequence": [
            { "side": "red", "pick": 'ban', "amount": "1" },
            { "side": "blue", "pick": 'ban', "amount": "1" },
            { "side": "red", "pick": 'entry', "amount": "1" },
            { "side": "blue", "pick": 'entry', "amount": "2" },
            { "side": "red", "pick": 'entry', "amount": "2" },
            { "side": "blue", "pick": 'entry', "amount": "1" },
            { "side": "blue", "pick": 'ban', "amount": "1" },
            { "side": "red", "pick": 'ban', "amount": "1" },
            { "side": "blue", "pick": 'entry', "amount": "1" },
            { "side": "red", "pick": 'entry', "amount": "2" },
            { "side": "blue", "pick": 'entry', "amount": "2" },
            { "side": "red", "pick": 'entry', "amount": "1" },
            { "side": "red", "pick": 'ban', "amount": "1" },
            { "side": "blue", "pick": 'ban', "amount": "1" },
            { "side": "red", "pick": 'entry', "amount": "1" },
            { "side": "blue", "pick": 'entry', "amount": "2" },
            { "side": "red", "pick": 'entry', "amount": "1" },
            { "side": "red", "pick": 'entry', "amount": "0" },
            { "side": "blue", "pick": 'entry', "amount": "0" },
            "reserved"
        ],

        "addSecDefaults": {
            "constell": 0,
            "weapon": 0,
            "refine": 0,
            "disadv": 0,
            "adjust": 0,
        },
    
        "cost_amount": 30,
        "": ""
    },

    "alter_default": 0,

    "rule_alter": [
        {
            "name": "튜토리얼",
            "name_full": "Tutorial",
            "score_range": "10-19",
            "established": true,
            "selectable": true,
            "over_cost_ratio": 10,
            "apply_dynamic_global_ban": false,
    
            "": ""
        },
        {
            "name": "비기너",
            "name_full": "Beginner",
            "score_range": "10-19",
            "established": true,
            "selectable": true,
            "apply_dynamic_global_ban": false,
    
            "cost_amount": 32,
            "": ""
        },
        {
            "name": "아마추어",
            "name_full": "Amateur",
            "score_range": "20-34",
            "established": true,
            "selectable": true,
    
            "cost_amount": 36,
            "": ""
        },
        {
            "name": "프로 (테스트)",
            "name_full": "Pro(Test)",
            "score_range": "35-54",
            "established": false,
            "selectable": false,
            "sequence": [
                { "side": "red", "pick": 'ban', "amount": "1" },
                { "side": "blue", "pick": 'ban', "amount": "2" },
                { "side": "red", "pick": 'ban', "amount": "1" },
                { "side": "red", "pick": 'entry', "amount": "1" },
                { "side": "blue", "pick": 'entry', "amount": "2" },
                { "side": "red", "pick": 'entry', "amount": "2" },
                { "side": "blue", "pick": 'entry', "amount": "1" },
                { "side": "red", "pick": 'ban', "amount": "1" },
                { "side": "blue", "pick": 'ban', "amount": "1" },
                { "side": "blue", "pick": 'entry', "amount": "1" },
                { "side": "red", "pick": 'entry', "amount": "2" },
                { "side": "blue", "pick": 'entry', "amount": "2" },
                { "side": "red", "pick": 'entry', "amount": "1" },
                { "side": "blue", "pick": 'ban', "amount": "1" },
                { "side": "red", "pick": 'ban', "amount": "1" },
                { "side": "red", "pick": 'entry', "amount": "1" },
                { "side": "blue", "pick": 'entry', "amount": "2" },
                { "side": "red", "pick": 'entry', "amount": "1" },
                { "side": "blue", "pick": 'entry', "amount": "0" },
                { "side": "red", "pick": 'entry', "amount": "0" },
                "reserved"
            ],
                
            "cost_amount": 45,
        },
        {
            "name": "프로",
            "name_full": "Pro",
            "score_range": "35-54",
            "established": true,
            "selectable": true,
            "sequence": [
                { "side": "red", "pick": 'ban', "amount": "1" },
                { "side": "blue", "pick": 'ban', "amount": "2" },
                { "side": "red", "pick": 'ban', "amount": "1" },
                { "side": "red", "pick": 'entry', "amount": "1" },
                { "side": "blue", "pick": 'entry', "amount": "2" },
                { "side": "red", "pick": 'entry', "amount": "2" },
                { "side": "blue", "pick": 'entry', "amount": "1" },
                { "side": "red", "pick": 'ban', "amount": "1" },
                { "side": "blue", "pick": 'ban', "amount": "1" },
                { "side": "blue", "pick": 'entry', "amount": "1" },
                { "side": "red", "pick": 'entry', "amount": "2" },
                { "side": "blue", "pick": 'entry', "amount": "2" },
                { "side": "red", "pick": 'entry', "amount": "1" },
                { "side": "blue", "pick": 'ban', "amount": "1" },
                { "side": "red", "pick": 'ban', "amount": "1" },
                { "side": "blue", "pick": 'ban weapon', "amount": "1" },
                { "side": "red", "pick": 'ban weapon', "amount": "1" },
                { "side": "red", "pick": 'entry', "amount": "1" },
                { "side": "blue", "pick": 'entry', "amount": "2" },
                { "side": "red", "pick": 'entry', "amount": "1" },
                { "side": "blue", "pick": 'entry', "amount": "0" },
                { "side": "red", "pick": 'entry', "amount": "0" },
                "reserved"
            ],
                
            "cost_amount": 46,
            "": ""
        },
    ],

    "cost_table": {
        "diluc":       [1, 1, 1, 1, 1, 1, 1],
        "klee":        [2, 2, 3, 3, 4, 4, 4],
        "hutao":       [3, 4, 4, 5, 5, 5, 5],
        "yoimiya":     [1, 1, 1, 1, 1, 1, 3],
        "dehya":       [1, 1, 2, 2, 2, 2, 3],
        "lyney":       [4, 5, 6, 7, 8, 9, 11],
        "arlecchino":  [5, 7, 8, 9, 10, 10, 13],

        "mona":        [1, 2, 2, 3, 4, 4, 4],
        "tartaglia":   [2, 3, 3, 4, 5, 6, 6],
        "kokomi":      [2, 2, 2, 2, 2, 2, 2],
        "ayato":       [2, 3, 4, 5, 6, 7, 9],
        "yelan":       [5, 6, 7, 8, 9, 10, 13],
        "nilou":       [3, 4, 5, 5, 5, 5, 7],
        "neuvillette": [7, 9, 10, 11, 11, 11, 14],
        "furina":      [6, 7, 8, 9, 10, 11, 13],

        "qiqi":        [0, 0, 0, 0, 0, 0, 0],
        "ganyu":       [1, 2, 3, 4, 5, 5, 6],
        "eula":        [0, 1, 2, 3, 3, 3, 5],
        "ayaka":       [2, 2, 3, 4, 6, 6, 7],
        "aloy":        [0, 0, 0, 0, 0, 0, 0],
        "shenhe":      [2, 3, 4, 4, 4, 4, 6],
        "wriothesley": [2, 4, 5, 6, 7, 8, 10],

        "keqing":      [2, 2, 2, 2, 2, 2, 3],
        "shogun":      [3, 4, 6, 7, 7, 7, 7],
        "yae":         [2, 3, 4, 5, 6, 7, 9],
        "cyno":        [1, 1, 2, 2, 2, 2, 4],
        "clorinde":    [2, 4, 7, 9, 10, 10, 12],

        "jean":        [1, 1, 2, 2, 3, 3, 3],
        "venti":       [3, 3, 3, 3, 3, 3, 4],
        "xiao":        [2, 3, 3, 3, 3, 4, 5],
        "kazuha":      [5, 6, 7, 7, 7, 7, 8],
        "wanderer":    [3, 4, 5, 7, 7, 7, 9],
        "liuyun":      [3, 4, 6, 6, 6, 6, 7],

        "zhongli":     [3, 3, 3, 3, 4, 4, 4],
        "albedo":      [1, 1, 1, 1, 1, 1, 1],
        "itto":        [1, 1, 2, 2, 2, 3, 5],
        "navia":       [3, 4, 5, 6, 7, 7, 10],
        "chiori":      [2, 3, 4, 5, 6, 7, 9],

        "tighnari":    [3, 4, 5, 6, 6, 6, 8],
        "nahida":      [6, 6, 8, 9, 10, 10, 12],
        "alhaitham":   [3, 4, 5, 6, 7, 8, 9],
        "baizhu":      [2, 3, 4, 4, 4, 4, 5],

        "treveler":    [1, 1, 1, 1, 1, 1, 1],
        
        
        "amber": 1,
        "xiangling": 4,
        "bennett": 5,
        "xinyan": 0,
        "yanfei": 1,
        "thoma": 2,
        "chevreuse": 4,
        "gaming": 1,

        "babara": 1,
        "xingqiu": 4,
        "candace": 0,

        "kaeya": 1,
        "diona": 1,
        "rosaria": 1,
        "chongyun": 1,
        "layla": 1,
        "mika": 1,
        "freminet": 0,
        "charlotte": 1,

        "lisa": 1,
        "razor": 0,
        "fischl": 3,
        "beidou": 1,
        "sara": 2,
        "shinobu": 3,
        "dori": 1,
        "sethos": 1,

        "sucrose": 2,
        "sayu": 0,
        "heizo": 1,
        "faruzan": 3,
        "lynette": 1,

        "noelle": 1,
        "ningguang": 0,
        "gorou": 1,
        "yunjin": 1,

        "collei": 1,
        "yaoyao": 1,
        "kaveh": 0,
        "kirara": 1,

        "": []
    },

    "global_banned": {
        // "neuvillette": true,
        // "arlecchino": true,
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