/* global api, Skeleton, Compiler, ScreenPreview */

/**
 * Extend WordPress customize API
 *
 * @augments wp.customize.Previewer
 * @requires Skeleton, Compiler and ScreenPreview
 */
// (function() { // k6doubt: In a IIFE to don't leak unneeded variables. \\

  var previewer = api.Previewer;

  var customizeFirstLoad = true;

  api.Previewer = previewer.extend({
    refresh: function() {
      // call the 'parent' method
      previewer.prototype.refresh.apply(this);

      // the first load is handled in the Compiler already
      // where we wait for the less callback on compile done
      if (!customizeFirstLoad) {
        Skeleton.loading();
      }

      // on iframe loaded
      this.loading.done(function () {
        // console.log('iframe refresh done'); // k6debug \\
        var iframe = this.iframe[0];
        Compiler.onReady(iframe);
        ScreenPreview.onReady(iframe);

        // the first load is handled in the Compiler already
        // where we wait for the less callback on compile done
        if (!customizeFirstLoad) {
          Skeleton.loaded();
        } else {
          customizeFirstLoad = false;
        }
      });
    }
  });
// })();