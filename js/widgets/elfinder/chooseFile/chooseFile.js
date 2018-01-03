/*
 * © Copyright Lenovo 2015.
 *
 * LIMITED AND RESTRICTED RIGHTS NOTICE:
 *
 * If data or software is delivered pursuant a General Services Administration
 * "GSA" contract, use, reproduction, or disclosure is subject to
 * restrictions set forth in Contract No. GS-35F-05925.
*/
define([
  'elfinder',
  'elfinder_i18n',
  'css!./css/chooseFile'
  ],
  function (elfinder, elfinder_i18n) {
    'use strict';

    elFinder.prototype.i18.en.messages['cmdchoosefile'] = 'Choose File';
    elFinder.prototype.i18.zh_CN.messages['cmdchoosefile'] = '选择文件';
    elFinder.prototype._options.commands.push('cmdchoosefile');
    elFinder.prototype.commands.choosefile = function() {
      var self = this;
      var fm = this.fm;
      this.callback = fm.options.chooseFileCallback;

      this.exec = function(hashes) {
          var fm    = this.fm,
          opts  = this.options,
          files = this.files(hashes),
          cnt   = files.length,
          url   = fm.option('url'),
          tmb   = fm.option('tmbUrl'),
          dfrd  = $.Deferred()
            .done(function(data) {
              fm.trigger('choosefile', {files : data});
              self.callback(data, fm);

              if (opts.oncomplete == 'close') {
                fm.hide();
              } else if (opts.oncomplete == 'destroy') {
                fm.destroy();
              }
            }),
          result = function(file) {
            return files[0];
          },
          req = [],
          i, file, dim;

        if (this.getstate() == -1) {
          return dfrd.reject();
        }

        for (i = 0; i < cnt; i++) {
          file = files[i];
          if (file.mime === 'directory') {
            return dfrd.reject();
          }
          file.baseUrl = url;
          file.url     = fm.url(file.hash);
          file.path    = fm.path(file.hash);
          if (file.tmb && file.tmb != 1) {
            file.tmb = tmb + file.tmb;
          }
          if (!file.width && !file.height) {
            if (file.dim) {
              dim = file.dim.split('x');
              file.width = dim[0];
              file.height = dim[1];
            }
          }
        }

        if (req.length) {
          $.when.apply(null, req).always(function() {
            dfrd.resolve(result(files));
          })
          return dfrd;
        }

        return dfrd.resolve(result(files));
      }
      this.getstate = function(sel) {
        //return 0 to enable, -1 to disable icon access
        var sel = this.files(sel),
            cnt = sel.length;
        if (cnt === 1) {
          if (sel[0].mime !== 'directory') {
            return 0;
          }
          else {
            return -1;
          }
        }
        else {
          return -1;
        }
      }
    }

    return {};
  });