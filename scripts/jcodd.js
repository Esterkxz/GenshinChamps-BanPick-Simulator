/*

MIT License

Copyright (c) 2023 Esterkxz (Ester1 / 에스터1z)

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

// JSON Characterized Object Data Definition //
//
// The JSON based lite code format
//
// v0.3 / release 2024.07.21
//
// Take to be liten from JSON code to smaller converted characters for like as BASE64.
//
//
// :: Code regulations
//
// 1. null is n.
// 2. No space and carriage return & line feed on code. Only allowed in data.
// 3. Omit "" variable definition.

let Jcodd = {

    /**
     * Characterize JSON
     * 
     * @param {string} json 
     * 
     * @returns {string} jcodd
     */
    toCodd: function (json) {
        var ex;
        //Get clean json
        let p1 = JSON.stringify(JSON.parse(json));
        //Convert null to n
        let p2 = p1.replace(/([\[\,\:])null([\]\,\}])/g, "$1n$2").replace(/([\[\,\:])null([\]\,\}])/g, "$1n$2");
        //Remove ""
        let p3 = p2.replace(/([\{\,])\"([^\"]*)\"\:/g, "$1$2:");
        //Check convert unicode
        if (p3.match(/[\u0000-\u001F|\u0080-\uFFFF]/g) != null) {
            let p4 = this.escape(p3);
            ex = p4;
        } else ex = p3;

        // console.log(p1);
        // console.log(p2);
        // console.log(p3);
        // console.log(ex);

        return ex;
    },

    /**
     * Convert object to JCODD directly
     * 
     * @param {object} obj 
     * 
     * @returns {string} JCODD
     */
    coddify: function (obj) {
        let json = JSON.stringify(obj);

        return this.toCodd(json);
    },

    /**
     * Parse JCODD to JSON
     * 
     * @param {string} codd 
     * 
     * @return {string} json
     */
    toJson: function (codd) {
        //Assign ""
        let p1 = codd.replace(/([\{\,])([^\"\:]*)\:/g, '$1"$2":');
        //Convert n to null
        let p2 = p1.replace(/([\[\,\:])n([\]\,\}])/g, "$1null$2").replace(/([\[\,\:])n([\]\,\}])/g, "$1null$2");

        return p2;
    },

    /**
     * Convert JCODD to object directly
     * 
     * @param {string} codd 
     * 
     * @returns {*} object
     */
    parse: function (codd) {
        let json = this.toJson(codd);

        return JSON.parse(json);
    },

    /**
     * Return to be escaped unicode character from char code
     * 
     * @param {Integer} cc  Char Code
     * 4
     * @returns {String} escaped
     */
    esc: function (cc) {
        if (cc < 0x20 || cc > 0x7e) {
            let x16 = cc.toString(16);
            var ex;
            if (x16.length > 2) ex = "%u" + x16.padStart(4, '0').toUpperCase();
            else ex = "%" + x16.padStart(2, '0').toUpperCase();
            return ex;
        } else return String.fromCharCode(cc);
    },

    /**
     * Return to be escaped unicode characters in string
     * 
     * @param {String} str
     * 4
     * @returns {String} escaped
     */
    escape: function (str) {
        var escaped = "";
        for (var i=0; i<str.length; i++) {
            escaped += this.esc(str.charCodeAt(i));
        }
        return escaped;
    },
}

let JCODD = function(jcodd) {
    return Jcodd.parse(jcodd);
}
