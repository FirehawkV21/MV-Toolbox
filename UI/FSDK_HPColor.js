//----------------------------------------------------------------------------------------------------
// HP Color Controller
// Version R1.05a
// Developed by AceOfAces
//----------------------------------------------------------------------------------------------------

var FirehawkADK = FirehawkADK || {};

/*:
* @plugindesc R1.05A || Allows developers to customize the HP bar and text Color depending on the remaining HP.
* @author AceOfAces
* 
* @param Options
*
* @param Compatibility Mode
* @type boolean
* @on Activate
* @off Deactivate
* @desc Turn this on (set to true) if you customize the normal HP bar and text color on a different plugin.
* @default false
* @parent Options
* 
* @param Add Warning Color
* @type boolean
* @on Activate
* @off Deactivate
* @desc Adds another color for the HP bar.
* @default false
* @parent Options
*
* @param Limits
* 
* @param Warning HP
* @desc Set the point where the HP is considered in the "Warning" area. The number must be float!
* @type number
* @max 1
* @min 0.01
* @decimals 2
* @default 0.50
* @parent Limits
*
* @param Low HP
* @desc Set the point where the HP is considered low. The number must be float!
* @type number
* @max 1
* @min 0.01
* @decimals 2
* @default 0.25
* @parent Limits
*
* @param Critical HP
* @desc Set the point where the HP is considered critical. The number must be float!
* @type number
* @max 1
* @min 0.01
* @decimals 2
* @default 0.15
* @parent Limits
* 
* @param Colors 
*
* @param Normal HP Color 1
* @desc Changes the color when the HP is considered normal (it's ignored if the compatibility mode is set). Interger value.
* @type number
* @max 31
* @min 0
* @default 11
* @parent Colors
* 
* @param Normal HP Color 2
* @desc Same with the previous parameter.
* @type number
* @max 31
* @min 0
* @default 3
* @parent Colors
*
* @param Warning HP Text Color
* @desc Set the color of the text on Warning HP. Integer variable.
* @type number
* @max 31
* @min 0
* @default 14
* @parent Colors
*
* @param Warning HP Color 1
* @desc Changes the color when the HP reaches "Warning" status (it's ignored if the "Add Warning Color" is off). Integer value.
* @type number
* @max 31
* @min 0
* @default 14
* @parent Colors
* 
* @param Warning HP Color 2
* @desc Same with the previous parameter.
* @type number
* @max 31
* @min 0
* @default 6
* @parent Colors
* 
*
* @param Low HP Text Color
* @desc Set the color of the text on low HP. Integer variable.
* @type number
* @max 31
* @min 0
* @default 2
* @parent Colors
*
* @param Low HP Bar Color 1
* @desc Sets the color for the HP bar on low HP. Integer variable.
* @type number
* @max 31
* @min 0
* @default 20
* @parent Colors
*
* @param Low HP Bar Color 2
* @desc Same with the previous parameter.
* @type number
* @max 31
* @min 0
* @default 21
* @parent Colors
*
* @param Critical HP Text
* @desc Set the color of the text when the HP is in critical. Integer variable.
* @type number
* @max 31
* @min 0
* @default 18
* @parent Colors
*
* @param Critical HP Bar Color 1
* @desc Set the color of the HP Bar when the HP is in critical. Integer variable.
* @type number
* @max 31
* @min 0
* @default 18
* @parent Colors
* 
* @param Critical HP Bar Color 2
* @desc Same with the previous parameter.
* @type number
* @max 31
* @min 0
* @default 2
* @parent Colors
*
* @help
* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
* HP Color Controller (MV Port) - Version R1.05A
* Developed by AceOfAces
* Licensed under the MIT license. Can be used for both Non-commercial and
* commercial games.
* Please credit me as AceOfAces when you use this plugin.
* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
* This script provides additional hp gauge and text colors similar to the
* Pokemon series.
* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
* Installation and setup:
* 1. Place this plugin below any plugin that changes HP Bars as well
* (such as Yanfly's Core Engine). If you don't have any of these on your project,
* you can place it anywhere.
* 2. After turning it on, save and play test. If the game didn't crash after
* opening the menu and you can see the bars green, the plugin is installed
* properly.
* If you wish to use the HP bar colors set by the other script, turn on the
* compatibility mode by setting it's value to true. Compatibility mode
* will simply ignore Normal HP Color 1 and Normal HP Color 2 and will use
* the preset color (or the other plugin's color, if it rerouted the selection).
* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
* Set up the colors:
* This plugin uses the colors found on the Window.png file (which you can find
* on img/System ). To use the color you want, enter a number of 0 to 31. Here's
* a quick reference guide:
*  0  1  2  3  4  5  6  7 
*  8  9 10 11 12 13 14 15
* 16 17 18 19 20 21 22 23
* 24 25 26 27 28 29 30 31
* The HP bar consists of two colors making a gradient. HP Color 1 is the color
* on the leftmost side of the HP bar and HP Color 2 is the color on the
* rightmost side of the bar.
* The HP Text is simply the color you specify.
* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
* 
*/
// Reference the Plugin Manager's parameters.
var paramdeck = PluginManager.parameters('FSDK_HPColor');
//Create the global Parameter Deck.
FirehawkADK.ParamDeck = FirehawkADK.ParamDeck || {};
//Load variables set in the Plugin Manager.
FirehawkADK.ParamDeck.CompatMode = String(paramdeck['Compatibility Mode']).trim().toLowerCase() === 'true';
FirehawkADK.ParamDeck.WarningColor = String(paramdeck['Add Warning Color']).trim().toLowerCase() === 'true';
FirehawkADK.ParamDeck.WarningHPLimit = parseFloat(paramdeck['Warning HP']);
FirehawkADK.ParamDeck.LowHPLimit = parseFloat(paramdeck['Low HP']);
FirehawkADK.ParamDeck.CriticalHPLimit = parseFloat(paramdeck['Critical HP']);
FirehawkADK.ParamDeck.HPNormalBar1 = parseInt(paramdeck['Normal HP Color 1']);
FirehawkADK.ParamDeck.HPNormalBar2 = parseInt(paramdeck['Normal HP Color 2']);
FirehawkADK.ParamDeck.HPWarningText = parseInt(paramdeck['Warning HP Text Color']);
FirehawkADK.ParamDeck.HPBarWarning1 = parseInt(paramdeck['Warning HP Color 1']);
FirehawkADK.ParamDeck.HPBarWarning2 = parseInt(paramdeck['Warning HP Color 2']);
FirehawkADK.ParamDeck.HPLowText = parseInt(paramdeck['Low HP Text Color']);
FirehawkADK.ParamDeck.HPBarLow1 = parseInt(paramdeck['Low HP Bar Color 1']);
FirehawkADK.ParamDeck.HPBarLow2 = parseInt(paramdeck['Low HP Bar Color 2']);
FirehawkADK.ParamDeck.CriticalHPText = parseInt(paramdeck['Critical HP Text']);
FirehawkADK.ParamDeck.CriticalHPBar1 = parseInt(paramdeck['Critical HP Bar Color 1']);
FirehawkADK.ParamDeck.CriticalHPBar2 = parseInt(paramdeck['Critical HP Bar Color 2']);

