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
    "rule_version": "v.0.3.0",

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
    
            "cost_amount": 30,
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
        "diluc":       [0, 0, 0, 0, 0, 0, 0],
        "klee":        [1, 1, 2, 2, 2, 2, 2],
        "hutao":       [2, 4, 4, 4, 4, 4, 4],
        "yoimiya":     [1, 1, 1, 1, 1, 1, 3],
        "dehya":       [1, 1, 1, 1, 1, 1, 1],
        "lyney":       [6, 7, 8, 9, 10, 11, 13],
        "arlecchino":  [8, 10, 11, 12, 13, 13, 16],

        "mona":        [0, 0, 0, 0, 0, 0, 0],
        "tartaglia":   [1, 1, 1, 1, 1, 1, 1],
        "kokomi":      [2, 2, 2, 2, 2, 2, 2],
        "ayato":       [1, 2, 3, 4, 5, 6, 8],
        "yelan":       [4, 5, 6, 7, 8, 9, 11],
        "nilou":       [3, 3, 5, 5, 5, 5, 7],
        "neuvillette": [10, 12, 13, 15, 16, 16, 18],
        "furina":      [5, 6, 7, 8, 9, 10, 11],
        "sigewinne":   [2, 3, 5, 5, 7, 8, 9],
        "mualani":     [5, 7, 9, 11, 11, 11, 13],

        "qiqi":        [0, 0, 0, 0, 0, 0, 0],
        "ganyu":       [0, 0, 0, 0, 0, 0, 0],
        "eula":        [0, 0, 0, 0, 0, 0, 0],
        "ayaka":       [1, 1, 2, 3, 5, 5, 6],
        "aloy":        [0, 0, 0, 0, 0, 0, 0],
        "shenhe":      [2, 3, 4, 4, 4, 4, 6],
        "wriothesley": [2, 5, 6, 7, 8, 9, 12],

        "keqing":      [0, 0, 0, 0, 0, 0, 0],
        "shogun":      [2, 3, 5, 6, 6, 6, 6],
        "yae":         [2, 3, 4, 5, 6, 6, 8],
        "cyno":        [0, 0, 0, 0, 0, 0, 0],
        "clorinde":    [2, 6, 10, 11, 12, 13, 15],

        "jean":        [0, 0, 0, 0, 0, 0, 0],
        "venti":       [2, 2, 2, 2, 2, 2, 2],
        "xiao":        [1, 2, 2, 2, 2, 2, 2],
        "kazuha":      [4, 4, 5, 5, 5, 5, 6],
        "wanderer":    [1, 2, 3, 5, 5, 5, 9],
        "liuyun":      [4, 5, 7, 7, 7, 7, 7],

        "zhongli":     [3, 3, 3, 3, 3, 3, 3],
        "albedo":      [0, 0, 0, 0, 0, 0, 0],
        "itto":        [0, 0, 0, 0, 0, 0, 0],
        "navia":       [4, 5, 6, 7, 8, 8, 13],
        "chiori":      [1, 2, 3, 4, 5, 6, 11],
        "xilonen":     [3, 3, 4, 4, 5, 5, 6],//[4, 4, 5, 5, 6, 6, 7],

        "tighnari":    [1, 2, 3, 4, 4, 4, 6],
        "nahida":      [5, 5, 6, 7, 8, 8, 10],
        "alhaitham":   [3, 3, 3, 3, 4, 4, 5],
        "baizhu":      [2, 2, 3, 3, 3, 3, 4],
        "emilie":      [5, 6, 8, 9, 10, 10, 12],
        "kinich":      [5, 7, 9, 11, 12, 12, 13],

        "treveler":    [1, 1, 1, 1, 1, 1, 1],
        
        
        "amber":        1,
        "xiangling":    3,
        "bennett":      4,
        "xinyan":       1,
        "yanfei":       0,
        "thoma":        2,
        "chevreuse":    4,
        "gaming":       0,

        "babara":       1,
        "xingqiu":      3,
        "candace":      0,

        "kaeya":        1,
        "diona":        1,
        "rosaria":      1,
        "chongyun":     0,
        "layla":        1,
        "mika":         0,
        "freminet":     0,
        "charlotte":    1,

        "lisa":         1,
        "razor":        0,
        "fischl":       3,
        "beidou":       1,
        "sara":         2,
        "shinobu":      2,
        "dori":         1,
        "sethos":       1,

        "sucrose":      2,
        "sayu":         0,
        "heizo":        2,
        "faruzan":      3,
        "lynette":      1,

        "noelle":       0,
        "ningguang":    0,
        "gorou":        1,
        "yunjin":       1,
        "kachina":      2,

        "collei":       1,
        "yaoyao":       1,
        "kaveh":        0,
        "kirara":       1,

        "": []
    },

    "cardy_rating": {
        "point_table": {},
        "point_sheet": `Characters	0	1	2	3	4	5	6
클로린드	25	60	80	90	100	105	150
사이노	7	10	15	18	19	20	30
각청	5	5	5	6	8	8	10
라이덴	12	14	55	70	72	72	75
미코	15	18	30	37	45	53	75
사라	0	0	0	0	0	0	8
아야토	5	7	12	18	20	21	55
푸리나	25	50	75	82	87	95	135
코코미	7	8	9	10	11	12	13
시그윈	6	8	20	22	30	32	60
모나	7	8	8	9	12	12	12
닐루	7	8	20	20	20	20	22
타르탈리아	9	10	11	13	15	17	22
야란	20	30	55	65	80	85	120
느비예트	35	70	77	90	91	92	130
말라니	40	70	80	90	98	100	150
알하이탐	20	21	35	45	50	55	90
백출	7	9	12	12	15	15	20
에밀리	15	30	40	55	65	70	130
나히다	15	16	65	70	80	86	100
타이나리	10	15	18	20	28	29	48
키니치	35	50	80	90	98	100	150
진	5	5	6	6	8	8	9
카즈하	28	35	45	45	45	45	50
방랑자	8	10	15	20	30	35	60
벤티	5	5	10	10	10	10	15
소	10	12	12	13	13	15	30
한운	20	22	60	60	60	60	65
파루잔	0	0	0	0	0	0	10
아를레키노	50	85	95	105	106	107	160
가명	0	0	0	0	0	0	25
다이루크	2	3	3	3	4	4	5
호두	22	55	57	65	66	67	70
클레	4	4	15	16	17	18	20
데히야	2	3	5	6	7	8	20
요이미야	5	6	10	15	16	16	45
리니	25	40	50	60	75	80	125
슈브르즈	20	22	22	22	25	25	35
아야카	15	16	25	38	55	55	70
유라	1	2	3	5	8	8	30
감우	4	6	7	8	12	12	25
치치	0	0	0	0	0	0	0
신학	8	15	20	23	23	26	40
라이오슬리	4	15	18	30	33	35	100
알베도	1	1	2	2	3	3	4
치오리	12	25	40	55	75	77	130
이토	8	11	13	14	15	16	60
나비아	40	43	65	75	85	87	140
종려	10	11	12	12	12	12	12
고로	0	0	0	0	0	0	0`,

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