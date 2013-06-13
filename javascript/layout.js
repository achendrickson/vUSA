dojo.require("esri.map");
dojo.require("esri.tasks.geometry");
dojo.require("esri.dijit.Legend");
dojo.require("esri.dijit.Scalebar");
dojo.require("esri.arcgis.utils");
dojo.require("esri.IdentityManager");
dojo.require("esri.dijit.Popup");
dojo.require("esri.arcgis.Portal");
dojo.requireLocalization("esriTemplate", "template");

dojo.require("dijit.dijit");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.StackContainer");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit/form/TextBox");
dojo.require("dijit.Dialog");
dojo.require("dijit.form.ComboBox");
dojo.require("dijit/form/Select");

dojo.require("dojo.window");
dojo.require("dojo.has");
dojo.require("dojo.date.locale");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dojo/json");
dojo.require("dojox.fx");
dojo.require("dojo.date.locale");

var map;
var configOptions;
var urlObject;

var i18n;
var popup;

var title;
var subtitle;

var portal;
var token;

var baseMapLayers = [];
var layerCounter = [];
var addedLayersOnMap = [];
var eventSelected = [];

function Init() {
    esri.config.defaults.io.proxyUrl = "proxy.ashx";
    esriConfig.defaults.io.alwaysUseProxy = false;
    esriConfig.defaults.io.timeout = 180000;

    var ss = document.createElement('link');
    ss.type = 'text/css';
    ss.rel = 'stylesheet';
    require(['esri/dijit/Popup'], function () {
        popup = new esri.dijit.Popup(null, dojo.create("div"));
    });
    ss.href = "css/desktop.css";

    document.getElementsByTagName("head")[0].appendChild(ss);
    portalUrl = '';
    i18n = dojo.i18n.getLocalization('esriTemplate', 'template');

    configOptions = {
        //The ID for the map from ArcGIS.com
        groups: i18n.viewer.groups,
        applicationIcon: i18n.viewer.main.applicationIcon,
        leftPanelHeader: i18n.viewer.main.leftPanelHeader,
        //Enter a title, if no title is specified, the webmap's title is used.
        title: i18n.viewer.main.applicationName,
        //Enter a subtitle, if not specified the ArcGIS.com web map's summary is used
        subtitle: '',
        //If the webmap uses Bing Maps data, you will need to provided your Bing Maps Key
        //specify a proxy url if needed
        proxyurl: '',
        //specify the url to a geometry service
        geometryserviceurl: 'http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer',

        //Modify this to point to your sharing service URL if you are using the portal
        sharingurl: '',
        baseMapId: i18n.viewer.main.baseMapId,
        defaultExtent: i18n.viewer.main.defaultExtent,
        labelESF: i18n.viewer.labelESF,
        HelpURL: i18n.viewer.HelpURL,
        mapSharingOptions: i18n.viewer.MapSharingOptions,
        agolError: i18n.viewer.errors.agolError,
        eventTagPatternPrefix: i18n.viewer.eventTagPatternPrefix,
        addItemUrl: i18n.viewer.main.addItemUrl,
        generateShareLink: i18n.viewer.main.generateShareLink,
        generateMapPublishLink: i18n.viewer.main.generateMapPublishLink,
        webMapItemDetail: i18n.viewer.main.webMapItemDetail,
        webMapParameters: i18n.viewer.WebMapParameters
    };

    if (configOptions.geometryserviceurl && location.protocol === "https:") {
        configOptions.geometryserviceurl = configOptions.geometryserviceurl.replace('http:', 'https:');
    }
    esri.config.defaults.geometryService = new esri.tasks.GeometryService(configOptions.geometryserviceurl);
    document.getElementById("divContainer").style.display = "block";
    dojo.byId("divEventConatiner").style.display = "block";
    dojo.byId("tdDialogHeader").innerHTML = "Select Portal";
    dojo.byId("divAddressResultContainer").style.display = "none";
    CreatePortalValues();
}

