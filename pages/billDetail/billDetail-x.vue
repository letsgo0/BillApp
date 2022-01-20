<template>
	<view class="">
		<input id="bill-record-search" placeholder="输入名字搜索" type="text" value="" />
		<!-- 左右划动 -->
		<view class="bill-record-container">
			<template v-if="billRecords.length">
				<vt-list-x :items="billRecords" :visualCount="visualCount" :listHeight="listHeight"
					:itemWidth="itemWidth" :prevCount="10" :nextCount="10" :padding="padding">
					<template v-slot:default="slotProps">
						<view class="slide" @touchstart="touchStart(slotProps.index,$event)"
							@touchend="touchEnd(slotProps.index,$event)" @touchmove="touchMove(slotProps.index,$event)"
							:style="{
							transform:`translateY(${billRecords[slotProps.index]?.translateY || 0}px`,
							width: itemWidth + 'px'
						}">
							<view class="slide-index">
								<text class="name">{{slotProps.item.name }}</text>
								<text class="amount">{{slotProps.item.amount }}</text>
								<text class="desc">{{slotProps.item.desc }}</text>
							</view>
							<view class="operation">
								<text @click="editBillRecord(slotProps.index)" class="edit">修改</text>
								<text @click="deleteBillRecord(+billRecords[slotProps.index].id)"
									class="delete">删除</text>
							</view>
						</view>
					</template>
				</vt-list-x>
			</template>
			<view v-else class="">
				<text>啥都没有</text>
			</view>
		</view>
		<button @click="addBillRecord" class="tab-bar" type="warn">新增记录</button>
	</view>
</template>

<script>
	import vtListX from '/components/virtual-list/virtual-list-x.vue'
	export default {
		components: {
			'vt-list-x': vtListX,
		},
		data() {
			return {
				billRecords: [],
				itemWidth: 30,
				listHeight: 0,
				visualCount: 0,
				paddingLR: 5,
				isDrag: false,
				translateYRange: {
					min: 0,
					max: 0,
				},
				initTranslateY: 0,
				initPageY: 0,
				tableName: ''
			}
		},
		computed: {
			padding() {
				return '0 ' + this.paddingLR + 'px';
			}
		},
		onLoad(params) {
			console.log(params);
			this.tableName = `bill_${params.billId}`;
			this.loadAllRecords();
			const that = this;
			const sys = uni.getSystemInfo({
				success(data) {
					const width = data.safeArea.width - 2 * that.paddingLR;
					that.visualCount = Math.ceil(width / that.itemWidth);
					console.log('visualCount = ' + that.visualCount);
				}
			})
		},
		methods: {
			confirmHeight() {
				const view = uni.createSelectorQuery().in(this).select('.slide-index');
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
						this.billRecords = res;
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
					id
				} = this.billRecords[index];
				const url =
					`../createNewBillDetail/createNewBillDetail?tableName=${this.tableName}&id=${id}&name=${name}&amount=${amount}&desc=${desc}`
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
				this.billRecords[index].translateY = this.billRecords[index].translateY ?? 0; // 添加属性
				this.initTranslateY = this.billRecords[index].translateY;
				this.initPageY = event.touches[0].pageY;
			},
			touchEnd(index, event) {
				if (this.billRecords[index].translateY > this.initTranslateY - 20) {
					this.billRecords[index].translateY = this.translateYRange.max;
				} else {
					this.billRecords[index].translateY = this.translateYRange.min;
				}
				this.isdrag = false;
			},
			touchMove(index, event) {
				if (this.isDrag) {
					const newTranslateY = this.initTranslateY + event.touches[0].pageY - this.initPageY;
					if (newTranslateY < this.translateYRange.min) {
						this.billRecords[index].translateY = this.translateYRange.min;
					} else if (newTranslateY > this.translateYRange.max) {
						this.billRecords[index].translateY = this.translateYRange.max;
					} else {
						this.billRecords[index].translateY = newTranslateY;
					}
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	#bill-record-search {
		background-color: #18BC37;
		color: #2C405A;
		width: 100%;
		height: 100rpx;
	}

	.bill-record-container {
		width: 100%;
		// height: 800rpx;
		background-color: #C0C0C0;
		// padding-left: 100rpx;

		.slide,
		.slide-index,
		.slide-index>text,
		.operation {
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-items: center;
			align-content: center;
			width: 100%;
		}

		.slide {
			height: 100%;
			border: 1px solid red;

			.slide-index {
				.name {
					height: 100px;
					background-color: #C0C0C0;
					// overflow-y: auto;
				}

				.amount {
					height: 50px;
					background-color: #F0AD4E;
					// overflow-y: auto;
				}

				.desc {
					height: 250px;
					background-color: #18BC37;
					// overflow-y: auto;
				}
			}

			.edit {
				background-color: #18BC37;
			}

			.delete {
				background-color: #DD524D;
			}
		}
	}
</style>
