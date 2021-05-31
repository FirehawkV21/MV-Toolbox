var FirehawkADK = FirehawkADK || {};
/*:
 * @plugindesc R1.00|Customize the Battle Escape event.
 * @author AceOfAces
 *
 * @param Settings
 * 
 * @param Add the Escape Start String
 * @parent Settings
 * @desc Adds the Escape Attempt text from the database.
 * @type boolean
 * @default false
 * @on Yes
 * @off No
 *
 * @param Ignore Escape Failed string
 * @parent Settings
 * @desc Ignore the Escape Failure string in the Database.
 * @type boolean
 * @default false
 * @on Ignore
 * @off Don't Ignore
 * 
 * @param Drop Gold
 * @parent Settings
 * @desc Will the party drop gold when they escape successfully?
 * @type select
 * @option No
 * @value 0
 * @option Yes(by fixed amount)
 * @value 1
 * @option Yes(by percentage)
 * @value 2
 * @default No
 * 
 * @param Gold Amount
 * @parent Drop Gold
 * @desc This adjusts the amount of gold lost in each escape.
 * @type number
 * @default 0
 * 
 * @param Percentage of gold lost
 * @parent Drop Gold
 * @desc This adjusts the percentage of gold lost in each escape.
 * @type number
 * @max 100
 * @min 0
 * @default 10
 *
 * @param Strings
 *
 * @param Escape Success
 * @parent Strings
 * @desc Which text will be shown when the escape succeeds.
 * @type text
 * @default %1 escaped successfully!
 *
 * @param Escape Failure
 * @parent Strings
 * @desc Which text will be shown when the escape fails.
 * @type text
 * @default %1 failed to escape.
 * 
 * @param Gold Dropped
 * @parent Strings
 * @desc The text that will be seen when gold is dropped.
 * @type text
 * @default %1\G was lost while escaping.
 * 
 * @help
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 * Escape Command Customizer (MV version) - Version R1.00
 * Developed by AceOfAces.
 * Licensed under the MIT license. Can be used for both non-commercial
 * and commercial games.
 * Please credit me as AceOfAces when you use this plugin.
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 * This plugin allows the developer to customize the behaviour of the escape
 * command.
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 * Installation Instructions:
 * 
 * 1. Put the plugin to the game's plugins folder.
 * 2. In the Plugin Manager, put the plugin to any location you prefer.
 * (For simplicity, put the plugin near to the other battle plugins)
 * 3. Edit the settings to your liking.
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 * Gold Dropping
 * 
 * When the player picks the option to escape, this plugin can remove part of
 * the gold they have. If they don't have enough gold to remove, the plugin
 * will remove half of the gold that they have (if a set amount is set).
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 */

var droppedGold = 0;

 // Reference the Plugin Manager's parameters.
var paramdeck = PluginManager.parameters('FSDK_EscapeCommandCustomizer');
//Create the global Parameter Deck.
FirehawkADK.ParamDeck = FirehawkADK.ParamDeck || {};
//Load variables set in the Plugin Manager
FirehawkADK.ParamDeck.MultiplexEscapeString = String(paramdeck['Add the Escape Start String']).trim().toLowerCase() === 'true';
FirehawkADK.ParamDeck.IgnoreDBString = String(paramdeck['Ignore Escape Failed string']).trim().toLowerCase() === 'true';
FirehawkADK.ParamDeck.dropGoldMode = parseInt(paramdeck['Drop Gold']);
FirehawkADK.ParamDeck.dropGoldAmount = parseInt(paramdeck['Gold Amount']);
FirehawkADK.ParamDeck.dropGoldPercentage = parseInt(paramdeck['Percentage of gold lost']) / 100;
FirehawkADK.ParamDeck.EscapeSuccessText = String(paramdeck['Escape Success']);
FirehawkADK.ParamDeck.EscapeFailedText = String(paramdeck['Escape Failure']);
FirehawkADK.ParamDeck.DroppedGoldText = String(paramdeck['Gold Dropped']);



//Rewrite displayEscapeSuccessMessage
this.BattleManager.displayEscapeSuccessMessage = function () {
    //Use switch-case.
    switch (FirehawkADK.ParamDeck.dropGoldMode){
        case 2:
        droppedGold = Math.floor($gameParty.gold() * FirehawkADK.ParamDeck.dropGoldPercentage);
        $gameParty.gainGold(-droppedGold);
       break;
       case 1:
       droppedGold = ($gameParty.gold() >= FirehawkADK.ParamDeck.dropGoldAmount) ? FirehawkADK.ParamDeck.dropGoldAmount : Math.floor($gameParty.gold() / 2);
       $gameParty.gainGold(-droppedGold);
       break;
       default:
       droppedGold = 0; 
    }
    if (FirehawkADK.ParamDeck.MultiplexEscapeString == true) $gameMessage.add(TextManager.escapeStart.format($gameParty.name()) + '\\.');
    $gameMessage.add(FirehawkADK.ParamDeck.EscapeSuccessText.format($gameParty.name()));
    if (FirehawkADK.ParamDeck.dropGoldAmount > 0)$gameMessage.add(FirehawkADK.ParamDeck.DroppedGoldText.format(droppedGold));
};

//Rewrite displayEscapeFailureMessage
this.BattleManager.displayEscapeFailureMessage = function () {
    if (FirehawkADK.ParamDeck.MultiplexEscapeString == true) $gameMessage.add(TextManager.escapeStart.format($gameParty.name()) + '\\.');
    if (FirehawkADK.ParamDeck.IgnoreDBString == true)
        $gameMessage.add(FirehawkADK.ParamDeck.EscapeFailedText.format($gameParty.name()));
    else
        $gameMessage.add(TextManager.escapeFailure);
};

/*
MIT License

Copyright (c) 2021 Studio ACE

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