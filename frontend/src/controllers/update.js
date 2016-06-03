// # Published under Commercial License.
// # Read the full license text at https://rhodecode.com/licenses.

angular.module('appenlight.controllers')
    .controller('DashboardUpdateController', DashboardUpdateController);

DashboardUpdateController.$inspect = ['$state',
    'stateHolder', 'UUIDProvider', '_', 'chartResultParser',
    'dashboardsResource', 'dashboardsNoIdResource', 'chartsPropertyResource'];

function DashboardUpdateController($state, stateHolder,
                                   UUIDProvider, _, chartResultParser, dashboardsResource,
                                   dashboardsNoIdResource, chartsPropertyResource) {
    var vm = this;
    vm.loading = {dashboard: false};
    vm.stateHolder = stateHolder;
    var defaultRowConfig = [
        {
            name: 'First row',
            columns: [
                {
                    saved: false,
                    name: 'Title 1 - Full Width',
                    width: 0,
                    chartId: UUIDProvider.genUUID4()
                }
            ]
        }
    ];

    determineWidth = function (row) {
        var width = 12;
        if (row.columns.length == 2) {
            width = 6
        }
        else if (row.columns.length == 3) {
            width = 4
        }
        else if (row.columns.length == 4) {
            width = 3
        }
        return width

    };

    _.each(defaultRowConfig, function (row) {
        var width = determineWidth(row);
        _.each(row.columns, function (column) {
            column.width = width;
        });
    });

    /**
     * Create defaults or fetch data
     */
    var resourceId = $state.params.resourceId;
    if (resourceId == 'new') {
        vm.resource = {
            resource_id: null,
            resource_name: 'New Title',
            layoutConfig: defaultRowConfig,
            chartConfig: {},
            chartData: {}
        }
    }
    else {
        vm.loading.dashboard = true;
        vm.resource = dashboardsResource.get({
            'resourceId': resourceId
        }, function (data) {
            vm.loading.dashboard = false;
            vm.resource.layoutConfig = data.layout_config;
            vm.resource.chartConfig = data.chart_config;
            vm.resource.chartData = {};
            _.each(vm.resource.layoutConfig, function (row) {
                _.each(row.columns, function (column) {
                    column.saved = true;
                });
            });

            console.log(data);
            for (var chartId in vm.resource.chartConfig) {
                vm.resource.chartData[chartId] = {
                    name: '',
                    loading: true,
                    data: {},
                    config: {}
                };
                // why do i need to make this a double closure?
                var gen_handler = function (chartId) {
                    var handler = function (data) {
                        if (typeof data.series == 'undefined'){
                            return false;
                        }
                        var result = chartResultParser(data);
                        vm.resource.chartData[chartId].name = data.name;
                        vm.resource.chartData[chartId].data = result.chartC3Data;
                        vm.resource.chartData[chartId].config = result.chartC3Config;
                        vm.resource.chartData[chartId].loading = false;
                    };
                    return handler;
                };
                chartsPropertyResource.get({
                    'key': 'data',
                    'chartId': chartId
                }, gen_handler(chartId));
            }
            ;
        });
    }

    vm.updateWidth = function(row){
        var width = determineWidth(row);
        _.each(row.columns, function (column) {
            column.width = width;
        });
    }

    vm.rowRemove = function (rowIx) {
        vm.resource.layoutConfig.splice(rowIx, 1);
    };

    vm.rowAdd = function () {
        console.log('rowAdd');
        if (vm.resource.layoutConfig.length < 7) {
            console.log('adding row');
            vm.resource.layoutConfig.push({
                name: "New Row",
                columns: []
            });
            vm.columnAdd(vm.resource.layoutConfig.length - 1);
        }
    };

    vm.columnRemove = function (rowIx, columnIx) {
        console.log('columnRemove', rowIx, 'column', columnIx);
        vm.resource.layoutConfig[rowIx].columns.splice(columnIx, 1);
        vm.updateWidth(vm.resource.layoutConfig[rowIx]);
    };

    vm.chartMoveLeft = function (rowIx, columnIx) {
        console.log('rowMoveLeft', rowIx, 'column', columnIx);
        if (columnIx > 0) {
            console.log('moving left');
            var next = vm.resource.layoutConfig[rowIx].columns[columnIx];
            var prev = vm.resource.layoutConfig[rowIx].columns[columnIx - 1];
            vm.resource.layoutConfig[rowIx].columns[columnIx - 1] = next;
            vm.resource.layoutConfig[rowIx].columns[columnIx] = prev;
        }
    };

    vm.chartMoveRight = function (rowIx, columnIx) {
        console.log('rowMoveRight', rowIx, 'column', columnIx);
        if (columnIx < vm.resource.layoutConfig[rowIx].columns.length - 1) {
            console.log('moving right');
            var next = vm.resource.layoutConfig[rowIx].columns[columnIx];
            var prev = vm.resource.layoutConfig[rowIx].columns[columnIx + 1];
            vm.resource.layoutConfig[rowIx].columns[columnIx + 1] = next;
            vm.resource.layoutConfig[rowIx].columns[columnIx] = prev;
        }
    };

    vm.chartMoveDown = function (rowIx, columnIx) {
        console.log('chartMoveDown', rowIx, 'column', columnIx);
        var tmpIx = rowIx;
        var orgRow = vm.resource.layoutConfig[rowIx];
        var movedCol = orgRow.columns[columnIx];
        console.log('moving', movedCol);
        while (true) {
            tmpIx++;
            console.log(tmpIx);
            if (tmpIx + 1 > vm.resource.layoutConfig.length) {
                break
            }
            var testedRow = vm.resource.layoutConfig[tmpIx];
            console.log('length', testedRow.columns.length, testedRow);
            if (testedRow.columns.length < 4) {
                console.log('ok to move ', testedRow);
                vm.resource.layoutConfig[rowIx].columns.splice(columnIx, 1);
                testedRow.columns.push(movedCol);
                vm.updateWidth(testedRow);
                vm.updateWidth(orgRow);
                break;
            }
        }

    };

    vm.chartMoveUp = function (rowIx, columnIx) {
        console.log('chartMoveUp', rowIx, 'column', columnIx);
        var tmpIx = rowIx;
        var orgRow = vm.resource.layoutConfig[rowIx];
        var movedCol = orgRow.columns[columnIx];
        console.log('moving', movedCol);
        while (true) {
            tmpIx--;
            console.log(tmpIx);
            if (tmpIx < 0) {
                break
            }
            var testedRow = vm.resource.layoutConfig[tmpIx];
            console.log('length', testedRow.columns.length, testedRow);
            if (testedRow.columns.length < 4) {
                console.log('ok to move ', testedRow);
                vm.resource.layoutConfig[rowIx].columns.splice(columnIx, 1);
                testedRow.columns.push(movedCol);
                vm.updateWidth(testedRow);
                vm.updateWidth(orgRow);
                break;
            }
        }
    };


    vm.columnAdd = function (rowIx) {
        console.log('columnAdd', rowIx);
        if (vm.resource.layoutConfig[rowIx].columns.length < 4) {
            vm.resource.layoutConfig[rowIx].columns.push({
                name: "New Column",
                width: 0,
                chartId: UUIDProvider.genUUID4()
            });
            vm.updateWidth(vm.resource.layoutConfig[rowIx]);
        }
    };

    vm.dashboardRemove = function () {
        dashboardsResource.delete({
            resourceId: resourceId
        }, {}, function (data) {
            $state.go('dashboard.list');
        });
    };

    vm.saveForm = function () {
        var postData = {
            resource_name: vm.resource.resource_name,
            layout_config: vm.resource.layoutConfig
        };
        console.log(postData);
        if (vm.resource.resource_id === null) {
            dashboardsNoIdResource.save({}, postData, function (data) {
                $state.go('dashboard.update', {resourceId: data.resource_id});
            });
        }
        else {
            console.log('update');
            dashboardsResource.update({
                resourceId: vm.resource.resource_id
            }, postData, function (data) {
                _.each(vm.resource.layoutConfig, function (row) {
                    _.each(row.columns, function (column) {
                        column.saved = true;
                    });
                });
            });
        }
    };

    vm.editChart = function (column) {
        $state.go('dashboard.chart', {
            resourceId: vm.resource.resource_id,
            chartId: column.chartId
        })
    }

    vm.editChartAlert = function (column) {
        $state.go('dashboard.chart_alert', {
            resourceId: vm.resource.resource_id,
            chartId: column.chartId
        })
    }

}
