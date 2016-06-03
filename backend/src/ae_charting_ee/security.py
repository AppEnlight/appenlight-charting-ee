# -*- coding: utf-8 -*-

# Published under Commercial License.
# Read the full license text at https://rhodecode.com/licenses.

from pyramid.security import Allow, Everyone

from pyramid.httpexceptions import HTTPNotFound
from ziggurat_foundations.permissions import permission_to_04_acls

import appenlight.models.resource
from appenlight.security import rewrite_root_perm, add_root_superperm
from appenlight.lib import to_integer_safe
from appenlight.models.services.alert_channel_action import AlertChannelActionService

from ae_charting_ee.models.services.dashboard import DashboardService
from ae_charting_ee.models.services.dashboard_chart import DashboardChartService

class DashboardFactory(object):
    """
    Checks permissions to specific dashboard based on user permissions or
    UUID and public settings
    """

    def __init__(self, request):
        Resource = appenlight.models.resource.Resource

        self.__acl__ = []
        self.used_uuid = False
        # used_uuid is set to true if user who is normally not authorized to
        # view the resource gains access to it because owner set it to public
        # and user knows the uuid of object

        org_resource_id = request.matchdict.get("resource_id",
                                                request.GET.get("resource_id"))
        resource_id = to_integer_safe(org_resource_id)
        self.resource = Resource.by_resource_id(resource_id) \
            if resource_id else None
        if self.resource is None:
            self.resource = DashboardService.by_uuid(org_resource_id)

        if self.resource and request.user:
            self.__acl__ = self.resource.__acl__
            permissions = self.resource.perms_for_user(request.user)
            for perm_user, perm_name in permission_to_04_acls(permissions):
                self.__acl__.append(rewrite_root_perm(perm_user, perm_name))

        if self.resource and self.resource.public:
            if not request.has_permission('view', self):
                self.used_uuid = True
            self.__acl__.append((Allow, Everyone, 'view'))

        add_root_superperm(request, self)

class ChartFactory(object):
    """
    Checks permissions to specific dashboard based on user permissions or
    UUID and public settings
    """

    def __init__(self, request):
        Resource = appenlight.models.resource.Resource

        self.__acl__ = []
        self.used_uuid = False
        # used_uuid is set to true if user who is normally not authorized to
        # view the resource gains access to it because owner set it to public
        # and user knows the uuid of object

        chart_id = request.matchdict.get("chart_id",
                                         request.GET.get("chart_id"))

        self.chart = DashboardChartService.by_uuid(chart_id)
        if not self.chart:
            raise HTTPNotFound()

        self.resource = Resource.by_resource_id(self.chart.resource_id)
        if self.resource and request.user:
            self.__acl__ = self.resource.__acl__
            permissions = self.resource.perms_for_user(request.user)
            for perm_user, perm_name in permission_to_04_acls(permissions):
                self.__acl__.append(rewrite_root_perm(perm_user, perm_name))

        if self.resource and self.resource.public:
            if not request.has_permission('view', self):
                self.used_uuid = True
            self.__acl__.append((Allow, Everyone, 'view'))

        add_root_superperm(request, self)


class ChartAlertFactory(object):
    """
    Checks permissions to specific dashboard based on user permissions or
    UUID and public settings
    """

    def __init__(self, request):
        Resource = appenlight.models.resource.Resource

        self.__acl__ = []
        self.used_uuid = False
        # used_uuid is set to true if user who is normally not authorized to
        # view the resource gains access to it because owner set it to public
        # and user knows the uuid of object

        alert_id = request.matchdict.get("alert_id",
                                         request.GET.get("alert_id"))
        self.alert = AlertChannelActionService.by_pkey(alert_id)
        if not self.alert:
            raise HTTPNotFound()

        self.chart = DashboardChartService.by_uuid(self.alert.other_id)

        if not self.chart:
            raise HTTPNotFound()

        self.resource = Resource.by_resource_id(self.chart.resource_id)
        if self.resource and request.user:
            self.__acl__ = self.resource.__acl__
            permissions = self.resource.perms_for_user(request.user)
            for perm_user, perm_name in permission_to_04_acls(permissions):
                self.__acl__.append(rewrite_root_perm(perm_user, perm_name))

        if self.resource and self.resource.public:
            if not request.has_permission('view', self):
                self.used_uuid = True
            self.__acl__.append((Allow, Everyone, 'view'))

        add_root_superperm(request, self)
