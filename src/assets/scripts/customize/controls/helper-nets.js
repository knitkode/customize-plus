/* global Preprocessor, Regexes */
/* exported: Nets */

/**
 * Nets
 *
 * @requires Preprocessor, Regexes
 */
var Nets = (function () {

  // @public API
  return {
    /**
     * [populateOff description]
     * netOff is a list of control ids (variables names) to which
     * this control can't be bound to avoid circular dependencies
     *
     * @param  {string} thisControlID    [description]
     * @param  {string} relatedControlID [description]
     * @param  {function()} callback     [description]
     */
    populateOff: function (thisNetOffToPass, relatedControlID) {
      var relatedControl = api.control(relatedControlID);
      if (!relatedControl) {
        return;
      }
      // store controlId in the netOff control property
      relatedControl.params.netOff = _.union(relatedControl.params.netOff, thisNetOffToPass);

      // // if the control is in the DOM hide the the select <option> that, if selected,
      // // would create a recursive variable definition, therefore a Maximum call stack size error.
      // // It would break less as well of course with `recursive variable definition` error.
      // if (relatedControl.rendered) {
      //   for (var i = relatedControl.params.netOff.length; i--;) {
      //     var optionTag = relatedControl._container.querySelector('option[value="' + relatedControl.params.netOff[i] + '"]');
      //     optionTag.style.display = 'none';
      //     optionTag.disabled = true;
      //   }
      // }

      var extractedControlIDs = Regexes.variable_match.exec(relatedControl.setting());
      if (extractedControlIDs) {
        this.populateOff(relatedControl.params.netOff, extractedControlIDs[1]); // k6todo we need to loop in the setting value here \\
      }
    },
    /**
     * [populateOn description]
     * netOn is a list of control ids (variables names) that should
     * change/notify this control about its changes.
     *
     * @param  {string} thisControlID    [description]
     * @param  {string} relatedControlID [description]
     */
    populateOn: function (thisControlID, relatedControlID) {
      var relatedControl = api.control(relatedControlID);
      if (relatedControl) {
        // push but prevent duplicates
        if (relatedControl.params.netOn.indexOf(thisControlID) === -1) {
          relatedControl.params.netOn.push(thisControlID);
        }
      }
    },
    /**
     * [clean description]
     * @param  {string} thisControlID  [description]
     */
    clean: function (thisControlID) {
      for (var i = 0, l = Preprocessor.varsColor.length; i < l; i++) {
        var control = api.control(Preprocessor.varsColor[i]);
        if (control) {
          // never remove from netOff of a control
          // its own id (that was set `onInit`)
          if (control.id !== thisControlID) {
            var params = control.params;
            var indexInNetOn = params.netOn.indexOf(thisControlID);
            var indexInNetOff = params.netOff.indexOf(thisControlID);
            if (indexInNetOn !== -1) {
              params.netOn.splice(indexInNetOn, 1);
            }
            if (indexInNetOff !== -1) {
              params.netOff.splice(indexInNetOff, 1);
              // reshow the select <option> hided in populateOff.
              // _showAvailableOption(control, thisControlID); // k6todo \\
              // var optionTag = control._container.querySelector('option[value="' + thisControlID + '"]');
              // optionTag.style.display = 'block';
              // optionTag.disabled = false;
            }
          }
        }
      }
    }
  };
})();