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
    "rule_version": "v.0.2.7",

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

    "alter_default": 0,

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
        "yoimiya":     [1, 1, 1, 1, 1, 1, 3],
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
        "adds_table": {},
        "adds_sheet": `Characters	0	1	2	3	4	5	6
클로린드	42	64	86	96	114	120	190
사이노	8	12	28	32	35	37	67
각청	6	6	6	6	8	8	14
라이덴	38	40	72	86	90	92	92
미코	39	41	58	66	68	72	120
사라	0	1	1	2	2	3	16
아야토	28	34	48	52	56	60	120
푸리나	50	70	110	125	130	140	199
코코미	26	32	32	32	34	34	34
시그윈	20	27	40	41	60	62	90
모나	16	20	20	24	28	28	28
닐루	38	42	84	86	90	92	100
타르탈리아	20	26	28	34	40	44	52
야란	42	56	80	88	120	126	170
느비예트	80	110	120	140	150	150	210
알하이탐	55	57	67	73	83	87	123
백출	20	22	34	35	39	40	51
에밀리	40	50	58	62	68	70	130
나히다	44	46	90	92	100	102	160
타이나리	10	15	20	20	25	28	70
진	6	6	10	10	16	16	16
카즈하	50	56	70	70	72	72	82
방랑자	22	27	35	38	42	45	120
벤티	30	30	30	30	34	34	45
소	16	21	23	25	25	28	95
한운	18	20	58	58	58	58	80
파루잔	2	4	4	4	6	6	32
아를레키노	50	80	90	95	99	105	190
가명	1	1	1	1	4	4	12
다이루크	6	8	8	8	8	8	8
호두	34	50	56	62	65	67	82
클레	6	8	25	27	33	35	39
데히야	2	3	4	5	7	8	15
요이미야	10	11	15	16	18	20	42
리니	42	56	70	78	90	95	140
슈브르즈	20	24	24	24	28	28	40
아야카	22	24	44	48	80	84	100
유라	2	4	6	8	12	14	74
감우	8	14	16	18	24	25	60
치치	1	1	1	1	1	1	2
신학	10	20	28	31	35	37	90
라이오슬리	18	52	62	74	81	85	140
알베도	14	14	18	20	22	23	30
치오리	28	37	50	60	70	71	150
이토	16	24	32	34	35	39	100
나비아	44	46	70	80	98	102	160
종려	24	24	30	30	30	30	30
고로	1	1	1	1	1	1	6`,

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