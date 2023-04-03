// Sentry Integration for RPG Maker MV
// Version R1.05
// Created by Studio ACE

var FirehawkADK = FirehawkADK || {};
FirehawkADK.SentryIntegration = FirehawkADK.SentryIntegration || {};

const Sentry = require("@sentry/browser");

// Reference the Plugin Manager's parameters.
var paramdeck = PluginManager.parameters('FSDK_SentryIntegration');
//Create the global Parameter Deck.
FirehawkADK.ParamDeck = FirehawkADK.ParamDeck || {};
//Load variables set in the Plugin Manager.
FirehawkADK.ParamDeck.SentryDSN = String(paramdeck['dsn']);
FirehawkADK.ParamDeck.SentryReleaseTag = String(paramdeck['releaseTag']);
FirehawkADK.ParamDeck.SentryEnvironmentTag = String(paramdeck['environmentTag']);
FirehawkADK.ParamDeck.SentryActivationFlag = String(paramdeck['defaultSetting']).trim().toLowerCase() === 'true';
FirehawkADK.ParamDeck.SentryForceFlag = String(paramdeck['Force Reporting']).trim().toLowerCase() === 'true';
FirehawkADK.ParamDeck.SentryActivationOptionName = String(paramdeck['optionsName']);
FirehawkADK.ParamDeck.SentryFeedbackScreenTitle = String(paramdeck['feedbackScreenTitle']);
FirehawkADK.ParamDeck.SentryFeedbackScreenSubtitle = String(paramdeck['feedbackScreenSubtitle1']);
FirehawkADK.ParamDeck.SentryFeedbackScreenSubtitle2 = String(paramdeck['feedbackScreenSubtitle2']);
FirehawkADK.ParamDeck.SentryFeedbackScreenNameField = String(paramdeck['feedbackScreenNameField']);
FirehawkADK.ParamDeck.SentryFeedbackScreenEmailField = String(paramdeck['feedbackScreenEmailField']);
FirehawkADK.ParamDeck.SentryFeedbackScreenCommentsField = String(paramdeck['feedbackScreenCommentsFieldLabel']);
FirehawkADK.ParamDeck.SentryFeedbackScreenSuccessMessage = String(paramdeck['feedbackScreenSentLabel']);
FirehawkADK.ParamDeck.SentryReportGameHealth = String(paramdeck['releaseHealth']).trim().toLowerCase() === 'true';
FirehawkADK.ParamDeck.SentryReportDeviceInfo = String(paramdeck['sendDeviceInfo']).trim().toLowerCase() === 'true';
FirehawkADK.ParamDeck.SentryMaxEventsStored = parseInt(paramdeck['offlineEventStorageCount']);
FirehawkADK.ParamDeck.SentryMaxBreadcrumbs = parseInt(paramdeck['maxBreadcrumbs']);
FirehawkADK.ParamDeck.SentryCaptureLevels = (paramdeck['consoleCapture']);
FirehawkADK.ParamDeck.SentryAllowList = (paramdeck['allowList']);
FirehawkADK.ParamDeck.SentryDenyList = (paramdeck['denyList']);
FirehawkADK.ParamDeck.SentryOfflineObjectsLimit = parseInt(paramdeck['offlineEventStorageCount']) || 30;
FirehawkADK.ParamDeck.SentryOfflineStorageName = String(paramdeck['dbName']);
FirehawkADK.ParamDeck.SentryOfflineObjectStorage = String(paramdeck['dbStoreName']);
FirehawkADK.ParamDeck.SentryFlushOfflineEvents = String(paramdeck['flushAtBoot']).trim().toLowerCase() === 'true';

//The initialization code. 
Sentry.init({
    dsn: FirehawkADK.ParamDeck.SentryDSN,
    release: FirehawkADK.ParamDeck.SentryReleaseTag,
    environment: FirehawkADK.ParamDeck.SentryEnvironmentTag,
    autoSessionTracking: FirehawkADK.ParamDeck.SentryReportGameHealth,
    maxBreadcrumbs: FirehawkADK.ParamDeck.SentryMaxBreadcrumbs,
    transport: Sentry.makeBrowserOfflineTransport(Sentry.makeFetchTransport),
    transportOptions: {
        dbName: FirehawkADK.ParamDeck.SentryOfflineStorageName,
        storeName: FirehawkADK.SentryOfflineObjectStorage,
        maxQueueSize: FirehawkADK.ParamDeck.SentryOfflineObjectsLimit,
        flushAtStartup: FirehawkADK.ParamDeck.SentryFlushOfflineEvents
    },
    beforeSend(event) {
        // Check if it is an exception, and if so, show the report dialog
        if (event.exception && event.level == 'fatal') {
            Sentry.showReportDialog({
                eventId: event.event_id,
                title: FirehawkADK.ParamDeck.SentryFeedbackScreenTitle,
                subtitle: FirehawkADK.ParamDeck.SentryFeedbackScreenSubtitle,
                subtitle2: FirehawkADK.ParamDeck.SentryFeedbackScreenSubtitle2,
                labelName: FirehawkADK.ParamDeck.SentryFeedbackScreenNameField,
                labelEmail: FirehawkADK.ParamDeck.SentryFeedbackScreenEmailField,
                labelComments: FirehawkADK.ParamDeck.SentryFeedbackScreenCommentsField,
                successMessage: FirehawkADK.ParamDeck.SentryFeedbackScreenSuccessMessage,
                allowList: FirehawkADK.ParamDeck.SentryAllowList,
                denyList: FirehawkADK.ParamDeck.SentryDenyList,
                enabled: (!FirehawkADK.ParamDeck.SentryForceFlag && Utils.isOptionValid('test')) ? false : true,
                debug: (FirehawkADK.ParamDeck.SentryForceFlag && Utils.isOptionValid('test')) ? true : false
            });
        }
        return event;
    }
});

