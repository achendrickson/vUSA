var legendDijit = null;
var addLayerId = [];

function BuildDesktopDOM() {
    dojo.byId("loginbackground").style.display = "none";
    new dijit.layout.BorderContainer({
        id: 'mainWindow',
        design: 'headline',
        gutters: 'false',
        style: {
            height: '100%',
            width: '100%'
        }
    }).placeAt(dojo.body(), 'first');

    AddCutsomContentPane('leftPane', 'left', '<div id="leftPaneContent" design="headline" gutters="false">' +
        '<div id="leftPaneHeader" region="top">' +
        '<span id="legendHeader"></span>' +
        '</div>' +
        '<div id="leftPaneBody" dojotype="dijit.layout.StackContainer" region="center">' +
        '<div id="panel1" class="panel_content" dojotype="dijit.layout.ContentPane">' +
        '<div id="legendDiv">' +
        '</div></div></div></div>', 'mainWindow', 'first');
    dojo.addClass(dijit.byId("leftPane").domNode, "leftPane1");

    AddCutsomContentPane('header', 'top', '<div style="position: absolute;" ><img id="applicationIcon"></div><div id="title"></div><div id="subtitle"></div><div id="header_flourish"></div>', 'mainWindow', 'first');
    CreateHeaderTable();
    var leg = dojo.create("div");
    dojo.byId("leftPaneHeader").appendChild(leg);
    leg.innerHTML = configOptions.leftPanelHeader;
    leg.style.color = "#175282";
    leg.style.padding = "7px 0px 0px 65px";
}

//function to create table cell 

function CreateTd(tdID, image, title) {
    var td = dojo.create("td", {
        "id": tdID
    });
    td.style.paddingRight = "10px";
    var div = dojo.create("div");
    div.className = "Header";

    td.appendChild(div);
    var thumbnail = CreateHeaderThumbnail(image, title);
    div.appendChild(thumbnail);
    dojo.connect(td, "onclick", function (e) {
        HeaderIconClick(e);
    });
    return td;
}

//function to create thumbnails for header icons

function CreateHeaderThumbnail(imageSrc, title) {
    var imgBasemap = document.createElement("img");
    imgBasemap.src = imageSrc;
    imgBasemap.className = "imgOptions";
    if (title) {
        imgBasemap.title = title;
        if (title == "Share") {
            imgBasemap.id = title;
        }
    }
    imgBasemap.style.cursor = "pointer";
    return imgBasemap;
}

function HeaderIconClick(e) {
    if (e.currentTarget.id == "addEvent") {
        dojo.byId("divAddContent").style.left = "31%";
        dojo.byId("divAddContent").style.top = "21%";
        dojo.byId("loadingIndicatorAdditionalContent").style.top = "21%";
        dojo.byId("loadingIndicatorAdditionalContent").style.left = "31%";
        dojo.byId("Checkbox").style.display = "block";
        IconClick(e);
        dojo.byId("divEventConatiner").style.display = "block";
        CreateLoadMapDialog();
    }
    if (e.currentTarget.id == "toggleLegends") {
        ToggleLegends();
        IconClick(eevt);
    }
    if (e.currentTarget.id == "addContent") {
        dojo.byId("divAddContent").style.left = "31%";
        dojo.byId("divAddContent").style.top = "21%";
        dojo.byId("loadingIndicatorAdditionalContent").style.top = "21%";
        dojo.byId("loadingIndicatorAdditionalContent").style.left = "31%";
        ShowProgressIndicator();
        IconClick(e);
        dojo.byId("AddHeaderConetent").innerHTML = "Add additional content";
        SearchWebMapsForAddContent();
        FeatureSearch();
    }
    if (e.currentTarget.id == "shareBaseMap") {
        IconClick(e);
        ShareMap(true);
    }
    if (e.currentTarget.id == "maximizeBaseMap") {
        ToggleFullScreen();
    }
    if (e.currentTarget.id == "help") {
        window.open(configOptions.HelpURL);
    }
}

//function to create header icons 

function CreateHeaderTable() {
    dojo.byId("applicationIcon").src = configOptions.applicationIcon;
    dojo.byId("title").innerHTML = configOptions.title;

    var headerTable = document.createElement("table");
    headerTable.className = "tableHeader";
    headerTable.id = "tableHeader";
    var headerRow = headerTable.insertRow(0);

    var eventTd = CreateTd("addEvent", "images/edit-event.png", "Change Event");
    var toggleLegendTd = CreateTd("toggleLegends", "images/toggle.png", "Toggle legend");
    var addAdditionalContentTd = CreateTd("addContent", "images/add.png", "Additional content");
    var shareTd = CreateTd("shareBaseMap", "images/share.png", "Share");
    var maximizeTd = CreateTd("maximizeBaseMap", "images/maximize.png");
    var helpTd = CreateTd("help", "images/help.png", "Help");

    headerRow.appendChild(eventTd);
    headerRow.appendChild(toggleLegendTd);
    headerRow.appendChild(addAdditionalContentTd);
    headerRow.appendChild(shareTd);
    headerRow.appendChild(maximizeTd);
    headerRow.appendChild(helpTd);

    dojo.byId("header").appendChild(headerTable);
}

