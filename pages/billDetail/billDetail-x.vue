<template>
	<view class="">
		<uni-search-bar id="record-search-btn" placeholder="输入名字搜索" v-model="searchKey" clearButton="auto"
			cancelButton="none" />
		<!-- 左右划动 -->
		<view v-if="recordsShown?.length > 0" class="bill-record-container">
			<view class="title" :style="{
					width: `${titleWidth}px`
				}">
				<!-- <view class="name"><text>姓名</text></view>
				<view class="amount"><text>金额</text></view>
				<view class="desc"><text>备注</text></view> -->
				<text class="name">姓名</text>
				<text class="amount">金额</text>
				<text class="desc">备注</text>
			</view>
			<vt-list-x :items="recordsShown" :visualCount="visualCount" :listHeight="listHeight" :itemWidth="itemWidth"
				:prevCount="10" :nextCount="10">
				<template v-slot:default="slotProps">
					<view class="slide" @touchstart="touchStart(slotProps.index,$event)"
						@touchend="touchEnd(slotProps.index,$event)" @touchmove="touchMove(slotProps.index,$event)"
						:style="{
							transform:`translateY(${recordsShown[slotProps.index]?.translateY || 0}px`,
							width: itemWidth + 'px'
						}">
						<view class="slide-index">
							<!-- <view class="name"><text>{{slotProps.item.name }}</text></view>
							<view class="amount"><text>{{slotProps.item.amount }}</text></view>
							<view class="desc"><text>{{slotProps.item.desc || '' }}</text></view> -->
							<text class="name">{{slotProps.item.name }}</text>
							<text class="amount">{{slotProps.item.amountZH }}</text>
							<text class="desc">{{slotProps.item.desc || '' }}</text>
						</view>
						<view class="operation">
							<text @click="editBillRecord(slotProps.index)" class="edit">查看</text>
							<text @click="deleteBillRecord(+recordsShown[slotProps.index].id)" class="delete">删除</text>
						</view>
					</view>
				</template>
			</vt-list-x>
		</view>
		<view v-else style="display: flex; justify-content: center; align-items: center;align-content: center;">
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
				itemWidth: 50,
				listHeight: 0,
				visualCount: 0,
				titleWidth: 40,
				isDrag: false,
				translateYRange: {
					min: 0,
					max: 0,
				},
				initTranslateY: 0,
				initPageY: 0,
				tableName: '',
				searchKey: '',
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
					const width = data.safeArea.width - this.titleWidth;
					this.visualCount = Math.ceil(width / this.itemWidth);
					console.log('visualCount = ' + this.visualCount);
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
						this.billRecords = res.map( item => {item.amountZH = AZH.num2ZH(item.amount).value; return item});
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
				} = this.recordsShown[index];
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
	$nameHeight: 150px;
	$amountHeight: 400px;
	$descHeight: 240px;

	.bill-record-container {
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;

		.slide,
		.slide-index,
		.operation,
		.title {
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
			border-left: 2px dotted #808080;

			.slide-index {
				.name {
					height: $nameHeight;
					background-color: #C0C0C0;
					// overflow-y: auto;
				}

				.amount {
					height: $amountHeight;
					background-color: #F0AD4E;
					// overflow-y: auto;
				}

				.desc {
					height: $descHeight;
					background-color: #18BC37;
					// overflow-y: auto;
				}
			}

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

		.title {
			justify-content: center;

			.name {
				height: $nameHeight;
				background-color: #C0C0C0;
				// overflow-y: auto;
			}

			.amount {
				height: $amountHeight;
				background-color: #F0AD4E;
				// overflow-y: auto;
			}

			.desc {
				height: $descHeight;
				background-color: #18BC37;
				// overflow-y: auto;
			}
		}
	}

	.name,
	.amount,
	.desc,
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
</style>
