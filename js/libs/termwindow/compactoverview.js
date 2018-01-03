// Copyright 2016 Lenovo
;(function() {
'use strict';
var compactactive = false;
function partition_list(sourcelist, partitions) {
    var chunksize = Math.ceil(sourcelist.length / partitions);
    var partitioned = [];
    for (var i = 0; i < sourcelist.length; i += chunksize) {
        partitioned[partitioned.length] = sourcelist.slice(i, i + chunksize);
    }
    return partitioned;
}
function doPower() {
    var targets = this[0];
    var newstate = this[1];
    postRequest('/confluent-api/noderange/' + targets + '/power/state',
                {state: newstate}, donull, null, processPowerState);
}

function changePower() {
    var newstate = this;
    var targets = [];
    for (var node in noderowmap) {
        if (noderowmap[node].style.display == 'block') {
            targets.push(node);
        }
    }
    var question = l('Do you want to change power for') + ' ' + targets.length + ' ' + l('systems?');
    targets = targets.join(',');
    confirmAction(question, doPower.bind([targets, newstate]));
}
function PopRight(renderer, below) {
    var self = this;
    self.renderer = renderer;
    self.stayactive = false;
    self.below = below;
    self.createElem = function() {
        if (self.mydiv) { return; }
        self.mydiv = document.createElement('div');
        self.mydiv.classList.add('popright');
        self.renderer(self.mydiv);
    };
    self.removeElem = function() {
        if (!self.mydiv) { return; }
        self.mydiv.parentElement.removeChild(self.mydiv);
        self.mydiv = false;
    };
    self.activate = function(parent) {
        self.createElem();
        if (self.below) {
            self.mydiv.style.top = parent.getBoundingClientRect().bottom + window.pageYOffset + 'px';
            self.mydiv.style.left = parent.getBoundingClientRect().left + window.pageXOffset + 'px';
        } else {
            self.mydiv.style.top = parent.getBoundingClientRect().top + window.pageYOffset + 'px';
            self.mydiv.style.left = parent.getBoundingClientRect().right + window.pageXOffset + 'px';
        }
        document.getElementById('main').appendChild(self.mydiv);
    };
    self.ignore = function(evt) {
        evt.stopImmediatePropagation();
    };
    self.clickactivate = function(evt) {
        self.stayactive = true;
        //self.mydiv.style.borderWidth = '3px';
        self.mydiv.style.boxShadow = '0 0 10px #000000';
        this.removeEventListener('mouseleave', self.hoverdeactivate);
        this.removeEventListener('click', self.clickactivate);
        self.mydiv.addEventListener('click', self.ignore);
        document.addEventListener('click', self.deactivate);
        self.parentelem = this;
        self.activate(this);
        self.mydiv.removeEventListener('mouseleave', self.hoverdeactivate);
    };
    self.hoveractivate = function(evt) {
        self.parentelem = this;
        this.addEventListener('mouseleave', self.hoverdeactivate);
        this.removeEventListener('mouseenter', self.hoveractivate);
        self.activate(this);
        self.mydiv.addEventListener('mouseleave', self.hoverdeactivate);
    };
    self.hoverdeactivate = function(e) {
        if (e.relatedTarget == self.mydiv) {
            return;
        }
        self.mydiv.removeEventListener('mouseleave', self.hoverdeactivate);
        self.parentelem.removeEventListener('mouseleave', self.hoverdeactivate);
        self.parentelem.addEventListener('mouseenter', self.hoveractivate);
        self.removeElem();
    };
    self.deactivate = function() {
        if (self.stayactive) {
            self.stayactive = false;
            return;
        }
        self.mydiv.style.borderWidth = '1px';
        document.removeEventListener('click', self.deactivate)
        self.parentelem.addEventListener('mouseenter', self.hoveractivate);
        self.parentelem.addEventListener('click', self.clickactivate);
        self.removeElem();
    };
    return self;
}

function nodeQuickActions(icon, nodename, consolemode, below) {
    var self = this;
    self.nodename = nodename;
    self.openConsole = function(e) {
            self.nqp.deactivate();
            new TerminalWindow("/confluent-api/nodes/" + self.nodename + "/console/session", self.nodename + ' ' + l('Console'), e.clientX-220, e.clientY-5, quickIcon(self.nodename, true, true));
    };
    self.openShell = function(e) {
            self.nqp.deactivate();
            new TerminalWindow("/confluent-api/nodes/" + self.nodename + "/shell/sessions/", self.nodename + ' ' + l('Shell'), e.clientX-220, e.clientY-5);
    };
    self.renderInto = function(container) {
        container.appendChild(document.createTextNode(self.nodename + ' ' + l('Quick Actions')));
        container.appendChild(document.createElement('hr'));
        var menu = document.createElement('ul');
        menu.classList.add('menu');
        container.appendChild(menu);
        addMenuItem(menu, 'Identify', donull, 'lightbulb-o');
        if (consolemode) {
            addMenuItem(menu, 'Send Break', donull, 'chain-broken');
        } else {
            addMenuItem(menu, 'Open Console', self.openConsole, 'desktop');
        }
        addMenuItem(menu, 'Open Shell', self.openShell, 'terminal');
        addMenuItem(menu, 'Notate', donull, 'pencil-square-o');
    };
    self.nqp = new PopRight(self.renderInto, below);
    icon.addEventListener('mouseenter', self.nqp.hoveractivate);
    icon.addEventListener('click', self.nqp.clickactivate);
    return self;
}
function healthInfo(icon, health, nodename, healthsummary) {
    var self = this;
    self.health = health;
    self.nodename = nodename;
    self.healthsummary = healthsummary;
    self.renderInto = function (container) {
        container.appendChild(document.createTextNode(self.nodename));
        if (typeof self.health == 'string') {
            container.appendChild(document.createTextNode(': ' + self.health));
            return;
        } else if (self.healthsummary == 'ok') {
            container.appendChild(document.createTextNode(': ok'));
            return;
        }
        container.appendChild(document.createElement('hr'));
        for (var i = 0; i < self.health.sensors.length; i++) {
            renderreading(container, self.health.sensors[i]);
            container.appendChild(document.createElement('br'));
        }
    };
    var healthdlg = new PopRight(self.renderInto);
    icon.addEventListener('mouseenter', healthdlg.hoveractivate);
    icon.addEventListener('click', healthdlg.clickactivate);
}

function renderreading(container, reading) {
    var newspan = document.createElement('span');
    var healthicon = document.createElement('i');
    //critical.svg  failed.svg  ok.svg  unknown.svg  warning.svg
    if (reading.health == 'warning') {
        healthicon.setAttribute('class', 'fa fa-exclamation-triangle yellow');
    } else if (reading.health == 'failed'  || reading.health == 'critical') {
        healthicon.setAttribute('class', 'fa fa-times-circle red');
    } else if (reading.health == 'unknown') {
        healthicon.setAttribute('class', 'fa fa-question');
    } else if (reading.health == 'ok') {
        healthicon.setAttribute('class', 'fa fa-check-square-o green');
    }
    newspan.appendChild(healthicon);
    var healthstr = reading.name + ': ' + reading.states.join();
    if (reading.value != null) {
        healthstr += ' ' + reading.value;
    }
    var healthnode = document.createTextNode(healthstr);
    newspan.appendChild(healthnode);
    container.appendChild(newspan);
}

function makepower(dlg, currpower) {
    if (currpower == 'on') {
        valid_power = [ "shutdown", "off", "reset" ];
    } else {
        valid_power = [ "on" ];
    }
    valid_power.forEach(function(dostate) {
        newdiv = document.createElement('div');
        newdiv.appendChild(document.createTextNode(dostate));
        dlg.mydiv.appendChild(newdiv);
    });
}
var powertimeout;
var healthtimeout;

function processPowerState(powerdata) {
    if (!compactactive) { return; }
    if ('_requestdone' in powerdata) {
        powertimeout = setTimeout(getchunkpower, 10000);
    }
    if (!powerdata.hasOwnProperty('databynode')) {
        return;
    }
    if (!Array.isArray(powerdata.databynode)) {
        powerdata.databynode = [powerdata.databynode];
    }
    for (var i = 0; i < powerdata.databynode.length; i++) {
        var datum = powerdata.databynode[i];
        for (var nodename in datum) {
            var powerbutton = document.getElementById("power-" + nodename);
            if ('state' in datum[nodename]) {
                var newpb = document.createElement('span')
                newpb.setAttribute('title', datum[nodename].state.value);
                newpb.id = 'power-' + nodename;
                if (datum[nodename].state.value == 'off') {
                    newpb.setAttribute('class', 'fa fa-power-off powericon');
                } else {
                    newpb.setAttribute('class', 'poweron fa fa-power-off powericon');
                }
                powerbutton.parentNode.replaceChild(newpb, powerbutton);
                // ns
            //askpwrdlg = new Dialog('powerdlg-' + this.nodename);
            //makepower(askpwrdlg, data.state.value);
            //powerbutton.addEventListener('click', askpwrdlg.promptactivate);
            // end ns
            } else if ('error' in datum[nodename]) {
                newpb = document.createElement('span')
                newpb.id = 'power-' + nodename;
                newpb.setAttribute('title', datum[nodename].error);
                newpb.setAttribute('class', 'fa fa-question powericon');
                powerbutton.parentNode.replaceChild(newpb, powerbutton);
            }
        }
    }
}

function filterHealth() {
    var allowedhealth = this;
    for (var nodename in nodehealthmap) {
        if (allowedhealth.indexOf(nodehealthmap[nodename]) > -1) {
            noderowmap[nodename].style.display = 'block';
        } else {
            noderowmap[nodename].style.display = 'none';
        }
    }

}

function processHealth(healthdata) {
    var healthbynode = {};
    var healthsum;
    if (!compactactive) { return; }
    if ('_requestdone' in healthdata) {
        healthtimeout = setTimeout(getchunkhealth, 30000);
    }
    if (!healthdata.hasOwnProperty('databynode')) {
        return;
    }
    if (!Array.isArray(healthdata.databynode)) {
        healthdata.databynode = [healthdata.databynode];
    }
    for (var i = 0; i < healthdata.databynode.length; i ++) {
        var datum = healthdata.databynode[i];
        for (var nodename in datum) {
            if ('health' in datum[nodename]) {
                var newhealthstat = document.createElement('span')
                nodehealthmap[nodename] = datum[nodename].health.value;
                if (datum[nodename].health.value == 'warning') {
                    newhealthstat.setAttribute('class', 'fa fa-exclamation-triangle yellow icon');
                } else if (datum[nodename].health.value == 'critical' || datum[nodename].health.value == 'failed') {
                    newhealthstat.setAttribute('class', 'fa fa-times-circle red icon');
                } else if (datum[nodename].health.value == 'unknown') {
                    newhealthstat.setAttribute('class', 'fa fa-question red icon');
                } else if (datum[nodename].health.value == 'ok') {
                    newhealthstat.setAttribute('class', 'fa fa-check-square-o green icon');
                } else {
                    newhealthstat.setAttribute('class', 'fa fa-question icon');
                }

                healthsum = document.getElementById("health-"+nodename);
                healthsum.parentNode.replaceChild(newhealthstat, healthsum);
                newhealthstat.setAttribute('id', "health-"+nodename);
                healthbynode[nodename] = datum[nodename].health.value;
            } else if ('sensors' in datum[nodename]) {
                healthsum = document.getElementById("health-"+nodename);
                var healthinfo = new healthInfo(healthsum, datum[nodename], nodename, healthbynode[nodename]);
            } else if ('error' in datum[nodename]) {
                newhealthstat = document.createElement('span')
                newhealthstat.setAttribute('class', 'fa fa-question icon red');
                newhealthstat.setAttribute('title', 'Health not known: ' + datum[nodename].error);
                healthsum = document.getElementById("health-"+nodename)
                newhealthstat.setAttribute('id', "health-"+nodename);
                healthsum.parentNode.replaceChild(newhealthstat, healthsum);
                healthinfo = new healthInfo(newhealthstat, 'Health not known: ' + datum[nodename].error, nodename);
            }
        }
    }
}

function getchunkpower() {
    powertimeout = null;
    getRequest("/confluent-api/noderange/" + noderange + "/power/state", processPowerState);
}

function getchunkhealth() {
    healthtimeout = null;
    getRequest("/confluent-api/noderange/" + noderange + "/health/hardware", processHealth);
}

function quickIcon(nodename, skipconsole, below) {
    var quickicon = document.createElement('span');
    quickicon.classList.add('fa', 'fa-wrench', 'activeicon');
    quickicon.style.margin="0px 2px";
    quickicon.title = nodename + ' ' + l('Quick Actions');
    new nodeQuickActions(quickicon, nodename, skipconsole, below);
    return quickicon;
}

var maxnoderowwidth = 0;
var noderowmap;
var nodehealthmap;
function drawnode(nodename, key) {
    var myrow = document.createElement('div');
    myrow.style.display = 'block';
    noderowmap[nodename] = myrow;
    myrow.classList.add('noderow');
    var healthspan = document.createElement('span')
    healthspan.classList.add('icon', 'fa', 'fa-spinner', 'fa-spin');
    healthspan.id = 'health-' + nodename;
    var nodenamespan = document.createElement('span');
    nodenamespan.classList.add('nodename');
    nodenamespan.textContent = nodename;
    var powerspan = document.createElement('span');
    powerspan.id='power-' + nodename;
    powerspan.classList.add('fa', 'fa-spinner', 'fa-spin', 'powericon');
    var quickicon = quickIcon(nodename);
    myrow.appendChild(healthspan);
    myrow.appendChild(powerspan);
    myrow.appendChild(quickicon);
    myrow.appendChild(nodenamespan);
    this.appendChild(myrow);
    var mywidth = healthspan.offsetWidth + powerspan.offsetWidth + nodenamespan.offsetWidth + quickicon.offsetWidth;
    if (mywidth > maxnoderowwidth) {
        maxnoderowwidth = mywidth;
    }
//    document.getElementById("console-"+nodename).addEventListener("click", nodecontext.openconsole.bind(nodecontext));
}

function createSelection(options) {
    var ms = document.createElement('select');
    options.forEach(function(o) {
        var opt = new Option(o, o);
        ms.appendChild(opt);
    });
    return ms;
}

var bkitem;
function maketoolbar() {
    var toolrow = document.createElement('ul');
    toolrow.classList.add('toolbar', 'header');
    /*toolrow.appendChild(maketoollabel(l('Health') + ':'));
    var selection = createSelection(['All', 'Warning', 'Critical']);
    selection.classList.add('tool');
    toolrow.appendChild(selection);
    toolrow.appendChild(maketoollabel(l('Noderange') + ':'));
    var nrinput = document.createElement('input');
    nrinput.classList.add('tool');
    toolrow.appendChild(nrinput);
    toolrow.appendChild(maketoollabel(l('Select') + ":"));
    var selections = createSelection(['', 'All', 'None', 'Invert']);
    selections.classList.add('tool');
    toolrow.appendChild(selections);
    toolrow.appendChild(maketoollabel(l('Power') + ":"));
    selections = createSelection(['', 'on', 'off', 'reset', 'boot']);
    selections.classList.add('tool');
    toolrow.appendChild(selections);
    toolrow.appendChild(maketoollabel(l('Next Boot') + ":"));
    selections = createSelection(['', 'default', 'network', 'cd', 'disk']);
    selections.classList.add('tool');
    toolrow.appendChild(selections);
    */
    var healthmenu = addToolMenu(toolrow, 'Filter by health', 'medkit');
    addMenuItem(healthmenu, 'Critical', filterHealth.bind(['critical', 'failed']), 'times-circle');
    addMenuItem(healthmenu, 'Warning', filterHealth.bind(['warning', 'critical', 'failed']), 'exclamation-triangle');
    addMenuItem(healthmenu, 'All', filterHealth.bind(['ok', 'warning', 'critical', 'failed']), 'check-square');
    var powerMenu = addToolMenu(toolrow, 'Power', 'power-off'); 
    addMenuItem(powerMenu, 'Off', changePower.bind('off'), 'power-off');
    addMenuItem(powerMenu, 'Boot', changePower.bind('boot'), 'refresh');
    addMenuItem(powerMenu, 'Shutdown', changePower.bind('shutdown'), 'bed');
    toolrow.appendChild(maketoollabel(l('Noderange') + ':'));
    var nrinput = document.createElement('input');
    nrinput.value = noderange;
    nrinput.classList.add('tool');
    nrinput.addEventListener('input', newnoderange.bind(nrinput));
    toolrow.appendChild(nrinput);
    var terms = addToolMenu(toolrow, 'Terminals', 'desktop');
    addMenuItem(terms, 'Open Multiple Consoles', openAllTerms.bind('/console/session'), 'desktop');
    addMenuItem(terms, 'Open Multiple Shells', openAllTerms.bind('/shell/sessions/'), 'terminal');
    addMenuItem(terms, 'Close All Terminals', CloseTerminals, 'close');
    addMenuItem(terms, 'Arrange', TileTerminals, 'th', true);
    var resize = function() { ScaleTerminals(this); }
    addMenuItem(terms, 'Shrink', resize.bind(0.8), 'minus-square', true);
    addMenuItem(terms, 'Reset Size', resize.bind(1), 'square', true);
    addMenuItem(terms, 'Enlarge', resize.bind(1.2), 'plus-square', true);
    //addMenuItem(terms, 'Type Everywhere', toggleBroadcast, 'keyboard-o');
    bkitem = addMenuItem(toolrow, 'Type in all Terminals', toggleBroadcast, 'keyboard-o');
    bkitem.classList.add('navitem');


    return toolrow;
}

var nrchanger;

function newnoderange() {
    if (nrchanger) {
        clearTimeout(nrchanger)
    }
    var nnr = this.value;
    noderange = nnr;
    nrchanger = setTimeout(function() {
        if (nnr != '') {
            drawnodes("/confluent-api/noderange/"+nnr+"/nodes/");
        }
        nrchanger = undefined;
        }, 750);
}
var nodes = [];

var broadcasting;
function toggleBroadcast() {
   if (broadcasting) {
    document.removeEventListener('keypress', AllTermsKeypress);
    document.removeEventListener('keydown', AllTermsKeydown);
    bkitem.style.background = '#ffffff';
    broadcasting = false;
   } else {
    document.addEventListener('keypress', AllTermsKeypress);
    document.addEventListener('keydown', AllTermsKeydown);
    bkitem.style.background = '#90ee90';
    broadcasting = true;
   }
}

function openAllTerms() {
   var qmenu;
   var suburl = this;
   nodes.forEach(function (node) {
       if (suburl == '/console/session') {
            new TerminalWindow("/confluent-api/nodes/" + node + suburl, node + ' ' + l('Console'), undefined, undefined, quickIcon(node, true, true));
       } else {
            new TerminalWindow("/confluent-api/nodes/" + node + "/shell/sessions/", node + ' ' + l('Shell'));
       }
   });
   TileTerminals();
}
var noderows;

function drawnodes(url) {
  while (noderows.firstChild) {
      noderows.removeChild(noderows.firstChild);
  }
  getRequest(url, function( data) {
    nodes = [];
    noderowmap = {};
    nodehealthmap = {};
    data["_links"]["item"].forEach( function( val, key ) {
        nodes.push(val.href.replace('/', ''));
    });
    nodes.forEach(drawnode.bind(noderows));
    getchunkpower();
    getchunkhealth();
    var colwidth = maxnoderowwidth + 50;
    noderows.style.WebkitColumnWidth = colwidth + 'px';
    noderows.style.MozColumnWidth = colwidth + 'px';
    noderows.style.columnWidth = colwidth + 'px';
  }, donull, undefined, undefined, true);
}

function closecompactoverview() {
    compactactive = false;
    if (powertimeout) {
        clearTimeout(powertimeout);
        powertimeout = null;
    }
    if (healthtimeout) {
        clearTimeout(healthtimeout);
        healthtimeout = null;
    }
}
function compactoverview() {
  clear_main();
  compactactive = true;
  window.main = compactoverview;
  window.closemain = closecompactoverview;
  window.location.hash = '#compactoverview';
  var mainpane = document.getElementById('main');
  mainpane.appendChild(maketoolbar());
  noderows = document.createElement('div');
  noderows.classList.add('header');
  mainpane.appendChild(noderows);
  drawnodes("/confluent-api/noderange/"+noderange+"/nodes/");
}
window.compactoverview = compactoverview;
window.closecompactoverview = closecompactoverview;
})();