//function to toggle legends panel

function ToggleLegends() {
    if (dojo.coords("leftPane").w > 0) {
        dojo.replaceClass("leftPane", "hideContainerHeight1", "showContainerHeight1");
        dojo.byId("leftPane").style.width = '0px';
        dojo.byId("map").style.left = "0px";
        setTimeout(function () {
            dojo.byId("map").style.width = "100%";
            map.resize();
        }, 500);
    } else {
        dojo.replaceClass("leftPane", "showContainerHeight1", "hideContainerHeight1");
        dojo.byId('leftPane').style.width = 224 + "px";
        setTimeout(function () {
            dojo.byId("map").style.left = "223px";
            dojo.byId("map").style.width = "84%";
            dojo.byId("leftPane").style.overflow = "auto";
            dojo.byId("leftPane").style.height = "92%";
            map.resize();
        }, 500);
    }
}

function IconClick(evt) {
    if (evt) {
        var k = evt.target.src;
        k = k.split("/");
        var r = k[k.length - 1].split(".");
        k = r[0].split("_");
        if (k.length > 1) {
            j = r[0].split("_h");
            evt.target.src = "images/" + j[0] + "." + r[1];
            dojo.query(".HeaderRound").forEach(function (node) {
                var k = node.src.split("/");
                var r = k[k.length - 1].split(".");
                if (j[0] == r[0]) {
                    dojo.replaceClass(node, "Header", "HeaderRound");
                }
            });
        } else {
            evt.target.src = "images/" + r[0] + "_h." + r[1];
            dojo.query(".HeaderRound").forEach(function (node) {
                var k = node.src;
                k = k.split("/");
                var r = k[k.length - 1].split(".");
                if (r[0] != "toggle_h") {
                    k = r[0].split("_");
                    if (k.length > 1) {
                        j = r[0].split("_h");
                        node.src = "images/" + j[0] + "." + r[1];
                    }
                    dojo.replaceClass(node, "Header", "HeaderRound");
                }
            });
            dojo.replaceClass(evt.target, "HeaderRound", "Header");
        }
        if (dojo.coords("divAppContainer").h > 0) {
            dojo.replaceClass("divAppContainer", "hideContainerHeight", "showContainerHeight");
            dojo.byId('divAppContainer').style.height = '0px';
        }
    } else {
        dojo.query(".HeaderRound").forEach(function (node) {
            var k = node.src;
            k = k.split("/");
            var r = k[k.length - 1].split(".");
            if (r[0] != "toggle_h") {
                k = r[0].split("_");
                if (k.length > 1) {
                    j = r[0].split("_h");
                    node.src = "images/" + j[0] + "." + r[1];
                }
                dojo.replaceClass(node, "Header", "HeaderRound");
            }
        });
    }
}

function AddCutsomContentPane(domId, domRegion, domContent, domPlacement, domLoc) {
    new dijit.layout.ContentPane({
        id: domId,
        region: domRegion,
        content: domContent
    }).placeAt(domPlacement, domLoc);
}

//function to call methods on enter key press

function CreateAdditionalContentOnKeyPress(evt, Id) {
    if (evt.which == 13 || evt.keyCode == 13) {
        if (Id == "inputAGOLText") {
            CreateAddContentsAGOLTable();
        }
        if (Id == "inputvUsaText") {
            CreateAddContentsvUsaTable();
        }
    }
}

function CreateAddContentsvUsaTable() {
    ShowProgressIndicatorAdditionalContent();
    dojo.empty(dojo.byId("divAddContentContainerTabContainer"));
    var textData = dojo.byId("inputvUsaText").value.trim();
    var params;
    var groups = "";
    for (var i in configOptions.groups) {
        if (groups == "") {
            groups = configOptions.groups[0].groupID;
        } else {
            groups = groups + '" OR "' + configOptions.groups[i].groupID;
        }
    }
    params = {
        q: textData + ' AND (group:("' + groups + '") OR accountid:' + portalUser.orgId + ')',
        num: 100,
        sortField: "modified",
        sortOrder: "desc",
        token: token
    }
    portal.queryItems(params).then(function (groupdata) {
        CreateAddContentsTable(groupdata, "divAddContentContainerTabContainer");
    });
}

function CreateAddContentsAGOLTable() {
    ShowProgressIndicatorAdditionalContent();
    dojo.empty(dojo.byId("divAddArcGISContentContainer"));
    var textData = dojo.byId("inputAGOLText").value.trim();
    var params;
    params = {
        q: textData,
        num: 100,
        sortField: "modified",
        sortOrder: "desc",
        token: token
    }
    portal.queryItems(params).then(function (groupdata) {
        CreateAddContentsTable(groupdata, "divAddArcGISContentContainer");
    });
}

function FeatureSearch() {
    var group = i18n.viewer.main.featureGroupId;
    var params = {
        q: 'group:' + group,
        num: 100,
        sortField: "modified",
        sortOrder: "desc"
    }
    portal.queryItems(params).then(function (groupdata) {
        CreateAddContentsTable(groupdata, "divAddArcGISContentContainer");
    });
}

//function to create add additional contents table

