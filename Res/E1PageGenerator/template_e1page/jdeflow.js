/*
 * Copyright © 2012, Oracle and/or its affiliates. All rights reserved.
 * Oracle and Java are registered trademarks of Oracle and/or its affiliates.
 * Other names may be trademarks of their respective owners.
 *
 * This software and related documentation are provided under a license agreement
 * containing restrictions on use and disclosure and are protected by intellectual
 * property laws. Except as expressly permitted in your license agreement or
 * allowed by law, you may not use, copy, reproduce, translate, broadcast, modify,
 * license, transmit, distribute, exhibit, perform, publish or display any part,
 * in any form, or by any means. Reverse engineering, disassembly, or
 * decompilation of this software, unless required by law for interoperability, is
 * prohibited.
 */

// -------------------- Constants across all flows --------------------------
var MIN_H_NARROW_SPACER = 6;
var MAX_H_NARROW_SPACER = 20;

var WIDE_TO_NARROW_RATIO = 3;
var HEADER_TO_NARROW_RATIO = 1.8;

var HEIGHT_ITEM = 50;

// -------------------- Constant within any given flow (computed once) ------
var rowsByType;
var numberOfSpaces;
var fixedHeight;
var flow;
var initDone = false;

// -------------------------- Page Height Dependant Quantities --------------
var minVarHeight = numberOfSpaces * MIN_H_NARROW_SPACER;
var maxVarHeight = numberOfSpaces * MAX_H_NARROW_SPACER;

// ------------------------------ Hover Related  ----------------------------
var LANG_STRINGS;
var HOVER_DELAY_TO_SHOW_DETAILS = 1000;
var DETAIL_FADE_IN_OUT_DURATION = 250;
var DETAIL_FADE_OUT_DELAY = 400;
var DETAIL_PANE_MAX_OPACITY = 0.93;
var savedDetailPane;

// ---------------------------------- Other ---------------------------------

var SECTION_FADE_DURATION = 300;
var SECTION_EXPAND_COLLAPSE_DURATION = 300;

var COLLAPSED_SECTION_ROTATION_ANGLE = -45;

var BROWSER_IS_IE = (navigator && navigator.appName == "Microsoft Internet Explorer");
if (BROWSER_IS_IE)
{
    SECTION_FADE_DURATION = 0;
}

// ------------------------------ Watchlist ----------------------------------

var WATCHLIST_HOLDER_ELEMENT;

function init()
{
    processTaskDefinitions();
    renderTable();
    checkRTL();
    setRotationAngleForCollapsible();
    autoReplaceIcons();
    updateHoverConsts();
    LANG_STRINGS = getLangStrings();
    computeFlowSpaceRequirements();
    watchListProcessing();
}

function renderTable()
{
    /* Runtime updates to the table are done - now we may reveal it. */

    var mainFlow = document.getElementById('mainFlow');
    if (mainFlow)
    {
        mainFlow.style.display = 'table';
    }
}

function checkRTL()
{
    try {
        if (top.isRTL)
        {
            document.documentElement.setAttribute('dir', 'rtl');
            isRTL = true;
        }
    }
    catch (excep)
    {
    }
}

var hideSecurityBlockedItems;
function watchListProcessing()
{
    processWatchlistDefinitions();
    var wlComponent = document.getElementById('watchlistContentHolder');
    WATCHLIST_HOLDER_ELEMENT = wlComponent;
    if (wlComponent)
    {
       adjustForWatchlistComponent();
    }
    if (top.WLIST)//If the Watchlist object exists let's start the processing if necessary.
    {
       top.WLIST.e1PageInit(document.getElementById('mainFlow'), hideSecurityBlockedItems, wlComponent);
    }
}

