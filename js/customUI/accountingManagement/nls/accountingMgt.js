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
		"accountingTitle":"计费组",
		"createAccountingGroup":"创建计费组",
		"changeRate":"修改费率",
		"depositCredits":"充值",
		"deductCredits":"扣款",
		"deleteBillGroup":"删除",
		"accountingGroup":"计费组",
		"groupStatus":"计费组状态",
		"lastOperation":"最近更新",
		"rate":"费率",
		"rateMeaning":"(单位机时所用金额)",
		"moneyType":"元",
		"rateUnit":"CPU/小时",

		"deductValue":"扣款金额",
		"usedHours":"已用机时(CPU*秒)",
		"usedCredits":"已用金额",
		"used":"已用",
		//"balance":"剩余",
		"balance":"剩余金额",
		"currentBalance":"当前余额",
		"chargeUnit":"点数",
		"initialAmount":"初始金额",
		"chargeRate":"计时费率",
		"OK":"确定",
		"Cancel":"取消",
		"deposit":"余额充值",
		"currentRate":"当前费率",

		"hintforUserDeposit1":"充值后",
		"hintforUserDeduct":"扣款后",
		"hintforUser2":"可使用",
		"hintforInfinitHours":"无限",
		"hintforUser3":"机时（单核CPU）",

		"confirmDeletion":"确定要删除计费组",

		"createGroupSuccessMsg":"计费组创建成功。",
		"createGroupErrorMsg":"计费组创建失败：",

		"depositSuccessMsg":"计费组充值成功。",
		"depositErrorMsg":"计费组充值失败：",

		"deductSuccessMsg":"计费组扣款成功。",
		"deductErrorMsg":"计费组扣款失败：",

		"changeRateSuccessMsg":"计费组修改费率成功。",
		"changeRateErrorMsg":"计费组修改费率失败：",

		"deleteGroupSuccessMsg":"计费组删除成功",
		"deleteGroupErrorMsg":"计费组删除失败",

		//if bill group is in Error status, could not change-rate/deposit/deduct. only can delete this group
		"groupErrorStatusMsg":"组当前状态异常，无法进行",
		"groupErrorInstruction":"。请先删除该组。",
		"usersNonEmptyMessage":"所选计费组中用户数不为0，无法删除。",

		"groupUpdatingMsg":"所选计费组当前正在更新，无法进行",

		//tooltip messages
		"billGroupNameRuleText":"2~20个字符，可使用字母、数字、下划线，需以字母开头",
		"chargeRateRuleText":"费率必须为大于等于0且不超过1,000,000的有效数字，可精确至小数点后四位",
		"amountRuleText":"单次充值金额必须为大于等于0且不超过1,000,000的有效数字，可精确至小数点后四位",
		"deductValueMaxHint":"扣款金额不得超过当前余额"
	},
	"zh":true,
	"en":true
});