function CreateAddContentsTable(groupdata, Id) {
    var addContentDiv = document.createElement("div");
    addContentDiv.id = "addContentContainer";
    addContentDiv.className = "addContentContainer";
    var addContentMainTable = document.createElement("table");
    addContentMainTable.cellPadding = 5;
    addContentMainTable.cellSpacing = 0;
    addContentMainTable.className = "addContentMainTable";
    addContentMainTable.style.width = "96%";
    addContentMainTable.id = "addContentMainTable";
    var i = 0;
    var j = 1;
    var length = groupdata.results.length;
    if (length > 0) {
        for (k = 0; k < length; k++) {
            var addContentMainTableRow = addContentMainTable.insertRow(i);
            var addContentMainTableCell1 = addContentMainTableRow.insertCell(0);
            addContentMainTableCell1.rowSpan = 2;
            addContentMainTableCell1.className = "selectBorder";
            var thumbnailImage = document.createElement("img");
            thumbnailImage.className = "thumbnailContainer";
            if (groupdata.results[k].thumbnailUrl == null) {
                thumbnailImage.src = "images/not-available.png";
            } else {
                thumbnailImage.src = groupdata.results[k].thumbnailUrl;
            }
            addContentMainTableCell1.appendChild(thumbnailImage);

            var addContentMainTableCell2 = addContentMainTableRow.insertCell(1);
            addContentMainTableCell2.className = "titleContainer";
            addContentMainTableCell2.colSpan = "3";
            var tempName = groupdata.results[k].title;
            if (tempName) {
                if (tempName.length > 50) {
                    addContentMainTableCell2.title = tempName;
                    var temp = "";
                    for (var a = 0; a < 50; a++) {
                        temp = temp + tempName.charAt(a);
                    }
                    addContentMainTableCell2.innerHTML = temp + "...";
                } else {
                    addContentMainTableCell2.innerHTML = tempName;
                }
            }
            addContentMainTableCell2.align = "left";
            var addContentMainTableRow1 = addContentMainTable.insertRow(j);
            var addContentMainTableCell3 = addContentMainTableRow1.insertCell(0);
            addContentMainTableCell3.className = "descriptionContainer";
            var tempDesc = groupdata.results[k].snippet;

            if (tempDesc) {
                if (tempDesc.length > 80) {
                    addContentMainTableCell3.title = tempDesc;
                    var temp1 = "";
                    for (var b = 0; b < 80; b++) {
                        temp1 = temp1 + tempDesc.charAt(b);
                    }
                    addContentMainTableCell3.innerHTML = temp1 + "...";
                } else {
                    addContentMainTableCell3.innerHTML = tempDesc;
                }
            } else {
                addContentMainTableCell3.innerHTML = "N/A";
            }
            addContentMainTableCell3.align = "left";
            var addContentMainTableCell4 = addContentMainTableRow1.insertCell(1);
            addContentMainTableCell4.className = "selectHyperlink";
            addContentMainTableCell4.style.width = "73px";

            var spanAddContentMainTableCell4 = dojo.create("span");
            spanAddContentMainTableCell4.style.cursor = "pointer";
            spanAddContentMainTableCell4.id = "Add_" + groupdata.results[k].id;
            addContentMainTableCell4.appendChild(spanAddContentMainTableCell4);
            if ((groupdata.results[k].type == "Map Service") || (groupdata.results[k].type == "KML") || (groupdata.results[k].type == "Feature Service") || (groupdata.results[k].type == "Web Map")) {
                if (!addLayerId[groupdata.results[k].id]) {
                    spanAddContentMainTableCell4.innerHTML = "Add";
                } else {
                    spanAddContentMainTableCell4.innerHTML = "Remove";
                }
                dojo.connect(spanAddContentMainTableCell4, "onclick", function (evt) {
                    var id = evt.target.id.split("_")[1];
                    if (evt.target.innerHTML == "Add") {
                        dojo.empty(legendDiv);
                        dojo.byId(evt.target.id).innerHTML = "Loading...";
                        CreateMapLayers(id, evt.target.id);

                    } else if (evt.target.innerHTML == "Remove") {
                        map.infoWindow.hide();
                        delete addLayerId[id];
                        dojo.byId(evt.target.id).innerHTML = "Removing...";
                        var itemURL = portalUrl + "/sharing/rest/content/items/${0}?f=json&token=${0}";

                        var userGroupDetails = itemURL.split("${0}");
                        var userGroupLink = userGroupDetails[0] + id + userGroupDetails[1] + token;
                        esri.request({
                            url: userGroupLink,
                            callbackParamName: "callback",
                            load: function (data) {

                                var layerIndex = id + "_" + 0;
                                var k = 0;
                                if (layerCounter[layerIndex]) {
                                    for (var i = 0; i == k; i++) {
                                        layerid = id + "_" + k;
                                        if (layerCounter[layerid]) {
                                            for (var l = 0; l < dijit.byId("legendDiv").layerInfos.length; l++) {

                                                if (dijit.byId("legendDiv").layerInfos[l].layer && map._layers[layerid]) {
                                                    if (map._layers[layerid].id == dijit.byId("legendDiv").layerInfos[l].layer.id) {
                                                        dijit.byId("legendDiv").layerInfos.splice(l, 1);
                                                        dijit.byId("legendDiv").refresh();
                                                        break;
                                                    }
                                                }
                                            }
                                            if (map.getLayer(layerCounter[layerid])) {
                                                map.removeLayer(map.getLayer(layerCounter[layerid]));
                                                delete layerCounter[layerid];
                                            }
                                            k++;
                                        } else {
                                            break;
                                        }
                                    }
                                } else {
                                    for (var l = 0; l < dijit.byId("legendDiv").layerInfos.length; l++) {
                                        if (map._layers[id].id == dijit.byId("legendDiv").layerInfos[l].layer.id) {
                                            dijit.byId("legendDiv").layerInfos.splice(l, 1);
                                            dijit.byId("legendDiv").refresh();
                                        }
                                    }
                                    map.removeLayer(map.getLayer(id));
                                }
                                evt.target.innerHTML = "Add";

                            },
                            error: function (err) {
                                HideProgressIndicatorAdditionalContent();
                                showDailog("error", err);
                            }
                        });
                    }
                });
                addContentMainTableCell4.align = "left";
            }

            var addContentMainTableCell5 = addContentMainTableRow1.insertCell(2);
            addContentMainTableCell5.className = "selectHyperlink";

            var spanAddContentMainTableCell5 = dojo.create("span");
            spanAddContentMainTableCell5.innerHTML = "Details";
            spanAddContentMainTableCell5.style.cursor = "pointer";
            addContentMainTableCell5.appendChild(spanAddContentMainTableCell5);
            spanAddContentMainTableCell5.id = "Details_" + groupdata.results[k].id;


            dojo.connect(spanAddContentMainTableCell5, "onclick", function (evt) {
                ShowProgressIndicatorAdditionalContent();
                dojo.byId("DetailsLayoutContent").style.left = dojo.byId("divAddContent").style.left;
                dojo.byId("DetailsLayoutContent").style.top = dojo.byId("divAddContent").style.top;
                dojo.byId("loadingIndicatorAdditionalContent").style.top = dojo.byId("divAddContent").style.top;
                dojo.byId("loadingIndicatorAdditionalContent").style.left = dojo.byId("divAddContent").style.left;

                setDragBehaviour("detailsheader", "DetailsLayoutContent");
                var webid = evt.target.id;
                dojo.byId("backGroundImage").style.visibility = "hidden";
                dojo.byId("DetailsLayoutContainer").style.display = "block";
                dojo.byId("DetailsLayoutContent").style.display = "block";

                var detailsURL = portalUrl + "/sharing/content/items/${0}?f=json&token=${0}";

                var userGroupDetails = detailsURL.split("${0}");
                var userGroupLink = userGroupDetails[0] + evt.target.id.split("_")[1] + userGroupDetails[1] + token;
                esri.request({
                    url: userGroupLink,
                    callbackParamName: "callback",
                    load: function (data) {

                        var details = dojo.create("div");
                        details.style.height = "350px";
                        details.style.width = "500px";
                        details.style.overflow = "auto";
                        document.getElementById("addDetailsContainer").appendChild(details);

                        var table = dojo.create("table");
                        details.appendChild(table);

                        table.cellPadding = 2;
                        table.cellSpacing = 2;
                        table.className = "detailsContentTable";

                        // details title
                        var row = createHTMLElements(table, true, 0);
                        var cell = createHTMLElements(row, false, 0);
                        cell.colSpan = "2";

                        var title = dojo.create("p");
                        title.className = "itemTitle";
                        var downloadPath = null;
                        if (data.itemType == "file") {

                            downloadPath = userGroupDetails[0] + evt.target.id.split("_")[1] + "/data?token=" + token;

                        }
                        if (!(data.type == "Map Service" || data.type == "Feature Service" || data.type == "Web Map")) {

                            title.innerHTML = data.title;
                            cell.appendChild(title);

                            createIteamDetailsHeader(data, table, downloadPath);
                            //details body       
                            createIteamDetailsBody(data, table);

                            //details map content

                            createDetailsMapContent(data, table, data.url);
                            //details properties
                            createDetailsproperties(data, table, webid);
                        }
                        else {
                            var itemDeferred = esri.arcgis.utils.getItem(evt.target.id.split("_")[1]);
                            itemDeferred.addCallback(function (itemInfo) {
                                if (itemInfo.item) {

                                    title.innerHTML = itemInfo.item.title;
                                    cell.appendChild(title);

                                    createIteamDetailsHeader(itemInfo.item, table, null);
                                    //details body       
                                    createIteamDetailsBody(itemInfo.item, table);

                                    //details map content

                                    createDetailsMapContent(itemInfo, table, null);
                                    //details properties
                                    createDetailsproperties(itemInfo.item, table, webid);

                                }
                            });
                        }
                    },
                    error: function (err) {
                        HideProgressIndicatorAdditionalContent();
                        showDailog("error", err);
                    }
                });
            });
            addContentMainTableCell5.align = "left";
            i = i + 2;
            j = j + 2;
        }
    } else {
        addContentMainTable.style.color = "#2F2F67";
        addContentMainTable.innerHTML = i18n.viewer.errors.agolError;
    }
    addContentDiv.appendChild(addContentMainTable);
    document.getElementById(Id).appendChild(addContentDiv);
    HideProgressIndicator();
    HideProgressIndicatorAdditionalContent();
}

