// # Published under Commercial License.
// # Read the full license text at https://rhodecode.com/licenses.

    angular.module('appenlight.controllers')
    .controller('DashboardChartAlertCreateController', DashboardChartAlertCreateController)

DashboardChartAlertCreateController.$inject = [
    '$state', 'chartResultParser', 'dashboardsResource', 'chartsPropertyResource', 'chartEventRulesNoIdResource', 'userSelfPropertyResource'
];

function DashboardChartAlertCreateController($state, chartResultParser, dashboardsResource, chartsPropertyResource, chartEventRulesNoIdResource, userSelfPropertyResource) {
    var vm = this;

    var allOps = {
        'eq': 'Equal',
        'ne': 'Not equal',
        'ge': 'Greater or equal',
        'gt': 'Greater than',
        'le': 'Lesser or equal',
        'lt': 'Lesser than',
        'startswith': 'Starts with',
        'endswith': 'Ends with',
        'contains': 'Contains'
    };

    var fieldOps = {};

    var possibleFields = {
        '__AND__': 'All met (composite rule)',
        '__OR__': 'One met (composite rule)'
    };

    vm.ruleDefinitions = {
        fieldOps: fieldOps,
        allOps: allOps,
        possibleFields: possibleFields
    };


    vm.name = '',

    vm.defaultRule = {
        "field": "__AND__",
        "rules": [
            {
                op: "gt",
                field: null
            }
        ]
    };
    vm.result = null;


    vm.createRule = function () {
        chartEventRulesNoIdResource.save(
            {'chart_id': $state.params.chartId},
            {
                chart_id: $state.params.chartId,
                name: vm.name,
                rule: vm.defaultRule,
                mappings: vm.result.system_labels
            },
            function (data) {
                console.log(data);
                vm.actions.push(data);
            }
        );
    };

    vm.previewRule = function () {

        var postData = {
            chart_id: $state.params.chartId,
            name: vm.name,
            rule: vm.defaultRule,
            mappings: vm.result.system_labels
        };

        chartsPropertyResource.save({
                key: 'data_rule_config',
                chartId: $state.params.chartId,
            }, postData
            , function (data) {
                if (typeof data.series == 'undefined') {
                    return false;
                }
                result = chartResultParser(data);
                vm.chartC3Data = result.chartC3Data;
                vm.chartC3Config = result.chartC3Config;
                vm.labelPairs = _.pairs(data.system_labels);
                vm.result = data;
                _.each(vm.labelPairs, function (entry) {
                    possibleFields[entry[0]] = entry[1].human_label;
                    fieldOps[entry[0]] = ['ge','gt', 'lt', 'le', 'eq'];
                });

                if (vm.labelPairs.length > 0) {
                    vm.defaultRule.rules[0].field = vm.labelPairs[0][0];
                }
                vm.loading.series = false;

            });

    };

    vm.dataLoaded = function () {
        return _.every(_.values(vm.loading), function (x) {
            return x === false
        });
    };

    /**
     *
     * Holds loading indicators state
     */
    vm.loading = {
        dashboard: true,
        series: true,
        rules: true,
        channels: true
    };

    vm.actions = chartEventRulesNoIdResource.query(
        {'chart_id': $state.params.chartId},
        function (data) {
            console.log(data);
            vm.loading.rules = false;
        }
    );

    dashboardsResource.get({
        'resourceId': $state.params.resourceId
    }, function (data) {
        vm.loading.dashboard = false;
        vm.resource = data;
        vm.chartConfig = data.chart_config[$state.params.chartId];
        chartsPropertyResource.get({
            key: 'data',
            'chartId': $state.params.chartId
        }, function (data) {
            if (typeof data.series == 'undefined') {
                return false;
            }
            result = chartResultParser(data);
            vm.chartC3Data = result.chartC3Data;
            vm.chartC3Config = result.chartC3Config;
            vm.labelPairs = _.pairs(data.system_labels);
            vm.result = data;
            _.each(vm.labelPairs, function (entry) {
                possibleFields[entry[0]] = entry[1].human_label;
                fieldOps[entry[0]] = ['ge','gt', 'lt', 'le', 'eq'];
            });

            if (vm.labelPairs.length > 0) {
                vm.defaultRule.rules[0].field = vm.labelPairs[0][0];
            }
            vm.loading.series = false;

        });

    });

    vm.alertChannels = userSelfPropertyResource.query({key: 'alert_channels'},
        function (data) {
            vm.loading.channels = false;
        });

}
