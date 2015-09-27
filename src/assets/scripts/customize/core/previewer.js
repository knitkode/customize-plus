/* global */

/**
 * Extend WordPress previewer
 *
 * Trigger a handy `newIframe` event each time the iframe preview has been
 * refreshed, passing as argument the iframe itself
 *
 * @extends wp.customize.Previewer
 */
// (function() { // @@doubt: In a IIFE to don't leak unneeded variables. \\
  var previewer = wpApi.Previewer;

  wpApi.Previewer = previewer.extend({
    refresh: function() {
      // call the 'parent' method
      previewer.prototype.refresh.apply(this);

      var self = this;

      // on iframe loaded
      this.loading.done(function () {
        self.trigger('newIframe', this.iframe[0]);
        // console.log('iframe refresh done');
      });
    }
  });
// })();