function PortalObjectCreation(url) {
    portalUrl = url;
    configOptions.sharingurl = portalUrl + '/sharing/content/items';
    if (!configOptions.sharingurl) {
        configOptions.sharingurl = location.protocol + '//' + location.host + "/sharing/content/items";
    }
    esri.arcgis.utils.arcgisUrl = configOptions.sharingurl;
    portal = new esri.arcgis.Portal(url);
    setTimeout(function () {
        AuthenticateUser();
    }, 500);
}

function ToggleFullScreen() {
    if (!document.fullscreenElement && // alternative standard method
    !document.mozFullScreenElement && !document.webkitFullscreenElement) { // current working methods
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        }
        dojo.byId("maximizeBaseMap").title = "Minimize";
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
        dojo.byId("maximizeBaseMap").title = "Full Screen";
    }
    map.resize();
}

function CreatePortalValues() {
    var data = i18n.viewer.portal;
    for (var i = 0; i < data.length; i++) {
        var trPortal = document.createElement("tr");
        dojo.byId("tblPortalList").appendChild(trPortal);
        dojo.byId("tblPortalList").style.width = "100%";
        var tdPortal = document.createElement("td");
        tdPortal.align = "left";
        tdPortal.id = data[i].portalName + i;
        if (i % 2 == 0) {
            tdPortal.className = "labelEvent";
        } else {
            tdPortal.className = "labelEventSecondRow";
        }
        tdPortal.style.cursor = "pointer";
        tdPortal.innerHTML = data[i].portalName;
        tdPortal.setAttribute("portalURL", document.location.protocol + data[i].portalUrl);
        tdPortal.onclick = function () {
            if (!dojo.hasClass(this, "labelEventNew1")) {
                dojo.removeClass(dojo.query(".labelEventNew1", dojo.byId("tblPortalList"))[0], "labelEventNew1");
                dojo.addClass(this, "labelEventNew1");
            };
        }
        if (i == 0) {
            dojo.addClass(tdPortal, "labelEventNew1");
        }
        trPortal.appendChild(tdPortal);
    }
}

function AuthenticateUser() {
    dojo.byId("divAppContainer").style.display = "block";
    portal.signIn().then(function (loggedInUser) {

        ShowProgressIndicator();
        portalUser = loggedInUser;
        sessionStorage.clear();
        FindArcGISUserInGroup(configOptions.defaultExtent);
    });
    if (dojo.query(".dijitDialogPaneContentArea")[0]) {
        dojo.query(".dijitDialogPaneContentArea")[0].childNodes[0].innerHTML = "Selected Portal: " + dojo.query(".labelEventNew1", dojo.byId("tblPortalList"))[0].innerHTML;

        var divPortal = dojo.create("div");
        divPortal.innerHTML = "Enter your Username and Password";
        divPortal.style.marginTop = "3px";
        dojo.query(".dijitDialogPaneContentArea")[0].childNodes[1].appendChild(divPortal);
    }
}

function EventAndPortalSelection() {

    if (dojo.byId("divAddressResultContainer").style.display != "none") {
        dojo.byId("divContainer").style.display = "none";
        ShowProgressIndicator();
        if (document.getElementById("clearLayers").checked) {
            addLayerId = [];
            for (i in map._layers) {
                if (!baseMapLayers[i]) {
                    map.removeLayer(map._layers[i]);
                }
            }
            map.infoWindow.hide();
            if (dijit.byId("legendDiv")) {
                dijit.byId("legendDiv").layerInfos = [];
                dijit.byId("legendDiv").refresh();
            }
            document.getElementById("clearLayers").checked = false;
        }
        IconClick();
        dojo.byId("AddHeaderConetent").innerHTML = "Add content";
        eventSelected = [];
        dojo.query(".labelEventNew").forEach(function (node) {
            var nodevalue = configOptions.eventTagPatternPrefix + node.innerHTML;
            eventSelected.push(nodevalue);
        });
        if (eventSelected.length != 0) {
            dojo.empty(dojo.byId("divAddContentContainer"));
            document.getElementById("divContainer").style.display = "none";
            dojo.byId("divEventConatiner").style.display = "none";
            SearchWebMapsForEvent(eventSelected);
        } else {
            SearchWebMapsForEvent();
        }
    } else {
        PortalObjectCreation(dojo.query(".labelEventNew1", dojo.byId("tblPortalList"))[0].getAttribute("portalURL"));
        document.getElementById("divContainer").style.display = "none";
        dojo.byId("divEventConatiner").style.display = "none";
        dojo.byId("tdDialogHeader").innerHTML = "Select event(s)";
        dojo.byId("divAddressResultContainer").style.display = "block";
        dojo.byId("divLoginContainer").style.display = "none";
    }
}

