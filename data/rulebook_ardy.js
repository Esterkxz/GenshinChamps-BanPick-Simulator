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
        "mualani":     [2, 4, 5, 6, 7, 8, 10],

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
        "kachina": 1,

        "collei": 1,
        "yaoyao": 1,
        "kaveh": 0,
        "kirara": 1,

        "": []
    },

    "cardy_rating": {
        "point_table": {},
        "point_sheet": `Characters	0	1	2	3	4	5	6
클로린드	18	50	70	75	85	90	130
사이노	2	3	10	12	14	15	30
각청	8	8	8	10	12	12	15
라이덴	12	14	55	70	72	72	75
미코	15	17	28	35	45	48	75
사라	0	0	0	0	0	0	5
아야토	8	13	18	28	38	39	55
푸리나	25	50	75	82	87	97	130
코코미	7	8	9	10	11	12	13
시그윈	5	8	20	22	30	32	60
모나	7	8	8	9	10	10	10
닐루	25	27	55	55	55	55	57
타르탈리아	7	8	9	11	13	15	20
야란	17	25	45	55	65	67	100
느비예트	35	70	77	90	91	92	130
말라니	14	28	42	56	68	80	99
알하이탐	23	24	35	40	50	55	75
백출	7	10	15	15	18	18	20
에밀리	18	35	50	55	75	80	110
나히다	15	16	70	75	85	86	105
타이나리	5	8	10	11	15	16	35
진	5	6	8	8	10	10	11
카즈하	28	35	45	45	45	45	50
방랑자	10	15	20	30	40	45	70
벤티	8	8	15	15	15	15	20
소	20	22	22	23	23	25	40
한운	30	35	60	60	60	60	65
파루잔	0	0	0	0	0	0	12
아를레키노	40	75	85	95	96	97	145
가명	0	0	0	0	0	0	10
다이루크	5	5	6	6	7	7	8
호두	20	45	47	53	54	55	57
클레	10	10	20	21	22	23	25
데히야	5	7	10	12	15	17	20
요이미야	10	11	15	18	19	19	55
리니	30	45	55	65	80	85	125
슈브르즈	40	42	42	42	45	45	55
아야카	15	16	25	38	60	61	70
유라	8	10	11	17	20	20	55
감우	8	16	17	18	24	24	50
치치	0	0	0	0	0	0	0
신학	8	15	20	23	23	26	40
라이오슬리	8	18	28	40	43	45	100
알베도	7	8	10	12	13	13	15
치오리	10	20	30	40	50	52	130
이토	15	22	25	27	29	31	90
나비아	50	55	80	90	100	105	150
종려	30	31	32	32	32	32	34
고로	0	0	0	0	0	0	5`,

        "diff_limit": 100,

        "aban_pointer": [80, 160, 320, 400, 560, 640, 800, 880, 960, 1040, 1120, 1200, 1280, 1360, 1440, 1520, 1600, 1680, 1760, 1840, 1920, 2000, 2080, 2160, 2240, 2320, 2400, 2480, 2560, 2640, 2720],
        "jban_pointer": [240, 480, 720],

        "": ""
    },

    "cardy_self_bans": 5,


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