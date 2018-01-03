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
		"accountingTitle":"Billing Group",
		"createAccountingGroup":"Create Group",
		"changeRate":"Change Rate",
		"depositCredits":"Deposit Credits",
		"deductCredits":"Deduct Credits",
		"deleteBillGroup":"Delete",
		"accountingGroup":"Billing Group",
		"groupStatus":"Status",
		"lastOperation":"Last Operation",
		"rate":"Rate",
		"rateMeaning":"(money/time)",
		"moneyType":"Dollars",
		"rateUnit":"CPU/Hour",

		"deductValue":"Deduct Value",
		"usedHours":"Hours Used(CPU*Second)",
		"usedCredits":"Credits Used",
		"used":"Used",
		//"balance":"剩余",
		"balance":"Balance",
		"currentBalance":"Current Balance",
		"chargeUnit":"Charge Unit",
		"initialAmount":"Initial Amount",
		"chargeRate":"Charge Rate",
		"OK":"OK",
		"Cancel":"Cancel",
		"deposit":"Deposit",
		"currentRate":"Current Rate",

		"hintforUserDeposit1":"After Deposit",
		"hintforUserDeduct":"After Deduct",
		"hintforUser2":"Available",
		"hintforInfinitHours":"Infinite",
		"hintforUser3":"Time（Per CPU）",

		"confirmDeletion":"Delete this billing group?",

		"createGroupSuccessMsg":"Create successfully.",
		"createGroupErrorMsg":"Failed：",

		"depositSuccessMsg":"Deposit successfully",
		"depositErrorMsg":"Failed：",

		"deductSuccessMsg":"Deduct successfully",
		"deductErrorMsg":"Failed：",

		"changeRateSuccessMsg":"Change successfully",
		"changeRateErrorMsg":"Failed：",

		"deleteGroupSuccessMsg":"Delete successfully",
		"deleteGroupErrorMsg":"Delete failed",

		//if bill group is in Error status, could not change-rate/deposit/deduct. only can delete this group
		"groupErrorStatusMsg":"Abnormal state，Can't operate",
		"groupErrorInstruction":".Please delete billing group at first.",
		"usersNonEmptyMessage":"at least an user in this group,can't delete.",

		"groupUpdatingMsg":"this group is updating，please wait.",

		//tooltip messages
		"billGroupNameRuleText":"2~20 characters that can be used with letters, numbers, and underscores,start with letter",
		"chargeRateRuleText":"Rates must be number between 0-1,000,000, can be accurate to the decimal point after the four",
		"amountRuleText":"Amount must be number between 0-1,000,000, can be accurate to the decimal point after the four",
		"deductValueMaxHint":"Deductions exceed current balance"
	});