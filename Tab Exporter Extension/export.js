var targetWindow = null;
var tabCount = 0;

function start(tab) {
    safari.windows.getCurrent(getWindows);
}

function getWindows(win) {
    targetWindow = win;
    safari.tabs.getAllInWindow(targetWindow.id, getTabs);
}

function getTabs(tabs) {
    tabCount = tabs.length;
    safari.windows.getAll({"populate" : true}, expTabs);
}

function expTabs(windows) {
    var numWindows = windows.length;
    var exportAll = document.getElementById('inclAll').checked == true ? 1 : 0;
    document.getElementById('content').value = '';
    for (var i = 0; i < numWindows; i++) {
        var win = windows[i];
        if (targetWindow.id == win.id || exportAll == 1) {
            var numTabs = win.tabs.length;
            for (var j = 0; j < numTabs; j++) {
                var tab = win.tabs[j];
                if (document.getElementById('inclTitle').checked == true) {
                    document.getElementById('content').value += tab.title + '\n';
                }
                document.getElementById('content').value += tab.url + '\n\n';
            }
        }
    }
}

function openTabs() {
    var content = document.getElementById('content').value;
    var rExp = new RegExp(
                          "(^|[ \t\r\n])((ftp|http|https|news|file|view-source|safari):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-])*)"
                          ,"g"
                          );
    var newTabs = content.match(rExp);
    if (newTabs != null) {
        var newTabsLen = newTabs.length;
        for (var j = 0; j < newTabsLen; j++) {
            var nt = newTabs[j];
            safari.tabs.create({url: nt, active: false });
        }
    } else {
        alert('Only fully qualified URLs will be opened.');
    }
}

function download() {
    
    
    var content = document.getElementById('content').value
    var content_arr = content.split('\n\n');
    var data = '<html><head></head><body>';
    for (var i = 0; i < content_arr.length; i++) {
        var content_url = content_arr[i].split('\n');
        if (document.getElementById('inclTitle').checked == true) {
            data+='<a href="'+content_url[1]+'">'+content_url[0]+'</a><br/>';
        } else {
            data+='<a href="'+content_arr[i]+'">'+content_arr[i]+'</a><br/>';
        }
    }
    data+='</body></html>';
    
    var blob = new Blob([data], {type: "text/html;charset=utf-8"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    
    a.download = "tabs.txt";
    a.href = url;
    a.click();
    
}

document.addEventListener('DOMContentLoaded', function () {
                          document.querySelector('#btOpenTabs').addEventListener('click', openTabs);
                          document.querySelector('#inclTitle').addEventListener('click', start);
                          document.querySelector('#inclAll').addEventListener('click', start);
                          document.querySelector('#download').addEventListener('click', download);
                          start();
                          });

