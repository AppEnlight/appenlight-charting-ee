// # Published under Commercial License.
// # Read the full license text at https://rhodecode.com/licenses.

angular.module('appenlight.services.resources').factory('dashboardsNoIdResource', ['$resource', 'AeConfig', function ($resource, AeConfig) {
    return $resource(AeConfig.urls.plugins.ae_charting_ee.dashboardsNoId, null, angular.copy(DEFAULT_ACTIONS));
}]);

angular.module('appenlight.services.resources').factory('dashboardsPropertyResource', ['$resource', 'AeConfig', function ($resource, AeConfig) {
    return $resource(AeConfig.urls.plugins.ae_charting_ee.dashboardsProperty, null, angular.copy(DEFAULT_ACTIONS));
}]);

angular.module('appenlight.services.resources').factory('dashboardsResource', ['$resource', 'AeConfig', function ($resource, AeConfig) {
    return $resource(AeConfig.urls.plugins.ae_charting_ee.dashboards, null, angular.copy(DEFAULT_ACTIONS));
}]);

angular.module('appenlight.services.resources').factory('chartsNoIdResource', ['$resource', 'AeConfig', function ($resource, AeConfig) {
    return $resource(AeConfig.urls.plugins.ae_charting_ee.chartsNoId, null, angular.copy(DEFAULT_ACTIONS));
}]);

angular.module('appenlight.services.resources').factory('chartsPropertyResource', ['$resource', 'AeConfig', function ($resource, AeConfig) {
    return $resource(AeConfig.urls.plugins.ae_charting_ee.chartsProperty, null, angular.copy(DEFAULT_ACTIONS));
}]);

angular.module('appenlight.services.resources').factory('chartsResource', ['$resource', 'AeConfig', function ($resource, AeConfig) {
    return $resource(AeConfig.urls.plugins.ae_charting_ee.charts, null, angular.copy(DEFAULT_ACTIONS));
}]);

angular.module('appenlight.services.resources').factory('chartEventRulesNoIdResource', ['$resource', 'AeConfig', function ($resource, AeConfig) {
    return $resource(AeConfig.urls.plugins.ae_charting_ee.chartsEventRulesNoId, null, angular.copy(DEFAULT_ACTIONS));
}]);

angular.module('appenlight.services.resources').factory('chartEventRulesResource', ['$resource', 'AeConfig', function ($resource, AeConfig) {
    return $resource(AeConfig.urls.plugins.ae_charting_ee.chartsEventRules, null, angular.copy(DEFAULT_ACTIONS));
}]);
