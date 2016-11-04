/*
 * Your installation or use of this SugarCRM file is subject to the applicable
 * terms available at
 * http://support.sugarcrm.com/06_Customer_Center/10_Master_Subscription_Agreements/.
 * If you do not agree to all of the applicable terms or do not have the
 * authority to bind the entity as an authorized representative, then do not
 * install or use this SugarCRM file.
 *
 * Copyright (C) SugarCRM Inc. All rights reserved.
 */
({
    extendsFrom: 'ChartField',
    chart_loaded: false, chart: null, chartType: '',
    generateD3Chart: function () {
        var self = this, chart, chartId = this.cid, chartData = this.model.get('rawChartData'), chartParams = this.model.get('rawChartParams') || {}, chartConfig = this.getChartConfig(chartData), reportData = this.model.get('rawReportData'), params = {
            contentEl: chartId,
            minColumnWidth: 120,
            margin: {top: 0, right: 10, bottom: 10, left: 10},
            allowScroll: true,
            overflowHandler: _.bind(this.overflowHandler, this)
        };
        if (!_.isEmpty(chartParams)) {
            params = _.extend(params, chartParams);
            chartData.properties[0].type = chartParams.chart_type;
            chartConfig = this.getChartConfig(chartData);
        }
        chartConfig['direction'] = app.lang.direction;
        chart = new loadSugarChart(chartId, chartData, [], chartConfig, params, _.bind(function (chart) {
            self.chart = chart;
            self.chart_loaded = _.isFunction(this.chart.update);
            self.chartData = chartData;
            self.chartConfig = chartConfig;
            self.chartParams = params;

            //Setup drill-down
            self.initColumnClick(self, chart);

            //Ensure drill-down works after legend clicks
            d3.selectAll("div#"+ chart.id() +" .nv-series").each(function(d,i){
                var oldOnClick = this.__onclick;
                var chartID = chart.id();
                this.onclick = function(event){
                    eval(oldOnClick);
                   self.initColumnClick(self, chart);
                };
            });
        }, this));
        app.events.on('preview:close', function () {
            if (_.isUndefined(app.drawer) || app.drawer.isActive(this.$el)) {
                this.resize();
            }
        }, this);
        this.view.layout.on('dashlet:collapse', function (collapse) {
            if (!collapse) {
                this.resize();
            }
        }, this);
        this.view.layout.context.on('dashlet:draggable:stop', function () {
            this.resize();
        }, this);
        $(window).on('resize.' + this.sfId, _.debounce(_.bind(this.resize, this), 100));
        this.handlePrinting('on');
        this.$('.nv-chart').on('click', _.bind(function (e) {
            this.chart.dispatch.chartClick();
        }, this));
    },
    initColumnClick: function(self, chart) {
        d3.selectAll("div#"+ chart.id() +" .nv-bar").on('click',function(event) {
            window.clickedLabel = [];

            var idx = event.x - 1;
            if (!_.isUndefined(self.chartData.values[idx].label) && !_.isArray(self.chartData.values[idx].label)) {
                window.clickedLabel.push(self.chartData.values[idx].label);
            }
            window.clickedLabel.push(self.chartData.label[event.series]);
            var url = app.api.buildURL('Reports/' + self.chartParams.saved_report_id);
            app.api.call('read', url, null, {
                success: function (response) {
                    var content = JSON.parse(response.content);
                    var metadata = app.metadata.getModule(content.module);
                    var operators = app.metadata.getFilterOperators(content.module);

                    var tmpFilter = [];
                    _.each(content.group_defs, function (el, key) {
                        var field = '';

                        switch (el.label) {
                            case "Team Name":
                                field = "team_name";
                                break;
                            case "User Name":
                                field = "assigned_user_name";

                                var get_args = {
                                    'filter': [
                                        {"user_name": window.clickedLabel[key]}
                                    ]
                                }

                                app.api.call('read', app.api.buildURL('Users', null, null, get_args), null, {
                                    success: function (data) {
                                        window.clickedLabel[key] = data.records[0].id;
                                    }
                                }, {async: false});

                                break;
                            default:
                                field = el.name;
                                break;
                        }

                        var searchValue = window.clickedLabel[key];
                        var fieldType = metadata.fields[field].type;

                        var selectedIndex = window.clickedLabel[key]
                        if (!_.isEmpty(metadata.fields[field].options)) {
                            var optionsList = app.lang.getAppListStrings(metadata.fields[field].options);
                            _.each(optionsList, function(listVal, listKey) {
                                if (listVal == window.clickedLabel[key]) {
                                    selectedIndex = listKey;
                                    return false;
                                }
                            });
                        }

                        var fieldOperator = _.keys(operators[fieldType]);
                        if (field == 'assigned_user_name') {
                            field = 'assigned_user_id';
                        }

                        if(fieldType == 'date' || fieldType == 'datetime' || fieldType == 'datetimecombo') {
                            if (el.column_function == "month") {
                                var searchDate = app.date(searchValue);

                                var startDate = searchDate.calendar();
                                var endDate = searchDate.endOf('month').calendar();

                                fieldOperator = ["$gte", "$lte"];
                            }
                        }

                        var tmp = {};
                        tmp[field] = {};
                        if (fieldOperator[0] == '$equals') {
                            tmp[field][fieldOperator[0]] = selectedIndex;
                        } else if (fieldOperator[0] == '$gte' && fieldOperator[1] == '$lte' && fieldOperator.length == 2) {
                            tmp[field][fieldOperator[0]] = startDate;
                            tmp[field][fieldOperator[1]] = endDate;
                        } else {
                            tmp[field][fieldOperator[0]] = [selectedIndex];
                        }

                        tmpFilter.push(tmp);
                    });

                    $("div.tooltip.xy-tooltip").remove();
                    app.user.lastState.set(response.module + ':filter:last-' + response.module + '-records', "from_report");

                    var data = {};
                    data.report_id = self.chartParams.saved_report_id;
                    data.filter = JSON.stringify(tmpFilter);

                    var cacheUrl = app.api.buildURL('SaveFilterToCache');
                    app.api.call('create', cacheUrl, data, {
                        success: function () {
                            app.router.navigate('#' + response.module, {trigger: true});
                        }
                    });
                }
            });
        });
    }
})