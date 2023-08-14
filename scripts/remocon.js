var openerEstablished;

var port;

window.addEventListener('event', (e) => {
    port = e.ports[0];
    port.postMessage({"op": "init", "document": document, "body": document.body});
    port.addEventListener('message', (e) => {
        console.log(e.data);
    });
});

function initialize() {
    // openerEstablished = opener.let.established;
    // opener.popupMaster.register(name, document, document.body);
    // opener.popupMaster.bind(window);
}

function checkRefreshed() {
    //if (openerEstablished != opener.let.established) initialize();
}

$(document).ready(function() {
    initialize();
});

