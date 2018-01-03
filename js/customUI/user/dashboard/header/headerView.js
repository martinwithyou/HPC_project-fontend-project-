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
    'cookie',
    'utils/constants/constants',
    'utils/constants/urlConstants',
    'utils/eventBus',
    'text!./templates/headerTmpl.mustache',
    'i18n!./nls/header',
    'css!./css/headerView'
  ],
  function(Marionette, cookie, constants, urlConstants, eventBus, dashboardHeader, nls) {
    'use strict';
    return Marionette.ItemView.extend({
      className: 'row',
      template: dashboardHeader,

      templateHelpers: function () {
        return {
          nls: nls
        };
      },

      showUserBalance: function (data) {
        var balance = "";
        if (data.user) {
          balance = data.user.bill_group.balance;
        }
        else {
          balance = data.bill_group.balance;
        }
        if (typeof (balance) === "number") {
          balance = balance.toFixed("3");
        }
        $("#users-balance-number").html(balance + nls.accountUnit);
      },

      onShow: function () {
        var self = this;
        var noticeXHR = $.ajax({
          url: urlConstants.config,
          dataType: "json",
          contentType: "application/json"});

        noticeXHR.done(function(data){
          var notice = data.notice;
          $("#userNotice").html("<i class='fa fa-info-circle notice-icon'></i><span class='notice-text'>" + data.notice + "</span>");
          $("#userNotice").attr("title", data.notice);
          if (data.notice.length < 40) {
            $("#userNotice").css("float", "right");
          }
        }
        );

        var uid=$.cookie('userid');
        var balanceXHR = $.ajax({
            url: urlConstants.users + uid + '/',
            dataType: "json",
            contentType: "application/json"});
        balanceXHR.done(function(data){
            self.showUserBalance(data);
        }
        );

        eventBus.on(constants.refreshUser, self.showUserBalance);
      }
    });
  });