function CreateLoadMapDialog() {
    if (tags.length == 0) {
        var webMapsEvtArray = [];
        SearchWebMapsForEvent();
        return;
    }
    dojo.empty(dojo.byId("divAddressResultContainer"));
    document.getElementById("divContainer").style.display = "block";
    setDragBehaviour("tblHeaderForEvents", "divContainer");
    var tableDiv = document.createElement("div");
    var dialogTable = document.createElement("table");
    dialogTable.cellPadding = 5;
    dialogTable.cellSpacing = 0;
    dialogTable.style.width = "100%";
    dialogTable.className = "dialogTable";
    dialogTable.id = "dialogTable";

    var dialogTableRow3 = dialogTable.insertRow(0);
    var dialogTableCell4 = dialogTableRow3.insertCell(0);

    var divEvent = document.createElement("div");
    divEvent.className = "ESFMainContainer";
    var i = 0;
    for (var j in tags) {
        var divLabelEvent = dojo.create("div");
        if (i % 2 == 0) {
            dojo.addClass(divLabelEvent, "labelEvent");
        } else {
            dojo.addClass(divLabelEvent, "labelEventSecondRow");
        }
        divLabelEvent.id = j;
        divLabelEvent.innerHTML = j;
        divEvent.appendChild(divLabelEvent);
        dojo.connect(divLabelEvent, "onclick", dojo.hitch(this, function (e) {
            if (dojo.hasClass(e.target, "labelEventNew")) {
                dojo.removeClass(e.target, "labelEventNew");
            } else {
                dojo.addClass(e.target, "labelEventNew");
            }
        }));
        i++;
    }
    dialogTableCell4.appendChild(divEvent);
    tableDiv.appendChild(dialogTable);
    document.getElementById("divAddressResultContainer").appendChild(tableDiv);
    if (eventSelected.length > 0) {
        for (var evtSelected = 0; evtSelected < eventSelected.length; evtSelected++) {
            var newEvent = eventSelected[evtSelected].split("_");
            dojo.addClass(dojo.byId(newEvent[2]), "labelEventNew");
        }
    }
}

