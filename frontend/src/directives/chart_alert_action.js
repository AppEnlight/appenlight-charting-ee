// # Published under Commercial License.
// # Read the full license text at https://rhodecode.com/licenses.

angular.module('appenlight.plugins.ae_charting_ee.directives', []).directive('chartAlertAction', ['userSelfPropertyResource', function (userSelfPropertyResource) {
    return {
        scope: {},
        bindToController:{
            action: '=',
            applications: '=',
            possibleChannels: '=',
            actions: '=',
            ruleDefinitions: '='
        },
        restrict: 'E',
        templateUrl: '/ae_charting_ee/templates/directives/chart_alert_action.html',
        controller:chartAlertActionController,
        controllerAs:'ctrl'
    };

    function chartAlertActionController(){
        console.log('starting');
        var vm = this;

        vm.bindChannel = function(){
            var post = {
                channel_pkey: vm.channelToBind.pkey,
                action_pkey: vm.action.pkey
            };
            console.log(post);
            userSelfPropertyResource.save({key: 'alert_channels_actions_binds'}, post,
                function (data) {
                    vm.action.channels = [];
                    vm.action.channels = data.channels;
                }, function (response) {
                    if (response.status == 422) {
                        console.log('scope', response);
                    }
                });
        };

        vm.unBindChannel = function(channel){
            userSelfPropertyResource.delete({
                    key: 'alert_channels_actions_binds',
                    channel_pkey: channel.pkey,
                    action_pkey: vm.action.pkey
                },
                function (data) {
                    vm.action.channels = [];
                    vm.action.channels = data.channels;
                }, function (response) {
                    if (response.status == 422) {
                        console.log('scope', response);
                    }
                });
        };

        vm.possibleChannels = _.filter(vm.possibleChannels, function(c){
                return c.supports_report_alerting }
        );

        if (vm.possibleChannels.length > 0){
            vm.channelToBind = vm.possibleChannels[0];
        }
        console.log(vm);

        vm.deleteAction = function (action) {
            console.log('vm.deleteAction');
            var GET = {
                key: 'alert_channels_rules',
                pkey: action.pkey
            };
            userSelfPropertyResource.remove(GET, function (data) {
                vm.actions.splice(vm.actions.indexOf(action), 1);
            });

        };

    }
}]);
