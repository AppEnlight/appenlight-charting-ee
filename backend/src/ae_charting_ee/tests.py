# -*- coding: utf-8 -*-

# Published under Commercial License.
# Read the full license text at https://rhodecode.com/licenses.


# @pytest.mark.usefixtures('chart_series')
# class TestChartPostProcessing(object):
#     def test_acumulate(self, chart_series):
#         series = copy.deepcopy(chart_series)
#         from appenlight.lib.utils.es_parser import postprocess_acumulate
#         test_data = [OrderedDict([(u'key', u'X'), (u'0_1', 1)]),
#                      OrderedDict([(u'key', u'X'), (u'0_1', 2), (u'0_2', 2)]),
#                      OrderedDict([(u'key', u'X'), (u'0_1', 3), (u'0_3', 3)]),
#                      OrderedDict([(u'key', u'X'), (u'0_1', 4), (u'0_2', 4)]),
#                      OrderedDict([(u'key', u'X'), (u'0_1', 5)]),
#                      OrderedDict([(u'key', u'X'), (u'0_1', 6), (u'0_2', 6),
#                                   (u'0_3', 6)])]
#         assert series == test_data
#
#         cumul_0_1 = sum([1, 2, 3, 4, 5, 6])
#         cumul_0_2 = sum([2, 4, 6])
#         cumul_0_3 = sum([3, 6])
#         postprocess_acumulate(series)
#         last_entry = series[-1]
#
#         assert last_entry['0_1'] == cumul_0_1
#         assert last_entry['0_2'] == cumul_0_2
#         assert last_entry['0_3'] == cumul_0_3
