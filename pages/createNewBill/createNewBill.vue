<template>
	<view class="container">
		<form @submit="formSubmit" @reset="formReset">
			<uni-section title="账簿名字(必填)" type="line" padding>
				<uni-easyinput name="name" v-model="param.name" placeholder="请输入账簿名字!" placeholder-style="color:#F76260"
					trim="all"></uni-easyinput>
			</uni-section>
			<uni-section title="账簿描述(可选)" type="line" padding>
				<uni-easyinput name="desc" v-model="param.desc" placeholder="请输入账簿描述!" placeholder-style="color:#F76260"
					trim="all"></uni-easyinput>
			</uni-section>
			<uni-section title="账簿封面(可选)" type="line" padding>
				<view class="img">
					<view>
						<view v-if="imgDefaultPath==''">
							<image class="imgInit" mode="aspectFit" src='./default.png' lazy-load="true"></image>
						</view>
						<view v-else>
							<image class="imgInit" :src="imgDefaultPath" mode="aspectFit" lazy-load="true"></image>
						</view>
					</view>
					<view class="uni-input-wrapper upload-img">
						<uni-file-picker ref="imgFiles" file-mediatype="image" :limit="1" :auto-upload="false"
							mode="grid">
						</uni-file-picker>
					</view>
				</view>
			</uni-section>
			<view class="tab-bar my-height">
				<button class="submit" form-type="submit" type="primary" :loading="isLoading"> {{btnMainText}}</button>
				<button class="reset" form-type="reset" type="warn">重置</button>
			</view>
		</form>
	</view>
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
				enumFrom: enumFrom,
				fromFlag: enumFrom['ADD'],
				btnMainText: "创建",
				imgDefaultPath: ''
			}
		},
		onLoad(param) {
			if (JSON.stringify(param) !== "{}") {
				console.log(param);
				this.param = param;
				this.fromFlag = this.enumFrom.EDIT;
				this.btnMainText = "修改"
				this.imgDefaultPath = param.imgPath
			}
			console.log(this.imgDefaultPath);
		},
		methods: {
			saveImgAsync(imgPath) {
				return new Promise((resolve, reject) => {
					uni.saveFile({
						tempFilePath: imgPath,
						success: res => {
							// console.log(`图片保存路径为: ${res.savedFilePath}`);
							resolve({
								imgPath: res.savedFilePath
							});
						},
						fail: error => {
							// console.log("图片保存失败: " + JSON.stringify(error));
							reject(error);
						}
					})
				})
			},
			formSubmit: function(e) {
				this.isLoading = true;
				let checkRes = true;
				let errorInfo = "";
				if (e.detail.value.name == "") {
					checkRes = false;
					errorInfo = "添加失败，原因可能为：\n1.未填写账簿名字"
				}
				if (!checkRes) {
					this.isLoading = false;
					uni.showModal({
						title: '提示',
						content: errorInfo,
						confirmColor: "#E43D33",
						showCancel: false,
					});
					return;
				}
				// 复制照片
				let imgPath;
				let promise;
				if (this.$refs.imgFiles.filesList.length == 0) {
					promise = new Promise((res, rej) => {
						res({
							imgPath: this.imgDefaultPath
						});
					});
				} else {
					imgPath = this.$refs.imgFiles.filesList[0].url;
					promise = this.saveImgAsync(imgPath);
				}
				// 存入数据库
				promise.then(res => {
					const imgPath = res.imgPath;
					// // 存入数据库
					const form = e.detail.value;
					const bill = {
						id: this.param.id,
						name: form.name,
						desc: form.desc,
						imgPath: imgPath,
					};
					if (this.fromFlag === this.enumFrom['ADD']) {
						console.log('add Bill');
						return getApp().globalData.DB.addBill(bill);
					} else {
						console.log('edit bill');
						return getApp().globalData.DB.updateBill(bill);
					}
				}).then(res => {
					this.isLoading = false;
					if (res.isSuccess) {
						let title = "";
						if (this.fromFlag === this.enumFrom['ADD']) {
							title = "添加成功";
							// 添加子表
							const id = res.rowId;
							getApp().globalData.DB.createBillTable(`bill_${id}`);
						} else {
							title = "修改成功"
						}
						uni.showToast({
							mask: true,
							title: title,
						})
						const pages = getCurrentPages();
						const prevPage = pages[pages.length - 2];
						prevPage.$vm.loadBillsList();
						uni.navigateBack({});
					} else {
						uni.showModal({
							showCancel: false,
							confirmColor: '#DD524D',
							content: '添加失败'
						})
					}
				})
			},
			formReset: function(e) {
				this.$refs.imgFiles.clearFiles();
			}
		}
	}
</script>

<style scoped lang="scss">
	.my-height {
		height: calc(2 * #{$tabBarHeight}) !important;
	}

	.submit {
		height: $tabBarHeight;
	}

	.reset {
		height: $tabBarHeight;
	}

	.img {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;
	}

	.imgInit {
		height: 180upx;
		width: 180upx;
	}
</style>