function computeFlowSpaceRequirements()
{
    if (documentContainsResizableSections())
    {
        // No special resizing because the page is too dynamic.
        return;
    }

    flow = document.getElementById('mainFlow');
    var tbody = flow.children[0];

    rowsByType = {item: [], narrowSpacer: [], wideSpacer: []};
    fixedHeight = 0;
    for (var i = 0; i < tbody.children.length; i++)
    {
        var row = tbody.children[i];
        switch(row.className)
        {
            case "narrowSpacer":
                rowsByType.narrowSpacer.push(row);
                break;

            case "wideSpacer":
                rowsByType.wideSpacer.push(row);
                break;

            default:
                rowsByType.item.push(row);
                fixedHeight += row.offsetHeight;
                break;
        }
    }

    numberOfSpaces =
        rowsByType.narrowSpacer.length +
        rowsByType.wideSpacer.length * WIDE_TO_NARROW_RATIO +
        HEADER_TO_NARROW_RATIO;

    minVarHeight = numberOfSpaces * MIN_H_NARROW_SPACER;
    maxVarHeight = numberOfSpaces * MAX_H_NARROW_SPACER;

    initDone = true;
    dynamicallySizeSpacers();
}

function dynamicallySizeSpacers()
{
    if (!initDone)
    {
        return;
    }

    var height = flow.parentNode.offsetHeight;
    var varHeight = height - fixedHeight;

    var scalar;
    if (varHeight < minVarHeight)
    {
        scalar = 1.0;

        /* We don't want to use overflow:auto because the scroll bar will appear
           and disappear in the instant before we adjust after resizing, causing
           a horizontal shift.  Instead, we can inteligently determine whether
           or not we will need a scroll bar.  */
        flow.parentNode.style.overflowY = 'scroll';
    }
    else
    {
        flow.parentNode.style.overflowY = 'hidden';
        if (varHeight > maxVarHeight)
        {
            scalar = MAX_H_NARROW_SPACER / MIN_H_NARROW_SPACER;
        }
        else
        {
            scalar = varHeight / minVarHeight;
        }
    }

    var unitHeight = scalar * MIN_H_NARROW_SPACER;

    flow.style.marginTop = (unitHeight * HEADER_TO_NARROW_RATIO) + 'px';

    for (var i = 0; i < rowsByType.narrowSpacer.length; i++)
    {
        rowsByType.narrowSpacer[i].style.height = unitHeight + 'px';
    }

    for (var i = 0; i < rowsByType.wideSpacer.length; i++)
    {
        rowsByType.wideSpacer[i].style.height = unitHeight * WIDE_TO_NARROW_RATIO + 'px';
    }
}


function dynamicallySizeComponent()
{
      if (!initDone || !WATCHLIST_HOLDER_ELEMENT)
    {
        return;
    }

    var wlCompTable  = document.getElementById('wlCompTable');
    var filterHolder = document.getElementById('filterHolder');
    var parent = WATCHLIST_HOLDER_ELEMENT.parentNode;
    if (parent.offsetHeight < WATCHLIST_HOLDER_ELEMENT.offsetHeight)
    {
       parent.style.overflowY = 'scroll';
       wlCompTable.style.width = parent.style.width = WATCHLIST_HOLDER_ELEMENT.style.width = filterHolder.style.width = '200px';
       adjustForWatchlistComponent();
    }
    else
    {
       parent.style.overflowY = '';
       wlCompTable.style.width = parent.style.width = WATCHLIST_HOLDER_ELEMENT.style.width = filterHolder.style.width = '';
    }

}


function getLangStrings()
{
    if (top.CARO_STRING_CONSTS)
    {
        return top.CARO_STRING_CONSTS;
    }

    var langObj = {task:        "Task:",
                   report:      "Report:",
                   application: "Application:",
                   form:        "Form:",
                   version:     "Version:",
                   productCode: "Product Code:"};

    return langObj;
}

function getDetailPane()
{
    if (!savedDetailPane)
    {
        savedDetailPane = document.createElement('div');
        savedDetailPane.className = 'caroDetailPane';
        savedDetailPane.id = 'caroDetailPane';
        savedDetailPane.setAttribute('id', savedDetailPane.id);
        savedDetailPane.lastHoverId = 0;

        savedDetailPane.textDiv = document.createElement('div');
        savedDetailPane.textDiv.className = 'detailText';
        savedDetailPane.appendChild(savedDetailPane.textDiv);

        savedDetailPane.setAttribute('onMouseover', 'javascript:startHoverTimer(this)');
        savedDetailPane.setAttribute('onMouseout', 'javascript:startTimerToMaybeEndHoverMode(this)');

        document.body.appendChild(savedDetailPane)
    }

    return savedDetailPane;
}