function SearchWebMapsForEvent(selected) {
    setDragBehaviour("AddHeaderConetent", "divAddContent");
    document.getElementById("backGroundImage").style.visibility = "visible"; ;
    document.getElementById("divAddContent").style.display = "block";

    var addContentDiv = document.createElement("div");
    addContentDiv.id = "addContentContainer";
    addContentDiv.className = "addContentContainer";
    var obj = "";
    if (selected) {
        for (i in selected) {
            if (i == 0) {
                obj = selected[0];
            } else {
                obj = obj + '" OR "' + selected[i];
            }
        }
    }
    for (var j in configOptions.labelESF) {
        if (obj == "") {
            obj = configOptions.labelESF[0].ESF;
        } else {
            obj = obj + '" OR "' + configOptions.labelESF[j].ESF;
        }
    }

    for (var j in i18n.viewer.labelICS) {
        obj = obj + '" OR "' + i18n.viewer.labelICS[j].ICS;
    }

    for (var j in i18n.viewer.labelEMAgencyGroup) {
        obj = obj + '" OR "' + i18n.viewer.labelEMAgencyGroup[j].EMG;
    }

    for (var j in i18n.viewer.labelEMTask) {
        obj = obj + '" OR "' + i18n.viewer.labelEMTask[j].EMT;
    }

    for (var j in i18n.viewer.labelEMFunction) {
        obj = obj + '" OR "' + i18n.viewer.labelEMFunction[j].EMF;
    }

    for (var j in i18n.viewer.labelCISector) {
        obj = obj + '" OR "' + i18n.viewer.labelCISector[j].CIS;
    }

    for (var j in i18n.viewer.labelHazardType) {
        obj = obj + '" OR "' + i18n.viewer.labelHazardType[j].HAZ;
    }
    var groups = "";
    for (var i in configOptions.groups) {
        if (groups == "") {
            groups = configOptions.groups[0].groupID;
        } else {
            groups = groups + '" OR "' + configOptions.groups[i].groupID;
        }
    }

    var queryString;
    if (i18n.viewer.main.jurisdiction == "") {
        queryString = 'group:("' + groups + '")' + ' OR (accountid:"' + portalUser.orgId + '") AND (tags: ("' + obj + '"))';
    }
    else {
        queryString = 'group:("' + groups + '")' + ' OR (accountid:"' + portalUser.orgId + '") AND (tags: ("' + obj + '") AND "' + i18n.viewer.main.jurisdiction + '")';

    }
    var params = {
        q: queryString,
        num: 100,
        sortField: "modified",
        sortOrder: "desc"
    }
    var postlength = esri.config.defaults.io.postLength;
    esri.config.defaults.io.postLength = 100;

    portal.queryItems(params).then(function (groupdata) {
        sessionStorage.clear();
        CreateAddContentsTable(groupdata, "divAddContentContainer");

    }, {
        useProxy: true
    });
    esri.config.defaults.io.postLength = postlength;
}

//function to create textbox and search image for tab container

function CreateSearchPanel(txtBoxId, searchImgId) {
    var divAddressPodPlaceHolder = dojo.create("div");
    var txtDiv = dojo.create("div");

    var tb = new dijit.form.TextBox({
        name: "firstname",
        id: txtBoxId,
        value: "" /* no or empty value! */,
        placeHolder: "Enter search text"
    });
    txtDiv.appendChild(tb.domNode);
    var image = dojo.create("img");
    image.src = "images/search.png";
    image.className = "imgSearchLocate";
    image.title = "Search";
    image.id = searchImgId;
    image.style.cursor = "pointer";
    image.style.height = "16px";
    image.style.width = "16px";
    if (searchImgId == "imgSearchvUsa") {
        dojo.connect(tb, "onKeyPress", function () {
            CreateAdditionalContentOnKeyPress(event, "inputvUsaText");
        });
        image.onclick = function () {
            CreateAddContentsvUsaTable();
        }
    }
    if (searchImgId == "imgSearch") {
        dojo.connect(tb, "onKeyPress", function () {
            CreateAdditionalContentOnKeyPress(event, "inputAGOLText");
        });
        image.onclick = function () {
            CreateAddContentsAGOLTable();
        }
    }

    divAddressPodPlaceHolder.appendChild(txtDiv);
    divAddressPodPlaceHolder.appendChild(image);
    return divAddressPodPlaceHolder;
}

//function to create tabs for Tab container