function createDetailsproperties(itemInfo, table, webid) {
    var row = table.insertRow(5);
    var cell = row.insertCell(0);
    cell.style.borderBottom = "1px solid #BEBEBE";
    cell.colSpan = "2";
    var table1 = dojo.create("table");
    cell.appendChild(table1);
    table1.cellPadding = 4;
    table1.cellSpacing = 0;

    var row1 = table1.insertRow(0);
    var cell1 = row1.insertCell(0);
    cell1.style.fontWeight = "bold";
    cell1.style.paddingLeft = "0px";
    cell1.style.paddingTop = "0px";
    cell1.innerHTML = "Properties";
    row1.style.height = "30px";
    row1.style.verticalAlign = "baseline";
    var row1 = table1.insertRow(1);
    row1.style.verticalAlign = "baseline";
    var cell1 = row1.insertCell(0);
    var cell2 = row1.insertCell(1);
    cell2.style.verticalAlign = "baseline";
    var tags = "Tags: ";
    var tags1 = "";
    for (var i = 0; i < itemInfo.tags.length; i++) {
        if (i == 0) {
            tags1 = itemInfo.tags[i];
        }
        else {
            tags1 = tags1 + ", " + itemInfo.tags[i];
        }
    }
    cell1.innerHTML = tags;
    cell2.innerHTML = tags1;

    var row1 = table1.insertRow(2);
    row1.style.verticalAlign = "baseline";
    var cell1 = row1.insertCell(0);
    var tags = "Size: ";
    cell1.innerHTML = tags;
    var cell2 = row1.insertCell(1);
    cell2.style.verticalAlign = "baseline";
    cell2.innerHTML = +itemInfo.size;

    var row1 = table1.insertRow(3);
    row1.style.verticalAlign = "baseline";
    var cell1 = row1.insertCell(0);
    var cell2 = row1.insertCell(1);
    cell2.style.verticalAlign = "baseline";
    var exten = "Extent: ";
    cell1.innerHTML = exten;
    cell1.style.verticalAlign = "baseline";
    if (itemInfo.extent.length > 0) {
        var extentTable = dojo.create("table");
        var extentRow = extentTable.insertRow(0);
        var extentCell = extentRow.insertCell(0);
        extentCell.style.width = "125px";
        extentCell.style.height = "22px";
        extentCell.innerHTML = "Left: " + itemInfo.extent[0][0];
        var extentCell1 = extentRow.insertCell(1);
        extentCell1.innerHTML = "Right: " + itemInfo.extent[1][0];
        var extentRow1 = extentTable.insertRow(1);
        var extentCell2 = extentRow1.insertCell(0);
        extentCell2.innerHTML = "Top: " + itemInfo.extent[0][1];
        var extentCell3 = extentRow1.insertCell(0);
        extentCell3.innerHTML = "Bottom: " + itemInfo.extent[1][1];
        cell2.appendChild(extentTable);
    }
    var row = table.insertRow(6);
    var cell = row.insertCell(0);

    var div = dojo.create("span");
    div.style.color = "blue";
    div.style.cursor = "pointer";
    div.innerHTML = "More details";
    cell.appendChild(div);
    dojo.connect(div, "onclick", function () {
        var k = portalUrl + "/home/item.html?id=${0}";
        var url = k.split("$")[0];
        url = url + webid.split("_")[1];
        window.open(url);
    });
    HideProgressIndicatorAdditionalContent();
}

