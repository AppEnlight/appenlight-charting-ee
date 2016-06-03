// # Published under Commercial License.
// # Read the full license text at https://rhodecode.com/licenses.

angular.module('appenlight.controllers')
    .controller('DashboardController', DashboardController);

DashboardController.$inject = ['$scope', '$interval', '$state', 'chartResultParser', 'chartsPropertyResource', 'dashboardsResource'];

function DashboardController($scope, $interval, $state, chartResultParser, chartsPropertyResource, dashboardsResource) {
    var vm = this;
    var intervals = [];
    vm.loading = {dashboard: true};
    vm.resource = dashboardsResource.get({
        'resourceId': $state.params.resourceId
    }, function (data) {
        vm.loading.dashboard = false;
        vm.resource.layoutConfig = data.layout_config;
        vm.resource.chartConfig = data.chart_config;
        vm.resource.chartData = {};
        for (var chartId in vm.resource.chartConfig) {
            var chartConf = {
                name: '',
                chartId: chartId,
                loading: true,
                refreshing: false,
                data: {},
                config: {},
                fetchFunc: function () {
                    var self = this;
                    self.refreshing = true;
                    console.log('chartId', self, self.chartId);
                    chartsPropertyResource.get({
                        'key': 'data',
                        'chartId': self.chartId
                    }, function (data) {
                        if (typeof data.series == 'undefined'){
                            return false;
                        }
                        var result = chartResultParser(data);
                        self.name = data.name;
                        self.data = result.chartC3Data;
                        self.config = result.chartC3Config;
                        self.loading = false;
                        self.refreshing = false;
                    });
                },
                iv: null
            };
            chartConf.fetchFunc();
            var iv = $interval(
                angular.bind(chartConf, chartConf.fetchFunc), 30000);

            vm.resource.chartData[chartId] = chartConf;
            intervals.push(iv);
        };
        console.log('vm.chartData', vm.resource.chartData);
    });

    $scope.$on('$locationChangeSuccess', function () {
        console.info('clearing intervals');
        _.each(intervals, function(iv){
            $interval.cancel(iv);
        });
    });

}
