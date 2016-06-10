# -*- coding: utf-8 -*-

# Published under Commercial License.
# Read the full license text at https://rhodecode.com/licenses.

def includeme(config):
    from .config import includeme as inc
    inc(config)
