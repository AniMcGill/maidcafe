'use strict';

angular.module('maidcafeApp.version', [
  'maidcafeApp.version.interpolate-filter',
  'maidcafeApp.version.version-directive'
])

.value('version', '0.1');