function CreateTabs(containerId) {
    var mainConatinerTab = dojo.create("div");
    var divAddContentContainerTabContainer = dojo.create("div");
    divAddContentContainerTabContainer.id = containerId;
    divAddContentContainerTabContainer.style.height = "317px";

    var tableTab = dojo.create("table");
    tableTab.style.height = "44px";
    var tableTabRow = tableTab.insertRow(0);
    var tableTabCell = tableTabRow.insertCell(0);
    var label = dojo.create("label");
    label.innerHTML = "Find content for";
    tableTabCell.appendChild(label);

    var tableTabCell2 = tableTabRow.insertCell(1);
    if (containerId == "divAddContentContainerTabContainer") {
        var divPodPlaceHolder = CreateSearchPanel("inputvUsaText", "imgSearchvUsa");
    }
    if (containerId == "divAddArcGISContentContainer") {
        var divPodPlaceHolder = CreateSearchPanel("inputAGOLText", "imgSearch");
    }

    tableTabCell2.appendChild(divPodPlaceHolder);

    mainConatinerTab.appendChild(divAddContentContainerTabContainer);
    mainConatinerTab.appendChild(tableTab);

    return mainConatinerTab;
}

//function to create Tab container for add additional contents

function SearchWebMapsForAddContent() {
    document.getElementById("backGroundImage").style.visibility = "visible";
    document.getElementById("divAddContent").style.display = "block";
    setDragBehaviour("AddHeaderConetent", "divAddContent");
    var mainConatinervUsaTab = CreateTabs("divAddContentContainerTabContainer");
    var mainConatinerAgolTab = CreateTabs("divAddArcGISContentContainer");

    var divT = dojo.create("div");
    divT.style.width = "100%";
    divT.style.height = "300px";
    document.getElementById("tabContainerMainDiv").appendChild(divT);
    var tc = new dijit.layout.TabContainer({
        tabPosition: "bottom",
        tabstrip: "true",
        style: "height: 100%; width: 100%;"
    }, divT);

    var cp1 = new dijit.layout.ContentPane({
        title: "vUSA Content",
        selected: "true",
        content: mainConatinervUsaTab
    });
    tc.addChild(cp1);

    var cp2 = new dijit.layout.ContentPane({
        title: "Public Content",
        content: mainConatinerAgolTab
    });
    tc.addChild(cp2);

    var cp3 = new dijit.layout.ContentPane({
        title: "My Portal",
        content: "Coming Soon"
    });
    tc.addChild(cp3);

    tc.startup();

    setTimeout(dojo.hitch(this, function () {
        tc.resize();
    }), 1000);

    var groups = "";
    for (var i in configOptions.groups) {
        if (groups == "") {
            groups = configOptions.groups[0].groupID;

        } else {
            groups = groups + '" OR "' + configOptions.groups[i].groupID;
        }
    }
    var params = {
        q: 'group:' + groups,
        sortField: "modified",
        sortOrder: "desc",
        num: 100
    }
    portal.queryItems(params).then(function (groupdata) {
        HideProgressIndicator();
        sessionStorage.clear();
        CreateAddContentsTable(groupdata, "divAddContentContainerTabContainer");
    });
}

var tags = [];

function EventList() {
    var groups = "";
    for (var i in configOptions.groups) {
        if (groups == "") {
            groups = configOptions.groups[0].groupID;
        } else {
            groups = groups + '" OR "' + configOptions.groups[i].groupID;
        }
    }

    var queryString;
    if (i18n.viewer.main.jurisdiction == "") {
        queryString = 'group:("' + groups + '")' + ' OR (accountid:"' + portalUser.orgId + '") AND (tags: ("' + configOptions.eventTagPatternPrefix + '"))';
    }
    else {
        queryString = 'group:("' + groups + '")' + ' OR (accountid:"' + portalUser.orgId + '") AND (tags: ("' + configOptions.eventTagPatternPrefix + '") AND "' + i18n.viewer.main.jurisdiction + '")';

    }

    var params = {
        q: queryString,
        num: 100,
        sortField: "modified",
        sortOrder: "desc"

    }
    portal.queryItems(params).then(function (tagdetails) {
        for (i in tagdetails.results) {
            for (j in tagdetails.results[i].tags) {
                var k = tagdetails.results[i].tags[j].search(configOptions.eventTagPatternPrefix);
                if (k != -1) {
                    var l = tagdetails.results[i].tags[j].split(configOptions.eventTagPatternPrefix);
                    if (!tags[l[1]]) {
                        tags[l[1]] = l[1];
                        tags.length = 1;
                    }
                }
            }
        }
        CreateLoadMapDialog();
        HideProgressIndicator();
    });
}

