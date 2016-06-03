angular.module('appenlight.templates').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/ae_charting_ee/templates/dashboards/alert_create.html',
    "<ng-include src=\"'templates/loader.html'\" ng-if=\"!alert_ctrlr.dataLoaded()\"></ng-include>\n" +
    "\n" +
    "<div ng-if=\"alert_ctrlr.dataLoaded()\">\n" +
    "    <div class=\"panel panel-default\">\n" +
    "        <div class=\"panel-body\">\n" +
    "            <c3chart data-domid=\"chart\" data-data=\"alert_ctrlr.chartC3Data\" data-config=\"alert_ctrlr.chartC3Config\">\n" +
    "            </c3chart>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"panel panel-default\">\n" +
    "        <div class=\"panel-body\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <label>Name</label><input class=\"form-control\" type=\"text\" ng-model=\"alert_ctrlr.name\" placeholder=\"Name of your rule\">\n" +
    "            </div>\n" +
    "            <rule rule=\"alert_ctrlr.defaultRule\" rule-definitions=\"alert_ctrlr.ruleDefinitions\" parent-rule=\"null\" parent-obj=\"null\" config=\"{disable_subrules:false}\"></rule>\n" +
    "            <a class=\"btn btn-info\" ng-click=\"alert_ctrlr.previewRule()\">Preview Rule</a>\n" +
    "            <a class=\"btn btn-success\" ng-click=\"alert_ctrlr.createRule()\">Create Rule</a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"panel panel-default\">\n" +
    "        <div class=\"panel-body\">\n" +
    "            <div ng-repeat=\"action in alert_ctrlr.actions\">\n" +
    "                <chart-alert-action action=\"action\" actions=\"alert_ctrlr.actions\" rule-definitions=\"alert_ctrlr.ruleDefinitions\" possible-channels=\"alert_ctrlr.alertChannels\"/>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/ae_charting_ee/templates/dashboards/breadcrumbs.html',
    "<ol class=\"breadcrumb\">\n" +
    "    <li>Dashboards</li>\n" +
    "    <li ng-show=\"$state.includes('dashboard.list')\" ng-class=\"{bold:$state.is('dashboard.list')}\">Dashboards list</li>\n" +
    "    <li ng-show=\"$state.includes('dashboard.update')\" ng-class=\"{bold:$state.is('dashboard.update')}\">Modify dashboard</li>\n" +
    "    <li ng-show=\"$state.includes('dashboard.chart')\" ng-class=\"{bold:$state.is('dashboard.chart')}\">Modify chart</li>\n" +
    "</ol>\n"
  );


  $templateCache.put('/ae_charting_ee/templates/dashboards/chart_update.html',
    "<script type=\"text/ng-template\" id=\"chartUpdateJSONConfig.html\">\n" +
    "\n" +
    "    <div class=\"modal-body\">\n" +
    "\n" +
    "        <textarea class=\"well\" ng-model=\"ctrl.jsonConfig\" style=\"width:100%; height: 350px\">\n" +
    "        </textarea>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button class=\"btn btn-warning\" ng-click=\"ctrl.ok()\">Load from JSON</button>\n" +
    "        <button class=\"btn btn-warning\" ng-click=\"ctrl.cancel()\">Close</button>\n" +
    "    </div>\n" +
    "</script>\n" +
    "\n" +
    "<ng-include src=\"'templates/loader.html'\" ng-if=\"chart.loading.dashboard === true\"></ng-include>\n" +
    "\n" +
    "\n" +
    "<div ng-show=\"!chart.loading.dashboard\">\n" +
    "\n" +
    "\n" +
    "    <div class=\"panel panel-default\">\n" +
    "        <div class=\"panel-heading\" ng-include=\"'/ae_charting_ee/templates/dashboards/breadcrumbs.html'\"></div>\n" +
    "        <div class=\"panel-body\">\n" +
    "            <form class=\"form-horizontal agg-form\" novalidate name=\"aggForm\">\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-3 col-lg-2\">Name:</label>\n" +
    "\n" +
    "                    <div class=\" col-sm-9 col-lg-10 form-inline\">\n" +
    "                        <input type=\"text\" name=\"name\" ng-model=\"chart.name\" class=\"form-control row-title\" placeholder=\"Chart name\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-3 col-lg-2\">Application:</label>\n" +
    "\n" +
    "                    <div class=\" col-sm-9 col-lg-10 form-inline\">\n" +
    "                        <select ng-model=\"chart.chartConfig.resource\" ng-change=\"chart.getCommonKeys()\" ng-options=\"r.resource_id as r.resource_name for r in AeUser.applications\" class=\"SelectField form-control input-sm\"></select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-3 col-lg-2\">Data source:</label>\n" +
    "\n" +
    "                    <div class=\" col-sm-9 col-lg-10 form-inline\">\n" +
    "                        <select ng-model=\"chart.chartConfig.datasource\" ng-change=\"chart.getCommonKeys()\" ng-options=\"key as value for (key, value) in chart.dataSources\" class=\"SelectField form-control input-sm\"></select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-3 col-lg-2\">Chart Type</label>\n" +
    "\n" +
    "                    <div class=\" col-sm-9 col-lg-10 form-inline\">\n" +
    "                        <select ng-model=\"chart.chartConfig.chartType.type\" ng-options=\"item.type as item.name for item in chart.chartTypes\" class=\"form-control\"></select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-3 col-lg-2\">Create data buckets with:</label>\n" +
    "\n" +
    "                    <div class=\" col-sm-9 col-lg-10 form-inline\">\n" +
    "                        <select ng-model=\"chart.chartConfig.parentAgg.type\" ng-options=\"item.type as item.name for item in chart.aggTypes\" class=\"form-control\"\n" +
    "                                ng-change=\"chart.AggTypeChanged(chart.chartConfig.parentAgg, chart.aggTypes)\"></select>\n" +
    "                        <input type=\"text\" name=\"field_label\" ng-model=\"chart.chartConfig.parentAgg.config.label\" class=\"form-control\" placeholder=\"Optional label\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "\n" +
    "                <div ng-show=\"chart.chartConfig.parentAgg.type == 'time_histogram'\" class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-3 col-lg-2\">Options</label>\n" +
    "\n" +
    "                    <div class=\" col-sm-9 col-lg-10 form-inline\">\n" +
    "                        Interval size\n" +
    "                        <select ng-model=\"chart.chartConfig.parentAgg.config.interval\" ng-options=\"i.key as i.label for i in chart.timeOptions | objectToOrderedArray:'minutes'\" class=\"form-control slim-input\"></select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div ng-show=\"chart.chartConfig.parentAgg.type == 'histogram'\" class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-3 col-lg-2\">Options</label>\n" +
    "                    HISTOGRAM\n" +
    "                </div>\n" +
    "                <div ng-show=\"chart.chartConfig.parentAgg.type == 'terms'\" class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-3 col-lg-2\">Options</label>\n" +
    "\n" +
    "                    <div class=\" col-sm-9 col-lg-10 form-inline\">\n" +
    "                        <input type=\"text\" name=\"field_name\" ng-model=\"chart.chartConfig.parentAgg.config.field\" placeholder=\"Tag field to group on\" uib-typeahead=\"tag for tag in chart.commonTags\" class=\"form-control\" autocomplete=\"off\">\n" +
    "                        Top N buckets:\n" +
    "                        <input type=\"text\" name=\"size\" ng-model=\"chart.chartConfig.parentAgg.config.size\" placeholder=\"Result size\" class=\"form-control\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                </span>\n" +
    "                <div ng-show=\"chart.chartConfig.parentAgg.type == 'range'\" class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-3 col-lg-2\">Options</label>\n" +
    "                    RANGE\n" +
    "                </div>\n" +
    "                <div ng-show=\"chart.chartConfig.parentAgg.type == 'date_range'\" class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-3 col-lg-2\">Options</label>\n" +
    "                    date RANGE\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-3 col-lg-2\">Limit data to:</label>\n" +
    "\n" +
    "                    <div class=\"col-sm-9 col-lg-10 form-inline\">\n" +
    "                        <select ng-model=\"chart.chartConfig.timeRange\" ng-options=\"i.key as i.label for i in chart.timeRanges | objectToOrderedArray:'minutes'\" class=\"form-control slim-input\"></select>\n" +
    "\n" +
    "                        till\n" +
    "\n" +
    "                        <select ng-model=\"chart.chartConfig.startMoment\" ng-options=\"key as value for (key, value) in chart.startMoments\" class=\"form-control slim-input\">\n" +
    "                        </select>\n" +
    "\n" +
    "                        minus\n" +
    "\n" +
    "                        <input type=\"text\" name=\"size\" ng-model=\"chart.chartConfig.startMomentValue\" placeholder=\"Value\" class=\"form-control slim-input\">\n" +
    "\n" +
    "                        <select ng-model=\"chart.chartConfig.startMomentUnit\" ng-options=\"key as value for (key, value) in chart.startMomentUnit\" class=\"form-control slim-input\">\n" +
    "                        </select>\n" +
    "\n" +
    "\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-3 col-lg-2\">Postprocess:</label>\n" +
    "\n" +
    "                    <div class=\"col-sm-9 col-lg-10 form-inline\">\n" +
    "                        <select ng-model=\"chart.chartConfig.postProcess.type\" ng-options=\"item.type as item.name for item in chart.postProcessTypes\" class=\"form-control\">\n" +
    "                            <option value=\"\">None</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-3 col-lg-2\">Metrics</label>\n" +
    "\n" +
    "                    <div class=\"col-sm-9 col-lg-10 form-inline\">\n" +
    "                        <div ng-repeat=\"agg in chart.chartConfig.aggs\">\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-xs-6 m-b-1\">\n" +
    "\n" +
    "                                    <div class=\"input-group\">\n" +
    "                                        <div class=\"input-group-addon\">Aggregation type</div>\n" +
    "                                        <select ng-model=\"agg.type\" ng-options=\"item.type as item.name for item in chart.subAggTypes\" class=\"form-control\" ng-change=\"chart.AggTypeChanged(agg, chart.subAggTypes)\"></select>\n" +
    "                                    </div>\n" +
    "\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"col-xs-6 text-right m-b-1\">\n" +
    "\n" +
    "                                    <a class=\"btn btn-default btn-sm\" data-uib-tooltip=\"Use computed value instead of field value\" ng-click=\"chart.setComputed(agg)\">\n" +
    "                                        <span class=\"fa fa-th-list\" style=\"{{!agg.computed ? 'opacity:0.3' : ''}}\"></span></a>\n" +
    "                                    <a ng-show=\"agg.type == 'terms'\" class=\"btn btn-default btn-sm\" data-uib-tooltip=\"Use additional aggregator to compute term value instead\" ng-click=\"chart.setDeepAgg(agg)\">\n" +
    "                                        <span class=\"fa fa-level-down\" style=\"{{!agg.deepAggEnabled ? 'opacity:0.3' : ''}}\"></span></a>\n" +
    "                                    <a class=\"btn btn-default btn-sm\" ng-click=\"chart.setAggregationGrouping(agg)\" data-uib-tooltip=\"Group values together\">\n" +
    "                                        <span class=\"fa fa-align-justify\" style=\"{{!agg.grouping ? 'opacity:0.3' : ''}}\"></span></a>\n" +
    "                                    <a class=\"btn btn-default btn-sm\" ng-click=\"chart.setParentBucketOrdering(agg)\" data-uib-tooltip=\"Sort parent buckets on this metric\">\n" +
    "                                                <span class=\"fa\" ng-class=\"{'fa-arrow-circle-down':chart.chartConfig.parentAgg.config.order_by.order == 'desc','fa-arrow-circle-up':chart.chartConfig.parentAgg.config.order_by.order != 'desc'}\"\n" +
    "                                                      style=\"{{chart.chartConfig.parentAgg.config.order_by.agg != agg.id ? 'opacity:0.3' : ''}}\"></span></a>\n" +
    "\n" +
    "\n" +
    "                                            <span class=\"dropdown pull-right\" data-uib-dropdown on-toggle=\"toggled(open)\">\n" +
    "                                                <a class=\"btn btn-danger btn-sm\" data-uib-dropdown-toggle><span class=\"fa fa-trash-o\"></span></a>\n" +
    "                                              <ul class=\"dropdown-menu\">\n" +
    "                                                  <li><a href>No</a></li>\n" +
    "                                                  <li><a href ng-click=\"chart.removeAggregation(agg)\">Yes</a></li>\n" +
    "                                              </ul>\n" +
    "                                            </span>\n" +
    "\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-xs-12\">\n" +
    "\n" +
    "                                    <div ng-show=\"agg.type == 'terms'\" class=\"m-b-1\">\n" +
    "                                        Top N buckets:\n" +
    "                                        <input type=\"text\" name=\"size\" ng-model=\"agg.config.size\" placeholder=\"Result size\" class=\"form-control\">\n" +
    "                                    </div>\n" +
    "\n" +
    "                                    <div ng-show=\"!agg.computed\">\n" +
    "                                        <span>On field</span>\n" +
    "\n" +
    "                                        <input type=\"text\" name=\"field_name\" ng-model=\"agg.config.field\" placeholder=\"Tag field to group on\" uib-typeahead=\"tag for tag in chart.commonTags\" class=\"form-control\" autocomplete=\"off\">\n" +
    "                                        <input type=\"text\" name=\"field_label\" ng-model=\"agg.config.label\" class=\"form-control\" placeholder=\"Optional label\">\n" +
    "                                    </div>\n" +
    "\n" +
    "                                                <span ng-show=\"agg.computed\">\n" +
    "                                                <div ng-repeat=\"field in agg.computed_fields\" class=\"m-b-1\">\n" +
    "\n" +
    "                                                    <span ng-show=\"$first\">On field</span>\n" +
    "                                                    <select ng-show=\"!$first\" ng-model=\"field.op\" ng-options=\"o[0] as o[1] for o in chart.ar_operators\" class=\"form-control slim-input\"></select>\n" +
    "                                                    <input type=\"text\" name=\"field_name\" ng-model=\"field.field\" placeholder=\"Tag field to group on\" uib-typeahead=\"tag for tag in chart.commonTags\" class=\"form-control\" autocomplete=“off”>\n" +
    "                                                    <input ng-show=\"$first\" type=\"text\" name=\"field_label\" ng-model=\"agg.config.label\" class=\"form-control\" placeholder=\"Optional label\">\n" +
    "\n" +
    "                                                    <a class=\"btn btn-danger\" ng-click=\"chart.removeComputedField(agg, field)\" ng-show=\"!$first\"><span class=\"fa fa-trash-o\"></span></a>\n" +
    "                                                </div>\n" +
    "\n" +
    "                                                    <a class=\"btn btn-info\" ng-click=\"chart.addComputedField(agg)\"><span class=\"fa fa-plus-circle\"></span> Add another field</a>\n" +
    "                                                </span>\n" +
    "\n" +
    "                                    <div ng-show=\"agg.deepAggEnabled\" class=\"m-t-1\">\n" +
    "                                        <!--deep agg -->\n" +
    "                                        <div class=\"input-group\">\n" +
    "                                            <div class=\"input-group-addon\">Sub-aggregation type</div>\n" +
    "                                            <select ng-model=\"agg.deepAgg.type\" ng-options=\"item.type as item.name for item in chart.subDeepAggTypes\" class=\"form-control slim-input\"\n" +
    "                                                    ng-change=\"chart.AggTypeChanged(agg.deepAgg, chart.subAggTypes)\"></select>\n" +
    "                                        </div>\n" +
    "\n" +
    "                                        <input type=\"text\" name=\"field_name\" ng-model=\"agg.deepAgg.config.field\" placeholder=\"Tag field to group on\" uib-typeahead=\"tag for tag in chart.commonTags\" class=\"form-control\" ng-show=\"!agg.deepAgg.computed\" autocomplete=“off”>\n" +
    "                                        <input type=\"text\" name=\"field_label\" ng-model=\"agg.deepAgg.config.label\" class=\"form-control\" placeholder=\"Optional label\">\n" +
    "\n" +
    "\n" +
    "                                        <a class=\"btn btn-default\" data-uib-tooltip=\"Use computed value instead of field value\" ng-click=\"chart.setComputed(agg.deepAgg)\"> <span class=\"fa fa-th-list\" style=\"{{!agg.deepAgg.computed ? 'opacity:0.3' : ''}}\"></span></a>\n" +
    "\n" +
    "                                                    <span ng-show=\"agg.deepAgg.computed\">\n" +
    "                                                            <div ng-repeat=\"field in agg.deepAgg.computed_fields\" class=\"m-t-1 m-b-1\">\n" +
    "\n" +
    "                                                                <span ng-show=\"$first\">On field</span>\n" +
    "\n" +
    "                                                                <select ng-show=\"!$first\" ng-model=\"field.op\" ng-options=\"o[0] as o[1] for o in chart.ar_operators\" class=\"form-control slim-input\"></select>\n" +
    "                                                                <input type=\"text\" name=\"field_name\" ng-model=\"field.field\" placeholder=\"Tag field to group on\" uib-typeahead=\"tag for tag in chart.commonTags\" class=\"form-control\" autocomplete=“off”>\n" +
    "\n" +
    "                                                                <a class=\"btn btn-danger\" ng-click=\"chart.removeComputedField(agg.deepAgg, field)\" ng-show=\"!$first\"><span class=\"fa fa-trash-o\"></span></a>\n" +
    "                                                            </div>\n" +
    "\n" +
    "                                                            <a class=\"btn btn-info\" ng-click=\"chart.addComputedField(agg.deepAgg)\"><span class=\"fa fa-plus-circle\"></span> Add another field</a>\n" +
    "                                                   </span>\n" +
    "\n" +
    "                                        <!--deep agg -->\n" +
    "                                    </div>\n" +
    "\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-xs-12\">\n" +
    "                                    <p class=\"m-b-1 m-t-1\">The aggregation will only use the data that matches following conditions:</p>\n" +
    "\n" +
    "                                    <div class=\"row m-b-1\" ng-repeat=\"filter in agg.filters\">\n" +
    "\n" +
    "                                        <div class=\"col-xs-11\">\n" +
    "\n" +
    "                                            <select class=\"form-control slim-input\"\n" +
    "                                                    ng-model=\"filter.type\"\n" +
    "                                                    ng-change=\"chart.filterChange(filter)\"\n" +
    "                                                    ng-options=\"item.type as item.name for item in chart.metricFilterTypes\"></select>\n" +
    "\n" +
    "\n" +
    "                                            <input type=\"text\" ng-model=\"filter.name\" ng-change=\"chart.getCommonValues(agg, filter)\" uib-typeahead=\"tag for tag in chart.commonTags\" placeholder=\"Tag name\" class=\"form-control slim-input\" ng-show=\"filter.type == 'tag'\"\n" +
    "                                                   autocomplete=\"off\"/>\n" +
    "\n" +
    "                                            <select ng-model=\"filter.op\" ng-options=\"o[0] as o[1] for o in chart.operators\" class=\"form-control slim-input\" ng-show=\"filter.type == 'tag'\"></select>\n" +
    "\n" +
    "                                            <input type=\"text\" name=\"value\" ng-model=\"filter.value\" placeholder=\"Value\" class=\"form-control\" ng-show=\"filter.type != 'namespace'\" uib-typeahead=\"val for val in chart.commonValues[agg.id + '.' + filter.name]\"/>\n" +
    "\n" +
    "                                            <input type=\"text\" name=\"value\" ng-model=\"filter.value\" placeholder=\"Namespace to filter on\" uib-typeahead=\"ns for ns in chart.commonNamespaces\" class=\"form-control\" ng-show=\"filter.type == 'namespace'\" autocomplete=\"off\">\n" +
    "\n" +
    "                                        </div>\n" +
    "                                        <div class=\"col-xs-1 text-right\">\n" +
    "                                            <a class=\"btn btn-danger\" ng-click=\"chart.removeFilterFromAgg(agg, filter)\"><span class=\"fa fa-trash-o\"></span></a>\n" +
    "                                        </div>\n" +
    "\n" +
    "                                    </div>\n" +
    "\n" +
    "                                    <div class=\"row\">\n" +
    "                                        <div class=\"col-sm-12\">\n" +
    "                                            <a class=\"btn btn-info\" ng-click=\"chart.addFilterToAgg(agg)\"><span class=\"fa fa-plus-circle\"></span> Add new rule</a>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <hr/>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"control-label col-sm-3 col-lg-2\"></label>\n" +
    "\n" +
    "                    <div class=\" col-sm-8 col-lg-10 form-inline\">\n" +
    "                        <a class=\"btn btn-info\" ng-click=\"chart.addAggregation()\">Add metric aggregation</a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"col-sm-4 col-lg-2\"></label>\n" +
    "\n" +
    "                    <div class=\" col-sm-8 col-lg-10\">\n" +
    "                        <a data-ui-sref='dashboard.update({resourceId: chart.dashboard.resource_id})' class=\"btn btn-default\"><span class=\"fa fa-arrow-circle-left\"></span> Go Back</a>\n" +
    "                        <a class=\"btn btn-info\" ng-click=\"chart.testChartData()\">Preview</a>\n" +
    "                        <a class=\"btn btn-success\" ng-click=\"chart.saveChartData()\">Save</a>\n" +
    "                        <a class=\"btn btn-default\" ng-click=\"chart.showJSON()\" data-uib-tooltip=\"Copy/Paste configs between charts\"><span class=\"fa fa-file-code-o\"> JSON</span></a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            </form>\n" +
    "\n" +
    "            <c3chart ng-if=\"!chart.isLoading.series\" data-domid=\"chart\" data-data=\"chart.chartC3Data\" data-config=\"chart.chartC3Config\">\n" +
    "            </c3chart>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('/ae_charting_ee/templates/dashboards/dashboard_update.html',
    "<div class=\"row\">\n" +
    "\n" +
    "    <div class=\"col-sm-3\" id=\"menu\">\n" +
    "\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">Manage dashboards</div>\n" +
    "            <ul class=\"list-group\">\n" +
    "                <li class=\"list-group-item\"><a data-ui-sref=\"dashboard.list\"><span class=\"fa fa-arrow-circle-left\"></span> Go Back</a></li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-sm-9\" ng-if=\"dashboards.loading.dashboard === true\">\n" +
    "        <ng-include src=\"'templates/loader.html'\"></ng-include>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-sm-9\" ng-if=\"!dashboard.loading.dashboard\">\n" +
    "\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\" ng-include=\"'/ae_charting_ee/templates/dashboards/breadcrumbs.html'\"></div>\n" +
    "            <div class=\"panel-body\">\n" +
    "\n" +
    "                <form class=\"form-horizontal chart-layout-form\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-4 col-lg-3\">Dashboard title</label>\n" +
    "                        <div class=\"col-sm-8 col-lg-9\">\n" +
    "                            <input ng-model=\"dashboard.resource.resource_name\" placeholder=\"New chart title\" class=\"form-control row-title\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-4 col-lg-3\"></label>\n" +
    "                        <div class=\"col-sm-8 col-lg-9\">\n" +
    "                            <a class=\"btn btn-info\" ng-click=\"dashboard.saveForm()\">Save</a>\n" +
    "\n" +
    "                            <span class=\"dropdown\" data-uib-dropdown on-toggle=\"toggled(open)\">\n" +
    "                                <a class=\"btn btn-danger\" data-uib-dropdown-toggle><span class=\"fa fa-trash-o\"></span></a>\n" +
    "                              <ul class=\"dropdown-menu\">\n" +
    "                                  <li><a href>No</a></li>\n" +
    "                                  <li><a href ng-click=\"dashboard.dashboardRemove(dashboard)\">Yes</a></li>\n" +
    "                              </ul>\n" +
    "                            </span>\n" +
    "\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <hr/>\n" +
    "\n" +
    "                    <div class=\"row\" ng-repeat=\"row in dashboard.resource.layoutConfig\">\n" +
    "                        <div class=\"col-sm-12\">\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-4 col-lg-3\">Row title</label>\n" +
    "                                <div class=\"col-sm-8 col-lg-9\">\n" +
    "                                    <input type=\"text\" ng-model=\"row.name\" placeholder=\"Row name\" class=\"form-control row-title\">\n" +
    "\n" +
    "                                    <a class=\"btn btn-info btn-xs\" ng-click=\"dashboard.columnAdd($index)\"><span class=\"fa fa-plus-circle\"></span> Add column</a>\n" +
    "\n" +
    "                                <span class=\"dropdown\" data-uib-dropdown on-toggle=\"toggled(open)\">\n" +
    "                                    <a class=\"btn btn-danger btn-xs\" data-uib-dropdown-toggle><span class=\"fa fa-trash-o\"></span></a>\n" +
    "                                  <ul class=\"dropdown-menu\">\n" +
    "                                      <li><a href>No</a></li>\n" +
    "                                      <li><a href ng-click=\"dashboard.rowRemove($index)\">Yes</a></li>\n" +
    "                                  </ul>\n" +
    "                                </span>\n" +
    "\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "\n" +
    "                        </div>\n" +
    "                        <div ng-repeat=\"column in row.columns\" class=\"col-sm-{{column.width}}\">\n" +
    "                            <div class=\"panel panel-default\">\n" +
    "                                <div class=\"panel-heading\">\n" +
    "                                    {{dashboard.resource.chartData[column.chartId].name}}\n" +
    "                                </div>\n" +
    "                                <div class=\"panel-body text-center\">\n" +
    "                                    <div ng-if=\"dashboard.resource.chartData[column.chartId].loading === true\">\n" +
    "                                        <ng-include src=\"'templates/loader.html'\"></ng-include>\n" +
    "                                    </div>\n" +
    "                                    <c3chart ng-if=\"dashboard.resource.chartData[column.chartId].loading === false\"\n" +
    "                                             data-domid=\"id_{{column.chartId}}\"\n" +
    "                                             data-data=\"dashboard.resource.chartData[column.chartId].data\"\n" +
    "                                             data-config=\"dashboard.resource.chartData[column.chartId].config\"\n" +
    "                                             data-resizetrigger=\"row.columns.length\"\n" +
    "                                    >\n" +
    "                                    </c3chart>\n" +
    "\n" +
    "                                    <a class=\"btn btn-primary\" ng-click=\"dashboard.editChart(column)\" ng-if=\"column.saved\">Configure chart</a>\n" +
    "                                    <a class=\"btn btn-primary\" ng-click=\"dashboard.editChartAlert(column)\" ng-if=\"column.saved\">Configure chart alerts</a>\n" +
    "\n" +
    "                                    <p ng-if=\"!column.saved\">You need to save your dashboard to configure charts</p>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"panel-footer\">\n" +
    "                                    <a class=\"btn btn-default btn-xs\" ng-click=\"dashboard.chartMoveUp($parent.$index, $index)\"><span\n" +
    "                                            class=\"fa fa-arrow-circle-up\"></span></a>\n" +
    "                                    <a class=\"btn btn-default btn-xs\" ng-click=\"dashboard.chartMoveDown($parent.$index, $index)\"><span\n" +
    "                                            class=\"fa fa-arrow-circle-down\"></span></a>\n" +
    "                                    <a class=\"btn btn-default btn-xs\" ng-click=\"dashboard.chartMoveLeft($parent.$index, $index)\"><span\n" +
    "                                            class=\"fa fa-arrow-circle-left\"></span></a>\n" +
    "                                    <a class=\"btn btn-default btn-xs\" ng-click=\"dashboard.chartMoveRight($parent.$index, $index)\"><span\n" +
    "                                            class=\"fa fa-arrow-circle-right\"></span></a>\n" +
    "\n" +
    "                                    <span class=\"dropdown\" data-uib-dropdown on-toggle=\"toggled(open)\">\n" +
    "                                      <a class=\"btn btn-danger btn-xs\" data-uib-dropdown-toggle><span class=\"fa fa-trash-o\"></span></a>\n" +
    "                                      <ul class=\"dropdown-menu\">\n" +
    "                                          <li><a href>No</a></li>\n" +
    "                                          <li><a href ng-click=\"dashboard.columnRemove($parent.$index, $index)\">Yes</a></li>\n" +
    "                                      </ul>\n" +
    "                                    </span>\n" +
    "\n" +
    "                                </div>\n" +
    "\n" +
    "                            </div>\n" +
    "\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <a class=\"btn btn-info btn-xs\" ng-click=\"dashboard.rowAdd()\"><span class=\"fa fa-plus-circle\"></span> Add row</a>\n" +
    "                </form>\n" +
    "\n" +
    "\n" +
    "                <permissions-form resource=\"dashboard.resource\" current-permissions=\"dashboard.resource.current_permissions\"\n" +
    "                                  possible-permissions=\"dashboard.resource.possible_permissions\" ng-if=\"dashboard.resource.resource_id\"></permissions-form>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n"
  );


  $templateCache.put('/ae_charting_ee/templates/dashboards/index.html',
    "<div class=\"row\">\n" +
    "    <div class=\"col-sm-3\" id=\"menu\">\n" +
    "\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">Manage dashboards</div>\n" +
    "            <ul class=\"list-group\">\n" +
    "                <li class=\"list-group-item\"><a data-ui-sref=\"dashboard.update({resourceId:'new'})\"><span class=\"fa fa-plus-circle\"></span> Create dashboard</a></li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <div class=\"col-sm-9\" ng-if=\"dashboards.loading.dashboard === true\">\n" +
    "        <ng-include src=\"'templates/loader.html'\"></ng-include>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-sm-9\" ng-if=\"!dashboards.loading.dashboard\">\n" +
    "\n" +
    "\n" +
    "        <div class=\"alert alert-success\">You can create business intelligence dashboards here, they are generated from your application log data or custom data you send to App Enlight via our <strong>logging api</strong></a>.\n" +
    "            With the help of tags you can create all kinds of information charts for your organization\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"panel panel-default\">\n" +
    "\n" +
    "            <div class=\"panel-heading\">Owned Dashboards</div>\n" +
    "\n" +
    "            <table class=\"table table-striped\">\n" +
    "                <thead>\n" +
    "                <tr>\n" +
    "                    <th class=\"resource_name\">Resource Name</th>\n" +
    "                    <th class=\"options\">Options</th>\n" +
    "                </tr>\n" +
    "                </thead>\n" +
    "                <tbody>\n" +
    "                <tr ng-repeat=\"dashboard in dashboards.owned_dashboards\">\n" +
    "                    <td>{{dashboard.resource_name}}</td>\n" +
    "                    <td>\n" +
    "                        <a class=\"btn btn-default btn-sm\" data-ui-sref='dashboard.view({resourceId: dashboard.uuid})'\n" +
    "                           data-uib-tooltip=\"View dashboard\"><span class=\"fa fa-area-chart\"></span> View</a>\n" +
    "                        <a class=\"btn btn-default btn-sm\" data-ui-sref='dashboard.update({resourceId: dashboard.resource_id})'\n" +
    "                           data-uib-tooltip=\"Update dashboard\"><span class=\"fa fa-cog\"></span> Update</a>\n" +
    "                        <a class=\"btn btn-sm\" ng-class=\"{'btn-default': !dashboard.public, 'btn-success': dashboard.public}\"\n" +
    "                           data-uib-tooltip=\"Set dashboard visibility to {{dashboard.public? 'PRIVATE': 'PUBLIC'}}\"\n" +
    "                           ng-click=\"dashboards.markPublic(dashboard)\"><span class=\"fa fa-eye\"></span></a>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"panel panel-default\">\n" +
    "\n" +
    "            <div class=\"panel-heading\">Dashboards shared with you</div>\n" +
    "\n" +
    "            <table class=\"table table-striped\">\n" +
    "                <thead>\n" +
    "                <tr>\n" +
    "                    <th class=\"resource_name\">Resource Name</th>\n" +
    "                    <th class=\"options\">Options</th>\n" +
    "                </tr>\n" +
    "                </thead>\n" +
    "                <tbody>\n" +
    "                <tr ng-repeat=\"dashboard in dashboards.viewable_dashboards\">\n" +
    "                    <td>{{dashboard.resource_name}}</td>\n" +
    "                    <td>\n" +
    "                        <a class=\"btn btn-default btn-sm\" data-ui-sref='dashboard.view({resourceId: dashboard.uuid})' data-uib-tooltip=\"View dashboard\"><span class=\"fa fa-area-chart\"></span> View</a>\n" +
    "                    <span ng-if=\"dashboard.permissions.indexOf('update') !== -1\">\n" +
    "                    <a class=\"btn btn-default btn-sm\" data-ui-sref='dashboard.update({resourceId: dashboard.resource_id})' data-uib-tooltip=\"Update dashboard\"><span class=\"fa fa-cog\"></span> Update</a>\n" +
    "                    <a class=\"btn btn-sm\" ng-class=\"{'btn-default': !dashboard.public, 'btn-success': dashboard.public}\" data-uib-tooltip=\"Set dashboard visibility to {{dashboard.public? 'PRIVATE': 'PUBLIC'}}\"\n" +
    "                       ng-click=\"dashboards.markPublic(dashboard)\"><span class=\"fa fa-eye\"></span></a>\n" +
    "                    </span>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/ae_charting_ee/templates/dashboards/parent_view.html',
    "<div ui-view></div>"
  );


  $templateCache.put('/ae_charting_ee/templates/dashboards/view.html',
    "<ng-include src=\"'templates/loader.html'\" ng-if=\"dashboard.loading.dashboard\"></ng-include>\n" +
    "\n" +
    "<div ng-if=\"dashboard.loading.dashboard === false\">\n" +
    "\n" +
    "    <div class=\"pull-right\">\n" +
    "        <a class=\"btn btn-default btn-sm\"\n" +
    "           ng-if=\"AeUser.hasContextPermission('update', dashboard.resource.current_permissions)\"\n" +
    "           data-ui-sref='dashboard.update({resourceId: dashboard.resource.resource_id})'\n" +
    "           data-uib-tooltip=\"Update dashboard\"><span class=\"fa fa-cog\"></span> Update</a>\n" +
    "\n" +
    "            <span class=\"dropdown\" data-uib-dropdown on-toggle=\"toggled(open)\" auto-close=\"disabled\" ng-if=\"dashboard.resource.public\">\n" +
    "                <a class=\"btn btn-success btn-sm\" data-uib-dropdown-toggle><span class=\"fa fa-link\"></span></a>\n" +
    "              <ul class=\"dropdown-menu\">\n" +
    "                  <li>\n" +
    "                      <div class=\"panel-body\">\n" +
    "                          <strong>Public url:</strong>\n" +
    "                          <input type=\"text\" class=\"form-control\" value=\"{{dashboard.resource.public_url}}\" style=\"width: 600px\" onclick=\"select()\" readonly=\"readonly\">\n" +
    "                      </div>\n" +
    "                  </li>\n" +
    "              </ul>\n" +
    "            </span>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <h1 class=\"text-center m-t-0\">{{dashboard.resource.resource_name}}</h1>\n" +
    "\n" +
    "    <div class=\"row\" ng-repeat=\"row in dashboard.resource.layoutConfig\">\n" +
    "        <h4 class=\"text-center\">{{row.name}}</h4>\n" +
    "        <div ng-repeat=\"column in row.columns\" class=\"col-sm-{{column.width}}\">\n" +
    "            <div class=\"panel panel-default\">\n" +
    "                <div class=\"panel-heading\">\n" +
    "                    {{dashboard.resource.chartData[column.chartId].name}}\n" +
    "                    <span ng-show=\"dashboard.resource.chartData[column.chartId].refreshing\" class=\"fa fa-2x fa-spinner pull-right fa-spin\"></span>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"panel-body text-center\">\n" +
    "                    <ng-include src=\"'templates/loader.html'\" ng-if=\"dashboard.resource.chartData[column.chartId].loading === true\"></ng-include>\n" +
    "\n" +
    "                    <c3chart ng-if=\"dashboard.resource.chartData[column.chartId].loading === false\"\n" +
    "                             update=\"true\"\n" +
    "                             data-domid=\"id_{{column.chartId}}\"\n" +
    "                             data-data=\"dashboard.resource.chartData[column.chartId].data\"\n" +
    "                             data-config=\"dashboard.resource.chartData[column.chartId].config\">\n" +
    "                    </c3chart>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('/ae_charting_ee/templates/directives/chart_alert_action.html',
    "<div class=\"panel panel-default action\">\n" +
    "    <div class=\"panel-body form-inline\">\n" +
    "        <div>\n" +
    "            <p>{{ ctrl.action.name }}</p>\n" +
    "            <p><strong>Channels:</strong></p>\n" +
    "            <ul class=\"list-group\">\n" +
    "                <li class=\"list-group-item\" ng-repeat=\"channel in ctrl.action.channels\">\n" +
    "                    <strong>{{channel.channel_visible_value}}</strong>\n" +
    "                    <div class=\"pull-right\">\n" +
    "                        <span class=\"dropdown\" data-uib-dropdown>\n" +
    "                            <a class=\"btn btn-danger btn-xs\" data-uib-dropdown-toggle><span class=\"fa fa-trash-o\"></span></a>\n" +
    "                              <ul class=\"dropdown-menu\">\n" +
    "                                  <li><a>No</a></li>\n" +
    "                                  <li><a ng-click=\"ctrl.unBindChannel(channel)\">Yes</a></li>\n" +
    "                              </ul>\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            <div class=\"form-group\" ng-if=\"ctrl.possibleChannels.length\">\n" +
    "                <select class=\"form-control\" ng-model=\"ctrl.channelToBind\" ng-options=\"c as c.channel_visible_value for c in ctrl.possibleChannels |filter: c.supports_report_alerting\"></select>\n" +
    "                <a class=\"btn btn-info\" ng-click=\"ctrl.bindChannel(channel, ctrl.action)\"><span class=\"fa fa-plus-circle\"></span> Add Channel</a>\n" +
    "            </div>\n" +
    "            <div class=\"alert alert-danger\" ng-if=\"!ctrl.possibleChannels.length\">\n" +
    "                <span class=\"fa fa-exclamation-triangle \"></span>You need to create an alert channel before you can assign it to your rule.\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <rule-read-only rule=\"ctrl.action.rule\" rule-definitions=\"ctrl.ruleDefinitions\" parent-rule=\"null\" parent-obj=\"ctrl.action\"></rule-read-only>\n" +
    "\n" +
    "\n" +
    "        <div class=\"text-right\">\n" +
    "            <span class=\"dropdown\" data-uib-dropdown>\n" +
    "                <a class=\"btn btn-danger\" data-uib-dropdown-toggle><span class=\"fa fa-trash-o\"></span></a>\n" +
    "                  <ul class=\"dropdown-menu\">\n" +
    "                      <li><a>No</a></li>\n" +
    "                      <li><a ng-click=\"ctrl.deleteAction(ctrl.action)\">Yes</a></li>\n" +
    "                  </ul>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n"
  );

}]);

