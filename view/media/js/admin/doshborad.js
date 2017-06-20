/**
 * Created by admin on 2015/8/12.
 */
var doshboard = function () {
    return {
        initCharts: function () {
            if (!jQuery.plot) {
                return;
            }

            function showTooltip(title, x, y, contents) {
                $('<div id="tooltip" class="chart-tooltip"><div class="date">' + title + '<\/div><div class="label label-success">' + contents + '元<\/div>').css({
                    position: 'absolute',
                    display: 'none',
                    top: y - 100,
                    width: 75,
                    left: x - 40,
                    border: '0px solid #ccc',
                    padding: '2px 6px',
                    'background-color': '#fff',
                }).appendTo("body").fadeIn(200);
            }

            if ($('#site_statistics').size() != 0) {

                $('#site_statistics_loading').hide();
                $('#site_statistics_content').show();

                $comm.ajax({
                    "url": "/doshborad/demand/day/list",
                    "type": "get"
                }, function (err, result) {
                    var _data = [];
                    var _columname = []

                    $.each(result.data, function (index, item) {
                        _data.push([index, item.count]);
                        _columname.push([index, item.date]);
                    })

                    var plot_statistics = $.plot($("#site_statistics"),
                        [
                            {
                                data: _data
                            }
                        ],
                        {
                            series: {
                                lines: {
                                    show: true,
                                    lineWidth: 2,
                                    fill: true,
                                    fillColor: {
                                        colors: [
                                            {
                                                opacity: 0.05
                                            },
                                            {
                                                opacity: 0.01
                                            }
                                        ]
                                    }
                                },
                                points: {
                                    show: true
                                },
                                shadowSize: 2
                            },
                            grid: {
                                hoverable: true,
                                clickable: true,
                                tickColor: "#eee",
                                borderWidth: 0
                            },
                            colors: ["#d12610", "#37b7f3", "#52e136"],
                            xaxis: {
                                ticks: _columname,
                                tickDecimals: 0
                            },
                            yaxis: {
                                ticks: 6,
                                tickDecimals: 0
                            }
                        });
                });
            }

            if ($('#site_activities').size() != 0) {
                //site activities
                var previousPoint2 = null;
                $('#site_activities_loading').hide();
                $('#site_activities_content').show();

                $comm.ajax({
                    "url": "/doshborad/grad/day/list",
                    "type": "get"
                }, function (err, result) {
                    var _data = [];
                    var _columname = []

                    $.each(result.data, function (index, item) {
                        _data.push([index, item.count]);
                        _columname.push([index, item.date]);
                    })

                    var plot_activities = $.plot(
                        $("#site_activities"), [
                            {
                                data: _data,
                                color: "rgba(107,207,123, 0.9)",
                                shadowSize: 0,
                                bars: {
                                    show: true,
                                    lineWidth: 0,
                                    fill: true,
                                    fillColor: {
                                        colors: [
                                            {
                                                opacity: 1
                                            },
                                            {
                                                opacity: 1
                                            }
                                        ]
                                    }
                                }
                            }
                        ], {
                            series: {
                                bars: {
                                    show: true,
                                    barWidth: 0.9
                                }
                            },
                            grid: {
                                show: true,
                                hoverable: true,
                                clickable: false,
                                autoHighlight: true,
                                borderWidth: 0
                            },
                            yaxis: {
                                min: 0,
                                max: 20
                            },
                            xaxis: {ticks: _columname}
                        });

                });
            }

            if ($('#commission_statistics').size() != 0) {

                $('#commission_statistics_loading').hide();
                $('#commission_statistics_content').show();

                $comm.ajax({
                    "url": "/doshborad/commission/day/list",
                    "type": "get"
                }, function (err, result) {
                    var _data = [];
                    var _columname = []
                    console.log(result.data);
                    $.each(result.data, function (index, item) {
                        _data.push([index, item.count]);
                        _columname.push([index, item.date]);
                    })

                    var plot_statistics = $.plot($("#commission_statistics"),
                        [
                            {
                                data: _data
                            }
                        ],
                        {
                            series: {
                                lines: {
                                    show: true,
                                    lineWidth: 2,
                                    fill: true,
                                    fillColor: {
                                        colors: [
                                            {
                                                opacity: 0.05
                                            },
                                            {
                                                opacity: 0.01
                                            }
                                        ]
                                    }
                                },
                                points: {
                                    show: true
                                },
                                shadowSize: 2
                            },
                            grid: {
                                hoverable: true,
                                clickable: true,
                                tickColor: "#eee",
                                borderWidth: 0
                            },
                            colors: ["#d12610", "#37b7f3", "#52e136"],
                            xaxis: {
                                ticks: _columname,
                                tickDecimals: 0
                            },
                            yaxis: {
                                ticks: 6,
                                tickDecimals: 0
                            }
                        });

                    var previousPoint = null;
                    $("#commission_statistics").bind("plothover", function (event, pos, item) {
                        $("#x").text(pos.x.toFixed(2));
                        $("#y").text(pos.y.toFixed(2));
                        if (item) {
                            if (previousPoint != item.dataIndex) {
                                previousPoint = item.dataIndex;

                                $("#tooltip").remove();
                                var x = item.datapoint[0].toFixed(2),
                                    y = item.datapoint[1].toFixed(2);
                                console.log(item);
                                showTooltip('总额', item.pageX, item.pageY, y);
                            }
                        } else {
                            $("#tooltip").remove();
                            previousPoint = null;
                        }
                    });
                });
            }
        },

        initMiniCharts: function () {

            $('.easy-pie-chart .number.transactions').easyPieChart({
                animate: 1000,
                size: 75,
                lineWidth: 3,
                barColor: App.getLayoutColorCode('yellow')
            });

            $('.easy-pie-chart .number.visits').easyPieChart({
                animate: 1000,
                size: 75,
                lineWidth: 3,
                barColor: App.getLayoutColorCode('green')
            });

            $('.easy-pie-chart .number.bounce').easyPieChart({
                animate: 1000,
                size: 75,
                lineWidth: 3,
                barColor: App.getLayoutColorCode('red')
            });

            $('.easy-pie-chart-reload').click(function () {
                $('.easy-pie-chart .number').each(function () {
                    var newValue = Math.floor(100 * Math.random());
                    $(this).data('easyPieChart').update(newValue);
                    $('span', this).text(newValue);
                });
            });

            $("#sparkline_bar").sparkline([8, 9, 10, 11, 10, 10, 12, 10, 10, 11, 9, 12, 11, 10, 9, 11, 13, 13, 12], {
                    type: 'bar',
                    width: '100',
                    barWidth: 5,
                    height: '55',
                    barColor: '#35aa47',
                    negBarColor: '#e02222'
                }
            );

            $("#sparkline_bar2").sparkline([9, 11, 12, 13, 12, 13, 10, 14, 13, 11, 11, 12, 11, 11, 10, 12, 11, 10], {
                    type: 'bar',
                    width: '100',
                    barWidth: 5,
                    height: '55',
                    barColor: '#ffb848',
                    negBarColor: '#e02222'
                }
            );

            $("#sparkline_line").sparkline([9, 10, 9, 10, 10, 11, 12, 10, 10, 11, 11, 12, 11, 10, 12, 11, 10, 12], {
                type: 'line',
                width: '100',
                height: '55',
                lineColor: '#ffb848'
            });

        },

        initCount: function () {
            $comm.ajax({
                "url": "/doshborad/count",
                "type": "get"
            }, function (err, result) {
                $('.wechat_friend_count').html(result.data.wechat_friend_count || 0);
                $('.demand_count').html(result.data.demand_count || 0);
                $('.grad_count').html(result.data.grad_count || 0);
                $('.money_count').html(result.data.money_count || 0);
            });
        }
    };

}();