function createDetailsMapContent(itemInfo, table, url) {
    var row = createHTMLElements(table, true, 4);
    var cell = createHTMLElements(row, false, 0);
    cell.style.borderBottom = "1px solid #BEBEBE";
    cell.colSpan = "2";
    var table1 = dojo.create("table");
    cell.appendChild(table1);
    table1.cellPadding = 2;
    table1.cellSpacing = 2;

    var row1 = createHTMLElements(table1, true, 0);
    var cell1 = createHTMLElements(row1, false, 0);
    cell1.style.fontWeight = "bold";
    cell1.innerHTML = "Map Contents";
    cell1.style.height = "30px";
    cell1.style.paddingLeft = "0px";
    cell1.style.paddingTop = "0px";
    cell1.style.verticalAlign = "top";
    if (url) {
        var row1 = createHTMLElements(table1, true, 1);
        var cell1 = createHTMLElements(row1, false, 0);
        cell1.className = "tdBreakWord";
        cell1.innerHTML = '<a href="' + url + '" target="_blank">' + url + '</a>';
        cell1.style.height = "30px";
        cell1.style.verticalAlign = "top";
    }
    else if (itemInfo.item.url) {
        var row1 = createHTMLElements(table1, true, 1);
        var cell1 = createHTMLElements(row1, false, 0);
        cell1.className = "tdBreakWord";
        cell1.innerHTML = '<a href="' + itemInfo.item.url + '" target="_blank">' + itemInfo.item.url + '</a>';
        cell1.style.height = "30px";
        cell1.style.verticalAlign = "top";
    }
    else if (itemInfo.itemData) {
        if (itemInfo.itemData.operationalLayers) {
            var k = 1;
            var l = 2;
            for (var i in itemInfo.itemData.operationalLayers) {
                var row1 = table1.insertRow(k);
                var cell1 = row1.insertCell(0);
                cell1.innerHTML = itemInfo.itemData.operationalLayers[i].title;

                var row1 = table1.insertRow(l);
                var cell1 = row1.insertCell(0);
                cell1.className = "tdBreakWord";
                cell1.innerHTML = '<a href="' + itemInfo.itemData.operationalLayers[i].url + '" target="_blank">' + itemInfo.itemData.operationalLayers[i].url + '</a>';
                if (i == itemInfo.itemData.operationalLayers.length - 1) {
                    cell1.style.height = "30px";
                    cell1.style.verticalAlign = "top";
                }
                k = k + 2;
                l = l + 2;
            }
        }
    }
}

