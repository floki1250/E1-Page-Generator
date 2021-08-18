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
 
///////////////////
// jdeAnimation.js 
//
// Base code for animations/transitions used across JDE EnterpriseOne
// Fairly generic animations should be defined in this file, but very specific ones
// can be added in other files that include this file.  
///////////////////

if (!ANIM)
{
    var ANIM = new Object();
    ANIM.Animations = new Object();
    ANIM.TimingFunctions = new Object();
}

ANIM.Animations.fade = new Object();
ANIM.Animations.fade.doFrame = function(obj, v0, vF, t)
{
    var opacity = v0 + t * (vF - v0);
    obj.style.opacity = opacity;
    obj.style.filter = 'alpha(opacity=' + Math.round(opacity * 100) + ')';
}

ANIM.Animations.sinSlideX = new Object();
ANIM.Animations.sinSlideX.doFrame = function(obj, v0, vF, t)
{
    obj.style.left = (obj.actualX = (v0 + ANIM.TimingFunctions.sinMot(t) * (vF - v0))) + 'px';    
}

ANIM.Animations.sinSlideX.doEnd = function(obj, vF)
{
    obj.style.left = vF + 'px';
}

ANIM.Animations.sinSlideXpct = new Object();
ANIM.Animations.sinSlideXpct.doFrame = function(obj, v0, vF, t)
{
    obj.style.left = (obj.actualX = (v0 + ANIM.TimingFunctions.sinMot(t) * (vF - v0))) + '%';    
}

ANIM.Animations.sinSlideXpct.doEnd = function(obj, vF)
{
    obj.style.left = vF + '%';
}

ANIM.Animations.sinSlideY = new Object();
ANIM.Animations.sinSlideY.doFrame = function(obj, v0, vF, t)
{
    obj.style.top = (obj.actualY = (v0 + ANIM.TimingFunctions.sinMot(t) * (vF - v0))) + 'px';    
}

ANIM.Animations.sinSlideXY = new Object();
ANIM.Animations.sinSlideXY.doFrame = function(obj, v0, vF, t)
{
    obj.style.left = (obj.actualX = (v0 + ANIM.TimingFunctions.sinMot(t) * (vF - v0))) + 'px';    
    obj.style.top = (obj.actualY + ANIM.TimingFunctions.sinMot(t) * (0 - obj.actualY)) + 'px';
}
ANIM.Animations.sinSlideXY.doEnd = function(obj, vF)
{
    obj.style.left = vF + 'px';
    obj.actualY = 0;
    obj.style.top = '';    
}

ANIM.Animations.changeHeight = new Object();
ANIM.Animations.changeHeight.doFrame = function(obj, v0, vF, t)
{
    obj.style.height = (v0 + (vF - v0) * ANIM.TimingFunctions.sinMot(t)) + 'px';
}


ANIM.animate = function(obj, animation, v0, vF, duration, delay, callback)
{
    if (!delay) { delay = 0; }
    var now = (new Date()).getTime();
    if (duration == -1)
    {
	ANIM.animationInnerVariableDuration(obj.getAttribute('id'), animation, v0, vF, now+delay, now+delay, callback);
    }
    else
    {
	ANIM.animationInner(obj.getAttribute('id'), animation, v0, vF, now+delay, duration, now+delay, callback);
    }
}


ANIM.animationInner = function(objid, animation, v0, vF, tStart, tTotal, tMin, callback)
{

    animObj = ANIM.Animations[animation];

    var now = (new Date()).getTime();
    var t = Math.min(1, Math.max(0, (now-tStart) / tTotal));

    if (now >= tMin || t >= 1)
    {
        // Generate Frame
        animObj.doFrame(document.getElementById(objid), v0, vF, t);
                
        tMin = now + 16;
    }

    if (t < 1)
    {
        var expr = 'ANIM.animationInner(' +
            ["'" + objid + "'", 
             "'" + animation + "'",
             v0, vF, tStart, tTotal, tMin,
             ('"' + callback + '"')
             ].join(', ') + ')';
                
        setTimeout(expr, tMin-now);
    }    
    else
    {
        // End Condition Reached
        if (animObj.doEnd)
            animObj.doEnd(document.getElementById(objid), vF);
        if ((callback) && (callback != "undefined") && (callback != "null"))
            eval(callback);
    }
}

ANIM.animationInnerVariableDuration = function(objid, animation, v0, vF, tStart, tMin, callback)
{
    animObj = ANIM.Animations[animation];

    var now = (new Date()).getTime();
    var t = now-tStart;

    var obj = document.getElementById(objid);

    if (now >= tMin || t >= 1 || obj.animationDoneFlag)
    {
        // Generate Frame
        animObj.doFrame(obj, v0, vF, t);
                
        tMin = now + 16;
    }

    if (!obj.animationDoneFlag)
    {
        var expr = 'ANIM.animationInnerVariableDuration(' +
            ["'" + objid + "'", 
             "'" + animation + "'",
             v0, vF, tStart, tMin,
             ('"' + callback + '"')
             ].join(', ') + ')';
                
        setTimeout(expr, tMin-now);
    }    
    else
    {
        // End Condition Reached
        if (animObj.doEnd)
            animObj.doEnd(obj, vF);
        if (callback)
            eval(callback);
    }
}