function startHoverTimer(obj)
{
    var dp = getDetailPane();
    dp.lastMoseoverId = obj.id;
    if (dp.inHoverMode)
    {
        ++dp.lastHoverId;
        if (obj.id != 'caroDetailPane')
        {
            showDetailPane(obj, false);
        }
    }
    else
    {
        dp.hoverObjId = obj.id;
        var expr = 'checkHoverTimer(' + (++dp.lastHoverId) + ')';
        setTimeout(expr, HOVER_DELAY_TO_SHOW_DETAILS);
    }
}

function checkHoverTimer(hoverId)
{
    var dp = getDetailPane();
    if (dp.lastHoverId == hoverId)
    {
        // Mouse has not left the box: go ahead and show
        var obj = document.getElementById(dp.hoverObjId);
        if (obj)
        {
            dp.inHoverMode = true;
            showDetailPane(obj, true);
        }
    }
}

function showDetailPane(obj, fadeIn)
{
    var detailPane = getDetailPane();
    detailPane.idOfObj = obj.id;
    detailPane.lastInteraction = (new Date()).getTime();

    detailPane.style.display = 'block';
    setDetailText(detailPane, obj);
    positionDetailPaneForTile(detailPane, obj);

    if (fadeIn)
    {
        ANIM.fadeObj(detailPane, 0, DETAIL_PANE_MAX_OPACITY, DETAIL_FADE_IN_OUT_DURATION, 0);
    }
}

function updateHoverConsts()
{
    try {
        if (top.CARO.CONSTANTS)
        {
            HOVER_DELAY_TO_SHOW_DETAILS = CARO.CONSTANTS.HOVER_DELAY_TO_SHOW_DETAILS;
            DETAIL_FADE_IN_OUT_DURATION = CARO.CONSTANTS.DETAIL_FADE_IN_OUT_DURATION;
            DETAIL_FADE_OUT_DELAY       = CARO.CONSTANTS.DETAIL_FADE_OUT_DELAY;
            DETAIL_PANE_MAX_OPACITY     = CARO.CONSTANTS.DETAIL_PANE_MAX_OPACITY;
        }
    }
    catch (error)
    {
    }
}

function setDetailText(detailPane, obj)
{
    var innerHTML = "";

    var liteHover = obj.getAttribute('liteHover');

    var title = obj.getAttribute('tileText');
    var description = obj.getAttribute('description');
    var urlText = obj.getAttribute('hoverLinkText');
    var url = obj.getAttribute('hoverLinkURL');

    if (title)
    {
        innerHTML += '<p class="tileTitle">' + title + '</p>';
    }

    if (!liteHover)
    {
        var task = obj.getAttribute('taskId');
        var app = obj.getAttribute('appId');
        var form = obj.getAttribute('formId');
        var version = obj.getAttribute('version');
        var report = obj.getAttribute('reportId');
        var productCode = obj.getAttribute('productCode');

        innerHTML += factoidToHTML(LANG_STRINGS.task,        task);
        innerHTML += factoidToHTML(LANG_STRINGS.application, app);
        innerHTML += factoidToHTML(LANG_STRINGS.report,      report);
        innerHTML += factoidToHTML(LANG_STRINGS.version,     version);
        innerHTML += factoidToHTML(LANG_STRINGS.form,        form);
        innerHTML += factoidToHTML(LANG_STRINGS.productCode, productCode);
    }

    if (description)
    {
        innerHTML += '<p class="descr">' + description + '</p>';
    }

    if (url && urlText)
    {
        innerHTML += '<p class="hoverLink"><a href="' + url + '" target="_blank">' + urlText + '</a></p>';
    }

    detailPane.textDiv.innerHTML = innerHTML;
}

function factoidToHTML(label, string)
{
    if (!string || (string == 'null'))
    {
        // The data is unavailable
        return '';
    }

    return ('<p class="detailItem"><label>' + label + '</label> ' + string + '</p>');
}

