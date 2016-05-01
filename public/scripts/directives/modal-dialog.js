/**
 * Directive that displays a bootstrap modal
 *
 * Receives as scope parameters:
 *
 * - {string} modal-id: id for the modal
 * - {boolean} visible: variable that will control the visibility of the view
 */
angular.module('PoisRUs').directive('modalDialog', [
    function() {
        return {
            replace: true,
            restrict: 'A',
            templateUrl: '/templates/directives/modal-dialog.html',
            transclude: {
                title: '?modalTitle',
                body: '?modalBody',
                footer: '?modalFooter'
            },
            scope: {
                visible: '=',
                sections: '='
            },
            link: function (scope, element, attrs) {

                // Watch for changes on 'visible' variable and change visibility
                // of the element through bootstrap's javascript API
                scope.$watch('visible', function(visibility) {
                    element.modal(visibility ? 'show' : 'hide');
                });

                // Update the value of 'visible' everytime this modal's
                // visibility changes. This ensures the value of 'visible' is
                // consistent even when the modal is not opened through this
                // variable (e.g. through bootstrap's API)
                element.bind('shown.bs.modal', function() {
                    if (attrs.visible) scope.$apply(function() {
                        scope.$parent[attrs.visible] = true;
                    });
                });
                element.bind('hidden.bs.modal', function() {
                    if (attrs.visible) scope.$apply(function() {
                        scope.$parent[attrs.visible] = false;
                    });
                });

            }
        };
    }
]);
