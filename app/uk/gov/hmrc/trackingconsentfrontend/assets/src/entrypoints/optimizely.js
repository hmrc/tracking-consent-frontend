/*
The following is boilerplate supplied by Optimizely to make the integration with GTM and GA work:
https://help.optimizely.com/Integrate_Other_Platforms/Integrate_Optimizely_X_with_Google_Universal_Analytics_using_Google_Tag_Manager

 */
var DATALAYER_OBJECT_NAME = 'dataLayer';

/**
 * Some analytics platforms have the ability to fix referrer values by overriding the page referrer value.
 * this function is called when a redirect has occured on the previous page.
 *
 * @param {string} referrer - The effective referrer value
 */
var referrerOverride = function(referrer) {
    var dataLayerObject = window[DATALAYER_OBJECT_NAME] || [];
    dataLayerObject.push({
        'event': 'optimizely-referrer-override',
        'optimizely-referrer': referrer
    });
};

/**
 * Used for experiments created in Optimizely. This function is executed for all
 * experiments that are running on the page. Use the arguments to send data to your platform.
 *
 * @param {string} campaignId - The ID of a campaign that is running on the page
 * @param {string} integrationString - Integration string for a particular campaign
 *   which is a sample of the visitor that isn't exposed so that Optimizely can calculate the impact of a campaign.
 */
var sendCampaignData = function(campaignId, integrationString) {
    var dimension = optimizely.get('data') && optimizely.get('data').campaigns[campaignId] && optimizely.get('data').campaigns[campaignId].integrationSettings && optimizely.get('data').campaigns[campaignId].integrationSettings.google_universal_analytics && optimizely.get('data').campaigns[campaignId].integrationSettings.google_universal_analytics.universal_analytics_slot;
    if (dimension) {
        var customVariableValue = integrationString;
        var dataLayerObject = window[DATALAYER_OBJECT_NAME] || [];
        dataLayerObject.push({
            'event': 'campaign-decided',
            'optimizely-dimension-value': customVariableValue,
            'optimizely-dimension-number': dimension
        });
    }
};

/**
 * This function fetches the campaign integration string from the Optimizely client
 * and calls the functions provided in the arguments with the data that needs to
 * be used for sending information. It is recommended to leave this function as is
 * and to create your own implementation of the functions referrerOverride and
 * sendCampaignData.
 *
 * @param {Function} referrerOverride - This function is called if the effective referrer value differs from
 *   the current document.referrer value. The only argument provided is the effective referrer value.
 * @param {Function} sendCampaignData - This function is called for every running campaign on the page.
 *   The function is called with all the relevant ids and names.
 */
var initNewOptimizelyIntegration = function(referrerOverride, sendCampaignData) {
    // There can only be one effective referrer on a page. This boolean makes sure the
    // redirect overwrite only happens once. Multiple referrerOverwrites might result in undesired behavior.
    var referrerOverwritten = false;
    var newActiveCampaign = function(id) {
        var state = window['optimizely'].get && window['optimizely'].get('state');
        var referrer = state.getRedirectInfo() && state.getRedirectInfo().referrer;
        if (!referrerOverwritten && referrer) {
            referrerOverride(referrer);
            referrerOverwritten = true;
        }

        var campaignId = id;
        var integrationString = state.getDecisionString({'campaignId':campaignId});

        sendCampaignData(campaignId, integrationString);
    };

    /**
     * At any moment, a new campaign can be activated (manual or conditional activation).
     * This function registers a listener that listens to newly activated campaigns and
     * handles them.
     */
    var registerFutureActiveCampaigns = function() {
        window.optimizely = window.optimizely || [];
        window.optimizely.push({
            type: 'addListener',
            filter: {
                type: 'lifecycle',
                name: 'campaignDecided'
            },
            handler: function(event) {
                var id = event.data.campaign.id;
                newActiveCampaign(id);
            }
        });
    };

    /**
     * If this code is running after Optimizely on the page, there might already be
     * some campaigns active. This function makes sure all those campaigns are
     * handled.
     */
    var registerCurrentlyActiveCampaigns = function(){
        var state = window['optimizely'] && window['optimizely'].get && window['optimizely'].get('state');
        if (state) {
            var activeCampaigns = state.getCampaignStates({
                isActive: true
            });
            for (var id in activeCampaigns) {
                newActiveCampaign(id);
            }
        }
    };

    registerCurrentlyActiveCampaigns();
    registerFutureActiveCampaigns();
};

/**
 * A wrapper around the logic for the new Optimizely integration.
 * @param {Function} referrerOverride - This function is called if the effective referrer value differs from
 *   the current document.referrer value. The only argument provided is the effective referrer value.
 * @param {Function} sendCampaignData - This function is called for every running campaign on the page.
 *   The function is called with all the relevant ids and names.
 */
var initOptimizelyIntegration = function(referrerOverride, sendCampaignData) {
    initNewOptimizelyIntegration(referrerOverride, sendCampaignData);
}

initOptimizelyIntegration(referrerOverride, sendCampaignData);