function positionDetailPaneForTile(detailPane, obj)
{
    // Position in the upper left to avoid scroll bars while taking measurements.
    detailPane.style.left =  detailPane.style.top = '0px';

    var detail_w = detailPane.offsetWidth;
    var detail_h = detailPane.offsetHeight;

    var tile_w = obj.offsetWidth;
    var tile_h = obj.offsetHeight;

    var tile_x = getAbsoluteX(obj);
    var tile_y = getAbsoluteY(obj) - getScrollY(obj);

    var page_h = window.innerHeight || document.documentElement.clientHeight;
    var page_w = window.innerWidth  || document.documentElement.clientWidth;

    var detail_x = (tile_x + (tile_w - detail_w) / 2.0);
    var detail_y = (tile_y + tile_h + 4);

    // If there isn't room for hover details below object, put them above.
    if ((detail_y + detail_h) >= page_h)
    {
        detail_y = (tile_y - detail_h - 4);
    }
    // if centering the details horizontally with the object would make them spill
    // offscreen, adjust horizontal position.
    detail_x = Math.max(0, Math.min(detail_x, page_w - detail_w));

    detailPane.style.left = detail_x + 'px';
    detailPane.style.top  = detail_y + 'px';
}

function getAbsoluteX(obj)
{
    if (!obj)
    {
        return 0
    }
    if (obj.offsetParent)
    {
        return obj.offsetLeft + getAbsoluteX(obj.offsetParent);
    }
    return obj.offsetLeft;
}

function getAbsoluteY(obj)
{
    if (!obj)
    {
        return 0
    }
    if (obj.offsetParent)
    {
        return obj.offsetTop + getAbsoluteY(obj.offsetParent);
    }
    return obj.offsetTop;
}

function getScrollY(obj)
{
    if (!obj)
    {
        return 0
    }
    if (obj.offsetParent)
    {
        return obj.scrollTop + getScrollY(obj.offsetParent);
    }
    return obj.scrollTop;
}

function startTimerToMaybeEndHoverMode(obj)
{
    var dp = getDetailPane();
    dp.lastMouseoutId = obj.id;
    setTimeout("maybeEndHoverMode(" + (++dp.lastHoverId) + ")", DETAIL_FADE_OUT_DELAY);
}

function maybeEndHoverMode(hoverId)
{
    var dp = getDetailPane();
    if ((dp.lastMoseoverId == dp.lastMouseoutId) && (hoverId == dp.lastHoverId))
    {
        endHoverModeNow();
    }
}

function endHoverModeNow()
{
    var detailPane = getDetailPane();
    if (detailPane.inHoverMode)
    {
        // ANIM.fadeObj(detailPane, 1, 0, CARO.CONSTANTS.DETAIL_FADE_IN_OUT_DURATION, 0);
        ANIM.animate(detailPane, 'fade', DETAIL_PANE_MAX_OPACITY, 0, DETAIL_FADE_IN_OUT_DURATION, 0, 'getDetailPane().style.display = \'none\'');
    }
    detailPane.inHoverMode = false;
}

