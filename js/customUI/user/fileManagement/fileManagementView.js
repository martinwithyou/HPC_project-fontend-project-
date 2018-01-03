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
    'marionette',
    'elfinder',
    'elfinder_i18n',
    'utils/constants/urlConstants',
    'utils/constants/constants',
    'utils/eventBus',
    'text!./templates/fileManagementTmpl.mustache',
    'i18n!./nls/fileManagement',
    'css!./css/fileManagement'
  ],
  function(Marionette, elfinder, elfinder_i18n, urlConstants, constants,
           eventBus, fileManagementTmpl, nls, fileManagementCSS) {
    'use strict';
    return Marionette.ItemView.extend({
      template: fileManagementTmpl,

      templateHelpers: function () {
        return {
          nls: nls
        };
      },

      refresh: function () {
        this.elf.exec('reload');
      },

      onShow: function () {
        var self = this;
        self.elf = $('#user-files').elfinder({
            url: urlConstants.files,
            lang: 'zh_CN',
            defaultView: 'list',
            useBrowserHistory: false,
            height: 550,
            commands : [
              'choosefolder','open', 'reload', 'home', 'up', 'back', 'forward', 'getfile', 'quicklook',
              'download', 'rm', 'duplicate', 'rename', 'mkdir', 'mkfile', 'upload', 'copy',
              'cut', 'paste', 'edit', 'extract', 'archive', 'search', 'info', 'view', 'help', 'resize', 'sort', 'netmount'
            ],
            uiOptions : {
                // toolbar configuration
                toolbar : [
                    ['back', 'forward'],
                    // ['reload'],
                    // ['home', 'up'],
                    ['mkdir', 'mkfile', 'upload'],
                    ['download'],
                    ['rm'],
                    ['rename', 'edit'],
                    ['search'],
                    ['view', 'sort']
                ]
            },
            contextmenu : {
                // navbarfolder menu
                navbar : ['open', '|', 'rm'],

                // current directory menu
                cwd    : ['reload', 'back', '|', 'upload', 'mkdir', 'mkfile'],

                // current directory file menu
                files  : [
                    'download', '|',
                    'rm', '|', 'edit', 'rename', 'resize'
                ]
            },
            getFileCallback: function(file) {
            },
            handlers : {
                init : function(event, elfinderInstance) {
                    $(".elfinder-button form input[type='file']").attr('title', nls.uploadFiles);
                }
            }
        }).elfinder('instance');
        self.elf.bind('load', function(event) {
            self.elf.exec('reload');
        });
        //self.elf.exec('reload');
        //eventBus.on(constants.refresh, self.refresh, self);
      }
    });
  });