function createIteamDetailsBody(itemInfo, table) {
    var row = createHTMLElements(table, true, 2);
    var cell = createHTMLElements(row, false, 0);
    cell.style.borderBottom = "1px solid #BEBEBE";
    cell.colSpan = "2";
    cell.style.paddingTop = "5px";

    var table1 = dojo.create("table");
    cell.appendChild(table1);
    table1.cellPadding = 0;
    table1.cellSpacing = 0;
    table1.style.width = "100%";
    var row1 = createHTMLElements(table1, true, 0);
    var cell1 = createHTMLElements(row1, false, 0);
    cell1.className = "detailDescription";
    cell1.innerHTML = "Description";

    if (itemInfo.description) {
        var row1 = createHTMLElements(table1, true, 1);
        var cell1 = createHTMLElements(row1, false, 0);
        var desc = itemInfo.description;
        cell1.innerHTML = desc.trim();
        cell1.style.verticalAlign = "top";
    }

    var row = createHTMLElements(table, true, 3);
    var cell = createHTMLElements(row, false, 0);
    cell.style.borderBottom = "1px solid #BEBEBE";
    cell.colSpan = "2";
    var table1 = dojo.create("table");
    cell.appendChild(table1);
    table1.cellPadding = 0;
    table1.cellSpacing = 0;

    var row1 = createHTMLElements(table1, true, 0);
    var cell1 = createHTMLElements(row1, false, 0);
    cell1.style.fontWeight = "bold";
    cell1.style.height = "30px";
    cell1.style.verticalAlign = "text-top";
    cell1.innerHTML = "Access and Use Constraints";
    if (itemInfo.licenseInfo) {
        var row1 = createHTMLElements(table1, true, 1);
        var cell1 = createHTMLElements(row1, false, 0);
        cell1.innerHTML = itemInfo.licenseInfo;
    }
}

function createIteamDetailsHeader(itemInfo, table, downloadPath) {
    // details header
    var row = createHTMLElements(table, true, 1);
    var cell = createHTMLElements(row, false, 0);
    cell.style.width = "200px";
    cell.style.height = "133px";
    cell.style.verticalAlign = "top";

    var thumbnail = dojo.create("img");
    thumbnail.className = "detailsImgCell";
    cell.appendChild(thumbnail);
    cell.align = "center";

    if (itemInfo.thumbnail == null) {
        thumbnail.src = "images/not-available.png";
    } else {
        imgurl = portalUrl + "/sharing/rest/content/items/" + itemInfo.id + "/info/" + itemInfo.thumbnail + "?token=" + token;
        thumbnail.src = imgurl;
    }

    var cell = createHTMLElements(row, false, 1);
    cell.style.verticalAlign = "top";
    cell.style.fontSize = "90%";

    var table1 = dojo.create("table");
    cell.appendChild(table1);
    table1.cellPadding = 2;
    table1.cellSpacing = 0;

    var row1 = createHTMLElements(table1, true, 0);
    var cell1 = createHTMLElements(row1, false, 0);
    cell1.innerHTML = itemInfo.snippet;

    var row1 = createHTMLElements(table1, true, 1);
    var cell1 = createHTMLElements(row1, false, 0);
    cell1.innerHTML = itemInfo.type + " by " + itemInfo.owner;

    var row1 = createHTMLElements(table1, true, 2);
    var cell1 = createHTMLElements(row1, false, 0);
    var date = dojo.date.locale.format(new Date(itemInfo.modified), { datePattern: "MMMM dd, yyyy", selector: "date" });
    cell1.innerHTML = "Last Modified: " + date;

    if (downloadPath) {
        var row1 = createHTMLElements(table1, true, 3);
        var cell1 = createHTMLElements(row1, false, 0);

        var div = dojo.create("span");
        div.style.color = "blue";
        div.style.cursor = "pointer";
        div.innerHTML = "Download";
        cell1.appendChild(div);
        dojo.connect(div, "onclick", function () {
            window.open(downloadPath);
        });

    }
}
function createHTMLElements(target, row, cell) {
    if (row) {
        var value = target.insertRow(cell);
    }
    else {
        var value = target.insertCell(cell);
    }
    return value;
}