function doExpandCollapse(section)
{
    var tableObj = section.parentNode.parentNode;
    if (!tableObj.savedWidth)
    {
        // Without this step, collapsing sections can change the width of the table
        tableObj.style.width = (tableObj.savedWidth = tableObj.offsetWidth) + 'px';
    }

    buildNextElementSiblingRecursive(section);

    if (! (section &&
           section.nextElementSibling &&
           section.nextElementSibling.nextElementSibling &&
           section.nextElementSibling.nextElementSibling.nextElementSibling ))
    {
        // Invalid structure
        return;
    }

    if (! section.contents)
    {
        // We have not yet determined this section's contents
        section.contents = [];
        section.totalHeight = 0;
        section.placeHolderRow = section.nextElementSibling.nextElementSibling;
        section.expanded = 1;

        // Build a list of contents by advancing rows until we hit another section or
        // the end of the table.

        var iterator = section.nextElementSibling.nextElementSibling.nextElementSibling;
        while (iterator && ! iterator.getAttribute('isASection'))
        {
            section.contents.push(iterator);
            section.totalHeight += iterator.offsetHeight;

            iterator = iterator.nextElementSibling;
        }

        section.placeHolderRow.style.height = section.totalHeight + 'px';
    }

    if (section.contents.length == 0)
    {
        // Empty section: return;
        return;
    }

    if (!section.expandCollapseControl)
    {
        try {
            section.expandCollapseControl = section.children[0].children[0].children[0];
        } catch (err) { /* Do nothing */ }
    }

    if (section.expanded)
    {
        // 1. Fade out contents
        fadeSectionContents(section, 1, 0);

        // 2. Swap which elements are visible.
        setTimeout(function() {setSectionContentsVisibility(section, 0); }, SECTION_FADE_DURATION);

        // 3. Animate Collapse
        ANIM.animate(section.placeHolderRow, 'changeHeight', section.totalHeight, 0, SECTION_EXPAND_COLLAPSE_DURATION, SECTION_FADE_DURATION);
        if (section.expandCollapseControl)
        {
            ANIM.animate(section.expandCollapseControl, 'rotate', 0, COLLAPSED_SECTION_ROTATION_ANGLE, SECTION_EXPAND_COLLAPSE_DURATION, SECTION_FADE_DURATION);
            section.setAttribute("aria-expanded", false);
        }
    }
    else
    {
        // 1. Animate Expansion
        ANIM.animate(section.placeHolderRow, 'changeHeight', 0, section.totalHeight, SECTION_EXPAND_COLLAPSE_DURATION, 0);

        // 2. Swap which elements are visible.
        setTimeout(function() {setSectionContentsVisibility(section, 1); }, SECTION_EXPAND_COLLAPSE_DURATION);
        if (section.expandCollapseControl)
        {
            ANIM.animate(section.expandCollapseControl, 'rotate', COLLAPSED_SECTION_ROTATION_ANGLE, 0, SECTION_EXPAND_COLLAPSE_DURATION);
            section.setAttribute("aria-expanded", true);
        }

        // 3. Fade in contents
        setTimeout(function() { fadeSectionContents(section, 0, 1); }, SECTION_EXPAND_COLLAPSE_DURATION);
    }

    section.expanded = 1 - section.expanded;

    section.setAttribute('expanded', section.expanded);
    // setTimeout(function() {section.setAttribute('expanded', section.expanded)}, SECTION_EXPAND_COLLAPSE_DURATION + SECTION_FADE_DURATION);
}

function fadeSectionContents(section, v0, v1)
{
    for (var i = 0; i < section.contents.length; i++)
    {
        ANIM.fadeObj(section.contents[i], v0, v1, SECTION_FADE_DURATION);
    }
}

function setSectionContentsVisibility(section, contentsVisible)
{
    var displayStringPlaceholder = (contentsVisible) ? '' : 'table-row';
    var displayStringContents    = (contentsVisible) ? '' : 'none';

    section.placeHolderRow.style.display = displayStringPlaceholder;
    for (var i = 0; i < section.contents.length; i++)
    {
        section.contents[i].style.display = displayStringContents;
    }
}

function buildNextElementSiblingRecursive(row)
{
    if (row && BROWSER_IS_IE)
    {
        if (! row.alreadyAddedNextElemSib)
        {
            row.nextElementSibling = row.nextSibling;
            buildNextElementSiblingRecursive(row.nextElementSibling)
            row.alreadyAddedNextElemSib = true;
        }
    }
}


function documentContainsResizableSections()
{
    for (var i = 1; i < 1000; i++)
    {
        var idOfPotentialSection = 'flowHeader' + i + '_text';
        var headerObj = document.getElementById(idOfPotentialSection);

        if (headerObj && headerObj.getAttribute('isASection'))
        {
            // We found a collapsible section.
            return true;
        }
        if (!headerObj)
        {
            // We ran out of headers and never found a collapsible one.
            return false;
        }
    }

    // We found 1000 sections and there may or may not be more.  Assume something is collapsible.
    return true;
}

var iconServiceExists;
function autoReplaceIcons()
{
    if (iconServiceExists && iconServiceExists())
    {
        // Auto-icon service is available.
        autoReplaceIconsImpl();
    }
}

/* determine if the icon should be 'reversed' or 'disabled' */
function getExtraInfo(tile,icon)
{
	// If the getIconVersion function doesn't exist, we don't have _rev or _dis versions.
    try
    {
        getIconVersion();
    }
    catch (err)
    {
        return '';
	}

    var extra = '';
    if (tile.getAttribute('havebox') == 'true')
    {
        extra = '_rev';
    }
    else if (tile.className.indexOf('disabled') != -1)
    {
        extra = '_dis';
    }

    return extra;
}

