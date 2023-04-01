/*:
 *
 * @plugindesc R1.06 || Provides automatic crash and error reports to the developer using Sentry.
 * @author AceOfAces
 * 
 * @param Setup
 * 
 * @param dsn
 * @text DSN
 * @parent Setup
 * @type text
 * @desc The key that is necessary to send data to.
 * @default <autentication_token>[at]sentry.io/<project-id>
 * 
 * @param releaseTag
 * @text Release Tag
 * @parent Setup
 * @desc The tag that is used to denote a release.
 * @default my-project-name[at]1.0.0
 * 
 * @param environmentTag
 * @text Environment Tag
 * @type text
 * @parent Setup
 * @desc The tag used to split releases. Handy if you have multiple releases (eg. Stable, Beta, Alpha, etc.)
 * @default dev 
 * 
 * @param defaultSetting
 * @text Default Setting
 * @parent Setup
 * @desc Which will be the default?
 * @type boolean
 * @on Send
 * @off Don't send
 * @default false
 * 
 * @param releaseHealth
 * @text Release Health
 * @parent Setup
 * @desc Should Sentry report the session's status? This is helpful for diagnosing regressions.
 * @type boolean
 * @on Send
 * @off Don't send
 * @default false
 * 
 * 
 * @param sendDeviceInfo
 * @text Send Device Info
 * @parent Setup
 * @desc Should Sentry record some information about the device? Helpful for diagnosing device-related issues (desktop only).
 * @type boolean
 * @on Send
 * @off Don't send
 * @default false
 * 
 * @param Offline Support
 * @parent Setup
 * 
 * @param dbName
 * @text Database Name
 * @parent Offline Support
 * @default sentry-offline
 * @desc The name for the IndexedDB database (that will hold the events).
 * 
 * @param dbStoreName
 * @text Storage Name
 * @parent Offline Support
 * @default GameName
 * @desc Name of the IndexedDB object store that will hold the events.
 * 
 * @param offlineEventStorageCount
 * @text Maximum Events Stored Offline
 * @parent Offline Support
 * @desc How many events can be stored when the user is offline? (Default: 30)
 * @type Number
 * @min 1
 * @default 30
 * 
 * @param flushAtBoot
 * @text Flush at startup
 * @parent Offlien Support
 * @type boolean
 * @default true
 * @on Flush
 * @off Don't flush
 * @desc Should Sentry flush events shortly after startup?
 * 
 * @param Options
 * 
 * @param sentryBreadcrumbs
 * @text Maximum Breadcrumbs
 * @parent Options
 * @type Number
 * @min 1
 * @default 100
 * @desc Sets the maximum number of breadcrumbs to send to Sentry (Default: 100)
 *
 * @param allowList
 * @text Allow List
 * @parent Options
 * @type text[]
 * @desc A list of domains that will be allowed for exception capturing. Leave this empty if you want to allow all sites.
 * @default []
 * 
 * @param denyList
 * @text Deny List
 * @parent Options
 * @type text[]
 * @desc A list of sites that will not be allowed for exception capturing.
 * @default []
 * 
 * @param forceReporting
 * @text Debug mode
 * @parent Options
 * @type boolean
 * @on On
 * @off Off
 * @desc If true, Sentry will show debug messages and send exceptions during playtesting. Helpful for testing the integration.
 * @default false
 * 
 * @param optionsName
 * @text Options Name
 * @parent Options
 * @desc The name of the setting in the options menu.
 * @default Auto-Upload Error Reports
 * 
 * @param Feedback Screen
 * 
 * @param feedbackScreenTitle
 * @text Screen Title
 * @type text
 * @parent Feedback Screen
 * @desc The title of the feedback screen.
 * @default Ack! The game crashed.
 * 
 * @param feedbackScreenSubtitle1
 * @text Screen Subtitle 1
 * @parent Feedback Screen
 * @desc This is the text that is shown below the title.
 * @default The crash has been reported to the dev.
 * 
 * @param feedbackScreenSubtitle2
 * @text Screen Subtitle 2
 * @parent Feedback Screen
 * @desc The second subtitle.
 * @default You can help in diagnosing the issue by providing some details.
 * 
 * @param feedbackScreenNameField
 * @text Name Field Label
 * @parent Feedback Screen
 * @desc The label for the Name field.
 * @default Name (Real, Nickname, whatever)
 * 
 * @param feedbackScreenEmailField
 * @text Email Field Label
 * @parent Feedback Screen
 * @desc The label for the Email field.
 * @default Email (in case we need to contact you for more information)
 * 
 * @param feedbackScreenCommentsFieldLabel
 * @text Comments Field Label
 * @parent Feedback Screen
 * @desc The label for the Comments field.
 * @default What happened?
 * 
 * @param feedbackScreenSentLabel
 * @text Feedback Sent Label
 * @parent Feedback Screen
 * @desc The text shown when the feedback was sent successfully.
 * @default Thank you for your feedback! You may now re-launch the game by pressing F5 (or closing and opening the game).
 * 
 * @help
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 * Sentry Integration for RPG Maker MV - Version R1.04
 * Developed by AceOfAces
 * Licensed under the MIT license. Can be used for both non-commercial
 * and commercial games.
 * Please credit me as AceOfAces when you use this plugin.
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 * This plugin allows developers to receive automated crash reports when the
 * game crashes. This can be a life-saver, especially if the players don't
 * bother to report bugs. You can even use this plugin to catch errors in
 * the code as well.
 * This plugin uses Sentry as a base.
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 * Installation and setup:
 * 1. Sign up to Sentry (https://sentry.io). We'll need a DSN for this.
 * 2. Once you've signed up, you'll be asked to create a project.
 * follow the instruction (make sure to select JavaScript as the
 * programming language).
 * 3. (Optional) If you are using the raw version, use the included
 * cook script so it can create an up-to-date version of this
 * plugin with the latest version of Sentry.
 * 4. Now, let's set up your project. Do the following:
 *  - Put the plugin in the top area of the plugin list. This is important,
 *  since we need to initialize the library before the game starts up.
 *  - If you use Yanfly's Core Engine or Olivia's Player Anti-Stress plugin,
 *  we'll need to patch them. Open the plugin(s) with notepad or a code
 *  editor, find the SceneManager.catchException and add the line:
 *  FirehawkADK.SentryIntegration.ReportEvent(e, 'fatal', 'engine', 'code');
 *  Underneath the line:
 *  SceneManager.catchException = function(e){
 *  - Once this is done, you'll need to fill in the data necessary to 
 *  initialize the SDK. Copy the DSN (see the init code in the setup page),
 *  the the version and environment tags you've set up over to this
 *  plugin's parameters. Make sure to replace [at] with the [at]
 *  symbol and switch the 'Debug Mode' to On.
 * 5. Once the project's set up, we'll need to test it out. Take any
 * plugin and add a myfunction1(); in another function. The AltMenuScreen
 * plugin is a good candidate.
 * 6. If the game crashes and Sentry has en entry for the error, the
 * plugin's set up correctly. Set the 'Debug Mode' option to
 * Off. Make sure to also remove the myfunction1(); as well.
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 * Plugin API
 * The plugin has a pretty simple API that can integrate easily
 * to the game's code. Most of the work is done by using this method:
 * 
 * FirehawkADK.SentryIntegration.ReportEvent(e,reportLevel,reporttag1,reporttag2);
 * 
 * This tag will send a report, alongside the error stack, breadcrumbs,
 * game information (version and environment tags), Operating System
 * and the tags you've specified. The arguments used are:
 * e: The The object that has the error stack. Look for catchException
 * or something similar. This is required.
 * reportLevel: The severity of the even (info, warning, error, fatal).
 * Look at the Sentry's documentation for more information.
 * This is also required.
 * report_tag: These are used for categorization purposes.
 * 
 * FirehawkADK.SentryIntegration.SendMessage(message);
 * Plugin command: SendMessage "Message"
 * Send a message to Sentry. This is useful with some instances.
 * 
 * FirehawkADK.SentryIntegration.AddBreadcrumb(message, category, level);
 * Plugin command: AddBreadcrumb "Message" "Category" "Level"
 * Attaches a custom breadcrumb to the report. This can be useful for
 * adding better context when diagnosing issues.
 * 
 * The plugin parameters break down like this:
 * 
 * DSN: This is the key that the service gives you.
 * Release Tag: For organizational purposes. Let's you attach a custom version.
 * Environment Tag: This denotes the type of the game. This helps in breaking
 * down the game versions a little further. Game version 1.0.0 that has the tag
 * dev is different from game version 1.0.0 and tag release.
 * Default Setting: This sets the default setting that the game will have.
 * For some countries, you may have to set this to 'Don't send', in order to
 * comply with laws regarding privacy.
 * Max Breadcrumbs: This is the maximum number of breadcrumbs that will be
 * sent with the report. Adjust this to your needs.
 * Allow list and Block list: This is more useful when the game is
 * hosted on a server. You can set the allow and block list of sites
 * that Sentry will be tracking for reports (CDN sites, for example).
 * Release Health: If this is turned on, Sentry will record the session 
 * Debug Mode: This enables Sentry's debug mode and lets the plugin send
 * reports during debugging the game.
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 * About Device Info
 * 
 * This option will allow Sentry to send select information about the device
 * the game runs on. This may be useful for diagnosing some specific issues.
 * Please note that this only works with the Windows, Mac and Linux builds
 * of your game. The details that are collected are:
 * OS version, Free and Total RAM and CPU Name, Speed and the architecture
 * that NW.js is built for.
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 * What's next?
 * -Make sure that your Sentry account is secured. Use a strong
 * password and 2 Factor Authentication.
 * -Do *not*, under any circumstances, share the DSN key.
 * Encrypt the game properly and compile the game's source code.
 * If you need an easy tool to compile the game's code, take a
 * look at my other project:
 * https://studioace.wordpress.com/projects/rpg-maker-mv-cook-tool/
 * -Make sure that you do not include any personal info without
 * disclosing this. Especially if you decide to edit this plugin.
 * Sentry provides a data scrubber, so make sure to set this up.
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
*/