function FindArcGISUserInGroup(extent) {
    sessionStorage.clear();
    var data = portalUser.credential;
    token = data.token;
    arrSubjectGroups = [];
    var popup = new esri.dijit.Popup({
        fillSymbol: new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 0.25]))
    }, dojo.create("div"));

    esri.arcgis.utils.createMap(configOptions.baseMapId, "map", {
        slider: true,
        infoWindow: popup
    }).then(function (response) {
        dojo.byId("map1").style.height = "0px";
        map = response.map;
        BuildDesktopDOM();
        for (var i in map._layers) {
            baseMapLayers[i] = i;
        }

        var zoomExtent = extent.split(",");
        var startExtent = new esri.geometry.Extent(parseFloat(zoomExtent[0]), parseFloat(zoomExtent[1]), parseFloat(zoomExtent[2]), parseFloat(zoomExtent[3]), map.spatialReference);
        map.setExtent(startExtent);
        EventList();

        var chk = window.location.toString();
        var chk1 = chk.split("=");
        if (chk.indexOf("webmap=") != -1) {
            CreateMapLayers(chk1[1], null);
        } else {
            dojo.byId("divEventConatiner").style.display = "block";
        }
        dojo.connect(map, "onLayerAdd", function (layer) {
            if (layer.type == "Feature Layer") {
                if (!layer.infoTemplate) {
                    var infoTemplate;
                    var template = [];
                    var divTemplate = document.createElement("div");
                    var table = document.createElement("table");
                    divTemplate.appendChild(table);
                    var tbody = document.createElement("tbody");
                    table.appendChild(tbody);
                    for (var i = 0; i < layer.fields.length; i++) {
                        var tr = document.createElement("tr");
                        tbody.appendChild(tr);

                        var tdDisplayText = document.createElement("td");
                        tdDisplayText.style.verticalAlign = "top";
                        tdDisplayText.innerHTML = ((layer.fields[i].alias) ? layer.fields[i].alias : layer.fields[i].name) + ": ";
                        tr.appendChild(tdDisplayText);

                        var tdFieldName = document.createElement("td");
                        tdFieldName.setAttribute("data", true);
                        tdFieldName.style.verticalAlign = "top";
                        tdFieldName.innerHTML = "${" + layer.fields[i].name + "}";
                        tr.appendChild(tdFieldName);
                    }
                    template.push(divTemplate);
                    var template1 = new esri.InfoTemplate(layer.name, template[0].outerHTML);
                    layer.setInfoTemplate(template1);
                }
            }
        });

    }, function (err) {
        showDailog("error", err);
    });
}

var counter1 = 0;

