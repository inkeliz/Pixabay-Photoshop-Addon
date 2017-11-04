var themeManager = (function () {
    'use strict';

    function toHex(color, delta) {

        function computeValue(value, delta) {
            var computedValue = !isNaN(delta) ? value + delta : value;
            if (computedValue < 0) {
                computedValue = 0;
            } else if (computedValue > 255) {
                computedValue = 255;
            }

            computedValue = Math.floor(computedValue);

            computedValue = computedValue.toString(16);
            return computedValue.length === 1 ? "0" + computedValue : computedValue;
        }

        var hex = "";
        if (color) {
            hex = computeValue(color.red, delta) + computeValue(color.green, delta) + computeValue(color.blue, delta);
        }
        return hex;
    }


    function reverseColor(color, delta) {
        return toHex({
                red: Math.abs(255 - color.red),
                green: Math.abs(255 - color.green),
                blue: Math.abs(255 - color.blue)
            },
            delta);
    }


    function addRule(stylesheetId, selector, rule) {
        var stylesheet = document.getElementById(stylesheetId);

        if (stylesheet) {
            stylesheet = stylesheet.sheet;
            if (stylesheet.addRule) {
                stylesheet.addRule(selector, rule);
            } else if (stylesheet.insertRule) {
                stylesheet.insertRule(selector + ' { ' + rule + ' }', stylesheet.cssRules.length);
            }
        }
    }


    function updateThemeWithAppSkinInfo(appSkinInfo) {

        var panelBgColor = appSkinInfo.panelBackgroundColor.color;
        var bgdColor = toHex(panelBgColor);

        var darkBgdColor =  toHex(panelBgColor, 20);

        var fontColor = "F0F0F0";
        if (panelBgColor.red > 122) {
            fontColor = "000000";
        }
        var lightBgdColor = toHex(panelBgColor, -20);

        var styleId = "hostStyle";

        addRule(styleId, ".hostElt", "background-color:" + "#" + bgdColor);
        addRule(styleId, ".hostElt", "font-size:" + appSkinInfo.baseFontSize + "px;");
        addRule(styleId, ".hostElt", "font-family:" + appSkinInfo.baseFontFamily);
        addRule(styleId, ".hostElt", "color:" + "#" + fontColor);

        addRule(styleId, ".hostBgd", "background-color:" + "#" + bgdColor);
        addRule(styleId, ".hostBgdDark", "background-color: " + "#" + darkBgdColor);
        addRule(styleId, ".hostBgdLight", "background-color: " + "#" + lightBgdColor);
        addRule(styleId, ".hostFontSize", "font-size:" + appSkinInfo.baseFontSize + "px;");
        addRule(styleId, ".hostFontFamily", "font-family:" + appSkinInfo.baseFontFamily);
        addRule(styleId, ".hostFontColor", "color:" + "#" + fontColor);
        addRule(styleId, "select", "color:" + "#" + fontColor);
        

        addRule(styleId, ".hostFont", "font-size:" + appSkinInfo.baseFontSize + "px;");
        addRule(styleId, ".hostFont", "font-family:" + appSkinInfo.baseFontFamily);
        addRule(styleId, ".hostFont", "color:" + "#" + fontColor);

        addRule(styleId, ".hostButton", "background-color:" + "#" + darkBgdColor);
        addRule(styleId, ".hostButton:hover", "background-color:" + "#" + bgdColor);
        addRule(styleId, ".hostButton:active", "background-color:" + "#" + darkBgdColor);
        addRule(styleId, ".hostBorder", "border: solid 1px " + "#" + reverseColor(panelBgColor, -100));

        addRule(styleId, "main .header .search input", "border: solid 1px " + "#" + darkBgdColor);
        addRule(styleId, ".drkBorder", "border: solid 1px " + "#" + darkBgdColor);
        addRule(styleId, ".lightBorder", "border: solid 1px " + "#" + bgdColor);
       
      

  

        addRule(styleId, "main .config .option", "border-top: solid 2px " + "#" + bgdColor);
        addRule(styleId, "main .config .option.active", "border-top: solid 2px " + "#" + reverseColor(panelBgColor, 20));
        addRule(styleId, "main .config .option:hover", "border-top: solid 2px " + "#" + reverseColor(panelBgColor, 20));

        addRule(styleId, "*::-webkit-scrollbar", "background-color:" + "#" + reverseColor(panelBgColor));
        addRule(styleId, "*::-webkit-scrollbar-track", "background-color:" + "#" + reverseColor(panelBgColor));


    }

    function onAppResize(event){

        var styleId = "hostStyle";
        var info = document.querySelector('.info').clientWidth;
        addRule(styleId, "main .info", "height:" + (window.innerHeight - 80) + 'px');

        var images = document.querySelectorAll('.flex-images .item');


        for (var i = 0; i < images.length; i++) {
            if (document.querySelector('.info').clientWidth >= 436) {
                images[i].getElementsByTagName('img')[0].style.height = (((info / 2) - 10) * parseInt(images[i].dataset.h)) / parseInt(images[i].dataset.w) + 'px';
            } else {
                images[i].getElementsByTagName('img')[0].style.height = ((info - 10) * parseInt(images[i].dataset.h)) / parseInt(images[i].dataset.w) + 'px';
            }
        } 

        if(images.length >= 1) {
            console.log(images[0].style.height, document.querySelector('.info').clientWidth);
        }

    }

    function onAppThemeColorChanged(event) {
        var skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
        updateThemeWithAppSkinInfo(skinInfo);
    }


    function init() {

        var csInterface = new CSInterface();

        updateThemeWithAppSkinInfo(csInterface.hostEnvironment.appSkinInfo);

        csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);

        onAppResize();
        window.addEventListener('resize', onAppResize);
    }

    return {
        init: init
    };

}());
