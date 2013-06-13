var _startX = 0; // mouse starting positions
var _startY = 0;
var _offsetX = 0; // current element offset
var _offsetY = 0;
var _dragElement; // reference for the header element for OnMouseDown
var header = null;
var containerDiv = null;
// Override this method to perform custom behavior during dijit construction.
// Common operations for constructor:
// 1) Initialize non-primitive types (i.e. objects and arrays)
// 2) Add additional properties needed by succeeding lifecycle methods

function setDragBehaviour(headerId, ContainerId) {
    header = dojo.byId(headerId);
    containerDiv = dojo.byId(ContainerId);
    header.onmousedown = dojo.hitch(this, function () {
        OnMouseDown();
    });
};

function OnMouseDown(e) {
    document.onmouseup = dojo.hitch(this, function () {
        OnMouseUp();
    });
    // IE is retarded and doesn't pass the event object
    if (!e)
        e = window.event;
    // IE uses srcElement, others use target
    var target = e.target != null ? e.target : e.srcElement;

    // for IE, left click == 1
    // for Firefox, left click == 0
    if ((e.button == 1 && window.event != null || e.button == 0)) {
        // grab the mouse position
        _startX = e.clientX;
        _startY = e.clientY;

        var coords = dojo.coords(containerDiv);

        // grab the clicked element's position
        _offsetX = coords.l;
        _offsetY = coords.t;

        // we need to access the element in OnMouseMove
        _dragElement = target;

        _dragElement.style.cursor = "move";

        // tell our code to start moving the element with the mouse
        document.onmousemove = dojo.hitch(this, function () {
            OnMouseMove();
        });

        // cancel out any text selections
        document.body.focus();

        // prevent text selection in IE
        document.onselectstart = function () {
            return false;
        };
        // prevent IE from trying to drag an image
        target.ondragstart = function () {
            return false;
        };

        // prevent text selection (except IE)
        return false;
    }
};

function OnMouseMove(e) {
    if (e == null)
        var e = window.event;

    // this is the actual "drag code"
    containerDiv.style.left = (_offsetX + e.clientX - _startX) + 'px';
    dojo.byId("loadingIndicatorAdditionalContent").style.left = (_offsetX + e.clientX - _startX) + 'px';
    containerDiv.style.top = (_offsetY + e.clientY - _startY) + 'px';
    dojo.byId("loadingIndicatorAdditionalContent").style.top = (_offsetY + e.clientY - _startY) + 'px';
};

function OnMouseUp(e) {

    if (_dragElement) {
        var mapDomNode = dojo.byId("map");
        var mapCoords = dojo.coords(mapDomNode);
        var containerCoords = dojo.coords(containerDiv);

        if (containerCoords.l < 0) {
            dojo.byId("loadingIndicatorAdditionalContent").style.left = "0px";
            containerDiv.style.left = "0px";

        }
        if (containerCoords.t < 0) {
            dojo.byId("loadingIndicatorAdditionalContent").style.top = "0px";
            containerDiv.style.top = "0px";

        }
        if (mapCoords.h < (containerCoords.t + containerCoords.h)) {
            dojo.byId("loadingIndicatorAdditionalContent").style.top = (mapCoords.h - containerCoords.h) + "px";
            containerDiv.style.top = (mapCoords.h - containerCoords.h) + "px";

        }
        if (mapCoords.w < (containerCoords.l + containerCoords.w)) {
            dojo.byId("loadingIndicatorAdditionalContent").style.left = (mapCoords.w - containerCoords.w) + "px";
            containerDiv.style.left = (mapCoords.w - containerCoords.w) + "px";
        }

        _dragElement.style.cursor = "default";

        // we're done with these events until the next OnMouseDown
        document.onmousemove = null;
        document.onselectstart = null;
        _dragElement.ondragstart = null;

        // this is how we know we're not dragging      
        _dragElement = null;
    }
}