var imgObjs = []; // Needs to be global.
function autoReplaceIconsImpl()
{
    // Arrays of tile info
    imgObjs      = [];
    var appIds   = [];
    var formIds  = [];
    var pCodes   = [];
    var extraInf = [];

    var countOfAJAXreplaces = 0;

    for (var i = 0; i < 1000; i++)
    {
        // Look for every flowTile.
        var tile = document.getElementById('flowTile_' + i);
        if (tile)
        {
            // The tile may or may not have an icon image.
            var icon = document.getElementById('flowTileIconImg_' + i);
            if (icon)
            {
                if (icon.getAttribute('autoReplace') == 'true')
                {
                    // Add this icon to the list, assuming there's actually some info
                    var appId = tile.getAttribute('appId') || tile.getAttribute('reportId') || '';
                    var formId = tile.getAttribute('formId') || '';
                    var pCode = tile.getAttribute('productCode') || '';
                    var extra = getExtraInfo(tile,icon);

                    // Workaround for a bug where report product code empty-string can
                    // inadvertently be mapped to an invalid value.
                    if ((pCode == '') && (tile.getAttribute('reportId')))
                    {
                        pCode = 'nil';
                    }

                    if (appId || formId || pCode)
                    {
                        countOfAJAXreplaces++;

                        imgObjs.push(icon);
                        appIds.push(appId);
                        formIds.push(formId);
                        pCodes.push(pCode);
                        extraInf.push(extra);
                    }
                }
            }
        }
        else if (i > 0)
        {
            // We have reached the last tile.
            break;
        }
    }

    // We now have our list of auto-icons.
    if (countOfAJAXreplaces > 0)
    {
        getIcons(appIds, formIds, pCodes, changeOutIcons, extraInf);
    }
}

function changeOutIcons(assignments)
{
    for (var i = 0; i < assignments.length; i++)
    {
        var asn = assignments[i];
        var size = (imgObjs[i].getAttribute('size') == 'medium') ? top.JDE_ICON_SUFFIX.MEDIUM : top.JDE_ICON_SUFFIX.LARGE;
        var extra = asn.extra ? asn.extra : '';
        var imageFile = top.JDE_ICON_PREFIX + asn.basename + extra + size + asn.ext;

        imgObjs[i].src = imageFile;
    }
}

function setRotationAngleForCollapsible()
{
    var dir = document.documentElement.getAttribute('dir');
    if (dir && dir.toLowerCase() == 'rtl')
    {
        COLLAPSED_SECTION_ROTATION_ANGLE = 45;
    }
}

var taskInfo;
function processTaskDefinitions()
{
    if (!taskInfo)
    {
        // We don't have any task info to process
        return;
    }

    // Look for every flowtile
    for (var i = 0 ; i < taskInfo.length; i++)
    {
        var tile = document.getElementById('flowTile_' + i);
        if (tile)
        {
            if (taskInfo[i])
            {
                // Set some pointers for future use
                tile.titleSpan = document.getElementById('tileDescription_' + i);
                tile.icon = document.getElementById('flowTileIconImg_' + i); // will sometimes be null

                // Apply the info
                applyTaskInfoToTile(taskInfo[i], tile);
            }
        }
        else
        {
            // We have reached the last tile.
            break;
        }
    }
}

function applyTaskInfoToTile(taskDetails, tile)
{
    // Permanently associate these details with the tile
    tile.taskDetails = taskDetails;

    // Change onclick
    setCorrectJavascriptAction(tile);

    // Apply the task name unless there is a custom name.
    renameTileIfAppropriate(tile);

    // If there is an icon (and it is not a custom-specified one),
    // then replace it with the task icon.
    applyIconIfAppropriate(tile);

    // For the purposes of hover, set some attributes on the tile object.
    setHoverPropertiesForTile(tile);
}

function renameTileIfAppropriate(tile)
{
    if (tile.taskDetails.errorMesg)
    {
        setTileTitle(tile, tile.taskDetails.errorMesg);
    }

    if (!tile.getAttribute('tileText'))
    {
        setTileTitle(tile, tile.taskDetails.taskName);
    }
}

function setTileTitle(tile, title)
{
    if (tile)
    {
        tile.setAttribute('tileText', title);
        if (tile.titleSpan)
        {
            tile.titleSpan.innerHTML = title;
        }
    }
}

