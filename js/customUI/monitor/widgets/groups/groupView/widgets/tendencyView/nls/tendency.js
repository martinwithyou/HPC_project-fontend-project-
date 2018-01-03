/*
 * © Copyright Lenovo 2015.
 *
 * LIMITED AND RESTRICTED RIGHTS NOTICE:
 *
 * If data or software is delivered pursuant a General Services Administration
 * "GSA" contract, use, reproduction, or disclosure is subject to
 * restrictions set forth in Contract No. GS-35F-05925.
*/
define({
	"root":{
		selected_time:"请选择时间段：",
		hour:"过去一小时",
		day:"过去一天",
		week:"过去七天",
		month:"过去三十天",
		load_b:"CPU总核数",
		cpu_b:"CPU总核数",
		memory_b:"总内存大小",
		disk_b:"总硬盘大小",
		job_b:"CPU总核数",
		network_in_b:"进",
		network_out_b:"出",
		error:"获取趋势图信息失败",
		text:["总load","平均CPU使用率（%）","平均内存使用率（%）","总硬盘使用率（%）","总网络流量（K）","总能耗（W）","平均温度（℃）","作业占用总核数"],
		type:["load","cpu","memory","disk","network","energy","temperature","job"],
		name:["load","CPU使用率（%）","内存使用率（%）","硬盘使用率（%）","网络流量（K）","能耗（W）","平均温度（℃）","作业占用核数"],
		element:["group_tendency_load","group_tendency_cpu","group_tendency_memory","group_tendency_disk","group_tendency_network","group_tendency_energy","group_tendency_temperature","group_tendency_job"]
	},
	"zh":true,
	"en":true
});