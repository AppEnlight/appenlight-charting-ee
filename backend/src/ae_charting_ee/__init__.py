# -*- coding: utf-8 -*-

# Published under Commercial License.
# Read the full license text at https://rhodecode.com/licenses.

__license__ = "Commercial License"
__author__ = "RhodeCode GmbH"
__url__ = "http://rhodecode.com"


def includeme(config):
    from .config import includeme as inc

    inc(config)
