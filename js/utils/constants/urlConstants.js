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
  ],
  function () {
    'use strict';

    var urlConstants = {
      "config": "/static/config/config.json",
      "index": "/",
      "login": "/login/",
      "users": "/api/users/",
      "userGroup": "/api/osgroups/",
      "billGroup": "/api/billgroups/",
      "deposit": "/api/deposits/",
      "queues": "/api/queues/",
      "files": "/api/files-connector/",
      "jobs": "/api/jobs/",
      "sessions": "/api/sessions/",
      "sessionInfo": "/api/sessionInfo/",
      "jobSummary": "/api/jobsummary/",
      "jobsRun": "/api/jobs?status=running",
      "jobsWait": "/api/jobs?status=waitforrun",
      "jobsHang": "/api/jobsHang/",
      "jobsFinish": "/api/jobs?status=finished",
      "clusterOverview": "/api/cluster-overview/",
      "jobHistory" : "/api/jobhistory/",
      "jobHistoryQueues" : "/api/queues/?role=admin",
      "nodes":"/api/nodes/",
      "vncsessions":"/api/vncsessions/",
      "nodesOverview" : "/api/nodes-overview/",
      "rooms":"/api/rooms/",
      "rows":"/api/rows/",
      "racks":"/api/racks/",
      "nodegroups":"/api/nodegroups/",
      "onOrOff":"/api/nodes/",

      "node":"api/nodes/",
      "running_jobs":"api/nodes/",

      "oneHour_load":"api/nodes",
      "oneHour_cpu":"api/nodes",
      "oneHour_memory":"api/nodes",
      "oneHour_disk":"api/nodes",
      "oneHour_energy":"api/nodes",
      "oneHour_temperature":"api/nodes",
      "oneHour_network":"api/nodes",

      "oneDay_load":"api/nodes",
      "oneDay_cpu":"api/nodes",
      "oneDay_memory":"api/nodes",
      "oneDay_disk":"api/nodes",
      "oneDay_energy":"api/nodes",
      "oneDay_temperature":"api/nodes",
      "oneDay_network":"api/nodes",

      "oneWeek_load":"api/nodes",
      "oneWeek_cpu":"api/nodes",
      "oneWeek_memory":"api/nodes",
      "oneWeek_disk":"api/nodes",
      "oneWeek_energy":"api/nodes",
      "oneWeek_temperature":"api/nodes",
      "oneWeek_network":"api/nodes",

      "oneMonth_load":"api/nodes",
      "oneMonth_cpu":"api/nodes",
      "oneMonth_memory":"api/nodes",
      "oneMonth_disk":"api/nodes",
      "oneMonth_energy":"api/nodes",
      "oneMonth_temperature":"api/nodes",
      "oneMonth_network":"api/nodes"



    };

    return urlConstants;
  });