;// # Published under Commercial License.
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
    
}]).run(['stateHolder', function (stateHolder) {

    
}]);

;// # Published under Commercial License.
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

;// # Published under Commercial License.
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

    

    /**
     * Removes keys in toChangeObject that don't exist in defaultObject
     * also set missing keys from defaultObject
     * @param toChangeObject
     * @param defaultObject
     */
    var setDefaultFromObject = function (toChangeObject, defaultObject) {
        var neededKeys = _.keys(defaultObject.config);
        neededKeys.push('field');
        
        /* config section START */

        // remove unneeded keys
        _.each(_.keys(toChangeObject.config), function (key) {
            if (neededKeys.indexOf(key) === -1 && key != 'label') {
                
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

        
        if (defaultObject.uiSettings) {
            if (!defaultObject.uiSettings.deepAggs) {
                
                toChangeObject.deepAggEnabled = false;
            }
        }

        
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

;// # Published under Commercial License.
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
        
        dashboardsPropertyResource.update({
            resourceId: dashboard.resource_id
        }, {'public': !dashboard.public}, function (data) {
            dashboard.public = data.public;
        });
    };

}

;// # Published under Commercial License.
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
        
        if (vm.resource.layoutConfig.length < 7) {
            
            vm.resource.layoutConfig.push({
                name: "New Row",
                columns: []
            });
            vm.columnAdd(vm.resource.layoutConfig.length - 1);
        }
    };

    vm.columnRemove = function (rowIx, columnIx) {
        
        vm.resource.layoutConfig[rowIx].columns.splice(columnIx, 1);
        vm.updateWidth(vm.resource.layoutConfig[rowIx]);
    };

    vm.chartMoveLeft = function (rowIx, columnIx) {
        
        if (columnIx > 0) {
            
            var next = vm.resource.layoutConfig[rowIx].columns[columnIx];
            var prev = vm.resource.layoutConfig[rowIx].columns[columnIx - 1];
            vm.resource.layoutConfig[rowIx].columns[columnIx - 1] = next;
            vm.resource.layoutConfig[rowIx].columns[columnIx] = prev;
        }
    };

    vm.chartMoveRight = function (rowIx, columnIx) {
        
        if (columnIx < vm.resource.layoutConfig[rowIx].columns.length - 1) {
            
            var next = vm.resource.layoutConfig[rowIx].columns[columnIx];
            var prev = vm.resource.layoutConfig[rowIx].columns[columnIx + 1];
            vm.resource.layoutConfig[rowIx].columns[columnIx + 1] = next;
            vm.resource.layoutConfig[rowIx].columns[columnIx] = prev;
        }
    };

    vm.chartMoveDown = function (rowIx, columnIx) {
        
        var tmpIx = rowIx;
        var orgRow = vm.resource.layoutConfig[rowIx];
        var movedCol = orgRow.columns[columnIx];
        
        while (true) {
            tmpIx++;
            
            if (tmpIx + 1 > vm.resource.layoutConfig.length) {
                break
            }
            var testedRow = vm.resource.layoutConfig[tmpIx];
            
            if (testedRow.columns.length < 4) {
                
                vm.resource.layoutConfig[rowIx].columns.splice(columnIx, 1);
                testedRow.columns.push(movedCol);
                vm.updateWidth(testedRow);
                vm.updateWidth(orgRow);
                break;
            }
        }

    };

    vm.chartMoveUp = function (rowIx, columnIx) {
        
        var tmpIx = rowIx;
        var orgRow = vm.resource.layoutConfig[rowIx];
        var movedCol = orgRow.columns[columnIx];
        
        while (true) {
            tmpIx--;
            
            if (tmpIx < 0) {
                break
            }
            var testedRow = vm.resource.layoutConfig[tmpIx];
            
            if (testedRow.columns.length < 4) {
                
                vm.resource.layoutConfig[rowIx].columns.splice(columnIx, 1);
                testedRow.columns.push(movedCol);
                vm.updateWidth(testedRow);
                vm.updateWidth(orgRow);
                break;
            }
        }
    };


    vm.columnAdd = function (rowIx) {
        
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
        
        if (vm.resource.resource_id === null) {
            dashboardsNoIdResource.save({}, postData, function (data) {
                $state.go('dashboard.update', {resourceId: data.resource_id});
            });
        }
        else {
            
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

;// # Published under Commercial License.
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
        
    });

    $scope.$on('$locationChangeSuccess', function () {
        console.info('clearing intervals');
        _.each(intervals, function(iv){
            $interval.cancel(iv);
        });
    });

}

;// # Published under Commercial License.
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
        
        var vm = this;

        vm.bindChannel = function(){
            var post = {
                channel_pkey: vm.channelToBind.pkey,
                action_pkey: vm.action.pkey
            };
            
            userSelfPropertyResource.save({key: 'alert_channels_actions_binds'}, post,
                function (data) {
                    vm.action.channels = [];
                    vm.action.channels = data.channels;
                }, function (response) {
                    if (response.status == 422) {
                        
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
                        
                    }
                });
        };

        vm.possibleChannels = _.filter(vm.possibleChannels, function(c){
                return c.supports_report_alerting }
        );

        if (vm.possibleChannels.length > 0){
            vm.channelToBind = vm.possibleChannels[0];
        }
        

        vm.deleteAction = function (action) {
            
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

;// # Published under Commercial License.
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
