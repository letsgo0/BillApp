<template>
	<view class="container">
		<form @submit="formSubmit" @reset="formReset">
			<view class="uni-form-item uni-column">
				<view class="uni-form-item__title">1.账簿名字(必填)</view>
				<view class="uni-input-wrapper">
					<input class="uni-input" focus name="name" placeholder="请输入账簿名字!" placeholder-style="color:#F76260"
						v-model="param.name" />
				</view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="uni-form-item__title">2.账簿描述(选填)</view>
				<view class="uni-input-wrapper">
					<input class="uni-input" name="desc" v-model="param.desc" placeholder="请输入账簿描述!"
						placeholder-style="color:#F76260" />
				</view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="uni-form-item__title">3.账簿封面(选填)</view>
				<view class="img">
					<view>
						<view v-if="imgDefaultPath==''">
							<image class="imgInit" mode="aspectFit" src='./default.png' lazy-load="true"></image>
						</view>
						<view v-else>
							<image class="imgInit" :src="imgDefaultPath" mode="aspectFit" lazy-load="true"></image>
						</view>
					</view>
					<view class="uni-input-wrapper upload-img test">
						<uni-file-picker ref="imgFiles" file-mediatype="image" :limit="1" :auto-upload="false"
							mode="grid">
						</uni-file-picker>
					</view>
				</view>
			</view>
			<view class="tab-bar">
				<button type="primary" form-type="submit" :loading="isLoading">{{btnMainText}}</button>
				<button type="warn" form-type="reset">重置</button>
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
				const that = this;
				this.isLoading = true;
				let checkRes = true;
				let errorInfo = "";
				console.log("this.$refs.imgFiles: " + JSON.stringify(this.$refs.imgFiles));;
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
							imgPath: that.imgDefaultPath
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
						id: that.param.id,
						name: form.name,
						desc: form.desc,
						imgPath: imgPath,
					};
					console.log(that.fromFlag);
					console.log(that.enumFrom);
					if (that.fromFlag === that.enumFrom['ADD']) {
						console.log('add');
						return getApp().globalData.DB.addBill(bill);
					} else {
						console.log('edit');
						return getApp().globalData.DB.updateBill(bill);
					}
				}).then(res => {
					let title = "";
					if (that.fromFlag === that.enumFrom['ADD']) {
						title = "添加成功"
					} else {
						title = "修改成功"
					}
					this.isLoading = false;
					uni.showToast({
						mask: true,
						title: title,
					})
					const pages = getCurrentPages();
					const prevPage = pages[pages.length - 2];
					prevPage.$vm.loadBillsList();
					uni.navigateBack({});
				}).catch(error => {
					console.log("error: " + JSON.stringify(error));
					this.isLoading = false;
					uni.showModal({
						showCancel: false,
						confirmColor: '#DD524D',
						content: '添加失败'
					})
				});
			},
			formReset: function(e) {
				this.$refs.imgFiles.clearFiles();
			},
			upSel(e) {
				console.log('select');
			},
			upSuc(e) {
				console.log("success");
			},
			upFail(e) {
				console.log('fail');
			}
		}
	}
</script>

<style  scoped>
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

	.img {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.imgInit {
		width: 200upx;
	}
	.test {
		background-color: #18BC37;
	}
</style>
