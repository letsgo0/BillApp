<template>
	<form @submit="formSubmit" @reset="formReset">
		<uni-section title="姓名(必填)" type="line" padding>
			<uni-easyinput name="name" v-model="param.name" placeholder="请输入姓名!"
				placeholder-style="color:#F76260"  trim="all"></uni-easyinput>
		</uni-section>
		<uni-section title="金额(必填)" type="line" padding>
			<uni-easyinput name="amount" v-model="param.amount" placeholder="请输入金额!"
				placeholder-style="color:#F76260"  trim="all"></uni-easyinput>
		</uni-section>
		<uni-section title="备注(可选)" type="line" padding>
			<uni-easyinput name="desc" v-model="param.desc" placeholder="请输入备注!"
				placeholder-style="color:#F76260"  trim="all"></uni-easyinput>
		</uni-section>
		<view class="tab-bar">
			<button form-type="submit" type="primary" :loading="isLoading"> {{btnMainText}}</button>
			<button form-type="reset" type="warn">重置</button>
		</view>
	</form>
</template>

<script>
	export default {
		data() {
			const enumFrom = {
				'EDIT': 1,
				'ADD': 2,
			}
			return {
				isLoading: false,
				param: {},
				enumFrom,
				fromFlag: enumFrom['ADD'],
				btnMainText: "创建",
			}
		},
		// 接受两个参数
		// tableName 账单表名
		// id        单条记录
		onLoad(params) {
			this.param = params;
			this.param.id = +params.id;
			this.param.desc = params.desc || '';
			if (this.param.id !== 0) {
				this.fromFlag = this.enumFrom['EDIT'];
				this.btnMainText = "修改"
			}
			console.log(this.param);
		},
		methods: {
			formSubmit() {
				this.isLoading = true;
				// validate argvs
				if (!(this.param.name && this.param.amount)) {
					this.isLoading = false;
					uni.showModal({
						title: '提示',
						content: "名字或者金额不能为空!",
						confirmColor: "#E43D33",
						showCancel: false,
					});
					return;
				}
				let promise;
				console.log(this.fromFlag);
				if (this.fromFlag === this.enumFrom['ADD']) {
					console.log('add');
					promise = getApp().globalData.DB.addBillRecord(this.param);
				} else if (this.fromFlag === this.enumFrom['EDIT']) {
					console.log('edit');
					console.log(this.param);
					promise = getApp().globalData.DB.updateBillRecord(this.param);
				}
				promise
					.then(res => {
						console.log(res);
						this.isLoading = false;
						if (res.isSuccess) {
							uni.showToast({
								mask: true,
								title: '成功',
							})
							const pages = getCurrentPages();
							const prevPage = pages[pages.length - 2];
							prevPage.$vm.loadAllRecords();
							uni.navigateBack({});
						} else {
							uni.showModal({
								showCancel: false,
								confirmColor: '#DD524D',
								content: '失败'
							})
						}
					})
			},
			formReset() {
				console.log('reset');
			}
		}
	}
</script>

<style scoped>
	.uni-form-item__title {
		font-size: 16px;
		line-height: 24px;
	}

	.uni-input-wrapper {
		/* #ifndef APP-NVUE */
		/* display: flex; */
		/* #endif */
		padding: 8px 13px;
		/* flex-direction: row; */
		/* flex-wrap: nowrap; */
		background-color: #FFFFFF;
		box-sizing: border-box;
	}

	.uni-input {
		height: 28px;
		line-height: 28px;
		font-size: 15px;
		padding: 0px;
		flex: 1;
		background-color: #FFFFFF;
	}
</style>
