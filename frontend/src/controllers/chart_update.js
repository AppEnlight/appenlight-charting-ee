// # Published under Commercial License.
// # Read the full license text at https://rhodecode.com/licenses.

angular.module('appenlight.controllers')
    .controller('DashboardChartUpdateController', DashboardChartUpdateController)

DashboardChartUpdateController.$inject = ['$state', '$uibModal',
    '_', 'chartResultParser', 'dashboardsResource', 'chartsResource',
    'chartsPropertyResource', 'sectionViewResource', 'AeUser', 'AeConfig'];

function DashboardChartUpdateController($state, $uibModal, _, chartResultParser, dashboardsResource, chartsResource, chartsPropertyResource, sectionViewResource, AeUser, AeConfig) {
    var vm = this;
    vm.applications = AeUser.applications_map;
    vm.loading = {dashboard: true};
    vm._ = _;
    // holds interval options for time histogram
    vm.timeOptions = {};
    var allowed = ['1m','5m', '30m', '1h', '4h',
        '12h', '24h', '3d', '1w', '2w', '1M'];
    _.each(allowed, function (key) {
        if (allowed.indexOf(key) !== -1) {
            vm.timeOptions[key] = AeConfig.timeOptions[key];
        }
    });
    vm.commonTags = [];
    vm.commonNamespaces = [];
    vm.commonValues = {};

    // information on how much in past should we look for
    vm.timeRanges = AeConfig.timeOptions;

    vm.startMoments = {
        week_end: 'Week end',
        month_end: 'Month end',
        day_end: 'Today (Day end)',
        now: 'Visit time'
    };

    vm.startMomentUnit = {
        minutes: 'Minutes',
        hours: 'Hours',
        days: "Days",
        months: "Months"
    };

    vm.dataSources = {
        'logs': 'Log entries',
        'metrics': 'Metrics',
    }

    console.log('timeOptions', vm.timeOptions);

    /**
     * Removes keys in toChangeObject that don't exist in defaultObject
     * also set missing keys from defaultObject
     * @param toChangeObject
     * @param defaultObject
     */
    var setDefaultFromObject = function (toChangeObject, defaultObject) {
        var neededKeys = _.keys(defaultObject.config);
        neededKeys.push('field');
        console.log(neededKeys);
        /* config section START */

        // remove unneeded keys
        _.each(_.keys(toChangeObject.config), function (key) {
            if (neededKeys.indexOf(key) === -1 && key != 'label') {
                console.log('removing ' + key);
                delete toChangeObject.config[key];
            }
        });
        // add needed keys
        _.each(neededKeys, function (key) {
            if (!toChangeObject.config[key] && defaultObject.config[key]) {
                toChangeObject.config[key] = defaultObject.config[key];
            }
        });

        /* config section END */

        console.debug('disabling deepAggs', defaultObject);
        if (defaultObject.uiSettings) {
            if (!defaultObject.uiSettings.deepAggs) {
                console.debug('disabling deepAggs OK');
                toChangeObject.deepAggEnabled = false;
            }
        }

        console.log(toChangeObject);
    };

    /**
     * Used to generate aggregation identifiers
     * @type {number}
     */
    var id_counter = 0;

    vm.metricFilterTypes = [
        {type: 'tag', name: 'Tag'},
        {type: 'namespace', name: 'Namespace'},
        {type: 'level', name: 'Level'}
    ];

    vm.filterChange = function(filter){
        filter.value = '';
    }

    vm.chartTypes = [
        {type: 'bar', name: 'Bar Chart'},
        {type: 'line', name: 'Line Chart'},
        {type: 'area', name: 'Area Chart'},
        {type: 'step', name: 'Step Chart'},
        {type: 'pie', name: 'Pie Chart'},
        {type: 'donut', name: 'Donut Chart'},
        {type: 'gauge', name: 'Gauge Chart'},
    ];

    vm.operators = [
        ['eq', '='],
        ['gt', '>'],
        ['gte', '>='],
        ['lt', '<'],
        ['lte', '<=']
    ];

    vm.ar_operators = [
        ['+', '+'],
        ['-', '-'],
        ['*', '*'],
        ['/', '/'],
    ];

    /**
     * Usd to form main buckets in the response
     */
    vm.aggTypes = [
        {type: null, name: 'No', config: {interval: null}},
        {
            type: 'time_histogram', name: 'Timeseries histogram',
            config: {
                interval: '24h',
                order_by: null
            }
        },
        //{
        //    type: 'histogram', name: 'Histogram',
        //    config: {
        //        interval: 500,
        //        order_by: null
        //    }
        //},
        {
            type: 'terms', name: 'Terms',
            config: {
                size: 10,
                order_by: null
            }
        },
        //{
        //    type: 'range', name: 'Range',
        //    config: {
        //        ranges: [
        //            {"to": 50},
        //            {"from": 50, "to": 100},
        //            {"from": 100}
        //        ],
        //        order_by: null
        //    }
        //},
        //{
        //    type: 'date_range', name: 'Date range',
        //    config: {
        //        ranges: [
        //            {"to": "now-10M/M"},
        //            {"from": "now-10M/M"}
        //        ],
        //        order_by: null
        //    }
        //},
    ];

    /**
     * Used to form metrics for separate resultset buckets
     */
    vm.subAggTypes = [
        {
            type: 'terms',
            name: 'Term names',
            config: {size: 10},
            uiSettings: {'deepAggs': true}
        },
        {
            type: 'percentiles',
            name: 'Percentiles',
            config: {},
            uiSettings: {'deepAggs': false}
        },
        {
            type: 'min',
            name: 'Minimum',
            config: {},
            uiSettings: {'deepAggs': false}
        },
        {
            type: 'max',
            name: 'Maximum',
            config: {},
            uiSettings: {'deepAggs': false}
        },
        {
            type: 'sum',
            name: 'Sum',
            config: {},
            uiSettings: {'deepAggs': false}
        },
        {
            type: 'avg',
            name: 'Average',
            config: {},
            uiSettings: {'deepAggs': false}
        },
        //{type: 'stats', name: 'Stats', config:{}},
        //{type: 'extended_stats', name: 'Extended Stats', config:{}},
        //{type: 'range', name: 'Range', config:{}},
        {type: 'value_count', name: 'Value Count', config: {}},
        {type: 'cardinality', name: 'Cardinality', config: {}}
    ];

    vm.subDeepAggTypes = [
        {type: 'min', name: 'Minimum', config: {}},
        {type: 'max', name: 'Maximum', config: {}},
        {type: 'sum', name: 'Sum'},
        {type: 'avg', name: 'Average', config: {}},
        {type: 'value_count', name: 'Value Count', config: {}},
        {type: 'cardinality', name: 'Cardinality', config: {}}
    ]

    /**
     *
     * Allows to set different grouping of elements, currently unused
     */
    vm.groupingTypes = [
        {type: null, name: 'None'},
        {type: 'namespace', name: 'Namespace'},
        {type: 'tag', name: 'Tag'},
    ];


    vm.postProcessTypes = [
        {type: 'acumulate', name: 'Acumulated', config: {}},
    ]

    /**
     *
     * Holds the models for formbuilding
     */
    vm.forms = {
        sub_agg: {
            type: vm.subAggTypes[0].type,
            field: '',
            deepAgg: null,
            computed: false,
            computed_fields: []
        }
    }
    /**
     *
     * Main json config that will be sent to backend
     */
    vm.chartConfig = {
        resource: AeUser.applications[0].resource_id,
        datasource: 'logs',
        timeRange: '1M',
        startMoment: 'now',
        startMomentValue: 0,
        startMomentUnit: 'days',
        parentAgg: {type: vm.aggTypes[0].type, config: {}},
        chartType: {type: vm.chartTypes[0].type, config: {}},
        postProcess: {type: null, config:{}},
        aggs: []
    };
    vm.name = '';
    vm.dashboard = null;

    dashboardsResource.get({
        'resourceId': $state.params.resourceId
    }, function (data) {
        vm.loading.dashboard = false;
        vm.dashboard = data;
        var idList = [];
        vm.name = data.chart_config[$state.params.chartId].name;
        if (data.chart_config[$state.params.chartId].config != null) {
            vm.chartConfig = data.chart_config[$state.params.chartId].config;
            // convert old data format
            vm.chartConfig['resource'] = Number(vm.chartConfig['resource']);
            _.each(vm.chartConfig.aggs, function (agg) {
                pregenerateFormData(agg.id);
                try {
                    idList.push(Number(agg.id))
                } catch (exc) {
                    console.log(exc);
                }
            })

        }
        else{
            vm.addAggregation();
        }
        // set the counter to max id so we can modify loaded definitions
        if (!_.isEmpty(idList)) {
            id_counter = _.max(idList) + 1;
        }
        console.log(idList);
        vm.getCommonKeys();
    });

    /**
     *
     * Holds loading indicators state
     */
    vm.isLoading = {
        series: true
    }


    /**
     * Sets up default model values for form controls
     * @param aggId
     */
    var pregenerateFormData = function (aggId) {
        _.each([aggId, 'd' + aggId], function (fId) {
            vm.forms[fId] = {
                name: '',
                value: '',
                op: vm.operators[0][0],
                computed_op: vm.ar_operators[0][0],
                computed_field: ''
            };
        });
    };

    /**
     * Adds a metric to "main" aggregation buckets so if you have
     * a time histogram selected you specify additional aggregations
     * to be performed in every time interval
     */
    vm.addAggregation = function () {
        var aggId = (id_counter++).toString();
        var aggConfig = {
            'id': aggId,
            'type': vm.forms.sub_agg.type,
            'grouping': false,
            'computed': false,
            'computed_fields': [
                {'op': null, 'field': vm.forms.sub_agg.field}
            ],
            'filters': [],
            'deepAggEnabled': false,
            'deepAgg': {
                'id': 'd' + aggId,
                'type': vm.subDeepAggTypes[2].type,
                'computed': false,
                'computed_fields': [
                    {'op': null, 'field': vm.forms.sub_agg.field}
                ],
                'filters': [],
                'config': {
                    'field': vm.forms.sub_agg.field
                }
            },
            'config': {
                'field': vm.forms.sub_agg.field
            }
        };
        vm.chartConfig.aggs.push(aggConfig)
        vm.forms.sub_agg.type = vm.subAggTypes[0].type;
        vm.forms.sub_agg.field = '';
        // add default data for form models that could be used later
        // in generated UI
        pregenerateFormData(aggId);
    };

    // if field type changes set the default config values, leaving out the values
    // we want
    vm.AggTypeChanged = function (agg, agg_defaults) {
        var defaultObject = _.find(agg_defaults, function (item) {
            return item.type === agg.type
        });
        setDefaultFromObject(agg, defaultObject);
    }

    vm.setComputed = function (agg) {
        agg.computed = !agg.computed;
        if (agg.computed) {
            agg.deepAggEnabled = false;
        }
    }

    vm.setDeepAgg = function (agg) {
        agg.deepAggEnabled = !agg.deepAggEnabled;
        if (agg.deepAggEnabled) {
            agg.computed = false;
        }
    }

    /**
     * Adds a field to aggregation that will be used in computing the
     * value out of multiple fields/values
     * @param agg - aggregation this has effect on
     */
    vm.addComputedField = function (agg) {
        agg.computed_fields.push(
            {
                op: vm.forms[agg.id].computed_op,
                field: vm.forms[agg.id].computed_field
            }
        );
        vm.forms[agg.id].computed_field = '';
    }
    /**
     * Removes one of the fields that are being computed on
     * @param agg - aggregation this has effect on
     * @param field - the field we want to remove
     */
    vm.removeComputedField = function (agg, field) {
        agg.computed_fields = _.filter(agg.computed_fields, function (item) {
            return item != field;
        });
    }

    /**
     * Changes default elasticsearch ordering from doc_count to value
     * of specific metric - for parent bucket
     * @param agg - aggregation this has effect on
     */
    vm.setParentBucketOrdering = function (agg) {

        var aggConfig = vm.chartConfig.parentAgg.config;

        if (aggConfig.order_by == null ||
            aggConfig.order_by.agg != agg.id) {
            aggConfig.order_by = {
                agg: agg.id,
                order: 'asc'
            }
        }
        else if (aggConfig.order_by.agg == agg.id &&
            aggConfig.order_by.order == 'asc'
        ) {
            aggConfig.order_by.order = 'desc'
        }
        else {
            aggConfig.order_by = null;
        }
    }
    /**
     * For charting - the specific metric's names after being backend
     * generated will be returned as grouping lists
     * @param agg - aggregation this has effect on
     */
    vm.setAggregationGrouping = function (agg) {
        agg.grouping = !agg.grouping;
    }

    /**
     * Removes specific aggregation from parent buckets
     * @param agg - aggregation this has effect on
     */
    vm.removeAggregation = function (agg) {
        vm.chartConfig.aggs = _.filter(vm.chartConfig.aggs, function (item) {
            return item != agg;
        });

        var aggConfig = vm.chartConfig.parentAgg.config;

        // reset order if aggregation gets removes
        if (aggConfig.order_by && aggConfig.order_by.agg == agg.id) {
            aggConfig.order_by = null;
        }

    }

    /**
     * Adds a filter to specific metric aggregation
     * @param agg - aggregation this has effect on
     */
    vm.addFilterToAgg = function (agg) {
        agg.filters.push({
            type: 'tag',
            name: vm.forms[agg.id].name,
            value: vm.forms[agg.id].value.toString(),
            op: vm.forms[agg.id].op
        });
    };

    /**
     * Removes a filter from specific metric aggregation
     * @param agg - aggregation this has effect on
     * @param filter - the filter that should be removed
     */
    vm.removeFilterFromAgg = function (agg, filter) {
        agg.filters = _.filter(agg.filters, function (item) {
            return item != filter;
        });
    }

    vm.saveChartData = function () {
        chartsResource.update({
            'chartId': $state.params.chartId
        }, {
            name: vm.name,
            config: vm.chartConfig
        }, function (data) {
            console.log(data);
        });
    };

    vm.testChartData = function () {
        vm.chartC3Config = {};
        vm.chartC3Data = {};

        vm.isLoading.series = true;
        chartsPropertyResource.save({
            key: 'data_test_config',
            'chartId': $state.params.chartId
        }, vm.chartConfig, function (data) {
            if (typeof data.series == 'undefined'){
                return false;
            }
            result = chartResultParser(data);
            vm.chartC3Data = result.chartC3Data;
            vm.chartC3Config = result.chartC3Config;
            console.log(vm.chartC3Config);
            // render the chart
            vm.isLoading.series = false;
        });
    }

    /**
     * Fetches most commonly used tags in logs
     */
    vm.getCommonKeys = function () {
        sectionViewResource.get({
            section: 'logs_section',
            view: 'common_tags',
            datasource: vm.chartConfig.datasource,
            resource: vm.chartConfig.resource
        }, function (data) {
            vm.commonTags = data['tags']
            vm.commonNamespaces = data['namespaces']
        });
    };

    vm.getCommonValues = function(agg, filterVal){
        var namespaces = [];
        _.each(agg.filters, function(item){
            if (item.type == 'namespace'){
                namespaces.push(item.value);
            }
        });
        console.log(namespaces);
        if (filterVal.op === 'eq' && filterVal.type === 'tag'){
            sectionViewResource.get({
                section: 'logs_section',
                view: 'common_values',
                datasource: vm.chartConfig.datasource,
                resource: vm.chartConfig.resource,
                namespace: namespaces,
                tag: filterVal.name
            }, function (data) {
                var key = agg.id + '.' + filterVal.name;
                vm.commonValues[key] = data.values;

            });
        }
    }

    vm.showJSON = function(){
        var opts = {
            backdrop: 'static',
            templateUrl: 'chartUpdateJSONConfig.html',
            controller: 'chartUpdateJSONConfigCtrl as ctrl',
            size: 'lg',
            bindToController: true,
            resolve: {
                parent: function () {
                    return vm;
                }
            }
        };
        var modalInstance = $uibModal.open(opts);
        modalInstance.result.then(function (report) {

        }, function () {
            console.info('Modal dismissed at: ' + new Date());
        });
    }

}

angular.module('appenlight.controllers')
    .controller('chartUpdateJSONConfigCtrl', chartUpdateJSONConfigCtrl);

chartUpdateJSONConfigCtrl.$inject = ['$uibModalInstance', 'parent'];

function chartUpdateJSONConfigCtrl($uibModalInstance, parent) {
    var vm = this;
    vm.jsonConfig = angular.toJson(parent.chartConfig, true);
    vm.ok = function () {
        parent.chartConfig = angular.fromJson(vm.jsonConfig);
        $uibModalInstance.dismiss('cancel');
    };
    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
