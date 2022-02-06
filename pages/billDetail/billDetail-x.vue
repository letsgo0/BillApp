<template>
	<view class="container">
		<uni-search-bar id="record-search-btn" placeholder="输入名字搜索" v-model="searchKey" clearButton="auto"
			cancelButton="none" />
		<!-- 左右划动 -->
		<view v-if="recordsShown?.length > 0" class="content">
			<view class="title">
				<text class="name">姓名</text>
				<text class="amount">金额</text>
			</view>
			<!-- <vt-list-x :items="recordsShown" :visualCount="visualCount" :listHeight="listHeight" :itemWidth="itemWidth" -->
			<vt-list-x class="list" :items="recordsShown" :visualCount="visualCount" :itemWidth="itemWidth"
				:prevCount="10" :nextCount="10">
				<template v-slot:default="slotProps">
					<view class="slide">
						<!-- <view class="slide-info"> -->
							<text class="name">{{slotProps.item.name }}</text>
							<text class="amount">{{slotProps.item.amountZH }}</text>
						<!-- </view> -->
						<!-- <view class="operation"> -->
							<text @click="editBillRecord(slotProps.index)" class="edit">查看</text>
							<text @click="deleteBillRecord(+recordsShown[slotProps.index].id)" class="delete">删除</text>
						<!-- </view> -->
					</view>
				</template>
			</vt-list-x>
		</view>
		<view v-else class="content"
			style="display: flex; justify-content: center; align-items: center;align-content: center;">
			<text>啥都没有</text>
		</view>
		<button @click="addBillRecord" class="tab-bar" type="warn">新增记录</button>
	</view>
</template>