//Pick the HP Text Color.
Window_Base.prototype.hpTextColorPicker = function (actor, isSystem) {
    switch (true) {
        case (FirehawkADK.ParamDeck.WarningColor === true) && actor.hp > actor.mhp * FirehawkADK.ParamDeck.WarningHPLimit:
        case (FirehawkADK.ParamDeck.WarningColor === false) && actor.hp > actor.mhp * FirehawkADK.ParamDeck.LowHPLimit:
            return isSystem ? this.systemColor() : this.normalColor();
        case (FirehawkADK.ParamDeck.WarningColor === true) && actor.hp > actor.mhp * FirehawkADK.ParamDeck.LowHPLimit:
            return this.textColor(FirehawkADK.ParamDeck.HPWarningText);
        case actor.hp > actor.mhp * FirehawkADK.ParamDeck.CriticalHPLimit:
            return this.textColor(FirehawkADK.ParamDeck.HPLowText);
        case actor.hp <= actor.mhp * FirehawkADK.ParamDeck.CriticalHPLimit:
            return this.textColor(FirehawkADK.ParamDeck.CriticalHPText);
    }
};

// Pick the HP Color 1 for the HP Gauge.
Window_Base.prototype.hpbarColorPicker1 = function (actor, compatFlag, compatColor) {
    switch (true) {
        case (FirehawkADK.ParamDeck.WarningColor == true) && actor.hp > actor.mhp * FirehawkADK.ParamDeck.WarningHPLimit:
        case (FirehawkADK.ParamDeck.WarningColor == false) && actor.hp > actor.mhp * FirehawkADK.ParamDeck.LowHPLimit:
            return (compatFlag == true) ?
                compatColor :
                this.textColor(FirehawkADK.ParamDeck.HPNormalBar1);
        case (FirehawkADK.ParamDeck.WarningColor == true) && actor.hp > actor.mhp * FirehawkADK.ParamDeck.LowHPLimit:
            return this.textColor(FirehawkADK.ParamDeck.HPBarWarning1);
        case actor.hp > actor.mhp * FirehawkADK.ParamDeck.CriticalHPLimit:
            return this.textColor(FirehawkADK.ParamDeck.HPBarLow1);
        case actor.hp <= actor.mhp * FirehawkADK.ParamDeck.CriticalHPLimit:
            return this.textColor(FirehawkADK.ParamDeck.CriticalHPBar1);
    }
};

