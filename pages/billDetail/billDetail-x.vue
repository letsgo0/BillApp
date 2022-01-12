<template>
	<view class="">
		<input id="bill-record-search" placeholder="输入名字搜索" type="text" value="" />
		<!-- 左右划动 -->
		<view class="bill-record-container">
			<vt-list-x  :items="billRecords" :listHeight="800" :visualCount="10" :itemWidth="25" :prevCount="50" :nextCount="50">
				<template v-slot:default="slotProps">
					<view class="item">
						<text>{{slotProps.item.name  }}</text>
						<text>{{slotProps.item.amount }}</text>
						<text>{{slotProps.item.desc }}</text>
					</view>
				</template>
			</vt-list-x>
		</view>
		<button @click="addNewBillRecord" class="tab-bar" type="warn">新增记录</button>
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
				billRecords: []
			}
		},
		onLoad(param) {
			this.generate(10000);
			// console.log(this.billRecords);
			// getApp().globalData.DB.get

		},
		methods: {
			generate(length = 50) {
				for (let i = 0; i < length; i++) {
					this.billRecords[i] = {
						name: '张三',
						amount: i,
						desc: '家住中国'
					}
				}
			}
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
		height: 800rpx;
		background-color: #C0C0C0;
		padding-left: 100rpx;

		.item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			align-content: center;
			width: 100%;
			border: 1px solid red;
		}
	}
</style>
