"""A setuptools based setup module.
"""
import os
import re

# Always prefer setuptools over distutils
from setuptools import setup, find_packages
# To use a consistent encoding
from codecs import open
from os import path
from Cython.Build import cythonize

here = path.abspath(path.dirname(__file__))

REQUIREMENTS = open(path.join(here, 'requirements.txt')).readlines()

compiled = re.compile('([^=><]*).*')


def parse_req(req):
    return compiled.search(req).group(1).strip()

requires = [_f for _f in map(parse_req, REQUIREMENTS) if _f]

# Get the long description from the README file
with open(path.join(here, 'README.rst'), encoding='utf-8') as f:
    long_description = f.read()


def _get_cython_modules(root_path):
    """Returns the list of cythonized modules."""

    def _add_to_cython(dirpath, filename):
        """Helper that indicates if the file should be cythonized"""
        if filename == '__init__.py':
            return False
        if 'migrations/versions' in dirpath:
            return False
        root, ext = os.path.splitext(filename)
        return ext == '.py'

    # Return an empty list when cython is disabled.
    if os.environ.get('CYTHONIZE') == '0':
        return []

    modules = []
    sources = []

    # Recurse into directories and add all python source files.
    for dirpath, dirnames, files in os.walk(os.path.join('src')):
        sources.extend([os.path.join(dirpath, f)
                        for f in files
                        if _add_to_cython(dirpath, f)])

    modules.extend(cythonize(sources))
    return modules


setup(
    name='ae_charting_ee',
    version='1.0',
    description='Appenlight Charting EE',
    long_description=long_description,
    url='https://',
    author='RhodeCode',
    author_email='support@rhodecode.com',
    license='commercial',
    classifiers=[
        'Development Status :: 5 - Production/Stable',
        'Intended Audience :: Developers',
        'Topic :: Software Development :: Monitoring',
        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 2.7'
    ],
    keywords='appenlight charting',
    package_dir={'': 'src'},
    packages=find_packages('src'),
    install_requires=requires,
    entry_points={
        'appenlight.plugins': [
            'ae_charting_ee = ae_charting_ee'
        ]
    },
    ext_modules=_get_cython_modules(here)
)