//Pick the HP Color 2 for the HP Gauge.
Window_Base.prototype.hpbarColorPicker2 = function (actor, compatFlag, compatColor) {
    switch (true) {
        case (FirehawkADK.ParamDeck.WarningColor == true) && actor.hp > actor.mhp * FirehawkADK.ParamDeck.WarningHPLimit:
        case (FirehawkADK.ParamDeck.WarningColor == false) && actor.hp > actor.mhp * FirehawkADK.ParamDeck.LowHPLimit:
            return (compatFlag == true) ? compatColor : this.textColor(FirehawkADK.ParamDeck.HPNormalBar2);
        case (FirehawkADK.ParamDeck.WarningColor == true) && actor.hp > actor.mhp * FirehawkADK.ParamDeck.LowHPLimit:
            return this.textColor(FirehawkADK.ParamDeck.HPBarWarning2);
        case actor.hp > actor.mhp * FirehawkADK.ParamDeck.CriticalHPLimit:
            return this.textColor(FirehawkADK.ParamDeck.HPBarLow2);
        case actor.hp <= actor.mhp * FirehawkADK.ParamDeck.CriticalHPLimit:
            return this.textColor(FirehawkADK.ParamDeck.CriticalHPBar2);
    }
};

//Re-write the drawActorHp function.
this.Window_Base.prototype.drawActorHp = function (actor, x, y, width) {
    width = width || 186;
    var color1 = this.hpbarColorPicker1(actor, FirehawkADK.ParamDeck.CompatMode, this.hpGaugeColor1());
    var color2 = this.hpbarColorPicker2(actor, FirehawkADK.ParamDeck.CompatMode, this.hpGaugeColor2());
    this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
    this.changeTextColor(this.hpTextColorPicker(actor, true));
    this.drawText(TextManager.hpA, x, y, 44);
    this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width,
        this.hpColor(actor), this.normalColor());
};

//Re-write the hpColor function so it can change the text color.
Window_Base.prototype.hpColor = function (actor) {
    if (!actor.isDead()) return this.hpTextColorPicker(actor, false);
    else return this.deathColor();
};

//This is a copy of the license.
// Do NOT remove it!

/* 
MIT License

Copyright (c) 2019 Studio ACE

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. 
*/