function CreateMapLayers(mapId, btid) {
    if (counter1 == 0) {
        var arr = [];
        var legendDijit = new esri.dijit.Legend({
            map: map,
            layerInfos: arr
        }, "legendDiv");
        legendDijit.startup();
        counter1++;
    }
    var arr = [];

    if (mapId) {
        esriConfig.defaults.io.alwaysUseProxy = true;
        var k1 = portalUrl + "/sharing/content/items/${0}?f=json&token=${0}";

        var userGroupDetails = k1.split("${0}");
        var userGroupLink = userGroupDetails[0] + mapId + userGroupDetails[1] + token;
        esri.request({
            url: userGroupLink,
            callbackParamName: "callback",
            load: function (data) {

                if (data.type == "KML") {
                    addedLayersOnMap.push(data);
                    AddKMLLayer(mapId, btid, data.url, data.title);
                } else if (data.type == "Web Map") {
                    AddWebMap(mapId, btid);
                } else if (data.type == "Feature Service") {

                    addLayerId[mapId] = mapId;
                    var layerType = data.url.substring(((data.url.lastIndexOf("/")) + 1), (data.url.length));
                    if (!isNaN(layerType)) {
                        addedLayersOnMap.push(data);
                        AddFeatureLayer(data.url, btid, data.id, data.title);
                    } else {
                        addedLayersOnMap.push(data);
                        var url1 = data.url + "?f=json";
                        esri.request({
                            url: url1,
                            handleAs: "json",
                            load: function (jsondata) {

                                if (jsondata.layers.length > 0) {
                                    for (var j = 0; j < jsondata.layers.length; j++) {
                                        var layerUrl = data.url + "/" + jsondata.layers[j].id;
                                        AddFeatureLayer(layerUrl, btid, data.id + "_" + j, data.title);
                                    }
                                }

                            },
                            error: function (err) {
                                HideProgressIndicatorAdditionalContent();
                                showDailog("error", err);
                            }
                        });

                    }
                } else if (data.type == "Map Service") {
                    addLayerId[mapId] = mapId;
                    var layerType = data.url.substring(((data.url.lastIndexOf("/")) + 1), (data.url.length));
                    if (!isNaN(layerType)) {
                        addedLayersOnMap.push(data);
                        AddFeatureLayer(data.url, btid, data.id, data.title);
                    } else {
                        addedLayersOnMap.push(data);
                        AddChashedAndDynamicService(data.url, data.id, btid, data.title);
                    }
                }
            },
            error: function (err) {
                HideProgressIndicatorAdditionalContent();
                showDailog("error", err);
            }
        });
    }
}

function AddKMLLayer(mapId, btid, url, title) {
    addLayerId[mapId] = mapId;
    var kml = new esri.layers.KMLLayer(url);
    kml.id = mapId;
    map.addLayer(kml);
    dijit.byId("legendDiv").layerInfos.push({
        "layer": kml,
        "title": title
    });
    if (btid) {
        dojo.byId(btid).innerHTML = "Remove";
    }
}

function AddWebMap(mapId, btid) {
    esri.arcgis.utils.createMap(mapId, "map1", {
        mapOptions: {
            slider: true
        },
        geometryServiceURL: "https://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"
    }).then(function (response) {
        dojo.byId("map1").style.height = "0px";
        esriConfig.defaults.io.alwaysUseProxy = false;
        var kml = [];
        var layers1 = response.itemInfo.itemData.operationalLayers;
        dojo.forEach(layers1, function (layer) {
            if (!layer.featureCollection) {

                if (layer.type == "KML") {
                    if (layer.visibility) {
                        addedLayersOnMap.push(layer);
                    }
                    kml[layer.id] = layer;
                } else {
                    if (layer.visibility) {
                        addedLayersOnMap.push(layer);
                    }
                    dijit.byId("legendDiv").layerInfos.push({
                        "layer": layer.layerObject,
                        "title": layer.title
                    });
                }
            }
        });

        dijit.byId('legendDiv').refresh();
        var layers = [];
        for (i in response.map._layers) {
            if ((i != response.itemInfo.itemData.baseMap.baseMapLayers[0].id) && (i != "map1_graphics")) {
                if (!kml[i]) {
                    if (response.map._layers[i].url) {
                        layers.push(response.map._layers[i]);
                    }
                }
            }
        }
        var extent = response.map.extent;

        response.map.removeAllLayers();
        response.map.destroy();

        if (layers) {
            var k = 0;
            for (i in layers) {
                layers[i].id = mapId + "_" + k;
                map.addLayer(layers[i]);
                layerCounter[layers[i].id] = layers[i].id;
                k++;
            }
            for (j in kml) {
                if (btid) {
                    AddKMLLayer(mapId + "_" + k, btid, kml[j].url, kml[j].title);
                } else {
                    AddKMLLayer(mapId + "_" + k, null, kml[j].url, kml[j].title);
                }
                layerCounter[mapId + "_" + k] = mapId + "_" + k;
                k++;
            }
            addLayerId[mapId] = mapId;
            kml = [];
        }
        map.setExtent(extent);
        if (btid) {
            dojo.byId(btid).innerHTML = "Remove";
        }
    }, function (err) {
        dojo.byId(btid).innerHTML = "Failed";
        showDailog("error", err);
    });
}