function CloseDetailsContentsContainer() {
    dojo.byId("divAddContent").style.top = dojo.byId("DetailsLayoutContent").style.top;
    dojo.byId("divAddContent").style.left = dojo.byId("DetailsLayoutContent").style.left;

    dojo.byId("loadingIndicatorAdditionalContent").style.top = dojo.byId("DetailsLayoutContent").style.top;
    dojo.byId("loadingIndicatorAdditionalContent").style.left = dojo.byId("DetailsLayoutContent").style.left;

    setDragBehaviour("AddHeaderConetent", "divAddContent");
    setDragBehaviour("AddHeaderConetent", "divAddContent");
    dojo.byId("DetailsLayoutContainer").style.display = "none";
    dojo.byId("DetailsLayoutContent").style.display = "none";
    dojo.empty(dojo.byId("addDetailsContainer"));
    dojo.byId("backGroundImage").style.visibility = "visible";

}
//Show progress indicator for add additional contents table

function ShowProgressIndicatorAdditionalContent() {
    dojo.byId("loadingIndicatorAdditionalContent").style.display = "block";
}

//Hide progress indicator for add additional contents table

function HideProgressIndicatorAdditionalContent() {
    dojo.byId("loadingIndicatorAdditionalContent").style.display = "none";
}

//Show progress indicator

function ShowProgressIndicator() {
    dojo.byId("divLoadingIndicator").style.display = "block";
}

//Hide progress indicator

function HideProgressIndicator() {
    dojo.byId("divLoadingIndicator").style.display = "none";
}

// function to close the contents container

function CloseAddContentsContainer() {
    dojo.byId("backGroundImage").style.visibility = "hidden"; ;
    dojo.byId("divAddContent").style.display = "none";
    if (dijit.byId("tabContainer")) {
        dijit.byId("tabContainer").destroyRecursive();
    }
    dojo.empty(dojo.byId("divAddContentContainer"));
    if (dijit.byId("inputAGOLText")) {
        dijit.byId("inputAGOLText").destroyRecursive();
    }
    if (dijit.byId("inputvUsaText")) {
        dijit.byId("inputvUsaText").destroyRecursive();
    }
    dojo.byId("divEventConatiner").style.display = "none";
    dojo.empty(dojo.byId("tabContainerMainDiv"));
    IconClick();
}

//function to create error dialog

function showDailog(title, message) {
    var alertDialog = dojo.create("div");
    alertDialog.id = "alertDialog";
    alertDialog.className = "alertDialog";

    var table = dojo.create("table");
    var row = table.insertRow(0);
    var cell = row.insertCell(0);
    var messageDiv = dojo.create("div");
    messageDiv.id = "divMessage";
    messageDiv.innerHTML = message;
    cell.appendChild(messageDiv)

    var row1 = table.insertRow(1);
    var cell1 = row1.insertCell(0);
    var okDiv = dojo.create("div");
    okDiv.style.marginLeft = "90px";
    okDiv.className = "customButton";
    okDiv.onclick = function () {
        dialog.destroyRecursive();
    }
    var okTable = dojo.create("table");
    var okRow = okTable.insertRow(0);
    var okCell = okRow.insertCell(0);
    okCell.align = "center";
    okCell.vAlign = "middle";
    okCell.innerHTML = "OK";
    okDiv.appendChild(okTable);
    cell1.appendChild(okDiv);

    alertDialog.appendChild(table);

    var dialog = new dijit.Dialog({
        title: title,
        content: alertDialog
    });
    dialog.show();
}

//function to create collection of operational layers and base map layer

function ShareMap(ext) {
    var operationalLayers = [];
    var baseMapCollection = [];
    if (ext) {
        if (dojo.coords("divAppContainer").h > 0) {
            dojo.replaceClass("divAppContainer", "hideContainerHeight", "showContainerHeight");
            dojo.byId('divAppContainer').style.height = '0px';
            return;
        } else {
            dojo.byId('divAppContainer').style.height = 72 + "px";
            dojo.replaceClass("divAppContainer", "showContainerHeight", "hideContainerHeight");
        }
    }
    for (var i = 0; i < addedLayersOnMap.length; i++) {
        if (addedLayersOnMap[i].type == "KML") {
            var layerObject = {
                "layerDefinition": {
                    "definitionExpression": ""
                },
                "url": addedLayersOnMap[i].url,
                "showLegend": true,
                "id": addedLayersOnMap[i].id,
                "itemId": addedLayersOnMap[i].id,
                "title": addedLayersOnMap[i].title,
                "type": addedLayersOnMap[i].type,
                "visibility": true
            }
        } else {
            var layerObject = {
                "layerDefinition": {
                    "definitionExpression": ""
                },
                "url": addedLayersOnMap[i].url,
                "showLegend": true,
                "id": addedLayersOnMap[i].id,
                "itemId": addedLayersOnMap[i].id,
                "title": addedLayersOnMap[i].title
            }
        }
        operationalLayers.push(layerObject);
    }
    var baseMapLayersCollection = {
        "layerDefinition": {},
        "url": this.map.getLayer(this.map.layerIds[0]).url,
        "showLegend": true,
        "opacity": 0.85,
        "title": this.map.getLayer(this.map.layerIds[0]).layerInfos[0].name
    }
    baseMapCollection.push(baseMapLayersCollection);
    CreateLayersForShare(operationalLayers, baseMapCollection);
}