// Wrapper around fade
ANIM.fadeObj = function(obj, v0, vF, T, delay, clear)
{
    var fadeType = (clear) ? 'fadeClear' : 'fade';
    ANIM.animate(obj, fadeType, v0, vF, T, delay);
}

ANIM.fadeObjSin = function(obj, v0, vF, T, delay)
{
    ANIM.animate(obj, 'fadeSin', v0, vF, T, delay)
}

ANIM.Animations.fade = new Object();
ANIM.Animations.fade.doFrame = function(obj, v0, vF, t)
{
    var opacity = v0 + t * (vF - v0);
    obj.style.opacity = opacity;
    obj.style.filter = 'alpha(opacity=' + Math.round(opacity * 100) + ')';
}

ANIM.Animations.fadeSin = new Object();
ANIM.Animations.fadeSin.doFrame = function(obj, v0, vF, t)
{
    var opacity = v0 + ANIM.TimingFunctions.sinMot(t) * (vF - v0);
    obj.style.opacity = opacity;
    obj.style.filter = 'alpha(opacity=' + Math.round(opacity * 100) + ')';
}

/* FadeClear is just like fade, except it clears the opacity at the end
   of the animation and lets it be class-determined. */
ANIM.Animations.fadeClear = new Object();
ANIM.Animations.fadeClear.doFrame = ANIM.Animations.fade.doFrame;
ANIM.Animations.fadeClear.doEnd = function(obj, vF)
{
    obj.style.opacity = '';
    obj.style.filter = '';  

    /* TODO:  The above code does not actually work in IE.  I have not found a way to
       clear out the filter.  Setting it equal to '' still overrides any class-set filters. */
}

/* Includes only the ie portion of opacity changes.  Useful in cases where most browsers 
   properly inherit opacity from parent to child, but IE does not.  Call the regular fade on
   the parent, and additionally call the ie version on the children */

ANIM.Animations.fadeIE = new Object();
ANIM.Animations.fadeIE.doFrame = function(obj, v0, vF, t)
{
    var opacity = v0 + t * (vF - v0);
    obj.style.filter = 'alpha(opacity=' + Math.round(opacity * 100) + ')';
}
ANIM.Animations.fadeIE.doEnd = function(obj, vF)
{
    if (vF == 1)
    {
	obj.style.filter = '-';
    }
}

ANIM.fadeObjIE = function(obj, v0, vF, T, delay)
{
    if (navigator && navigator.appName == "Microsoft Internet Explorer")
    {
	ANIM.animate(obj, 'fadeIE', v0, vF, T, delay);
    }
}


ANIM.TimingFunctions.sinMot = function(t)
{
    return 0.5 * (1.0 - Math.cos(Math.PI * t));
}

ANIM.applyRotation = function(obj, degrees)
{
    obj.style.webkitTransform = 
    obj.style.MozTransform = 
    obj.style.transform = 'rotate(' + degrees + 'deg)';

    if (navigator && navigator.appName == "Microsoft Internet Explorer")
    {
        var theta = degrees * (Math.PI / 180);
        
        var ct = Math.cos(theta);
        var st = Math.sin(theta);
        
        var w = (obj.offsetWidth  || obj.savedKnownWidth)  / 2;
        var h = (obj.offsetHeight || obj.savedKnownHeight) / 2;
        
        /* Note: This function did not work properly when the object was hidden 
           (display:none) at call-time because the width and height cannot be 
           determined.  Therefore, check for a savedKnownWidth/Height, which must
           be set by the client if this function is to be used on a hidden object.*/

        /* Note: Since this function will be repeatedly called during an animation,
           a possible performance improvement would be to cache w and h since they
           presumably will not change during the animation.  
           
           In practice, there does not seem to be any performance problem, and the
           animation is quite smooth.  IE does seem to cache the obj.offsetWidth 
           and obj.offsetHeight as opposed to recomputing them each time, so saving
           them as constants would really only save the division by 2 and is 
           probably not worth the sacrifice in code cleanliness at this time.  */

        obj.style.filter = 'progid:DXImageTransform.Microsoft.Matrix(M11='
            + ct
            + ', M12='
            + (-1 * st)
            + ', Dx='
            + (-1 * w * ct + h * st + w) 
            + ', M21='
            + st 
            + ', M22='
            + ct
            + ', Dy='
            + (-1 * w * st + -1 * h * ct + h)
            + ')'
    }
}

ANIM.Animations.rotate = new Object();
ANIM.Animations.rotate.doFrame = function(obj, v0, vF, t)
{
    ANIM.applyRotation(obj, v0 + (vF - v0) * t);
}