var hideSecurityBlockedItems;
function setCorrectJavascriptAction(tile)
{
    // Remove any existing javascript onclick action
    if (tile.getAttribute('onclick'))
    {
        tile.setAttribute('onclick', '');
    }
    tile.onclick = null;

    // Now give it the correct javascript action
    if (tile.taskDetails.hasSecurity && (tile.taskDetails.hasSecurity == 'true')) // String comparison is deliberate
    {
        // If the tile has explicitely been disabled, don't assign it an onclick action
        if (tile.className.indexOf("disabled") == -1)
        {
            tile.onclick = activateTaskItem;
            tile.onkeydown = function(event) { if (event.keyCode==32 || event.keyCode==13) {this.click(); return false;} };
        }
    }
    else
    {
        if (!tile.taskDetails.errorMesg)
        {
            if (hideSecurityBlockedItems)
            {
                makeTileInvisible(tile);
                return;
            }
            else
            {
                tile.className = tile.className.replace('enabled','disabled');
                disableTileForAccessibility(tile);
            }
        }
        else
        {
            if (tile.className.indexOf('brokenTask') == -1)
            {
               tile.className += ' brokenTask';
               disableTileForAccessibility(tile);
            }
        }
    }
}

function disableTileForAccessibility(tile)
{
        if(tile.firstChild && tile.firstChild.firstChild && tile.firstChild.firstChild.id && tile.firstChild.firstChild.id.indexOf("wlControl_")!=-1) // refresh icon for watch list
        {
            var watchListRefreshHolder = tile.firstChild.firstChild;
            watchListRefreshHolder.setAttribute("tabindex", -1);
            watchListRefreshHolder.onclick = null;
            watchListRefreshHolder.onkeydown = null;
            watchListRefreshHolder.setAttribute("role", "presentation");
        }
        if(tile.lastChild.id && tile.lastChild.id.indexOf("tileDescription_")!=-1) // small icon description
        {
            var wlTileDesciption = tile.lastChild;
            wlTileDesciption.setAttribute("tabindex", -1);
            wlTileDesciption.setAttribute("role", "presentation");
        }
        else if(tile.lastChild.firstChild && tile.lastChild.firstChild.id && tile.lastChild.firstChild.id.indexOf("tileDescription_")!=-1) // large icon description
        {
            var wlTileDesciption = tile.lastChild.firstChild;
            wlTileDesciption.setAttribute("tabindex", -1);
            wlTileDesciption.setAttribute("role", "presentation");
        }
        
}
                
function applyIconIfAppropriate(tile)
{
    if (tile.icon)
    {
        // This tile includes an icon
        if ((tile.icon.getAttribute('autoReplace') == 'true')   ||
	    (tile.taskDetails && tile.taskDetails.errorMessage) ||
	    (tile.watchlistDetails && tile.watchlistDetails.errorMessage))
        {
            // It is marked for auto replacement
            var size = (tile.icon.getAttribute('size') == 'medium') ? top.JDE_ICON_SUFFIX.MEDIUM : top.JDE_ICON_SUFFIX.LARGE;
            var extra = getExtraInfo(tile);
            var iconBasename = null;
            var iconExtension = null;
            if (tile.watchlistDetails)
            {
               iconBasename = tile.watchlistDetails.iconBasename;
               iconExtension = tile.watchlistDetails.iconExtension;
            }
            if (tile.taskDetails)
            {
               iconBasename = tile.taskDetails.iconBasename;
               iconExtension = tile.taskDetails.iconExtension;
            }

            if (iconBasename != null && iconExtension != null)
            {
               var iconFileName =  top.JDE_ICON_PREFIX + iconBasename + extra + size + iconExtension;
               tile.icon.src = iconFileName;
            }

            /* Mark the file not to be auto-replaced so we don't replace it
             * a second time when we run the legacy ajax replacement. */
            tile.icon.setAttribute('autoReplace', 'false');
        }
    }
}

function setHoverPropertiesForTile(tile)
{
    var details = tile.taskDetails;

    if (details.hasSecurity == 'true')
    {
        var objId = details.appID;
        if (objId)
        {
            if (objId.toUpperCase().charAt(0) == 'R')
            {
                tile.setAttribute('reportId', objId);
            }
            else
            {
                tile.setAttribute('appId', objId);
            }
        }

        setAttributeIfExists(tile, 'taskId', details.taskId);
        setAttributeIfExists(tile, 'formId', details.formID);
        setAttributeIfExists(tile, 'version', details.version);
        setAttributeIfExists(tile, 'productCode', details.sysCode);
    }
    else
    {
        // Disable hover: disconnect listeners
        tile.setAttribute('onmouseover', undefined);
        tile.setAttribute('onmouseout', undefined);
    }
}

