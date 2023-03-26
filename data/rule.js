let rules = {
    "comment": "\
Rule refferenced by 앙리형 (Angri-hyung / brother Henry - Streamer & Youtuber)\n\
Youtube: https://www.youtube.com/@angri_hyung \n\
Twitch(Official): https://www.twitch.tv/angrimoldi \n\
Twitch(for Live): https://www.twitch.tv/angrihyung \n\
\n\
check this videos: \n\
https://www.youtube.com/@angri_hyung/search?query=%EC%9B%90%EC%8B%A0%20%EC%B1%94%EC%8A%A4 \n\
\n\
Rule data created by Esterisk (에스터1z / Ester1z) \n\
* this file is rule data reference and basic standard.\n\
    ",
    "rule_title": "앙챔스 룰북",
    "rule_version": 1.4,

    "sequence": null,
    "cost_amount": -1,

    "base_rule": {
        "league_tail": "LEAGUE",
        "sequence": [
            { "side": "red", "pick": 'ban', "amount": "2" },
            { "side": "blue", "pick": 'ban', "amount": "2" },
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
    
        "cost_amount": 24,
        "": ""
    },

    "alter_default": 2,

    "rule_alter": [
        {
            "name": "무인검 리그",
            "name_full": "무인검",
            "score_range": "10-19",
            "established": true,
            "sequence": [
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
    
            "": ""
        },
        {
            "name": "흑술창 리그",
            "name_full": "흑술창",
            "score_range": "20-34",
            "established": true,

            "cost_amount": 26,
            "": ""
        },
        {
            "name": "제례활 리그",
            "name_full": "제례활",
            "score_range": "35-54",
            "established": true,
            
            "cost_amount": 28,
            "": ""
        },
        {
            "name": "이무기 리그",
            "name_full": "이무기 검",
            "score_range": "55-84",
            "established": true,
            
            "cost_amount": 30,
            "": ""
        },
        {
            "name": "카구라 리그",
            "name_full": "카구라의 진의",
            "score_range": "85-124",
            "established": true,
            
            "cost_amount": 32,
            "": ""
        },
        {
            "name": "일태도 리그",
            "name_full": "무상의 일태도",
            "score_range": "125+",
            "established": true,
            "sequence": [
                { "side": "red", "pick": 'ban', "amount": "2" },
                { "side": "blue", "pick": 'ban', "amount": "2" },
                { "side": "red", "pick": 'entry', "amount": "1" },
                { "side": "blue", "pick": 'entry', "amount": "2" },
                { "side": "red", "pick": 'entry', "amount": "2" },
                { "side": "blue", "pick": 'entry', "amount": "2" },
                { "side": "red", "pick": 'entry', "amount": "1" },
                { "side": "blue", "pick": 'ban', "amount": "2" },
                { "side": "red", "pick": 'ban', "amount": "2" },
                { "side": "blue", "pick": 'entry', "amount": "1" },
                { "side": "red", "pick": 'entry', "amount": "2" },
                { "side": "blue", "pick": 'entry', "amount": "2" },
                { "side": "red", "pick": 'entry', "amount": "2" },
                { "side": "blue", "pick": 'entry', "amount": "1" },
                { "side": "red", "pick": 'entry', "amount": "0" },
                { "side": "blue", "pick": 'entry', "amount": "0" },
                    "reserved"
            ],
                
            "cost_amount": 64,
            "": ""
        },
        {
            "name": "단무지 리그",
            "name_full": "무공의 검",
            "score_range": "20+",
            "established": false,
            "sequence": [
                { "side": "red", "pick": 'ban', "amount": "2" },
                { "side": "blue", "pick": 'ban', "amount": "2" },
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
                { "side": "red", "pick": 'ban weapon', "amount": "2" },
                { "side": "blue", "pick": 'ban weapon', "amount": "2" },
                "reserved"
            ],
            
            "cost_amount": 27,
            "": ""
        },
        {
            "name": "비상식량 리그",
            "name_full": "파공의 백철 땅딸보",
            "score_range": "90+",
            "established": false,
            "sequence": [
                { "side": "red", "pick": 'ban', "amount": "2" },
                { "side": "blue", "pick": 'entry', "amount": "2" },
                { "side": "blue", "pick": 'ban', "amount": "1" },
                { "side": "red", "pick": 'entry', "amount": "3" },
                { "side": "blue", "pick": 'entry', "amount": "2" },
                { "side": "blue", "pick": 'ban', "amount": "2" },
                { "side": "red", "pick": 'entry', "amount": "2" },
                { "side": "red", "pick": 'ban', "amount": "1" },
                { "side": "blue", "pick": 'entry', "amount": "2" },
                { "side": "red", "pick": 'entry', "amount": "1" },
                { "side": "blue", "pick": 'entry', "amount": "1" },
                { "side": "red", "pick": 'entry', "amount": "1" },
                { "side": "blue", "pick": 'entry', "amount": "1" },
                { "side": "red", "pick": 'entry', "amount": "1" },
                { "side": "red", "pick": 'entry', "amount": "0" },
                { "side": "blue", "pick": 'entry', "amount": "0" },
                "reserved"
            ],
            
            "cost_amount": 42,
            "": ""
        },
        {
            "name": "장판원 리그",
            "name_full": "이나즈마 최고의\n장난감 판매원",
            "score_range": "70+",
            "established": false,
            "sequence": [
                { "side": "red", "pick": 'entry', "amount": "1" },
                { "side": "blue", "pick": 'entry', "amount": "1" },
                { "side": "blue", "pick": 'proffer', "amount": "1" },
                { "side": "red", "pick": 'proffer', "amount": "1" },
                { "side": "blue", "pick": 'entry', "amount": "2" },
                { "side": "red", "pick": 'entry', "amount": "2" },
                { "side": "blue", "pick": 'proffer', "amount": "1" },
                { "side": "blue", "pick": 'ban', "amount": "1" },
                { "side": "red", "pick": 'proffer', "amount": "1" },
                { "side": "red", "pick": 'ban', "amount": "1" },
                { "side": "blue", "pick": 'entry', "amount": "1" },
                { "side": "blue", "pick": 'proffer', "amount": "1" },
                { "side": "red", "pick": 'entry', "amount": "1" },
                { "side": "red", "pick": 'proffer', "amount": "1" },
                { "side": "blue", "pick": 'entry', "amount": "1" },
                { "side": "red", "pick": 'entry', "amount": "1" },
                { "side": "red", "pick": 'entry', "amount": "0" },
                { "side": "blue", "pick": 'entry', "amount": "0" },
                "reserved"
            ],
            
            "cost_amount": 36,
            "": ""
        }
    ],

    "additional_cost": {
        "minimum": 0,
        "maximum": 3,
        "conditions": [
        // { "cond_item_1": "equals_for", "cond_item_2": "comp_op / space / value" ...(and ops), "cost": pos/neg integer num for accrue adds },
            { "c_class": "limited", "c_constellations": ">= 1", "cost": 1 },
            { "c_class": "limited", "c_constellations": ">= 3", "cost": 1 },
            { "c_class": "limited", "c_constellations": ">= 6", "cost": 1 }
        ]

        // "character_level": {},
        // "character_level_exceeds": {},
        // "character_weapon": {},
        // "character_weapon_grade": {},
        // "character_weapon_level": {},
        // "character_weapon_refine": {},
        // "character_artifact": {},
        // "character_constellations": {
        //     "1": 1,
        //     "2": 2,
        //     "6": 3
        // },
        // "character_skills_normal": {},
        // "character_skills_elemental": {},
        // "character_skills_ultimate": {}
    },

    "characters_override": {
        "comment": "\
For using alter of characters classification by rule \n\
        ",
        "tighnari": {
            "class": "limited"
        }
    },

    "weapons_override": {
        "comment": "\
For using alter of weapons classification by rule \n\
        "
    }
}