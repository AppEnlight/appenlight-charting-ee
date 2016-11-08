// # Published under Commercial License.
// # Read the full license text at https://rhodecode.com/licenses.

angular.module('appenlight.plugins.ae_charting_ee',
    ['appenlight.plugins.ae_charting_ee.directives']).config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('dashboard', {
        abstract: true,
        url: '/ui/dashboard',
        templateUrl: '/ae_charting_ee/templates/dashboards/parent_view.html'
    });
    $stateProvider.state('dashboard.list', {
        url: '',
        templateUrl: '/ae_charting_ee/templates/dashboards/index.html',
        controller: 'DashboardsIndexController as dashboards'
    });
    $stateProvider.state('dashboard.view', {
        url: '/:resourceId',
        templateUrl: '/ae_charting_ee/templates/dashboards/view.html',
        controller: 'DashboardController as dashboard'
    });
    $stateProvider.state('dashboard.chart', {
        url: '/:resourceId/updateChart/:chartId',
        templateUrl: '/ae_charting_ee/templates/dashboards/chart_update.html',
        controller: 'DashboardChartUpdateController as chart'
    });
    $stateProvider.state('dashboard.chart_alert', {
        url: '/:resourceId/updateChartAlert/:chartId',
        templateUrl: '/ae_charting_ee/templates/dashboards/alert_create.html',
        controller: 'DashboardChartAlertCreateController as alert_ctrlr'
    });
    $stateProvider.state('dashboard.update', {
        url: '/:resourceId/update',
        templateUrl: '/ae_charting_ee/templates/dashboards/dashboard_update.html',
        controller: 'DashboardUpdateController as dashboard'
    });

}]).run(['stateHolder', 'AeConfig', function (stateHolder, AeConfig) {
    /**
     * register plugin in stateHolder
     */
    stateHolder.plugins.callables.push(function () {
        console.log('ae_charting run()');
        AeConfig.topNav.menuDashboardsItems.push(
            {'sref': 'dashboard.list', 'label': 'Custom Dashboards'}
        );
    });

}]);