function AddFeatureLayer(url, btid, id, title) {
    var featureLayer = new esri.layers.FeatureLayer(url, {
        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"]
    });
    featureLayer.id = id;
    map.addLayer(featureLayer);
    map.getLayer(featureLayer.id).show();
    dijit.byId("legendDiv").layerInfos.push({
        "layer": featureLayer,
        "title": title
    });
    SetExtentForLayer(url);
    dojo.byId(btid).innerHTML = "Remove";
}

function SetExtentForLayer(url, type) {
    var url1 = url + "?f=json";
    esri.request({
        url: url1,
        handleAs: "json",
        load: function (data) {

            geometryService = new esri.tasks.GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
            var layerExtent;
            if (type) {
                layerExtent = CreateExtent(data.fullExtent);
            } else {
                layerExtent = CreateExtent(data.extent);
            }
            if (layerExtent.spatialReference.wkid == map.spatialReference.wkid) {
                map.setExtent(layerExtent);
            } else {
                var project = geometryService.project([layerExtent], map.spatialReference);
                project.then(Success, Failure);
            }
        },
        error: function (err) {
            HideProgressIndicatorAdditionalContent();
            showDailog("error", err);
        }
    });
}

function CreateExtent(ext) {
    var projExtent;
    if (ext.spatialReference.wkid) {
        projExtent = new esri.geometry.Extent({
            "xmin": ext.xmin,
            "ymin": ext.ymin,
            "xmax": ext.xmax,
            "ymax": ext.ymax,
            "spatialReference": {
                "wkid": ext.spatialReference.wkid
            }
        });
    } else {
        projExtent = new esri.geometry.Extent({
            "xmin": ext.xmin,
            "ymin": ext.ymin,
            "xmax": ext.xmax,
            "ymax": ext.ymax,
            "spatialReference": {
                "wkid": ext.spatialReference.wkt
            }
        });
    }
    return projExtent;
}

function Success(result) {
    if (result.length) {
        map.setExtent(result[0]);
    } else {
        console.log("No results were returned.");
    }
}

function Failure(err) {
    showDailog("error", err);
}

function AddChashedAndDynamicService(url, id, btid, title) {
    var url1 = url + "?f=json";
    esri.request({
        url: url1,
        handleAs: "json",
        load: function (data) {

            if (data.singleFusedMapCache) {
                AddTiledService(url, id, btid, title);
            } else {
                AddDynamicService(url, id, btid, title);
            }
        },
        error: function (err) {
            HideProgressIndicatorAdditionalContent();
            showDailog("error", err);
        }
    });
}

function AddTiledService(url, id, btid, title) {
    var overlaymap = new esri.layers.ArcGISTiledMapServiceLayer(url);
    overlaymap.id = id;
    map.addLayer(overlaymap);
    dijit.byId("legendDiv").layerInfos.push({
        "layer": overlaymap,
        "title": title
    });
    SetExtentForLayer(url, true);
    dojo.byId(btid).innerHTML = "Remove";
}

function AddDynamicService(url, id, btid, title) {
    var imageParameters = new esri.layers.ImageParameters();
    var overlaymap = new esri.layers.ArcGISDynamicMapServiceLayer(url, {
        "imageParameters": imageParameters
    });
    overlaymap.id = id;
    map.addLayer(overlaymap);
    dijit.byId("legendDiv").layerInfos.push({
        "layer": overlaymap,
        "title": title
    });
    SetExtentForLayer(url, true);
    dojo.byId(btid).innerHTML = "Remove";
}