function setAttributeIfExists(tile, attributeName, value)
{
    if (value)
    {
        tile.setAttribute(attributeName, value);
    }
}

var runE1Task;
function activateTaskItem()
{
    if (runE1Task)
    {
        runE1Task(this.taskDetails.taskId);
    }
}

function makeTileInvisible(tile)
{
    /* This function is used to fully kill an item we do not want to exist
     * We cannot delete the item or give it display:none because we still
     * need a placeholder table cell of the appropriate width.
     */

    // Destroy all contents
    /* TODO: what is the ideal way to slaughter all children?
     *       firstChild vs lastChild vs innerHTML */
    while (tile.firstChild)
    {
        tile.removeChild(tile.firstChild);
    }
    tile.className += ' dead';
}

var watchlistInfo;
function processWatchlistDefinitions()
{
    if (!watchlistInfo)
    {
        // We don't have any watchlist info to process
        return;
    }

    // Look for every flowtile
    for (var i = 0 ; i < watchlistInfo.length; i++)
    {
        var tile = document.getElementById('flowTile_' + i);
        if (tile)
        {
            if (watchlistInfo[i])
            {
                // Set some pointers for future use
                tile.titleSpan = document.getElementById('tileDescription_' + i);
                tile.icon = document.getElementById('flowTileIconImg_' + i); // will sometimes be null

                // Apply the info
                applyWatchlistInfoToTile(watchlistInfo[i], tile);
            }
        }
        else
        {
            // We have reached the last tile.
            break;
        }
    }
}

function applyWatchlistInfoToTile(watchlistDetails, tile)
{
    // Permanently associate these details with the tile
    tile.watchlistDetails = watchlistDetails;

    // Change onclick and tile text
    setWatchlistJavascriptAction(tile);

    // Apply the watchhlist name unless there is a custom name.
    // Additionally change the name to the error message if necessary.
    renameWatchlistTileIfAppropriate(tile);

    // If there is an icon (and it is not a custom-specified one),
    // then replace it with the task icon.
    applyIconIfAppropriate(tile);
}

var hideSecurityBlockedItems;
function setWatchlistJavascriptAction(tile)
{
    // Remove any existing javascript onclick action
    if (tile.getAttribute('onclick'))
    {
        tile.setAttribute('onclick', '');
    }
    tile.onclick = null;

    if (!tile.watchlistDetails.exists)
    {
        //Set the error message text if it is there.
        if (!tile.watchlistDetails.errorMesg)
        {
           tile.className = tile.className.replace('enabled','disabled');
           disableTileForAccessibility(tile);
        }
        else
        {
           if (hideSecurityBlockedItems)
           {
                makeTileInvisible(tile);
                return;
           }
           else
           {
                if (tile.className.indexOf('brokenTask') == -1)
                {
                   tile.className += ' brokenTask';
                }
                if (tile.className.indexOf('enabled') != -1)
                {
                   tile.className = tile.className.replace('enabled','disabled');
                }
                disableTileForAccessibility(tile);
            }
        }
    }
}

function renameWatchlistTileIfAppropriate(tile)
{
    if (tile.watchlistDetails.errorMesg)
    {
        setTileTitle(tile, tile.watchlistDetails.errorMesg);
    }
}

function adjustForWatchlistComponent()
{
   //Adjust the left value of the mainflow holder
   //This is necessary so the sizing of the page will work.
   var mainFlow = document.getElementById('mainFlow');
   var wlCompTable  = document.getElementById('wlCompTable');
   var flowHolder = mainFlow.parentNode;
   if (flowHolder)
   {
      if (WATCHLIST_HOLDER_ELEMENT)
      {
         flowHolder.style.left = WATCHLIST_HOLDER_ELEMENT.offsetWidth + 22 + 'px';
      }
      else
      {
         flowHolder.style.left = '208px';
      }
   }
   if (wlCompTable  && BROWSER_IS_IE)
   {
      //IE9 does not set default to be full height so this must be done explicitly
      wlCompTable.style.height = '99%';
   }

}