//Initialize config.
ConfigManager.SentryUploadReports = FirehawkADK.ParamDeck.SentryActivationFlag;

FirehawkADK.SentryIntegration.PrepConfig = ConfigManager.makeData;
ConfigManager.makeData = function () {
    var config = FirehawkADK.SentryIntegration.PrepConfig.call(this);
    config.SentryUploadReports = this.SentryUploadReports;
    return config;
};

FirehawkADK.SentryIntegration.ApplyConfig = ConfigManager.applyData;
ConfigManager.applyData = function (config) {
    FirehawkADK.SentryIntegration.ApplyConfig.call(this, config);
    this.SentryUploadReports = (config['SentryUploadReports'] != undefined) ? config['SentryUploadReports'] : FirehawkADK.ParamDeck.SentryActivationFlag;
};

//Re-write catchException
SceneManager.catchException = function (e) {
    if (e instanceof Error) {
        Graphics.printError(e.name, e.message);
        console.error(e.stack);
    } else {
        Graphics.printError('UnknownError', e);
    }
    AudioManager.stopAll();
    FirehawkADK.SentryIntegration.ReportEvent(e, 'fatal', 'engine', 'code');
    this.stop();

};

//Re-write the exit code so Sentry can finish up any work needed.
SceneManager.exit = function () {
    Sentry.close(10000);
    this.goto(null);
    this._exiting = true;
};

//Implements the error report code. Edit this if you want to adjust how the library will collect information.
FirehawkADK.SentryIntegration.ReportEvent = function (e, reportLevel, report_tag1, report_tag2) {
    Sentry.configureScope(function (scope) {
        scope.setTag(report_tag1, report_tag2);
        scope.setLevel(reportLevel);
    });
    if (reportLevel == 'fatal') {
        if (!DataManager.isEventTest() && !DataManager.isBattleTest())
            Sentry.setContext('location', {
                'current_map': $dataMapInfos[$gameMap.mapId()].name,
                'position_x': $gamePlayer._realX,
                'position_y': $gamePlayer._realY,
                'has_collided': $gamePlayer.isCollidedWithEvents(),
                'is_in_vehicle': $gamePlayer.isInVehicle(),
                'map_region_id': $gameMap.regionId($gamePlayer._realX, $gamePlayer._realY),
                'is_fighting': $gameParty._inBattle

            });
        if (Utils.isNwjs() && FirehawkADK.ParamDeck.SentryReportDeviceInfo) {
            var cpuData = deviceinternals.cpus();
            Sentry.setContext('device_internals', {
                'system_ram': deviceinternals.totalmem() / 1048576,
                'system_ram_free': deviceinternals.freemem() / 1048576,
                'system_cpu': cpuData[0].model,
                'system_cpu_speed': cpuData[0].speed,
                'system_os_version': deviceinternals.version(),
                'system_os_build': deviceinternals.release()
            });
        }
    }
    if ((!Utils.isOptionValid('test') && ConfigManager.SentryUploadReports)) Sentry.captureException(e);
};

//Implements the manual breadcrumb code.
FirehawkADK.SentryIntegration.AddBreadcrumb = function (message, category, level) {
    if ((!Utils.isOptionValid('test') && ConfigManager.SentryUploadReports)) Sentry.addBreadcrumb({
        message: message,
        category: category,
        level: level
    });
}

//Implements the send message code.
FirehawkADK.SentryIntegration.SendMessage = function (message) {
    if ((!Utils.isOptionValid('test') && ConfigManager.SentryUploadReports)) Sentry.captureMessage(message);
}

//The plugin command code.
FirehawkADK.SentryIntegration.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        FirehawkADK.SentryIntegration.Game_Interpreter_pluginCommand.call(this, command, args)
        switch (command) {
            case 'AddBreadcrumb':
                FirehawkADK.SentryIntegration.AddBreadcrumb(args[0], args[1], args[2]);
                break;
            case 'SendMessage':
                FirehawkADK.SentryIntegration.SendMessage(args[0]);
                break;
        }
    }

//Add the setting to the Options menu.
FirehawkADK.SentryIntegration.RegisterSetting = Window_Options.prototype.addGeneralOptions;
Window_Options.prototype.addGeneralOptions = function () {
    FirehawkADK.SentryIntegration.RegisterSetting.call(this);
    this.addCommand(FirehawkADK.ParamDeck.SentryActivationOptionName, 'SentryUploadReports');
};

SceneManager.preferableRendererType = function () {
        return 'webgl';
};