//function to create parameters for the web map to share

function CreateLayersForShare(operationalLayers, baseMapCollection) {
    var textData = {
        "version": "1.6",
        "baseMap": {
            "title": this.map.getLayer(this.map.layerIds[0]).layerInfos[0].name,
            "baseMapLayers": baseMapCollection
        },
        "operationalLayers": operationalLayers
    };

    // Get the extent, need coordinates to be Geographic
    var xmin, ymin, xmax, ymax, wkid;
    xmin = this.map.extent.xmin;
    ymin = this.map.extent.ymin;
    xmax = this.map.extent.xmax;
    ymax = this.map.extent.ymax;
    wkid = this.map.extent.spatialReference.wkid;

    // Convert Mercator units to geographic, if necessary
    if (this.map.extent.spatialReference._isWebMercator()) {
        var geographic = esri.geometry.webMercatorToGeographic(this.map.extent);
        xmin = geographic.xmin;
        ymin = geographic.ymin;
        xmax = geographic.xmax;
        ymax = geographic.ymax;
        wkid = geographic.spatialReference.wkid;
    }

    var parameters = {
        "title": configOptions.webMapParameters.Title,
        "tags": configOptions.webMapParameters.Tags,
        "description": configOptions.webMapParameters.Description,
        "type": "Web Map",
        "spatialreference": {
            "wkid": wkid
        },
        "extent": xmin + ", " + ymin + ", " + xmax + ", " + ymax,
        "text": JSON.stringify(textData),
        "overwrite": true
    };
    CreateWebMap(parameters);
}

function CreateWebMap(parameters) {
    var arr1 = [portalUser.username, token];
    var addItemUrl = dojo.string.substitute(configOptions.addItemUrl, arr1);
    esri.request({
        url: addItemUrl,
        content: parameters,
        handleAs: "json",
        load: dojo.hitch(this, function (response) {

            ShareWith(response, this.map.layerIds[0]);
            MapPublish(response.id);
        }),
        error: dojo.hitch(this, function (e) {
            HideProgressIndicatorAdditionalContent();
            showDailog("error", e);
        })
    }, {
        usePost: true
    });

}

//to share with the organization
function ShareWith(response1, feature) {
    var arr = [portalUser.username, response1.id, token];
    var generateShareLink = dojo.string.substitute(configOptions.generateShareLink, arr);
    esri.request({
        url: generateShareLink,
        content: {
            org: true
        },
        handleAs: "json",
        load: dojo.hitch(this, function (response) { }),
        error: dojo.hitch(this, function (e) {
            HideProgressIndicatorAdditionalContent();
            showDailog("error", err);
        })
    }, {
        usePost: true
    });
}

//publish shareMap

function MapPublish(id) {
    var url = configOptions.webMapItemDetail + id;
    var newArr = [id, token];
    var generateMapPublishLink = dojo.string.substitute(configOptions.generateMapPublishLink, newArr);
    esri.request({
        url: generateMapPublishLink,
        handleAs: "json",
        load: dojo.hitch(this, function (data) {
            ShareLink(url);
        }),
        error: dojo.hitch(this, function (e) {
            HideProgressIndicatorAdditionalContent();
            showDailog("error", e);
        })
    }, {
        usePost: true
    });
}

function ShareLink(webMapUrl) {
    tinyUrl = null;
    var tinyResponse;
    var generatedUrl = webMapUrl.split("=");
    var url = esri.urlToObject(window.location.toString());
    var urlStr = encodeURI(url.path) + "?webmap=" + generatedUrl[1];
    url = dojo.string.substitute(configOptions.mapSharingOptions.TinyURLServiceURL, [urlStr]);
    dojo.io.script.get({
        url: url,
        callbackParamName: "callback",
        load: function (data) {
            tinyResponse = data;
            tinyUrl = data;
            var attr = configOptions.mapSharingOptions.TinyURLResponseAttribute.split(".");
            for (var x = 0; x < attr.length; x++) {
                tinyUrl = tinyUrl[attr[x]];
            }
        },
        error: function (error) {
            showDailog("error", tinyResponse.error);
        }
    });
    setTimeout(function () {
        if (!tinyResponse) {
            return;
        }
    }, 6000);
}

//Open login page for facebook,tweet and open Email client with shared link for Email

function Share1(site) {
    if (dojo.coords("divAppContainer").h > 0) {
        dojo.replaceClass("divAppContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId('divAppContainer').style.height = '0px';
    }
    dojo.byId("Share").src = "images/share.png";
    dojo.replaceClass("Share", "Header", "HeaderRound");
    if (tinyUrl) {
        switch (site) {
            case "facebook":
                window.open(dojo.string.substitute(configOptions.mapSharingOptions.FacebookShareURL, [tinyUrl]));
                break;
            case "twitter":
                window.open(dojo.string.substitute(configOptions.mapSharingOptions.TwitterShareURL, [tinyUrl]));
                break;
            case "mail":
                parent.location = dojo.string.substitute(configOptions.mapSharingOptions.ShareByMailLink, [tinyUrl]);
                break;

        }
    } else {
        showDailog("error", "Bitly API engine is not working, Please try again after sometime");
        return;
    }
}