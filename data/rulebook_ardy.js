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
    "rule_version": "v.0.2.8",

    "rule_type": "cost",

    "sequence": null,

    "ban_card_accure": null,

    "base_rule": {
        "league_tail": "LEAGUE",
        "rule_type": "cost",
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
            { "side": "blue", "pick": 'entry', "amount": "0" },
            { "side": "red", "pick": 'entry', "amount": "0" },
            "reserved"
        ],

        "prebanSelection": null,

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

    "alter_default": 6,

    "rule_alter": [
        {
            "name": "블라인드 밴",
            "name_full": "Blinded ban",
            "rule_type": "preban",
            "score_range": "0",
            "established": true,
            "selectable": true,
            "apply_dynamic_global_ban": false,
            "sequence": [
                { "side": "red", "pick": 'preban', "amount": "5" },
                { "side": "blue", "pick": 'preban', "amount": "5" },
                { "side": "red", "pick": 'entry', "amount": "1" },
                { "side": "blue", "pick": 'entry', "amount": "2" },
                { "side": "red", "pick": 'entry', "amount": "2" },
                { "side": "blue", "pick": 'entry', "amount": "2" },
                { "side": "red", "pick": 'entry', "amount": "2" },
                { "side": "blue", "pick": 'entry', "amount": "2" },
                { "side": "red", "pick": 'entry', "amount": "2" },
                { "side": "blue", "pick": 'entry', "amount": "2" },
                { "side": "red", "pick": 'entry', "amount": "1" },
                { "side": "blue", "pick": 'entry', "amount": "0" },
                { "side": "red", "pick": 'entry', "amount": "0" },
                "reserved"
            ],

            "excludePreban": [
                "treveler", "aloy"
            ],
            "prebanSelections": [
                { "rarity": "5", "amount": 3 },
                { "rarity": "4", "amount": 2 },
            ],
            
            "cost_amount": 128,
            "": ""
        },
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
        {
            "name": "카디컵",
            "name_full": "Cardy cup",
            "rule_type": "cardy",
            "score_range": "0",
            "established": false,
            "selectable": true,
            "apply_dynamic_global_ban": false,
            "sequence": [
                { "side": null, "pick": 'aban', "amount": null },
                { "side": null, "pick": 'jban', "amount": null },
                { "side": "red", "pick": 'ban', "amount": "1" },
                { "side": "blue", "pick": 'ban', "amount": "1" },
                { "side": "red", "pick": 'ban', "amount": "1" },
                { "side": "blue", "pick": 'ban', "amount": "1" },
                { "side": "red", "pick": 'ban', "amount": "1" },
                { "side": "blue", "pick": 'ban', "amount": "1" },
                { "side": "red", "pick": 'entry', "amount": "1" },
                { "side": "blue", "pick": 'entry', "amount": "2" },
                { "side": "red", "pick": 'entry', "amount": "2" },
                { "side": "blue", "pick": 'entry', "amount": "2" },
                { "side": "red", "pick": 'entry', "amount": "1" },
                { "side": "blue", "pick": 'ban', "amount": "1" },
                { "side": "red", "pick": 'ban', "amount": "1" },
                { "side": "blue", "pick": 'entry', "amount": "1" },
                { "side": "red", "pick": 'entry', "amount": "2" },
                { "side": "blue", "pick": 'entry', "amount": "2" },
                { "side": "red", "pick": 'entry', "amount": "2" },
                { "side": "blue", "pick": 'entry', "amount": "1" },
                { "side": "red", "pick": 'entry', "amount": "0" },
                { "side": "blue", "pick": 'entry', "amount": "0" },
                "reserved"
            ],
            
            "cost_amount": 0,
            "": ""
        },
    ],

    "cost_table": {
        "diluc":       [1, 1, 1, 1, 1, 1, 1],
        "klee":        [1, 1, 2, 2, 3, 3, 3],
        "hutao":       [3, 4, 4, 5, 5, 5, 5],
        "yoimiya":     [1, 1, 1, 1, 1, 1, 4],
        "dehya":       [1, 1, 2, 2, 2, 2, 3],
        "lyney":       [5, 6, 7, 8, 9, 10, 12],
        "arlecchino":  [7, 9, 10, 11, 12, 12, 15],

        "mona":        [1, 2, 2, 3, 3, 3, 3],
        "tartaglia":   [1, 2, 2, 3, 4, 5, 5],
        "kokomi":      [2, 2, 2, 2, 2, 2, 2],
        "ayato":       [2, 3, 4, 5, 6, 7, 9],
        "yelan":       [5, 6, 7, 8, 9, 10, 13],
        "nilou":       [3, 4, 5, 5, 5, 5, 6],
        "neuvillette": [9, 11, 12, 13, 13, 13, 16],
        "furina":      [6, 7, 8, 9, 10, 11, 13],
        "sigewinne":   [2, 3, 5, 5, 7, 8, 9],

        "qiqi":        [0, 0, 0, 0, 0, 0, 0],
        "ganyu":       [1, 2, 2, 3, 4, 4, 5],
        "eula":        [0, 0, 0, 1, 1, 1, 2],
        "ayaka":       [1, 1, 2, 3, 5, 5, 6],
        "aloy":        [0, 0, 0, 0, 0, 0, 0],
        "shenhe":      [2, 3, 4, 4, 4, 4, 6],
        "wriothesley": [2, 5, 6, 7, 8, 9, 11],

        "keqing":      [2, 2, 2, 2, 2, 2, 3],
        "shogun":      [2, 3, 5, 6, 6, 6, 6],
        "yae":         [2, 3, 4, 5, 6, 6, 8],
        "cyno":        [0, 0, 1, 1, 1, 1, 2],
        "clorinde":    [2, 5, 9, 11, 12, 12, 14],

        "jean":        [1, 1, 2, 2, 3, 3, 3],
        "venti":       [3, 3, 3, 3, 3, 3, 4],
        "xiao":        [1, 2, 2, 2, 2, 3, 4],
        "kazuha":      [5, 5, 6, 6, 6, 6, 7],
        "wanderer":    [2, 3, 4, 6, 6, 6, 7],
        "liuyun":      [2, 3, 5, 5, 5, 5, 6],

        "zhongli":     [3, 3, 3, 3, 4, 4, 4],
        "albedo":      [1, 1, 1, 1, 1, 1, 1],
        "itto":        [0, 0, 1, 1, 1, 2, 4],
        "navia":       [3, 4, 5, 6, 7, 7, 10],
        "chiori":      [2, 3, 4, 5, 6, 7, 10],

        "tighnari":    [2, 3, 4, 5, 5, 5, 7],
        "nahida":      [6, 6, 8, 9, 10, 10, 12],
        "alhaitham":   [2, 3, 4, 5, 6, 7, 8],
        "baizhu":      [2, 3, 4, 4, 4, 4, 5],
        "emilie":      [2, 4, 6, 6, 7, 7, 8],

        "treveler":    [1, 1, 1, 1, 1, 1, 1],
        
        
        "amber": 1,
        "xiangling": 3,
        "bennett": 4,
        "xinyan": 0,
        "yanfei": 0,
        "thoma": 2,
        "chevreuse": 4,
        "gaming": 1,

        "babara": 1,
        "xingqiu": 3,
        "candace": 0,

        "kaeya": 1,
        "diona": 1,
        "rosaria": 1,
        "chongyun": 0,
        "layla": 1,
        "mika": 0,
        "freminet": 0,
        "charlotte": 1,

        "lisa": 1,
        "razor": 0,
        "fischl": 3,
        "beidou": 1,
        "sara": 2,
        "shinobu": 2,
        "dori": 1,
        "sethos": 1,

        "sucrose": 2,
        "sayu": 0,
        "heizo": 1,
        "faruzan": 3,
        "lynette": 1,

        "noelle": 0,
        "ningguang": 0,
        "gorou": 1,
        "yunjin": 1,

        "collei": 1,
        "yaoyao": 1,
        "kaveh": 0,
        "kirara": 1,

        "": []
    },

    "cardy_rating": {
        "point_table": {},
        "point_sheet": `Characters	0	1	2	3	4	5	6
클로린드	30	55	80	85	100	105	150
사이노	2	2	8	18	20	21	70
각청	2	3	4	5	6	6	6
라이덴	14	16	50	65	70	70	75
미코	16	24	44	54	58	68	78
사라	0	0	0	0	0	0	8
아야토	10	12	18	24	28	32	70
푸리나	35	60	80	110	120	125	150
코코미	10	11	11	11	12	12	13
시그윈	5	6	24	25	26	27	70
모나	6	8	8	8	10	10	10
닐루	35	37	80	80	80	80	85
타르탈리아	6	8	9	12	14	16	30
야란	18	23	45	55	65	70	130
느비예트	50	80	90	115	115	115	150
알하이탐	22	22	30	36	38	42	70
백출	10	10	24	24	26	26	60
에밀리	30	50	65	75	80	85	130
나히다	22	24	80	85	90	92	130
타이나리	4	6	8	10	12	12	22
진	2	2	3	3	6	6	6
카즈하	30	35	40	41	42	43	60
방랑자	20	21	32	36	38	42	122
벤티	5	5	6	7	8	9	20
소	20	21	21	21	21	23	82
한운	30	30	80	80	80	80	130
파루잔	0	0	0	0	0	0	16
아를레키노	50	80	95	115	115	115	150
가명	0	0	0	0	0	0	10
다이루크	8	8	8	8	8	8	8
호두	18	45	47	50	52	55	57
클레	4	5	20	22	24	26	28
데히야	8	9	10	11	13	14	20
요이미야	4	5	6	7	8	8	50
리니	22	34	42	60	75	80	125
슈브르즈	45	45	45	40	70	70	80
아야카	20	20	28	36	70	71	85
유라	5	6	7	8	9	10	50
감우	10	12	13	14	15	16	45
치치	0	0	0	0	0	0	0
신학	5	10	12	16	16	16	50
라이오슬리	10	20	25	45	50	55	130
알베도	20	20	20	25	26	26	30
치오리	35	55	70	85	100	102	140
이토	30	35	38	40	45	55	100
나비아	70	72	95	110	125	127	170
종려	70	71	72	73	74	75	76
고로	0	0	0	0	0	0	5`,

        "diff_limit": 100,

        "aban_pointer": [100, 200, 300, 500, 600, 900, 1000, 1100, 1300, 1400, 1500, 1600, 1700, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200],
        "jban_pointer": [400, 800, 1200],

        "": ""
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