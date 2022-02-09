<template>
	<view class="container">
		<uni-search-bar class="search-btn" placeholder="账簿搜索框,用'*'占位" v-model="searchKey" clearButton="auto"
			cancelButton="none" />
		<uni-search-bar style="visibility: hidden;" value="占位元素" />
		<uni-list class="bill-list" v-if="billsShown?.length > 0">
			<template v-for="(bill,index) in billsShown" :key="bill.id">
				<view class="slide" @touchstart="touchStart(index,$event)" @touchend="touchEnd(index,$event)"
					@touchmove="touchMove(index,$event)" :style="{transform:'translateX(' + bill.translateX + 'px)'}">
					<uni-list-chat class="slide-index" :clickable="true" :border="true" :title="bill.name"
						:avatar="bill.imgPath || imgDefaultPath" :note="bill.desc" :time="'创于'+bill.createdTime"
						link="navigateTo" :to="'../billDetail/billDetail-x?billId='+bill.id">
					</uni-list-chat>
					<view class="operation">
						<view>
							<button @click="editBill(index)" type="default">修改</button>
							<button @click="deleteBill(index)" type="warn">删除</button>
						</view>
					</view>
				</view>
			</template>
		</uni-list>
		<view v-else style="display: flex; justify-content: center; align-items: center;align-content: center;">
			<text>啥都没有</text>
		</view>
		<view class="placeholder"></view>
		<button @click="addNewBill" class="tab-bar" type="warn">添加新账簿</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bills: [],
				isdrag: false,
				translateXRange: {
					min: 0,
					max: 0
				},
				initTranslateX: 0,
				initPageX: 0,
				imgDefaultPath: '/static/logo.png',
				searchKey: '',
			}
		},
		computed: {
			// 过滤之后用于展示的列表
			billsShown() {
				if (this.searchKey == '')
					return this.bills;
				else
					return this.bills.filter(bill => bill.name.match(this.searchKey.replace(/\*/g,'.') + ''))
			}
		},
		onLoad() {
			this.loadBillsList();
		},
		methods: {
			editBill(index) {
				const param = this.bills[index];
				const url =
					`../createNewBill/createNewBill?id=${param.id}&name=${param.name}&desc=${param.desc}&imgPath=${param.imgPath}`;
				console.log(url);
				uni.navigateTo({
					url: url,
				})
			},
			loadBillsList() {
				const app = getApp();
				app.globalData.DB.selectAllBill().then(res => {
					this.bills = res;
				}).catch(error => {
					uni.showModal({
						title: '报错',
						content: '加载数据库出错: \n' + JSON.stringify(error),
						showCancel: false,
					})
				})
			},
			addNewBill(event) {
				uni.navigateTo({
					url: '../createNewBill/createNewBill'
				})
			},
			deleteBill(index) {
				uni.showModal({
					showCancel: true,
					title: '警告',
					content: '确定删除此账单？不可撤回！',
					confirmText: '删除',
					confirmColor: '#E43D33',
					cancelColor: '#18BC37',
					cancelText: '不小心点错了',
					success: (res) => {
						if (!res.confirm) return;
						getApp().globalData.DB.deleteBill(this.bills[index].id)
							.then(res => {
								console.log(res);
								if (res.isSuccess) {
									this.loadBillsList();
									uni.showToast({
										mask: true,
										title: '删除成功',
									})
								} else {
									uni.showModal({
										showCancel: false,
										confirmColor: '#DD524D',
										content: '删除失败'
									})
								}
							})
					}
				})
			},
			touchStart(index, e) {
				const view = uni.createSelectorQuery().select(".operation");
				view.boundingClientRect(data => {
					this.translateXRange = {
						min: -(data.width),
						max: 0
					};
				}).exec();
				this.isdrag = true;
				this.bills[index].translateX = this.bills[index].translateX ?? 0; // 添加属性
				this.initTranslateX = this.bills[index].translateX;
				this.initPageX = e.touches[0].pageX;
			},
			touchEnd(index, e) {
				if (this.bills[index].translateX > this.initTranslateX - 20) {
					this.bills[index].translateX = this.translateXRange.max;
				} else {
					this.bills[index].translateX = this.translateXRange.min;
				}
				this.isdrag = false;
			},
			touchMove(index, e) {
				if (this.isdrag) {
					const newTranslateX = this.initTranslateX + e.touches[0].pageX - this.initPageX;
					if (newTranslateX < this.translateXRange.min) {
						this.bills[index].translateX = this.translateXRange.min;
					} else if (newTranslateX > this.translateXRange.max) {
						this.bills[index].translateX = this.translateXRange.max;
					} else {
						this.bills[index].translateX = newTranslateX;
					}
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		height: 100%;

		.search-btn {
			position: fixed;
			background-color: #ededed;
			z-index: 10;
			width: 100%;
		}

		.placeholder {
			height: $tabBarHeight;
		}

		.bill-list {
			.slide {
				white-space: nowrap;
				width: max-content;
				display: flex;
				align-items: center;
				overflow-x: hidden;

				.slide-index {
					// display: inline-block;
					width: 100vw;
				}

				.operation {
					// width: 314rpx;
					// display: inline-block;

					>view {
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						align-content: center;
						margin-left: 20upx;
					}
				}
			}
		}
	}
</style>
