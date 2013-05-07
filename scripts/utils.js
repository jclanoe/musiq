
EXTENSION_SCHEME = document.location.href.split("://")[0];


function getPopoverWindow() {
    if (EXTENSION_SCHEME == 'safari-extension') {
        return safari.extension.popovers[0].contentWindow;
    }
    else if (EXTENSION_SCHEME == 'chrome-extension') {

    }
}

function getBackgroundPageWindow() {
    if (EXTENSION_SCHEME == 'safari-extension') {
        return safari.extension.globalPage.contentWindow;
    }
    else if (EXTENSION_SCHEME == 'chrome-extension') {

    }
}

////////////////
// Prototypes //
////////////////

Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

////////////////////////////////
// Function Browser dependant //
////////////////////////////////

if (EXTENSION_SCHEME == 'safari-extension') {
    function showPopover(popoverId, toolbarItemId) {
        var toolbarItem = safari.extension.toolbarItems.filter(function (tbi) {
            return tbi.identifier == toolbarItemId && tbi.browserWindow == safari.application.activeBrowserWindow;
        })[0];
        var popover = safari.extension.popovers.filter(function (po) {
            return po.identifier == popoverId;
        })[0];
        toolbarItem.popover = popover;
        toolbarItem.showPopover();
    }

    function performCommand(event) {
    	if (event.command == "openPopover") {
    		showPopover("com.musiq.popover", "com.musiq.popoverbutton");
    	}
    }

    safari.application.addEventListener("command", performCommand, false);
}
else if (EXTENSION_SCHEME == 'chrome-extension') {
    // Do some Chrome shit right here
}