<script>
	import vtListX from '/components/virtual-list/virtual-list-x.vue'
	import * as AZH from '/utils/amoutZH/amoutZH.js'
	export default {
		components: {
			'vt-list-x': vtListX,
		},
		data() {
			return {
				billRecords: [],
				itemWidth: 0,
				listHeight: 0,
				visualCount: 0,
				isDrag: false,
				translateYRange: {
					min: 0,
					max: 0,
				},
				initTranslateY: 0,
				initPageY: 0,
				tableName: '',
				searchKey: '',
				screenHeight: 0,
				itemWidth: 0,
			}
		},
		computed: {
			// 过滤之后用于展示的列表
			recordsShown() {
				if (this.searchKey == '')
					return this.billRecords;
				else
					return this.billRecords.filter(record => record.name.match(this.searchKey + ''))
			}
		},
		onLoad(params) {
			console.log(params);
			this.tableName = `bill_${params.billId}`;
			this.loadAllRecords();
			const sys = uni.getSystemInfo({
				success: (data) => {
					this.itemWidth = data.screenWidth * 60 / 750; // rpx => px
					console.log('screenWidth: ' + data.screenWidth);
					console.log(this.itemWidth);
					const remainWidth = data.safeArea.width - this.itemWidth;
					this.visualCount = Math.ceil(remainWidth / this.itemWidth);
					console.log('visualCount = ' + this.visualCount);
				}
			})
		},
		methods: {
			confirmHeight() {
				const view = uni.createSelectorQuery().in(this).select('.slide-info');
				view.boundingClientRect(data => {
					if (data) {
						this.listHeight = data.height;
					}
				}).exec();
			},
			loadAllRecords() {
				const app = getApp();
				app.globalData.DB.selectBillAllRecords(this.tableName)
					.then(res => {
						this.billRecords = res.map(item => {
							item.amountZH = AZH.num2ZH(item.amount).value;
							return item
						});
						this.$nextTick(() => {
							this.confirmHeight();
						})
						console.log(this.billRecords);
					}).catch(error => {
						uni.showModal({
							title: '报错',
							content: '加载账簿出错: \n' + JSON.stringify(error),
							showCancel: false,
						})
					})
			},
			editBillRecord(index) {
				const {
					name,
					amount,
					desc,
					id,
					page,
				} = this.recordsShown[index];
				const url =
					`../createNewBillDetail/createNewBillDetail?tableName=${this.tableName}&id=${id}&name=${name}&amount=${amount}&page=${page}&desc=${desc}`
				uni.navigateTo({
					url: url,
				})
			},
			deleteBillRecord(recordId) {
				uni.showModal({
					showCancel: true,
					title: '警告',
					content: '确定删除此记录？不可撤回！',
					confirmText: '删除',
					confirmColor: '#E43D33',
					cancelColor: '#18BC37',
					cancelText: '不小心点错了',
					success: (res) => {
						if (!res.confirm) return;
						getApp().globalData.DB.deleteBillRecord(this.tableName, recordId)
							.then(res => {
								console.log(res);
								if (res.isSuccess) {
									this.loadAllRecords();
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
			addBillRecord() {
				uni.navigateTo({
					url: `../createNewBillDetail/createNewBillDetail?tableName=${this.tableName}&id=0`
				})
			},
			touchStart(index, event) {
				const view = uni.createSelectorQuery().in(this).select(".operation");
				view.boundingClientRect(data => {
					if (!data) return;
					this.translateYRange = {
						min: -(data.height),
						max: 0
					};
				}).exec();
				this.isDrag = true;
				this.recordsShown[index].translateY = this.recordsShown[index].translateY ?? 0; // 添加属性
				this.initTranslateY = this.recordsShown[index].translateY;
				this.initPageY = event.touches[0].pageY;
			},
			touchEnd(index, event) {
				if (this.recordsShown[index].translateY > this.initTranslateY - 20) {
					this.recordsShown[index].translateY = this.translateYRange.max;
				} else {
					this.recordsShown[index].translateY = this.translateYRange.min;
				}
				this.isdrag = false;
			},
			touchMove(index, event) {
				if (this.isDrag) {
					const newTranslateY = this.initTranslateY + event.touches[0].pageY - this.initPageY;
					if (newTranslateY < this.translateYRange.min) {
						this.recordsShown[index].translateY = this.translateYRange.min;
					} else if (newTranslateY > this.translateYRange.max) {
						this.recordsShown[index].translateY = this.translateYRange.max;
					} else {
						this.recordsShown[index].translateY = newTranslateY;
					}
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	$itemWidth: 70rpx;
	$nameHeight: 220rpx;
	$amountHeight: 400rpx;

	.container {
		display: flex;
		flex-direction: column;
		// height: 100%; // 100%无效，因为父元素没有明确高度
		height: 100vh;
		padding-bottom: $tabBarHeight;

		.content {
			flex-grow: 1;

			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;

			background-color: #C8C7CC;

			.title {
				display: flex;
				flex-direction: column;
				align-items: center;
				height: 100%;
				width: $itemWidth;
				// padding: 0 20px;

				.name {
					min-height: $nameHeight;
					height: 25%;
					width: $itemWidth;
					background-color: #C0C0C0;
				}

				.amount {
					flex-grow: 1;
					background-color: #F0AD4E;
					width: $itemWidth;
				}
			}

			.slide {
				display: flex;
				flex-direction: column;
				flex-wrap: nowrap;
				align-items: center;
				height: 100%;
				border-left: 1px dotted #808080;
				width: $itemWidth;

				// .slide-info {
				// 	display: flex;
				// 	flex-direction: column;
				// 	flex-wrap: nowrap;
				// 	align-items: center;
				// 	height: 100%;
					
					.name {
						min-height: $nameHeight;
						height: 25%;
						background-color: #C0C0C0;
						// overflow-y: auto;
					}

					.amount {
						// height: $amountHeight;
						flex-grow: 1;
						background-color: #F0AD4E;
						// overflow-y: auto;
					}
				// }

				.edit,
				.delete {
					padding: 6px 0;
					border-radius: 3px;
				}

				.edit {
					background-color: #e4cf57;
				}

				.delete {
					background-color: #DD524D;
				}
			}
		}

		.name,
		.amount,
		.edit,
		.delete {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			align-content: center;
			width: 100%;
			writing-mode: vertical-lr;
		}
	}
</style>
