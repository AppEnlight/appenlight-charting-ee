// # Published under Commercial License.
// # Read the full license text at https://rhodecode.com/licenses.

angular.module('appenlight.controllers')
    .controller('DashboardsIndexController', DashboardsIndexController);

DashboardsIndexController.$inject = ['dashboardsResource', 'dashboardsPropertyResource'];

function DashboardsIndexController(dashboardsNoIdResource, dashboardsPropertyResource) {
    var vm = this;
    vm.dashboards = [];
    vm.loading = {dashboard: true};
    dashboardsNoIdResource.get({}, vm.chartConfig, function (data) {
        vm.viewable_dashboards = data.viewable_dashboards;
        vm.owned_dashboards = data.owned_dashboards;
        vm.loading.dashboard = false;
    });

    vm.markPublic = function (dashboard) {
        console.log(dashboard);
        dashboardsPropertyResource.update({
            resourceId: dashboard.resource_id
        }, {'public': !dashboard.public}, function (data) {
            dashboard.public = data.public;
        });
    };

}
